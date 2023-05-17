import { FC, PropsWithChildren } from 'react';
import './index.css';
import { Header } from '@/components/Header';
import { Session } from 'next-auth';
import Providers from '@/components/Providers';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';

const sans = localFont({
    src: [
        {
            path: '../fonts/Product Sans Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../fonts/Product Sans Italic.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../fonts/Product Sans Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../fonts/Product Sans Bold Italic.ttf',
            weight: '700',
            style: 'italic',
        },
    ],
});
const RootLayout: FC<PropsWithChildren<{ session: Session }>> = ({ session, children }) => (
    <html lang="en" className={sans.className}>
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
