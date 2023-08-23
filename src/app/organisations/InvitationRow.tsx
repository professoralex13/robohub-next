'use client';

import { CircleCheck, CircleX } from 'tabler-icons-react';
import { trpc } from '@/common/trpc';
import { Organisation, OrganisationInvite } from '@prisma/client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loading-icons';

interface InvitationRowProps {
    invitation: OrganisationInvite & {
        organisation: Organisation;
    };
}

/**
 * Client component for showing pending invitation for the user to an organisation.
 *
 * Handles the accepting or declining of the invitation with a form.
 */
export const InvitationRow: FC<InvitationRowProps> = ({ invitation }) => {
    const { mutateAsync, isLoading } = trpc.react.organisation.respondToInvite.useMutation();

    const router = useRouter();

    const respond = async (accept: boolean) => {
        await mutateAsync({ accept, organisationId: invitation.organisationId });
        router.refresh();
    };

    return (
        <div
            className="group flex flex-row items-center rounded-lg p-2 duration-100 hover:bg-slate-700"
        >
            <span className="mr-10 break-words text-2xl">{invitation.organisation.name}</span>

            {isLoading ? <Oval width={27} height={27} /> : (
                <>
                    <CircleX size={30} className="mr-2 cursor-pointer opacity-0 duration-200 hover:stroke-red-500 group-hover:opacity-100" onClick={() => respond(false)} />
                    <CircleCheck size={30} className="cursor-pointer opacity-0 duration-200 hover:stroke-green-500 group-hover:opacity-100" onClick={() => respond(true)} />
                </>
            )}
        </div>
    );
};
