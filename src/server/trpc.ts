import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

export const t = initTRPC.context<Context>().create({
    // Handles Date/Map/Set
    transformer: superjson,
});

export const { middleware, router } = t;
export const publicProcedure = t.procedure;
