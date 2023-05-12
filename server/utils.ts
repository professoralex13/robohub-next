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

export async function getUser(username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (!user) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: `No user could be found with the username: ${username}`,
        });
    }

    return user;
}

export async function getOrganisation(context: Context, name: string, minimumMembership: MembershipType = MembershipType.Member) {
    const organisation = await prisma.organisation.findUnique({
        where: {
            name,
        },
        include: {
            users: true,
        },
    });

    if (!organisation) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No organisation could be found with the name: ${name}`,
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
                message: `You are not a high enough member of the organisation: ${name}`,
            });
        }
    }

    return organisation;
}
