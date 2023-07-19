import { prisma } from '@/common/prisma';
import { PUBLIC_BUCKET_URL, env } from '@/common/environment';
import { privateProcedure, router } from './trpc';

export const accountRouter = router({
    /**
     * Request POST url for uploading profile picture from client
     *
     * @returns Url for post to be sent to, along with neccesary formData to be sent in the body of the POST
     *
     * @example
     * const { postURL, formData } = await trpc.account.uploadAvatarPresignedUrl();
     *
     * const body = new FormData();
     *
     * // Create formData with data returned from presignedUrl endpoint, and the file to upload
     * Object.entries({ ...formData, file }).forEach(([key, value]) => {
     *     body.append(key, value);
     * });
     *
     * await fetch(postURL, {
     *     method: 'POST',
     *     body,
     * });
     */
    uploadAvatarPresignedUrl: privateProcedure.mutation(async ({ ctx }) => {
        const { user } = ctx.session;

        const key = `user-avatars/${user.id}`;

        // Delete previous profile picture from bucket
        await ctx.storage.removeObject(env.PUBLIC_BUCKET_NAME, key);

        const policy = ctx.storage.newPostPolicy();

        policy.setBucket(env.PUBLIC_BUCKET_NAME);
        policy.setKey(key);
        policy.setExpires(new Date(Date.now() + 60 * 1000));
        policy.setContentLengthRange(0, 4000000);

        // Create post policy allowing POST request to url to upload image from client
        const presignedPost = await ctx.storage.presignedPostPolicy(policy);

        // Update database with expected url for uploaded image
        await ctx.database.user.update({
            where: {
                id: user.id,
            },
            data: {
                image: `${PUBLIC_BUCKET_URL}/${key}`,
            },
        });

        return presignedPost;
    }),
});
