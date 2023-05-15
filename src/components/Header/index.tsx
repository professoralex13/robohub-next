'use server';

import Link from 'next/link';
import { Search } from 'tabler-icons-react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { NavLink } from './NavLink';
import { AccountSection } from './Account';

export const Header = async () => {
    const session = await getServerSession(nextAuthOptions);

    return (
        <header className="absolute top-0 flex w-full items-center justify-between gap-16 border-b-4 border-navy-300 p-5">
            <Link href="/" className="mr-auto text-5xl text-navy-300">robohub</Link>
            <NavLink href="/blogs">Blogs</NavLink>
            <NavLink href="/teams">Teams</NavLink>
            {session ? <AccountSection user={session.user} /> : (
                <NavLink href="/sign-in">Sign In</NavLink>
            )}
            <Search className="duration-100 hover:stroke-navy-300" />
        </header>
    );
};
