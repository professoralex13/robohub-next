'use client';

import { User, TeamUser } from '@prisma/client';
import { protectedClientPage } from '@/components/protectedClientPage';
import { MembershipType } from '@/common';
import { trpc } from '@/common/trpc';
import { Oval } from 'react-loading-icons';
import { Trash } from 'tabler-icons-react';
import { useRouter } from 'next/navigation';
import { useConfirmation } from '@/components/ConfirmationDialog';
import { useTeam } from '../TeamContext';

interface MemberRowProps {
    member: TeamUser & {
        user: User;
    };
}

export const MemberRow = protectedClientPage<MemberRowProps>(({ member }) => {
    const { user, isLeader } = member;

    const team = useTeam();

    const showRemoveButton = team.membershipType >= MembershipType.Admin;

    const { mutateAsync, isLoading } = trpc.react.teams.removeUser.useMutation();

    const router = useRouter();

    const confirm = useConfirmation();

    return (
        <div
            className="grid grid-cols-[max-content_auto_max-content] gap-3 overflow-hidden p-3"
        >
            <span className="text-xl text-slate-400">{user.name}</span>
            {isLeader && <span className="text-xl text-slate-400">Leader</span>}
            {showRemoveButton && (isLoading ? <Oval className="my-auto ml-auto h-7" /> : (
                <Trash
                    className="my-auto ml-auto cursor-pointer stroke-slate-400 duration-200 hover:stroke-red-500"
                    onClick={async () => {
                        if (await confirm(<span>Remove <strong>{user.name}</strong> from <strong>{team.id}</strong></span>)) {
                            await mutateAsync({
                                teamId: team.id,
                                userId: user.id,
                            });

                            router.refresh();
                        }
                    }}
                />
            ))}
        </div>
    );
});
