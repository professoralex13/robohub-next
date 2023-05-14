import { prisma } from '@/common/prisma';
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from "next-auth/providers/google";

export const nextAuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            id: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // Needed for some reason
        session: ({ user, session }) => {
            session.user = user;

            return session;
        }
    },
    session: {
        strategy: "database",
    },
    pages: {
        signIn: '/sign-in',
    },
};
