import 'server-only';
import { prisma } from '@/common/prisma';

export function getOrganisation(params: { name: string }) {
    return prisma.organisation.findUniqueOrThrow({ where: { urlName: params.name } });
}
