import { FC, PropsWithChildren } from 'react';
import './index.css';
import { Header } from '@/components/Header';
import { Session } from 'next-auth';
import Providers from '@/components/Providers';
import { Analytics } from '@vercel/analytics/react';

const RootLayout: FC<PropsWithChildren<{ session: Session }>> = ({ session, children }) => (
    <html lang="en">
        <body>
            <Providers session={session}>
                <Header />
                {children}
                <Analytics />
            </Providers>
        </body>
    </html>
);

export default RootLayout;
