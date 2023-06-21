'use client';

import { FC, PropsWithChildren, useState } from 'react';
import { TeamPageProps } from '@/app/teams/[id]/layout';
import { protectedClientPage } from '@/components/protectedClientPage';
import { trpc } from '@/common/trpc';
import { useTeam } from '@/app/teams/[id]/TeamContext';
import { Oval } from 'react-loading-icons';
import { User } from '@prisma/client';
import { useConfirmation } from '@/components/ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { MembershipType } from '@/common';

interface AddUserRowProps {
    user: User;
}

const AddUserRow: FC<AddUserRowProps> = ({ user }) => {
    const { mutateAsync, isLoading } = trpc.react.teams.addUser.useMutation();

    const team = useTeam();

    const confirm = useConfirmation();

    const router = useRouter();

    return (
        <button
            type="button"
            onClick={!isLoading ? (async () => {
                if (await confirm(<span>Add <strong>{user.name}</strong> to <strong>{team.id}</strong></span>)) {
                    await mutateAsync({
                        userId: user.id,
                        teamId: team.id,
                    });

                    // Close Dialog before refreshing page to ensure user list query is immediately cleared

                    router.refresh();
                }
            }) : undefined}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 duration-200 hover:bg-navy-600"
        >
            <span className="text-xl">
                {user.name}
            </span>
            {isLoading ? <Oval /> : <span className="opacity-0 duration-200 group-hover:opacity-100">Add to Team</span>}
        </button>
    );
};

const MembersLayout = protectedClientPage<PropsWithChildren<TeamPageProps>>(({ children }) => {
    const [query, setQuery] = useState('');

    const team = useTeam();

    const { data } = trpc.react.users.query.useQuery({ query, take: 10, ignoredTeam: team.id, requiredOrganisation: team.organisation.name }, { cacheTime: 0 });

    return (
        <div className="flex w-1/3 flex-col gap-3">
            <h1 className="border-b-[1px] border-slate-600 pb-3 text-3xl">Members</h1>
            {children}
            <div className="border-b-[1px] border-slate-600" />
            {team.membershipType >= MembershipType.Admin && (
                <>
                    <input className="w-full" type="text" placeholder="Add user" value={query} onChange={(e) => setQuery(e.target.value)} />
                    {query !== '' && (data === undefined ? <Oval />
                        : data.length === 0 ? <span className="text-xl text-slate-400">No Users found</span>
                            : data.map((user) => <AddUserRow user={user} />))}
                </>
            )}
        </div>
    );
});

export default MembersLayout;
