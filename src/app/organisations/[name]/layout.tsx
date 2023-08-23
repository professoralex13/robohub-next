import { PropsWithChildren } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/common/prisma';
import { protectedServerPage } from '@/components/protectedServerPage';
import { MembershipType } from '@/common';
import { OrganisationHeader } from './OrganisationHeader';
import { OrganisationContextProvider } from './OrganisationContext';

/**
 * Generic page props for organisation tabs which types the url param for organisation name
 */
export interface OrganisationPageProps<P = {}> {
    params: {
        /**
         * The name of the currently navigated organisation
         */
        name: string;
    } & P;
}

/**
 * Root layout of the organisation page, renders the header above the current sub page.
 *
 * Handles validating that the current logged user is a member of the respective navigated organisation before rendering any sub pages.
 */
const OrganisationRoot = protectedServerPage<PropsWithChildren<OrganisationPageProps>>(async ({ params: { name }, children, user }) => {
    const organisation = await prisma.organisation.findFirst({
        where: { urlName: name },
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
        <div className="space-y-2 p-3">
            <OrganisationHeader organisation={organisation} memberCount={organisation._count.users} teamCount={organisation._count.teams} />

            <OrganisationContextProvider value={{ ...organisation, membershipType }}>
                {children}
            </OrganisationContextProvider>
        </div>
    );
});

export default OrganisationRoot;
