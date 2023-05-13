'server only';

import { nextAuthOptions } from '@/common/auth';
import { User, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export function protectedServerPage<P extends {}>(Component: (props: P & { user: User }) => Promise<JSX.Element>) {
    return (props: P) => getServerSession(nextAuthOptions).then((session) => {
        if (!session) {
            redirect('/');
        }

        return Component({ user: session.user, ...props });
    });
}
