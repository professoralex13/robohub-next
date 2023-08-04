'use client';

import { OrganisationInvite, User } from '@prisma/client';
import { protectedClientPage } from '@/components/protectedClientPage';
import { MembershipType } from '@/common';
import { trpc } from '@/common/trpc';
import { Oval } from 'react-loading-icons';
import { X } from 'tabler-icons-react';
import { useRouter } from 'next/navigation';
import { useConfirmation } from '@/components/ConfirmationDialog';
import { useOrganisation } from '../../OrganisationContext';

interface MemberRowProps {
    member: OrganisationInvite & {
        user: User;
        inviter: User;
    };
}

export const MemberRow = protectedClientPage<MemberRowProps>(({ member, user: loggedInUser }) => {
    const { user, isAdmin, inviter } = member;

    const organisation = useOrganisation();

    const showRemoveButton = organisation.membershipType >= MembershipType.Admin && user.id !== loggedInUser.id;

    const { mutateAsync, isLoading } = trpc.react.organisation.cancelInvite.useMutation();

    const router = useRouter();

    const confirm = useConfirmation();

    return (
        <div
            className="grid grid-cols-[max-content_auto_max-content_5%] gap-3 overflow-hidden p-3"
        >
            <input type="checkbox" className="m-auto" />
            <span className="text-xl text-slate-400">{user.name}</span>
            <span className="text-lg text-slate-400">Invited by {inviter.name}</span>
            {isAdmin && <span className="text-xl text-slate-400">Admin</span>}
            {showRemoveButton && (isLoading ? <Oval className="my-auto ml-auto h-7" /> : (
                <X
                    className="my-auto ml-auto cursor-pointer stroke-slate-400 duration-200 hover:stroke-red-500"
                    onClick={async () => {
                        if (await confirm(<span>Cancel <strong>{user.name}'s</strong> invitation</span>)) {
                            await mutateAsync({
                                organisationId: organisation.id,
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
