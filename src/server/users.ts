import * as yup from 'yup';

import { prisma } from '@/common/prisma';
import { publicProcedure, router } from './trpc';

export const usersRouter = router({
    query: publicProcedure.input(yup.object().shape({
        query: yup.string(),
        ignoredOrganisation: yup.string().optional(),
        take: yup.number().required(),
        skip: yup.number().optional(),
    })).query(async ({ input }) => {
        const { query, ignoredOrganisation, take, skip } = input;

        const users = await prisma.user.findMany({
            where: {
                OR: [{ email: { contains: query } }, { name: { contains: query } }],
                organisations: ignoredOrganisation ? {
                    every: {
                        NOT: {
                            organisation: {
                                name: ignoredOrganisation,
                            },
                        },
                    },
                } : undefined,
            },
            take,
            skip,
        });

        return users;
    }),
});
