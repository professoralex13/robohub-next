'use client';

import { useUser } from '@/hooks/useUser';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export function protectedClientPage<P extends {}>(Component: (props: P & { user: User }) => ReactNode) {
    return (props: P) => {
        const user = useUser();

        if (!user) {
            redirect('/');
        }

        return Component({ user, ...props });
    };
}
