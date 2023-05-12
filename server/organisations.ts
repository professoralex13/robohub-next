import * as yup from 'yup';

import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { publicProcedure, router } from './trpc';
import { getAuthenticatedUser, getOrganisation, getUser } from './utils';

const CreateOrganisationSchema = yup.object().shape({
    name: yup.string().required('Required'),
    description: yup.string().required('Required'),
    location: yup.string().required('Required'),
});

export const organisationRouter = router({
    nameTaken: publicProcedure.input(yup.string()).query(async ({ input }) => {
        const organisation = await prisma.organisation.findFirst({ where: { name: input } });

        return !!organisation;
    }),

    create: publicProcedure.input(CreateOrganisationSchema).mutation(async ({ ctx, input }) => {
        const user = getAuthenticatedUser(ctx);

        const organisation = await prisma.organisation.create({
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

    addUser: publicProcedure.input(yup.object().shape({
        organisationName: yup.string().required(),
        username: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { organisationName, username } = input;

        const organisation = await getOrganisation(ctx, organisationName, MembershipType.Admin);

        const user = await getUser(username);

        await prisma.organisationUser.create({
            data: {
                isAdmin: false,
                userId: user.id,
                organisationId: organisation.id,
            },
        });
    }),

    removeUser: publicProcedure.input(yup.object().shape({
        organisationName: yup.string().required(),
        username: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { organisationName, username } = input;

        const organisation = await getOrganisation(ctx, organisationName, MembershipType.Admin);

        const user = await getUser(username);

        await prisma.organisationUser.delete({
            where: {
                userId_organisationId: {
                    userId: user.id,
                    organisationId: organisation.id,
                },
            },
        });
    }),
});
