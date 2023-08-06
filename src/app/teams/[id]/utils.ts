import { prisma } from '@/common/prisma';

/**
 * Server side function for  getting the current routed team from the expected url parameters.
 *
 * In theory, throws error if no team is found, however team layout should 404 before this is called.
 */
export function getTeam(params: { id: string }) {
    return prisma.team.findUniqueOrThrow({ where: { id: params.id } });
}
