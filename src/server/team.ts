import * as yup from 'yup';
import { getTeam, getUser } from '@/server/utils';
import { MembershipType } from '@/common';
import { privateProcedure, publicProcedure, router } from './trpc';

export const teamsRouter = router({
    /**
     * @param teamId
     * @returns whether or not the `teamId` is taken by an existing team
     */
    idTaken: publicProcedure.input(yup.string().required()).query(async ({ ctx, input }) => {
        const team = await ctx.database.team.findFirst({ where: { id: input } });

        return !!team;
    }),

    /**
     * Adds a user from the given teams organisation, to the given team
     *
     * The logged in user **must** be an admin of the given team's organisation, or be a leader of the given team to use this method
     * @param userId - id of the user in the given team's organisation to add
     * @param teamId - id of the team to add the given user to
     */
    addUser: privateProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        teamId: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, teamId } = input;

        const team = await getTeam(ctx, teamId, MembershipType.Admin);

        // Checks that user is in same organisation as team
        await ctx.database.organisationUser.findFirstOrThrow({
            where: {
                organisationId: team.organisationId,
                userId,
            },
        });

        const user = await getUser(ctx, userId);

        await ctx.database.teamUser.create({
            data: {
                isLeader: false,
                userId: user.id,
                teamId: team.id,
            },
        });
    }),

    /**
     * Removes a given user from a given team
     *
     * The logged in user **must** be an admin of the given team's organisation, or be a leader of the given team to use this method
     * @param userId - id of the user in the team, to remove from the team
     * @param teamId - id of the team to remove the user from
     */
    removeUser: privateProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        teamId: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, teamId } = input;

        const team = await getTeam(ctx, teamId, MembershipType.Admin);

        const user = await getUser(ctx, userId);

        await ctx.database.teamUser.delete({
            where: {
                userId_teamId: {
                    teamId: team.id,
                    userId: user.id,
                },
            },
        });
    }),
});
