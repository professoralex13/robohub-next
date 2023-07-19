import { TRPCError } from '@trpc/server';
import { MembershipType } from '@/common';
import { Context } from './context';

export async function getUser(ctx: Context, id: string) {
    const user = await ctx.database.user.findUnique({
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

export async function getOrganisation(ctx: Context, id: number, minimumMembership: MembershipType = MembershipType.Member) {
    const organisation = await ctx.database.organisation.findUnique({
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
        const user = ctx.session?.user;

        let membershipType = MembershipType.None;

        for (const member of organisation.users) {
            if (member.userId === user?.id) {
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

export async function getTeam(ctx: Context, id: string, minimumMembership: MembershipType = MembershipType.Member) {
    const team = await ctx.database.team.findUnique({
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
        const user = ctx.session?.user;

        let membershipType = MembershipType.None;

        for (const member of team.users) {
            if (member.userId === user?.id) {
                if (member.isLeader) {
                    membershipType = MembershipType.Admin;
                } else {
                    membershipType = MembershipType.Member;
                }
            }
        }

        for (const member of team.organisation.users) {
            if (member.userId === user?.id) {
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
