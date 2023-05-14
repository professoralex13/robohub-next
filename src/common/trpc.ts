import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { AppRouter } from '@/server';
import superjson from 'superjson';

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return '';
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    }
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

const reactHandler = createTRPCNext<AppRouter>({
    config() {
        return {
            transformer: superjson,
            links: [
                httpBatchLink({
                    /**
             * If you want to use SSR, you need to use the server's full URL
             * @link https://trpc.io/docs/ssr
             * */
                    url: `${getBaseUrl()}/api/trpc`,
                    // You can pass any HTTP headers you wish here
                    async headers() {
                        return {
                            // authorization: getAuthCookie(),
                        };
                    },
                }),
            ],
        };
    },
});

const clientHandler = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
        httpBatchLink({
            /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         * */
            url: `${getBaseUrl()}/api/trpc`,
            // You can pass any HTTP headers you wish here
            async headers() {
                return {
                    // authorization: getAuthCookie(),
                };
            },
        }),
    ],
});

export const trpc = {
    react: reactHandler,
    client: clientHandler,
};
