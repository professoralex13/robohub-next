'use client';

import { Dashboard, Icon, Users } from 'tabler-icons-react';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { Route } from 'next';
import Link from 'next/link';
import { m } from 'framer-motion';

interface NavigationLinkProps<T extends string> extends PropsWithChildren {
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

const NavigationLink = <T extends string>({ symbol: Symbol, count, children, url }: NavigationLinkProps<T>) => {
    const isActive = usePathname()?.startsWith(url);

    return (
        <Link href={url} prefetch className="relative flex cursor-pointer items-center gap-3 rounded-md p-2 duration-200 hover:bg-navy-600">
            {/* Uses framer motion layoutId to smoothly transition sideline between links based on which is active */}
            {isActive && <m.div layoutId="organisation-header-sideline" className="absolute inset-y-2 -left-1 w-0.5 rounded-full bg-white group-hover:bg-navy-300" />}
            <Symbol size={20} />
            <span className="max-sm:hidden">{children}</span>
            {count !== undefined && <span className="rounded-full border-2 px-1 text-sm group-hover:border-navy-300 group-hover:text-navy-300">{count}</span>}
        </Link>
    );
};

interface TeamNavigationProps {
    teamId: string;
    memberCount: number;
}

/**
 * Component for sidebar navigation to be shown in teams layout
 */
export const TeamNavigation: FC<TeamNavigationProps> = ({ teamId, memberCount }) => (
    <div>
        <NavigationLink url={`/teams/${teamId}/overview`} symbol={Dashboard}>
            Overview
        </NavigationLink>

        <NavigationLink url={`/teams/${teamId}/members`} symbol={Users} count={memberCount}>
            Members
        </NavigationLink>
    </div>
);
