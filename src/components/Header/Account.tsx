'use client';

import { m } from 'framer-motion';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { ChevronUp } from 'tabler-icons-react';
import { ModalWrapper } from '../ModalWrapper';

interface AccountModalProps {
    name: string;
    onSelect: () => void;
}

/**
 * Component for the dropdown menu affiliated with clicking the current logged in user pfp and chevron
 */
const AccountModal: FC<AccountModalProps> = ({ name, onSelect }) => {
    const router = useRouter();

    return (
        <m.div
            className="card absolute right-0 top-16 flex w-max flex-col"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
        >
            <span className="border-b-2 border-slate-700 px-4 py-2 text-lg">Name: <br /><strong>{name}</strong></span>
            <div className="flex flex-col" onClick={onSelect}>
                <Link href="/organisations" className="modal-item" onClick={onSelect}>
                    Your organisations
                </Link>
                <Link href="/teams" className="modal-item" onClick={onSelect}>
                    Your teams
                </Link>
                <Link href="/settings" className="modal-item" onClick={onSelect}>
                    Settings
                </Link>

                <button onClick={() => signOut().finally(() => router.push('/'))} type="button" className="modal-item rounded-b-md border-t-2 border-slate-700 text-left">
                    Sign out
                </button>
            </div>
        </m.div>
    );
};

/**
 * Component for the section of the header concerned with showing the current logged in user
 */
export const AccountSection = ({ user }: { user: User }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="flex flex-row items-center gap-2"
                onClick={() => setModalOpen(true)}
                type="button"
            >
                {/* Cannot use next/image because it needs a specified width and height which is unknown */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.image} alt="profile" className="h-10 w-10 rounded-full" />
                <m.div animate={{ rotateX: modalOpen ? 0 : 180 }} className="text-center">
                    <ChevronUp />
                </m.div>
            </button>
            <ModalWrapper open={modalOpen} onClose={() => setModalOpen(false)}>
                <AccountModal onSelect={() => setModalOpen(false)} name={user.name} />
            </ModalWrapper>
        </div>
    );
};
