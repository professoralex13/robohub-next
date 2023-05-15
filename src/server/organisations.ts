import * as yup from 'yup';
import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { CreateOrganisationSchema, CreateTeamSchema } from '@/common/schema';
import { publicProcedure, router } from './trpc';
import { getAuthenticatedUser, getOrganisation, getUser } from './utils';

export const organisationRouter = router({
    nameTaken: publicProcedure.input(yup.string().required()).query(async ({ input }) => {
        const organisation = await prisma.organisation.findFirst({ where: { name: input } });

        return !!organisation;
    }),

    teamNameTaken: publicProcedure.input(yup.object().shape({
        teamName: yup.string().required(),
        organisationName: yup.string().required(),
    })).query(async ({ input }) => {
        const { teamName, organisationName } = input;

        const team = await prisma.team.findFirst({
            where: {
                name: teamName,
                organisation: {
                    name: organisationName,
                },
            },
        });

        return !!team;
    }),

    create: publicProcedure.input(CreateOrganisationSchema).mutation(async ({ ctx, input }) => {
        const user = getAuthenticatedUser(ctx);

        const organisation = await prisma.organisation.create({
            data: {
                ...input,
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
        id: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { organisationName, id } = input;

        const organisation = await getOrganisation(ctx, organisationName, MembershipType.Admin);

        const user = await getUser(id);

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
        id: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { organisationName, id } = input;

        const organisation = await getOrganisation(ctx, organisationName, MembershipType.Admin);

        const user = await getUser(id);

        await prisma.organisationUser.delete({
            where: {
                userId_organisationId: {
                    userId: user.id,
                    organisationId: organisation.id,
                },
            },
        });
    }),

    createTeam: publicProcedure.input(
        CreateTeamSchema.concat(yup.object().shape({ organisationName: yup.string().required() })),
    ).mutation(async ({ ctx, input }) => {
        const { organisationName, id, name } = input;

        const organisation = await getOrganisation(ctx, organisationName, MembershipType.Admin);

        const team = await prisma.team.create({
            data: {
                id,
                name,
                organisationId: organisation.id,
            },
        });

        return team;
    }),
});
