import { protectedServerPage } from '@/components/protectedServerPage';
import { prisma } from '@/common/prisma';
import { MotionDiv } from '@/components/Motion';
import Link from 'next/link';
import { Settings } from 'tabler-icons-react';

/**
 * Page for showing list of teams that the current user is a member of.
 *
 * Being a member or admin of an organisation does not mean you are in every team in an organisation.
 */
const TeamsList = protectedServerPage(async ({ user }) => {
    const teams = await prisma.team.findMany({
        where: {
            users: {
                some: {
                    user,
                },
            },
        },
    });

    return (
        <div className="overflow-hidden">
            <MotionDiv
                className="flex h-screen flex-col items-center gap-16 overflow-hidden p-5 pt-36"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-6xl">Your Teams</span>
                <div className="card flex w-[33vw] flex-col gap-5 p-5">
                    {teams.map((team) => (
                        <Link
                            href={`/teams/${team.id}/overview`}
                            className="flex cursor-pointer flex-row items-center justify-between rounded-lg p-2 duration-100 hover:bg-slate-700"
                        >
                            <strong className="text-4xl">{team.id}</strong>
                            <span className="text-4xl">{team.name}</span>

                            <Settings size={30} className="hover:stroke-navy-300" />
                        </Link>
                    ))}
                    {teams.length === 0 && (
                        <span className="text-center text-3xl">You are not a member of any teams</span>
                    )}
                </div>
            </MotionDiv>
        </div>
    );
});

export default TeamsList;
