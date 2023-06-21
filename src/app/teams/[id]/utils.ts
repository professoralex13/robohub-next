import { prisma } from '@/common/prisma';

export function getTeam(params: { id: string }) {
    return prisma.team.findUniqueOrThrow({ where: { id: params.id } });
}
