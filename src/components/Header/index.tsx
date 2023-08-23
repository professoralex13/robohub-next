'use server';

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/common/auth';
import { NavLink } from './NavLink';
import { AccountSection } from './Account';

export const Header = async () => {
    const session = await getServerSession(nextAuthOptions);

    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-16 border-b-2 border-navy-300 p-2 px-5">
            <Link href="/" className="mr-auto text-2xl text-navy-300">robohub</Link>
            {session ? <AccountSection user={session.user} /> : (
                <NavLink href="/sign-in">Sign in</NavLink>
            )}
        </header>
    );
};
