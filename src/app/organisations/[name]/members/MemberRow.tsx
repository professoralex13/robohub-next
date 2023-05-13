'use client';

import { OrganisationUser, User } from '@prisma/client';
import { protectedClientPage } from '@/components/protectedClientPage';
import { MembershipType } from '@/common';
import { trpc } from '@/common/trpc';
import { Oval } from 'react-loading-icons';
import { Trash } from 'tabler-icons-react';
import { useRouter } from 'next/navigation';
import { useConfirmation } from '@/app/contexts/ConfirmationContext';
import { useOrganisation } from '../OrganisationContext';

interface MemberRowProps {
    member: OrganisationUser & {
        user: User;
    };
}

export const MemberRow = protectedClientPage<MemberRowProps>(({ member, user: loggedInUser }) => {
    const { user, isAdmin } = member;

    const organisation = useOrganisation();

    const showRemoveButton = organisation.membershipType >= MembershipType.Admin && user.username !== loggedInUser.username;

    const { mutateAsync, isLoading } = trpc.react.organisation.removeUser.useMutation();

    const router = useRouter();

    const confirm = useConfirmation();

    return (
        <div
            className="grid grid-cols-[max-content_auto_max-content_5%] gap-3 overflow-hidden p-3"
        >
            <input type="checkbox" className="m-auto" />
            <span className="text-xl text-slate-400">{user.username}</span>
            {isAdmin && <span className="text-xl text-slate-400">Admin</span>}
            {showRemoveButton && (isLoading ? <Oval className="my-auto ml-auto h-7" /> : (
                <Trash
                    className="my-auto ml-auto cursor-pointer stroke-slate-400 duration-200 hover:stroke-red-500"
                    onClick={async () => {
                        if (await confirm(<span>Remove <strong>{user.username}</strong> from <strong>{organisation.name}</strong></span>)) {
                            await mutateAsync({
                                organisationName: organisation.name,
                                username: user.username,
                            });

                            router.refresh();
                        }
                    }}
                />
            ))}
        </div>
    );
});
