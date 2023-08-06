'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

/**
 * A component wrapper that ensures the user is logged in before rendering.
 * Also injects the users data as a prop into the component for use.
 * Only works for client components.
 * @param Component - Function component definition for component to be rendered. Function arguments will be the props generic, plus logged in user data
 * @returns Wrapped function component which ensures login before rendering
 */
export function protectedClientPage<P extends {}>(Component: (props: P & { user: User }) => JSX.Element) {
    // This function works by essentially creating another react component layer which handles session fetching
    // And then returns a call to the actual component passed as an argument
    return (props: P) => {
        const { data } = useSession();

        if (!data) {
            redirect('/');
        }

        return Component({ user: data.user, ...props });
    };
}
