import { OrganisationPageProps } from '@/app/organisations/[name]/layout';
import { TeamCard } from '@/app/organisations/[name]/teams/TeamCard';
import { WarningBox } from '@/components/Notification';
import { getOrganisation } from '@/app/organisations/[name]/utils';

/**
 * Renders list of teams in the current organisation.
 *
 * This is expected to be inserted as a child of the teams layout.
 */
const TeamsList = async ({ params }: OrganisationPageProps) => {
    const teams = await getOrganisation(params).teams({
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
            )}
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
