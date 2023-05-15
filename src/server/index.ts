import { accountRouter } from '@/server/account';
import { teamsRouter } from '@/server/team';
import { organisationRouter } from './organisations';
import { router } from './trpc';
import { usersRouter } from './users';

export const appRouter = router({
    organisation: organisationRouter,
    users: usersRouter,
    account: accountRouter,
    teams: teamsRouter,
});

export type AppRouter = typeof appRouter;
