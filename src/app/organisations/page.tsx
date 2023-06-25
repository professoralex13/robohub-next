import { Settings } from 'tabler-icons-react';
import { MotionDiv } from '@/components/Motion';
import { prisma } from '@/common/prisma';
import Link from 'next/link';
import { protectedServerPage } from '@/components/protectedServerPage';
import { InvitationRow } from '@/app/organisations/InvitationRow';

const OrganisationList = protectedServerPage(async ({ user }) => {
    const organisations = await prisma.organisation.findMany({
        where: {
            users: {
                some: {
                    user,
                },
            },
        },
    });

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
                className="flex h-screen flex-col items-center justify-between overflow-hidden p-5 pt-36"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col items-center gap-16">
                    <span className="text-6xl">Your Organisations</span>
                    <div className="card flex w-[33vw] flex-col gap-5 p-5">
                        {organisations.map((organisation) => (
                            <Link
                                href={`/organisations/${organisation.urlName}/overview`}
                                className="flex cursor-pointer flex-row items-center justify-between rounded-lg p-2 duration-100 hover:bg-slate-700"
                            >
                                <span className="text-4xl">{organisation.name}</span>

                                <Settings size={30} className="hover:stroke-navy-300" />
                            </Link>
                        ))}
                        {organisations.length === 0 && (
                            <span className="text-center text-3xl">You are not a member of any organisations</span>
                        )}
                        {invitations.length !== 0 && (
                            <span className="border-t-[1px] border-slate-500 pt-5 text-center text-3xl text-slate-400">Invitations</span>
                        )}
                        {invitations.map((invite) => (
                            <InvitationRow invitation={invite} />
                        ))}
                    </div>
                </div>

                <Link href="/organisations/create" className="button">Create Organisation</Link>
            </MotionDiv>
        </div>
    );
});

export default OrganisationList;
