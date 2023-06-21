import { TRPCError } from '@trpc/server';
import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { Context } from './context';

export function getAuthenticatedUser(ctx: Context) {
    const user = ctx.session?.user;

    if (!user) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must be signed in to use this API',
        });
    }

    return user;
}

export async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: `No user could be found with the id: ${id}`,
        });
    }

    return user;
}

export async function getOrganisation(context: Context, id: number, minimumMembership: MembershipType = MembershipType.Member) {
    const organisation = await prisma.organisation.findUnique({
        where: {
            id,
        },
        include: {
            users: true,
        },
    });

    if (!organisation) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No organisation could be found with the id: ${id}`,
        });
    }

    if (minimumMembership > MembershipType.None) {
        const user = getAuthenticatedUser(context);

        let membershipType = MembershipType.None;

        for (const member of organisation.users) {
            if (member.userId === user.id) {
                if (member.isAdmin) {
                    membershipType = MembershipType.Admin;
                } else {
                    membershipType = MembershipType.Member;
                }
            }
        }

        if (membershipType < minimumMembership) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: `You are not a high enough member of the organisation: ${organisation.id}`,
            });
        }
    }

    return organisation;
}

export async function getTeam(context: Context, id: string, minimumMembership: MembershipType = MembershipType.Member) {
    const team = await prisma.team.findUnique({
        where: {
            id,
        },
        include: {
            users: true,
            organisation: {
                include: {
                    users: true,
                },
            },
        },
    });

    if (!team) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No Team could be found with the id: ${id}`,
        });
    }

    if (minimumMembership > MembershipType.None) {
        const user = getAuthenticatedUser(context);

        let membershipType = MembershipType.None;

        for (const member of team.users) {
            if (member.userId === user.id) {
                if (member.isLeader) {
                    membershipType = MembershipType.Admin;
                } else {
                    membershipType = MembershipType.Member;
                }
            }
        }

        for (const member of team.organisation.users) {
            if (member.userId === user.id) {
                if (member.isAdmin) {
                    membershipType = MembershipType.Admin;
                }
            }
        }

        if (membershipType < minimumMembership) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: `You are not a high enough member of the team: ${team.id}`,
            });
        }
    }

    return team;
}

export function transformUrlName(name: string) {
    return name.replaceAll(' ', '-');
}
