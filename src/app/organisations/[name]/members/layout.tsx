'use client';

import { MembershipType } from '@/common';
import { FC, ReactNode, useState } from 'react';
import { ModalWrapper } from '@/components/ModalWrapper';
import clsx from 'clsx';
import { useOrganisation } from '../OrganisationContext';
import AddUserModal from './AddUser';

interface MembersProps {
    members: ReactNode;
    invitations: ReactNode;
}

const Members: FC<MembersProps> = ({ members, invitations }) => {
    const organisation = useOrganisation();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const [invitationsOpen, setInvitationsOpen] = useState(false);

    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3">
            {/* View Selection Card */}
            <div className="card flex h-min flex-col">
                <button className={clsx('modal-item rounded-t-md text-left', !invitationsOpen && 'bg-slate-700')} type="button" onClick={() => setInvitationsOpen(false)}>
                    Members
                </button>
                <button className={clsx('modal-item rounded-b-md text-left', invitationsOpen && 'bg-slate-700')} type="button" onClick={() => setInvitationsOpen(true)}>
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
                {invitationsOpen ? invitations : members}
            </div>
        </div>
    );
};

export default Members;
