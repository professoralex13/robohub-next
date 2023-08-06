import * as yup from 'yup';
import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { CreateOrganisationSchema, CreateTeamSchema } from '@/common/schema';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from './trpc';
import { getAuthenticatedUser, getOrganisation, getUser, transformUrlName } from './utils';

export const organisationRouter = router({
    /**
     * @param organisationName
     * @returns whether or not the `organisationName` is taken by another existing organiastion
     */
    nameTaken: publicProcedure.input(yup.string().required()).query(async ({ input }) => {
        const urlName = transformUrlName(input);
        const organisation = await prisma.organisation.findFirst({ where: { OR: [{ name: input }, { urlName }] } });

        return !!organisation;
    }),

    /**
     * @param teamName
     * @param organisationId - The id of the organisation to check within
     * @returns whether or not the `teamName` is taken by a team already within a given organisation
     */
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

    /**
     * Creates a new organisation using provided information, with the current logged in user as an admin
     */
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

    /**
     * Sends an invitation to a given user for a given organiastion
     *
     * The logged in user **must** be an admin of the given organisation to use this method
     * @param userId - id of the user to invite
     * @param organisationId - id of the organisation to invite the user to
     */
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

    /**
     * Cancels any pending invitation for a given user to a given organiastion
     *
     * The loggedin user **must** be an admin of the given organisation to use this method
     * @param userId - id of the user to cancel the invitation to
     * @param organisationId - id of the organisation to cancel the invitation from
     */
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

    /**
     * Responds to any pending invite for the current logged in user to a given organisation
     *
     * ? Perhaps rewrite to use the id of the invite instead of organisationId
     *
     * @param organisationId - id of the organisation to respond to any invite from
     * @param accept - boolean for whether the user is **accepting** the invite
     */
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

    /**
     * Removes a given user from a given organiastion
     *
     * The loggedin user **must** be an admin of the given organisation to use this method
     * @param userId - id of the user to remove from the organisation
     * @param organisationId - id of the organisation to remove the user from
     */
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

    /**
     * Creates a new team within a given organisation.
     *
     * @param organisationId - id of the organisation to create the new team within
     */
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
