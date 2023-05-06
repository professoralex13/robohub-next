import * as yup from 'yup';
import { hash } from 'argon2';

import { publicProcedure, router } from './trpc';

const SignUpSchema = yup.object({
    email: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
});

export const authRouter = router({
    emailTaken: publicProcedure.input(yup.string()).query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findFirst({ where: { email: input } });

        return !!user;
    }),
    usernameTaken: publicProcedure.input(yup.string()).query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findFirst({ where: { username: input } });

        return !!user;
    }),
    signUp: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input }) => {
        const { email, username, password } = input;

        const passwordHash = await hash(password);

        const user = await ctx.prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
            },
        });

        return {
            status: 201,
            message: 'Account created',
            result: user.email,
        };
    }),
});
