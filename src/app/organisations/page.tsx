import { Settings } from 'tabler-icons-react';
import { MotionDiv } from '@/components/Motion';
import { prisma } from '@/common/prisma';
import Link from 'next/link';
import { protectedServerPage } from '@/components/protectedServerPage';
import { InvitationRow } from '@/app/organisations/InvitationRow';

/**
 * Page showing the list of organisations that the current logged in user is a member of, plus pending invites to other organisations.
 */
const OrganisationList = protectedServerPage(async ({ user }) => {
    // Gets list of organisations which have OrganisationMembers with the logged user affiliate
    const organisations = await prisma.organisation.findMany({
        where: {
            users: {
                some: {
                    user,
                },
            },
        },
        include: {
            users: {
                where: {
                    user,
                },
            },
        },
    });

    // Gets list of invitations where the affiliated user is the logged in uesr
    const invitations = await prisma.organisationInvite.findMany({
        where: {
            user,
        },
        include: {
            organisation: true,
        },
    });

    return (
        <div className="overflow-hidden">
            <MotionDiv
                className="flex flex-col items-center gap-10 overflow-hidden p-5"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-2xl">Your Organisations</span>
                <div className="card flex flex-col gap-3 p-3">
                    {organisations.map((organisation) => (
                        <Link
                            href={`/organisations/${organisation.urlName}/overview`}
                            className="flex cursor-pointer flex-row items-center justify-between gap-3 rounded-lg p-2 duration-100 hover:bg-slate-700"
                        >
                            <span className="break-words text-2xl">{organisation.name}</span>

                            {organisation.users[0].isAdmin && (
                                <Link
                                    href={`/organisations/${organisation.urlName}/settings`}
                                >
                                    <Settings size={20} className="hover:stroke-navy-300" />
                                </Link>
                            )}
                        </Link>
                    ))}
                    {organisations.length === 0 && (
                        <span className="text-center text-2xl">You are not a member of any organisations</span>
                    )}
                    {invitations.length !== 0 && (
                        <span className="ml-2 border-t-[1px] border-slate-500 pt-5 text-left text-2xl text-slate-400">Invitations</span>
                    )}
                    {invitations.map((invite) => (
                        <InvitationRow invitation={invite} />
                    ))}
                </div>

                <Link href="/organisations/create" className="button">Create Organisation</Link>
            </MotionDiv>
        </div>
    );
});

export default OrganisationList;
