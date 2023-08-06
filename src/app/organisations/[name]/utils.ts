import 'server-only';
import { prisma } from '@/common/prisma';

/**
 * Server side function for getting the current routed organisation from the expected url parameters.
 *
 * In theory, throws error if no organisation is found, however organisation layout should 404 before this is called.
 */
export function getOrganisation(params: { name: string }) {
    return prisma.organisation.findUniqueOrThrow({ where: { urlName: params.name } });
}
