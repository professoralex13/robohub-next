'use client';

import { MembershipType } from '@/common';
import { FC, PropsWithChildren, useState } from 'react';
import { ModalWrapper } from '@/components/ModalWrapper';
import { useOrganisation } from '../OrganisationContext';
import AddUserModal from './AddUser';

const Members: FC<PropsWithChildren> = ({ children }) => {
    const organisation = useOrganisation();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3">
            {/* View Selection Card */}
            <div className="card flex h-min flex-col">
                <button className="modal-item rounded-t-md bg-slate-700 text-left" type="button">
                    Members
                </button>
                <button className="modal-item rounded-b-md text-left text-slate-400" type="button">
                    Pending Members
                </button>
            </div>

            {/* Input field for filtering the names of members */}
            <input placeholder="Find Members" type="text" className="row-span-1" />
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
