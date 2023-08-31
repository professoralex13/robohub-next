import * as yup from 'yup';

import { publicProcedure, router } from './trpc';

export const usersRouter = router({
    // TODO: Refactor into specific functions for each query use i.e. team member add, organisation invite
    // TODO: Improve parameter names to specify whether they are id or name based
    /**
     * Queries a list of users based on a query string and filters
     *
     * @param query - Substring to query for inside email address or name of users (case insensitive)
     * @param ignoredOrganisation - Name of organisation to not return users from
     * @param requiredorganisation - Name of organisation to only return users from
     * @param ignoredTeam - Id of team to not return users from
     * @param requiredTeam - Id of team to only return users from
     *
     * @param take - number of users to query
     * @param skip - number of users to skip
     *
     * @example
     * const users = trpc.users.query({
     *     query: inputState,
     *     requiredOrganisation: organisation.name,
     *     ignoredTeam: team.id,
     * }); // List of users eligible to be added to a team
     */
    query: publicProcedure.input(yup.object().shape({
        query: yup.string(),

        ignoredOrganisation: yup.string().optional(),
        requiredOrganisation: yup.string().optional(),
        ignoredTeam: yup.string().optional(),
        requiredTeam: yup.string().optional(),

        take: yup.number().required(),
        skip: yup.number().optional(),
    })).query(async ({ ctx, input }) => {
        const {
            query,
            ignoredOrganisation,
            requiredOrganisation,
            ignoredTeam,
            requiredTeam,
            take,
            skip,
        } = input;

        return ctx.database.user.findMany({
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
                organisationInvites: {
                    every: ignoredOrganisation ? {
                        NOT: {
                            organisation: {
                                name: ignoredOrganisation,
                            },
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
