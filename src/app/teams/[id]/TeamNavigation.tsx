'use client';

import { Dashboard, Icon, Users } from 'tabler-icons-react';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { Route } from 'next';
import Link from 'next/link';
import { m } from 'framer-motion';

interface NavigationLinkProps<T extends string> extends PropsWithChildren {
    symbol: Icon;
    count?: number;
    children: string;
    url: Route<T>;
}

const NavigationLink = <T extends string>({ symbol: Symbol, count, children, url }: NavigationLinkProps<T>) => {
    const isActive = usePathname()?.startsWith(url);

    return (
        <Link href={url} prefetch className="relative flex cursor-pointer items-center gap-3 rounded-md p-2 duration-200 hover:bg-navy-600">
            {isActive && <m.div layoutId="organisation-header-sideline" className="absolute inset-y-2 -left-1 w-0.5 rounded-full bg-white group-hover:bg-navy-300" />}
            <Symbol size={20} />
            <span className="mr-auto">{children}</span>
            {count !== undefined && <span className="rounded-full border-2 px-1 text-sm group-hover:border-navy-300 group-hover:text-navy-300">{count}</span>}
        </Link>
    );
};

interface TeamNavigationProps {
    teamId: string;
    memberCount: number;
}

export const TeamNavigation: FC<TeamNavigationProps> = ({ teamId, memberCount }) => (
    <div className="w-80">
        <NavigationLink url={`/teams/${teamId}/overview`} symbol={Dashboard}>
            Overview
        </NavigationLink>

        <NavigationLink url={`/teams/${teamId}/members`} symbol={Users} count={memberCount}>
            Members
        </NavigationLink>
    </div>
);
