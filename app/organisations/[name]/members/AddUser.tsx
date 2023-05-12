'use client';

import { trpc } from '@/common/trpc';
import { User } from '@prisma/client';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { Oval } from 'react-loading-icons';
import PFP from '@/public/pfp.png';
import Image from 'next/image';
import { useConfirmation } from '@/app/contexts/ConfirmationContext';
import { useOrganisation } from '../OrganisationContext';

interface UserCardProps {
    user: User;
    onSelect: () => void;
}

const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
    const { mutateAsync, isLoading } = trpc.react.organisation.addUser.useMutation();

    const organisation = useOrganisation();

    const router = useRouter();

    const confirm = useConfirmation();

    return (
        <button
            className="group relative h-max w-full cursor-pointer"
            onClick={!isLoading ? (async () => {
                if (await confirm(<span>Add <strong>{user.username}</strong> to <strong>{organisation.name}</strong></span>)) {
                    await mutateAsync({
                        organisationName: organisation.name,
                        username: user.username,
                    });

                    router.refresh();

                    onSelect();
                }
            }) : undefined}
            type="button"
        >
            <div className={clsx(
                'card grid auto-cols-max gap-x-3 p-2 duration-200',
                isLoading ? 'opacity-50 blur-sm' : 'group-hover:opacity-50 group-hover:blur-sm',
            )}
            >
                <Image src={PFP} alt="profile" className="col-span-1 col-start-1 row-span-2 row-start-1 h-14 w-14 rounded-full" />
                <span className="col-start-2 row-start-1 text-start text-xl">{user.username}</span>
                <span className="col-start-2 row-start-2 text-start text-lg text-slate-300">{user.email}</span>
            </div>

            <div
                className={clsx(
                    'absolute left-0 top-0 flex h-full w-full items-center justify-center p-2 opacity-0 duration-200',
                    isLoading ? 'opacity-100' : 'group-hover:opacity-100',
                )}
            >
                {isLoading ? <Oval /> : <span className="text-lg">Add to Organisation</span>}
            </div>
        </button>
    );
};

const AddUserModal: FC<{ onClose: () => void }> = ({ onClose }) => {
    const [query, setQuery] = useState('');

    const organisation = useOrganisation();

    const { data } = trpc.react.users.query.useQuery({ query, take: 10, ignoredOrganisation: organisation.name });

    return (
        <motion.div
            className="card absolute right-0 top-14 w-max space-y-3 p-5"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
        >
            <input type="text" placeholder="email/username/full name" value={query} onChange={(e) => setQuery(e.target.value)} />

            {/* List must be hidden when length zero so space-y-3 does not create empty space */}
            <div className={clsx('flex max-h-[50vh] flex-col items-center gap-3 overflow-y-auto', data?.length === 0 && 'hidden')}>
                {data === undefined ? <Oval /> : data.map((user) => (
                    <UserCard key={user.username} user={user} onSelect={onClose} />
                ))}
            </div>
        </motion.div>
    );
};

export default AddUserModal;
