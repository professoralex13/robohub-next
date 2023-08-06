'use client';

import { trpc } from '@/common/trpc';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { FC, PropsWithChildren } from 'react';
import { DialogContextProvider } from '@/app/contexts/DialogContext';
import { LazyMotion, domMax } from 'framer-motion';

interface ProvidersProps {
    session: Session;
}

/**
 * Providers must be called in a client component otherwise they will not work.
 * This Component wraps all necessary providers in a client file.
 */
const Providers: FC<PropsWithChildren<ProvidersProps>> = ({ session, children }) => (
    <SessionProvider session={session}>
        <LazyMotion features={domMax}>
            <DialogContextProvider>
                {children}
            </DialogContextProvider>
        </LazyMotion>
    </SessionProvider>
);

// Fixes errors when rendering this component
export default trpc.react.withTRPC(Providers) as FC<PropsWithChildren<ProvidersProps>>;
