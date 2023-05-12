import { authRouter } from './auth';
import { organisationRouter } from './organisations';
import { router } from './trpc';

export const appRouter = router({
    auth: authRouter,
    organisation: organisationRouter,
});

export type AppRouter = typeof appRouter;
