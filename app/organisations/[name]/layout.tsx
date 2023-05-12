import { PropsWithChildren } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/common/prisma';
import { protectedServerPage } from '@/components/protectedServerPage';
import { OrganisationHeader } from './OrganisationHeader';

export interface OrganisationPageProps<P = {}> { params: { name: string } & P }

const OrganisationRoot = protectedServerPage(async ({ params: { name }, children }: PropsWithChildren<OrganisationPageProps>) => {
    const organisation = await prisma.organisation.findFirst({
        where: { name },
        include: {
            teams: true,
            users: true,
        },
    });

    if (!organisation) {
        notFound();
    }

    return (
        <div className="space-y-2 p-2 pt-28">
            <OrganisationHeader organisation={organisation} memberCount={organisation.users.length} teamCount={organisation.teams.length} />

            {children}
        </div>
    );
});

export default OrganisationRoot;
