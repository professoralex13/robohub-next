'use client';

import clsx from 'clsx';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

interface LinkProps<T extends string> {
    href: Route<T>;
}

export const NavLink = <T extends string>({ href: to, children }: PropsWithChildren<LinkProps<T>>) => {
    const pathname = usePathname();

    const isActive = pathname?.startsWith(to);

    return (
        <Link href={to} className={clsx('link text-xl', isActive && 'text-navy-300 underline')}>{children}</Link>
    );
};
