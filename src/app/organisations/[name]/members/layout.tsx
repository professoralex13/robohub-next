'use client';

import { MembershipType } from '@/common';
import { FC, PropsWithChildren, useState } from 'react';
import { ModalWrapper } from '@/components/ModalWrapper';
import clsx from 'clsx';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { useOrganisation } from '../OrganisationContext';
import AddUserModal from './AddUser';
import { OrganisationPageProps } from '../layout';

/**
 * Layout component for the members tab of an organisation
 *
 * This layout uses the [parallel routing](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) pattern to switch between showing invitations, and members.
 *
 * We need to do this instead of just putting `<MembersList>` and `<PendingMembersList>` in because the invitations and members lists must be server components
 */
const Members: FC<PropsWithChildren<OrganisationPageProps>> = ({ children, params }) => {
    const organisation = useOrganisation();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const invitationsOpen = useSelectedLayoutSegment() === 'invitations';

    const router = useRouter();

    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3">
            {/* View Selection Card */}
            <div className="card flex h-min flex-col">
                <button
                    className={clsx('modal-item rounded-t-md text-left', !invitationsOpen && 'bg-slate-700')}
                    type="button"
                    onClick={() => router.push(`/organisations/${params.name}/members`)}
                >
                    Members
                </button>
                <button
                    className={clsx('modal-item rounded-b-md text-left', invitationsOpen && 'bg-slate-700')}
                    type="button"
                    onClick={() => router.push(`/organisations/${params.name}/members/invitations`)}
                >
                    Invitations
                </button>
            </div>

            {/* Input field for filtering the names of members */}
            <input placeholder="Search" type="text" className="row-span-1" />
            {organisation.membershipType >= MembershipType.Admin && (
                <div className="relative col-start-4">
                    <button type="button" className="button" onClick={() => setInviteDialogOpen(true)}>
                        Invite Members
                    </button>
                    <ModalWrapper open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                        <AddUserModal onClose={() => setInviteDialogOpen(false)} />
                    </ModalWrapper>
                </div>
            )}

            {/* Card showing list of all members in organisation */}
            <div className="col-span-3 col-start-2 row-start-2">
                {children}
            </div>
        </div>
    );
};

export default Members;
