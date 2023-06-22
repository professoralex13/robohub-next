import * as yup from 'yup';
import { prisma } from '@/common/prisma';
import { getTeam, getUser } from '@/server/utils';
import { MembershipType } from '@/common';
import { publicProcedure, router } from './trpc';

export const teamsRouter = router({
    idTaken: publicProcedure.input(yup.string().required()).query(async ({ input }) => {
        const team = await prisma.team.findFirst({ where: { id: input } });

        return !!team;
    }),

    addUser: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        teamId: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, teamId } = input;

        const team = await getTeam(ctx, teamId, MembershipType.Admin);

        // Checks that user is in same organisation as team
        await prisma.organisationUser.findFirstOrThrow({
            where: {
                organisationId: team.organisationId,
                userId,
            },
        });

        const user = await getUser(userId);

        await prisma.teamUser.create({
            data: {
                isLeader: false,
                userId: user.id,
                teamId: team.id,
            },
        });
    }),

    removeUser: publicProcedure.input(yup.object().shape({
        userId: yup.string().required(),
        teamId: yup.string().required(),
    })).mutation(async ({ ctx, input }) => {
        const { userId, teamId } = input;

        const team = await getTeam(ctx, teamId, MembershipType.Admin);

        const user = await getUser(userId);

        await prisma.teamUser.delete({
            where: {
                userId_teamId: {
                    teamId: team.id,
                    userId: user.id,
                },
            },
        });
    }),
});
