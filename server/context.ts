import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@/common/prisma';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';

export async function createContext(ctx: CreateNextContextOptions) {
    const { req, res } = ctx;

    const session = await getServerSession(req, res, nextAuthOptions);

    return {
        req,
        res,
        prisma,
        session,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
