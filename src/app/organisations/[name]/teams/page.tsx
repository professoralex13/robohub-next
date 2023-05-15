import { OrganisationPageProps } from '@/app/organisations/[name]/layout';
import { prisma } from '@/common/prisma';
import { TeamCard } from '@/app/organisations/[name]/teams/TeamCard';
import { WarningBox } from '@/components/Notification';

const TeamsList = async ({ params }: OrganisationPageProps) => {
    const teams = await prisma.organisation.findUniqueOrThrow({ where: { name: params.name } }).teams({
        include: {
            _count: {
                select: {
                    notebooks: true,
                    users: true,
                },
            },
        },
    });

    return (
        <div className="flex flex-wrap gap-3">
            {teams.length === 0 && (
                <WarningBox>
                    There are no teams in this organisation
                </WarningBox>
            ) }
            {teams.map((team) => (
                <TeamCard
                    team={team}
                    memberCount={team._count.users}
                    notebookCount={team._count.notebooks}
                />
            ))}
        </div>
    );
};

export default TeamsList;
