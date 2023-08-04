/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        typedRoutes: true,
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
            },
        ],
    },
};

module.exports = nextConfig;
