'use client';

import { Organisation } from '@prisma/client';
import { m } from 'framer-motion';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { Dashboard, Icon, List, Notes, Settings, User, Users } from 'tabler-icons-react';
import teamLogo from '@public/TeamLogo.png';

interface HeaderLinkProps<T extends string> extends PropsWithChildren {
    /**
     * Tabler icons symbol to display as part of link
     */
    symbol: Icon;
    /**
     * Optional number data affiliated with link
     */
    count?: number;
    /**
     * ***Absolute*** link for respective page
     *
     * Must be absolute otherwise the link cannot correctly validate which page is in use
     */
    url: Route<T>;
    children: string;
}

/**
 * Component for link in header of organisation layout.
 *
 * Handles underlining based upon current selected page
 */
const HeaderLink = <T extends string>({ symbol: Symbol, count, children, url }: HeaderLinkProps<T>) => {
    const isActive = usePathname()?.startsWith(url);

    return (
        <Link href={url} prefetch className="group relative flex h-10 cursor-pointer items-center gap-2 pb-1 hover:border-navy-300">
            <Symbol size={25} className="group-hover:stroke-navy-300" />
            <span className="text-xl group-hover:text-navy-300">{children}</span>
            {count !== undefined && <span className="rounded-full border-2 px-1 text-lg group-hover:border-navy-300 group-hover:text-navy-300">{count}</span>}

            {/* Uses framer motion layoutId to smoothly transition underline between links based on which is active */}
            {isActive && <m.div layoutId="organisation-header-underline" className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-white group-hover:bg-navy-300" />}
        </Link>
    );
};

interface OrganisationHeaderProps {
    organisation: Organisation;
    memberCount: number;
    teamCount: number;
}

/**
 * Component for header to be displayed above organisation sub pages
 */
export const OrganisationHeader: FC<OrganisationHeaderProps> = ({ organisation, memberCount, teamCount }) => (
    <div className="card grid auto-cols-max grid-rows-2 gap-3 p-2">
        <Image src={teamLogo} className="row-span-2 h-28 w-28" alt="organisation logo" />

        <div className="col-start-2 mt-auto space-x-10">
            <strong className="text-4xl">{organisation.name}</strong>
            <span className="text-3xl">{organisation.location}</span>
        </div>

        <div className="flex flex-row items-center gap-10 gap-y-5">
            <HeaderLink url={`/organisations/${organisation.urlName}/overview`} symbol={Dashboard}>Overview</HeaderLink>
            <HeaderLink url={`/organisations/${organisation.urlName}/blogs`} symbol={Notes}>Blogs</HeaderLink>
            <HeaderLink url={`/organisations/${organisation.urlName}/parts`} symbol={List}>Parts</HeaderLink>
            <HeaderLink url={`/organisations/${organisation.urlName}/members`} symbol={User} count={memberCount}>Members</HeaderLink>
            <HeaderLink url={`/organisations/${organisation.urlName}/teams`} symbol={Users} count={teamCount}>Teams</HeaderLink>
            <HeaderLink url={`/organisations/${organisation.urlName}/settings`} symbol={Settings}>Settings</HeaderLink>
        </div>
    </div>
);
