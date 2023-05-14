/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        typedRoutes: true,
        serverActions: true,
    },
    typescript: {
        // fixes async component build issue
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            }
        ]
    }
};

module.exports = nextConfig;
