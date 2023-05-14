import { accountRouter } from '@/server/account';
import { organisationRouter } from './organisations';
import { router } from './trpc';
import { usersRouter } from './users';

export const appRouter = router({
    organisation: organisationRouter,
    users: usersRouter,
    account: accountRouter,
});

export type AppRouter = typeof appRouter;
