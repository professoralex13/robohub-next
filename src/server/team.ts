import * as yup from 'yup';
import { prisma } from '@/common/prisma';
import { publicProcedure, router } from './trpc';

export const teamsRouter = router({
    idTaken: publicProcedure.input(yup.string().required()).query(async ({ input }) => {
        const team = await prisma.team.findFirst({ where: { id: input } });

        return !!team;
    }),
});
