import { prisma } from '@/common/prisma';
import { notFound } from 'next/navigation';
import { protectedServerPage } from '@/components/protectedServerPage';
import { PropsWithChildren } from 'react';
import { MembershipType } from '@/common';
import { Dashboard, Users } from 'tabler-icons-react';
import { motion } from 'framer-motion';

export interface TeamPageProps<P = {}> { params: { id: string } & P }

const TeamRoot = protectedServerPage<PropsWithChildren<TeamPageProps>>(async ({ params: { id }, children, user }) => {
    // const team = await prisma.team.findFirst({
    //     where: { id },
    //     include: { users: true },
    // });
    //
    // if (!team) {
    //     notFound();
    // }
    //
    // let membershipType = MembershipType.None;
    //
    // for (const member of team.users) {
    //     if (member.userId === user.id) {
    //         if (member.isLeader) {
    //             membershipType = MembershipType.Admin;
    //         } else {
    //             membershipType = MembershipType.Member;
    //         }
    //     }
    // }
    //
    // if (membershipType === MembershipType.None) {
    //     notFound();
    // }

    const a = 5;

    return (
        <div className="space-y-3 px-10 pt-28">
            <div>
                <div className="flex items-center gap-5">
                    <strong className="text-4xl text-navy-300">4067X</strong>
                    <strong className="text-3xl">Burnside X</strong>
                </div>
                <span className="text-xl text-slate-400">Team in <strong>Burnside Robotics</strong></span>
            </div>
            <div className="flex gap-5">
                <div className="w-80">
                    <div className="relative flex items-center gap-3 rounded-md p-2 hover:bg-navy-600">
                        <Dashboard size={20} />
                        <span>Overview</span>
                        <div className="absolute inset-y-2 -left-1 w-0.5 rounded-full bg-white group-hover:bg-navy-300" />
                    </div>

                    <div className="flex items-center gap-3 rounded-md p-2 hover:bg-navy-600">
                        <Users size={20} />
                        <span>Members</span>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
});

export default TeamRoot;
