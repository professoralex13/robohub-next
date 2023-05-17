import * as yup from 'yup';
import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { CreateOrganisationSchema, CreateTeamSchema } from '@/common/schema';
import { publicProcedure, router } from './trpc';
import { getAuthenticatedUser, getOrganisation, getUser, transformUrlName } from './utils';

export const organisationRouter = router({
    nameTaken: publicProcedure.input(yup.string().required()).query(async ({ input }) => {
        const urlName = transformUrlName(input);
        const organisation = await prisma.organisation.findFirst({ where: { OR: [{ name: input }, { urlName }] } });

        return !!organisation;
    }),

    teamNameTaken: publicProcedure.input(yup.object().shape({
        teamName: yup.string().required(),
        organisationId: yup.number().required(),
    })).query(async ({ input }) => {
        const { teamName, organisationId } = input;

        const team = await prisma.team.findFirst({
            where: {
                name: teamName,
                organisation: {
                    id: organisationId,
                },
            },
        });

        return !!team;
    }),

    create: publicProcedure.input(CreateOrganisationSchema).mutation(async ({ ctx, input }) => {
        const user = getAuthenticatedUser(ctx);
        const { name, location, description } = input;

        return prisma.organisation.create({
            data: {
                name,
                urlName: transformUrlName(name),
                location,
                description,
                users: {
                    create: {
                        isAdmin: true,
                        userId: user.id,
                    },
                },
            },
        });
    }),

    addUser: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        organisationId: yup.number().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, organisationId } = input;

        const organisation = await getOrganisation(ctx, organisationId, MembershipType.Admin);

        const user = await getUser(userId);

        await prisma.organisationUser.create({
            data: {
                isAdmin: false,
                userId: user.id,
                organisationId: organisation.id,
            },
        });
    }),

    removeUser: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        organisationId: yup.number().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, organisationId } = input;

        const organisation = await getOrganisation(ctx, organisationId, MembershipType.Admin);

        const user = await getUser(userId);

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
        CreateTeamSchema.concat(yup.object().shape({ organisationId: yup.number().required() })),
    ).mutation(async ({ ctx, input }) => {
        const { organisationId, id, name } = input;

        const organisation = await getOrganisation(ctx, organisationId, MembershipType.Admin);

        return prisma.team.create({
            data: {
                id,
                name,
                organisationId: organisation.id,
            },
        });
    }),
});
