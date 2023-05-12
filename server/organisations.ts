import * as yup from 'yup';

import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from './trpc';

const CreateOrganisationSchema = yup.object().shape({
    name: yup.string().required('Required'),
    description: yup.string().required('Required'),
    location: yup.string().required('Required'),
});

export const organisationRouter = router({
    nameTaken: publicProcedure.input(yup.string()).query(async ({ ctx, input }) => {
        const organisation = await ctx.prisma.organisation.findFirst({ where: { name: input } });

        return !!organisation;
    }),

    create: publicProcedure.input(CreateOrganisationSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be signed in to create an organisation',
            });
        }

        const organisation = await ctx.prisma.organisation.create({
            data: {
                // Replace spaces with dashes to prevent URL issues
                name: input.name.replaceAll(' ', '-'),
                description: input.description,
                location: input.location,
                users: {
                    create: {
                        isAdmin: true,
                        userId: user.id,
                    },
                },
            },
        });

        return organisation;
    }),
});
