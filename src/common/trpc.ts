import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { AppRouter } from '@/server';
import superjson from 'superjson';

/**
 * Handler for react query hooks
 */
const reactHandler = createTRPCNext<AppRouter>({
    config() {
        return {
            transformer: superjson,
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        };
    },
});

/**
 * Handler for traditional function query calls
 */
const clientHandler = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpBatchLink({
            url: '/api/trpc',
        }),
    ],
});

export const trpc = {
    react: reactHandler,
    client: clientHandler,
};
