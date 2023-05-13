import { PropsWithChildren } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/common/prisma';
import { protectedServerPage } from '@/components/protectedServerPage';
import { MembershipType } from '@/common';
import { OrganisationHeader } from './OrganisationHeader';
import { OrganisationContextProvider } from './OrganisationContext';

export interface OrganisationPageProps<P = {}> { params: { name: string } & P }

const OrganisationRoot = protectedServerPage<PropsWithChildren<OrganisationPageProps>>(async ({ params: { name }, children, user }) => {
    const organisation = await prisma.organisation.findFirst({
        where: { name },
        include: {
            users: true,
            _count: {
                select: {
                    users: true,
                    teams: true,
                },
            },
        },
    });

    if (!organisation) {
        notFound();
    }

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

    if (membershipType === MembershipType.None) {
        notFound();
    }

    return (
        <div className="space-y-2 p-2 pt-28">
            <OrganisationHeader organisation={organisation} memberCount={organisation._count.users} teamCount={organisation._count.teams} />

            <OrganisationContextProvider value={{ ...organisation, membershipType }}>
                {children}
            </OrganisationContextProvider>
        </div>
    );
});

export default OrganisationRoot;
