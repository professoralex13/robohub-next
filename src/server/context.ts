import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { Storage } from '@google-cloud/storage';
import { env } from '@/common/environment';

export async function createContext(ctx: CreateNextContextOptions) {
    const { req, res } = ctx;

    const session = await getServerSession(req, res, nextAuthOptions);

    const storage = new Storage({
        projectId: env.GCLOUD_PROJECT_ID,
        credentials: {
            client_email: env.GCLOUD_CLIENT_EMAIL,
            private_key: env.GCLOUD_PRIVATE_KEY.split(String.raw`\n`).join('\n'), // Replacement is needed for scenarios where env vars are provided as raw data
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
