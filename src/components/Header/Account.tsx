'use client';

import { motion } from 'framer-motion';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import Image from 'next/image';
import PFP from '@public/pfp.png';
import caretIcon from '@public/Caret.svg';
import { ModalWrapper } from '../ModalWrapper';

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

export const AccountSection = ({ user }: { user: User }) => {
    const [modalOpen, setModalOpen] = useState(false);

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
