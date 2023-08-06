'use client';

import { FC, PropsWithChildren } from 'react';
import { MembershipType } from '@/common';
import { useOrganisation } from '@/app/organisations/[name]/OrganisationContext';
import { useDialogContext } from '@/app/contexts/DialogContext';
import { CreateTeamDialog } from '@/app/organisations/[name]/teams/CreateTeamDialog';

/**
 * Layout of Teams tab of organisation page
 */
const Teams: FC<PropsWithChildren> = ({ children }) => {
    const organisation = useOrganisation();

    const openDialog = useDialogContext();

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
                {/* Input field for filtering the names of teams */}
                <input placeholder="Find Teams" type="text" className="row-span-1" />
                {organisation.membershipType >= MembershipType.Admin && (
                    <div className="relative col-start-4">
                        <button type="button" className="button" onClick={() => openDialog(<CreateTeamDialog organisation={organisation} />)}>
                            Create Team
                        </button>
                    </div>
                )}
            </div>

            {children}
        </div>
    );
};

export default Teams;
