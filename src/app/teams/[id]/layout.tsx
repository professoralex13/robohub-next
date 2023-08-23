import { MembershipType } from '@/common';
import { prisma } from '@/common/prisma';
import { protectedServerPage } from '@/components/protectedServerPage';
import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { TeamNavigation } from '@/app/teams/[id]/TeamNavigation';
import { TeamContextProvider } from '@/app/teams/[id]/TeamContext';
import Link from 'next/link';

export interface TeamPageProps<P = {}> { params: { id: string } & P }

/**
 * Layout for currently routed team.
 *
 * Handles authenticating that current user has rights to view this team, otherwise, 404.
 *
 * Renders the side navbar for the team, and then the child page slot.
 */
const TeamRoot = protectedServerPage<PropsWithChildren<TeamPageProps>>(async ({ params: { id }, children, user }) => {
    const team = await prisma.team.findFirst({
        where: { id },
        include: {
            users: true,
            organisation: {
                include: {
                    users: true,
                },
            },
            _count: {
                select: {
                    users: true,
                },
            },
        },
    });

    if (!team) {
        notFound();
    }

    let membershipType = MembershipType.None;

    for (const member of team.users) {
        if (member.userId === user.id) {
            membershipType = member.isLeader ? MembershipType.Admin : MembershipType.Member;
        }
    }

    for (const member of team.organisation.users) {
        if (member.userId === user.id) {
            if (member.isAdmin) {
                membershipType = MembershipType.Admin;
            }
        }
    }

    if (membershipType === MembershipType.None) {
        notFound();
    }

    return (
        <div className="space-y-3 p-4">
            <div>
                <div className="flex items-center gap-5">
                    <strong className="text-4xl text-navy-300">{team.id}</strong>
                    <strong className="text-3xl">{team.name}</strong>
                </div>
                <span className="text-xl text-slate-400">Team in <Link href={`/organisations/${team.organisation.urlName}/overview`}><strong>{team.organisation.name}</strong></Link></span>
            </div>
            <div className="flex gap-5">
                <TeamNavigation teamId={id} memberCount={team._count.users} />
                <TeamContextProvider value={{ ...team, membershipType }}>
                    {children}
                </TeamContextProvider>
            </div>
        </div>
    );
});

export default TeamRoot;
