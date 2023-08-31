import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { env } from '@/common/environment';
import { Client } from 'minio';
import { prisma } from '@/common/prisma';

/**
 * Gets neccesary context information for trpc procedures
 */
export async function createContext(ctx: CreateNextContextOptions) {
    const { req, res } = ctx;

    const session = await getServerSession(req, res, nextAuthOptions);

    const storage = new Client({
        endPoint: env.CDN_URL,
        useSSL: true,
        accessKey: env.CDN_ACCESS_KEY,
        secretKey: env.CDN_SECRET_KEY,
    });

    return {
        req,
        res,
        session,
        storage,
        database: prisma,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
