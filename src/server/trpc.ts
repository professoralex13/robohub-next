import { initTRPC } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

export const t = initTRPC.context<Context>().create({
    // Handles Date/Map/Set
    transformer: superjson,
});

export const { middleware, router } = t;
export const publicProcedure = t.procedure;
