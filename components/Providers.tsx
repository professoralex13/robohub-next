'use client';

import { trpc } from '@/common/trpc';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { FC, PropsWithChildren } from 'react';

interface ProvidersProps {
    session: Session;
}

const Providers: FC<PropsWithChildren<ProvidersProps>> = ({ session, children }) => (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
);

// Fixes errors when rendering this component
export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren<ProvidersProps>>;
