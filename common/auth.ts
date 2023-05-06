import { prisma } from '@/common/prisma';
import { verify } from 'argon2';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
    emailUsername: yup.string().required('Required'),
    password: yup.string().required('Required'),
});

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                emailUsername: {},
                password: {},
            },
            type: 'credentials',

            authorize: async (input) => {
                const credentials = await LoginSchema.validate(input);

                const user = await prisma.user.findFirst({
                    where: { OR: [{ email: credentials.emailUsername }, { username: credentials.emailUsername }] },
                });

                if (!user) {
                    throw new Error('Invalid Username or password');
                }

                const isValidPassword = await verify(user.passwordHash, credentials.password);

                if (!isValidPassword) {
                    throw new Error('Invalid Username or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    username: token.username,
                };
            }

            return session;
        },
    },
    jwt: {
        secret: 'super-secret',
        maxAge: 15 * 24 * 30 * 60, // 15 days
    },
    pages: {
        signIn: '/sign-in',
    },
};
