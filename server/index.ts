import { authRouter } from './auth';
import { organisationRouter } from './organisations';
import { router } from './trpc';
import { usersRouter } from './users';

export const appRouter = router({
    auth: authRouter,
    organisation: organisationRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;
