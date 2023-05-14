import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { Storage } from '@google-cloud/storage';

export async function createContext(ctx: CreateNextContextOptions) {
    const { req, res } = ctx;

    const session = await getServerSession(req, res, nextAuthOptions);

    const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT_ID,
        credentials: {
            client_email: process.env.GCLOUD_CLIENT_EMAIL,
            private_key: process.env.GCLOUD_PRIVATE_KEY,
        },
    });

    const publicBucket = storage.bucket('robohub-public');

    return {
        req,
        res,
        session,
        publicBucket,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
