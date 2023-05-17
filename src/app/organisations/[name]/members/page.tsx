import { getOrganisation } from '@/app/organisations/[name]/utils';
import { MemberRow } from './MemberRow';
import { OrganisationPageProps } from '../layout';

const MembersList = async ({ params }: OrganisationPageProps) => {
    const members = await getOrganisation(params).users({
        include: {
            user: true,
        },
    });

    return (
        <div className="card ">
            {/* Member list card header */}
            <div className="grid grid-cols-[min-content_auto] gap-3 rounded-t-md bg-slate-700 px-3 py-2">
                <input type="checkbox" />
                <span className="text-slate-300">Members</span>
            </div>
            {members.map((member) => (
                <MemberRow key={member.user.email} member={member} />
            ))}
        </div>
    );
};

export default MembersList;
