import * as trpcNext from '@trpc/server/adapters/next';

import { appRouter } from '@/server';
import { createContext } from '@/server/context';

const handler = trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
});

export default handler;
