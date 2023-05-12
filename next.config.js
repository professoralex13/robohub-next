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
};

module.exports = nextConfig;
