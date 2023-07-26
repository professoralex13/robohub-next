import { getAuthenticatedUser } from '@/server/utils';
import { prisma } from '@/common/prisma';
import { PUBLIC_BUCKET_URL, env } from '@/common/environment';
import { publicProcedure, router } from './trpc';

export const accountRouter = router({
    uploadAvatarPresignedUrl: publicProcedure.mutation(async ({ ctx }) => {
        const user = getAuthenticatedUser(ctx);

        const key = `user-avatars/${user.id}`;

        await ctx.storage.removeObject(env.PUBLIC_BUCKET_NAME, key);

        const policy = ctx.storage.newPostPolicy();

        policy.setBucket(env.PUBLIC_BUCKET_NAME);
        policy.setKey(key);
        policy.setExpires(new Date(Date.now() + 60 * 1000));
        policy.setContentLengthRange(0, 4000000);

        const presignedPost = await ctx.storage.presignedPostPolicy(policy);

        await prisma.user.update({
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
