import { Notebook, User } from 'tabler-icons-react';
import { Team } from '@prisma/client';
import { FC } from 'react';
import Link from 'next/link';

interface TeamCardProps {
    team: Team;
    memberCount: number;
    notebookCount: number;
}

export const TeamCard: FC<TeamCardProps> = ({ team, memberCount, notebookCount }) => (
    <Link href={`/teams/${team.id}`} className="card grow cursor-pointer space-y-5 p-5 duration-150 hover:border-navy-300">
        <div className="flex gap-5">
            <strong className="text-3xl">{team.id}</strong>
            <span className="text-3xl">{team.name}</span>
        </div>
        <div className="flex gap-5">
            <div className="flex items-center gap-2">
                <User />
                <span className="text-xl">Members</span>
                <span className="rounded-full border-2 px-1 text-lg">{memberCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <Notebook />
                <span className="text-xl">Notebooks</span>
                <span className="rounded-full border-2 px-1 text-lg">{notebookCount}</span>
            </div>
        </div>
    </Link>
);
