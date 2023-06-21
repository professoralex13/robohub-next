import { protectedServerPage } from '@/components/protectedServerPage';
import { PropsWithChildren } from 'react';
import { TeamPageProps } from '@/app/teams/[id]/layout';
import { getTeam } from '@/app/teams/[id]/utils';
import { MemberRow } from '@/app/teams/[id]/members/MemberRow';

const Members = protectedServerPage<PropsWithChildren<TeamPageProps>>(async ({ params }) => {
    const members = await getTeam(params).users({
        include: {
            user: true,
        },
    });

    return (
        <div>
            {members.length === 0 && <span className="mx-auto">This team has no members</span>}
            {members.map((member) => (
                <MemberRow key={member.user.email} member={member} />
            ))}
        </div>
    );
});

export default Members;
