import * as yup from 'yup';

import { prisma } from '@/common/prisma';
import { publicProcedure, router } from './trpc';

export const usersRouter = router({
    query: publicProcedure.input(yup.object().shape({
        query: yup.string(),

        ignoredOrganisation: yup.string().optional(),
        requiredOrganisation: yup.string().optional(),
        ignoredTeam: yup.string().optional(),
        requiredTeam: yup.string().optional(),

        take: yup.number().required(),
        skip: yup.number().optional(),
    })).query(async ({ input }) => {
        const {
            query,
            ignoredOrganisation,
            requiredOrganisation,
            ignoredTeam,
            requiredTeam,
            take,
            skip,
        } = input;

        return prisma.user.findMany({
            where: {
                OR: [{ email: { contains: query, mode: 'insensitive' } }, { name: { contains: query, mode: 'insensitive' } }],
                organisations: {
                    every: ignoredOrganisation ? {
                        NOT: {
                            organisation: {
                                name: ignoredOrganisation,
                            },
                        },
                    } : undefined,
                    some: requiredOrganisation ? {
                        organisation: {
                            name: requiredOrganisation,
                        },
                    } : undefined,
                },
                teams: {
                    every: ignoredTeam ? {
                        NOT: {
                            team: {
                                id: ignoredTeam,
                            },
                        },
                    } : undefined,
                    some: requiredTeam ? {
                        team: {
                            id: requiredTeam,
                        },
                    } : undefined,
                },
            },
            take,
            skip,
        });
    }),
});
