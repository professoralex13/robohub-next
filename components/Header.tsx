'use client';

import { Search } from 'tabler-icons-react';
import { FC, PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Route } from 'next';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { ModalWrapper } from './ModalWrapper';
import PFP from '../public/pfp.png';
import caretIcon from '../public/Caret.svg';

interface LinkProps<T extends string> {
    href: Route<T>;
}

const NavLink = <T extends string>({ href: to, children }: PropsWithChildren<LinkProps<T>>) => {
    const pathname = usePathname();

    const isActive = pathname?.startsWith(to);

    return (
        <Link href={to} className={clsx('link text-xl', isActive && 'text-navy-300 underline')}>{children}</Link>
    );
};

interface AccountModalProps {
    username: string;
    onSelect: () => void;
}

const AccountModal: FC<AccountModalProps> = ({ username, onSelect }) => {
    const router = useRouter();

    return (
        <motion.div
            className="card absolute right-0 top-16 flex w-max flex-col"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
        >
            <span className="border-b-2 border-slate-700 px-4 py-2 text-lg">Username: <br /><strong>{username}</strong></span>
            <div className="flex flex-col" onClick={onSelect}>
                <Link href="/organisations" className="modal-item" onClick={onSelect}>
                    Your organisations
                </Link>
                <Link href="/settings" className="modal-item" onClick={onSelect}>
                    Settings
                </Link>

                <button onClick={() => signOut().finally(() => router.push('/'))} type="button" className="modal-item rounded-b-md border-t-2 border-slate-700 text-left">
                    Sign out
                </button>
            </div>
        </motion.div>
    );
};

const AccountSection = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const user = useUser();

    if (!user) {
        return (
            <>
                <NavLink href="/sign-in">Sign In</NavLink>
                <NavLink href="/sign-up">Sign Up</NavLink>
            </>
        );
    }

    return (
        <div className="relative">
            <button
                className="flex flex-row items-center gap-2"
                onClick={() => setModalOpen(true)}
                type="button"
            >
                <Image src={PFP} alt="profile" className="h-12 w-12 rounded-full" />
                <Image src={caretIcon} alt="caret" />
            </button>
            <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)}>
                <AccountModal onSelect={() => setModalOpen(false)} username={user.username} />
            </ModalWrapper>
        </div>
    );
};

export const Header = () => (
    <header className="fixed top-0 z-10 flex w-screen items-center justify-between gap-16 border-b-4 border-navy-300 p-5">
        <Link href="/" className="mr-auto text-5xl text-navy-300">robohub</Link>
        <NavLink href="/blogs">Blogs</NavLink>
        <NavLink href="/teams">Teams</NavLink>
        <AccountSection />
        <Search className="duration-100 hover:stroke-navy-300" />
    </header>
);
