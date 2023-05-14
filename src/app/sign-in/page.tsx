'use client';

import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ErrorBox } from '@/components/Notification';
import { FC } from 'react';

interface SignInPageProps {
    searchParams: {
        error?: 'OAuthAccountNotLinked' | 'OAuthSignin' | 'OAuthCallback';
    };
}

const SignIn: FC<SignInPageProps> = ({ searchParams }) => {
    const { data } = useSession();
    const router = useRouter();

    if (data) {
        router.push('/');
        return null;
    }

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex h-screen flex-col items-center justify-center gap-16"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button className="button" type="button" onClick={() => signIn('google')}>Sign in with google</button>
                <button className="button" type="button" onClick={() => signIn('discord')}>Sign in with discord</button>
                <button className="button" type="button" onClick={() => signIn('github')}>Sign in with github</button>

                {searchParams.error === 'OAuthAccountNotLinked' && <ErrorBox>Your account was created with a different provider, please login with that provider</ErrorBox>}
            </motion.div>
        </div>
    );
};

export default SignIn;
