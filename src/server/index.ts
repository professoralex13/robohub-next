import { organisationRouter } from './organisations';
import { router } from './trpc';
import { usersRouter } from './users';

export const appRouter = router({
    organisation: organisationRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;
