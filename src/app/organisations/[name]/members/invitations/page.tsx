import { getOrganisation } from '@/app/organisations/[name]/utils';
import { MemberRow } from './MemberRow';
import { OrganisationPageProps } from '../../layout';

/**
 * Component for the list of pending invites/members to an organisation
 */
const PendingMembersList = async ({ params }: OrganisationPageProps) => {
    const members = await getOrganisation(params).userInvites({
        include: {
            user: true,
            inviter: true,
        },
    });

    return (
        <div className="card">
            {/* Member list card header */}
            <div className="grid grid-cols-[min-content_auto] gap-3 rounded-t-md bg-slate-700 px-3 py-2">
                <input type="checkbox" />
                <span className="text-slate-300">Invited Members</span>
            </div>
            {members.map((member) => (
                <MemberRow key={member.user.email} member={member} />
            ))}
        </div>
    );
};

export default PendingMembersList;
