'server only';

import { nextAuthOptions } from '@/common/auth';
import { User, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

/**
 * A component wrapper that ensures the user is logged in before rendering.
 * Also injects the users data as a prop into the component for use.
 * Only works for server components.
 * @param Component - Function component definition for component to be rendered. Function arguments will be the props generic, plus logged in user data
 * @returns Wrapped function component which ensures login before rendering
 */
export function protectedServerPage<P extends {}>(Component: (props: P & { user: User }) => Promise<JSX.Element>) {
    // This function works by returning a new component which cets the session on server then either returns wrapped component, or redirects if no session is found
    return (props: P) => getServerSession(nextAuthOptions).then((session) => {
        if (!session) {
            redirect('/');
        }

        return Component({ user: session.user, ...props });
    });
}
