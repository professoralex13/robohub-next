import { Notebook, User } from 'tabler-icons-react';
import { Team } from '@prisma/client';
import { FC } from 'react';
import Link from 'next/link';

interface TeamCardProps {
    team: Team;
    memberCount: number;
    notebookCount: number;
}

/**
 * Component for a card in the list of teams in an organisation
 *
 * Each card is a clickable link to the respective teams own page
 */
export const TeamCard: FC<TeamCardProps> = ({ team, memberCount, notebookCount }) => (
    <Link href={`/teams/${team.id}/overview`} className="card grow cursor-pointer space-y-3 p-3 duration-150 hover:border-navy-300">
        <div className="flex gap-5">
            <strong className="text-xl">{team.id}</strong>
            <span className="text-xl">{team.name}</span>
        </div>
        <div className="flex gap-5">
            <div className="flex items-center gap-2">
                <User />
                <span className="text-lg">Members</span>
                <span className="rounded-full border-2 px-1 text-sm">{memberCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <Notebook />
                <span className="text-lg">Notebooks</span>
                <span className="rounded-full border-2 px-1 text-sm">{notebookCount}</span>
            </div>
        </div>
    </Link>
);
