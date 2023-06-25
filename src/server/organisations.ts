import * as yup from 'yup';
import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { CreateOrganisationSchema, CreateTeamSchema } from '@/common/schema';
import { TRPCError } from '@trpc/server';
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

    inviteUser: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        organisationId: yup.number().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, organisationId } = input;

        const organisation = await getOrganisation(ctx, organisationId, MembershipType.Admin);

        const user = await getUser(userId);

        await prisma.organisationInvite.create({
            data: {
                isAdmin: false,
                userId: user.id,
                organisationId: organisation.id,
                inviterId: getAuthenticatedUser(ctx).id,
            },
        });
    }),

    cancelInvite: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        organisationId: yup.number().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, organisationId } = input;

        const organisation = await getOrganisation(ctx, organisationId, MembershipType.Admin);

        const user = await getUser(userId);

        await prisma.organisationInvite.delete({
            where: {
                userId_organisationId: {
                    userId: user.id,
                    organisationId: organisation.id,
                },
            },
        });
    }),

    respondToInvite: publicProcedure.input(yup.object().shape({
        organisationId: yup.number().required(),
        accept: yup.boolean().required(),
    })).mutation(async ({ ctx, input }) => {
        const { organisationId, accept } = input;
        const user = getAuthenticatedUser(ctx);

        const invitation = await prisma.organisationInvite.findUnique({
            where: {
                userId_organisationId: {
                    userId: user.id,
                    organisationId,
                },
            },
        });

        // Ensures that no one can force accept an invitation when none was sent
        if (!invitation) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `You have no invitations from the organisation with id: ${organisationId}`,
            });
        }

        if (accept) {
            await prisma.organisationUser.create({
                data: {
                    userId: user.id,
                    organisationId,
                    isAdmin: invitation.isAdmin,
                },
            });
        }

        await prisma.organisationInvite.delete({
            where: {
                userId_organisationId: {
                    userId: user.id,
                    organisationId,
                },
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

        // User cannot be in team but not organisation
        await prisma.teamUser.deleteMany({
            where: {
                userId: user.id,
                team: {
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
