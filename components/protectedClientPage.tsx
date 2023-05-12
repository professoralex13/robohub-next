'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export function protectedClientPage<P extends {}>(Component: (props: P & { user: User }) => ReactNode) {
    return (props: P) => {
        const { data } = useSession();

        if (!data) {
            redirect('/');
        }

        return Component({ user: data.user, ...props });
    };
}
