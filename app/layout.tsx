import { FC, PropsWithChildren } from 'react';
import './index.css';
import { Header } from '@/components/Header';
import { Session } from 'next-auth';
import Providers from '@/components/Providers';

const RootLayout: FC<PropsWithChildren<{ session: Session }>> = ({ session, children }) => (
    <html lang="en">
        <body>
            <Providers session={session}>
                <Header />
                {children}
            </Providers>
        </body>
    </html>
);

export default RootLayout;
