import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

export const t = initTRPC.context<Context>().create({
    // Handles Date/Map/Set
    transformer: superjson,
});

export const { router } = t;
export const publicProcedure = t.procedure;

const enforceUserAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must be signed in to use this API',
        });
    }

    return next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const privateProcedure = t.procedure.use(enforceUserAuthenticated);
