import { getAuthenticatedUser } from '@/server/utils';
import { prisma } from '@/common/prisma';
import { ContentDeliveryRoot } from '@/common/environment';
import { publicProcedure, router } from './trpc';

export const accountRouter = router({
    uploadAvatarPresignedUrl: publicProcedure.mutation(async ({ ctx }) => {
        const user = getAuthenticatedUser(ctx);

        const key = `user-avatars/${user.id}/${crypto.randomUUID()}`;

        await ctx.publicBucket.deleteFiles({
            prefix: `user-avatars/${user.id}`,
        });

        const file = ctx.publicBucket.file(key);

        const url = await file.generateSignedPostPolicyV4({
            expires: Date.now() + 60 * 1000,
            conditions: [
                ['content-length-range', 0, 4000000],
            ],
        });

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                image: ContentDeliveryRoot + key,
            },
        });

        return url;
    }),
});
