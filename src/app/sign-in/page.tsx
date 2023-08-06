'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */

import { m } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ErrorBox } from '@/components/Notification';
import { FC } from 'react';
import { BrandDiscord, BrandGithub, BrandGoogle } from 'tabler-icons-react';

interface SignInPageProps {
    searchParams: {
        error?: 'OAuthAccountNotLinked' | 'OAuthSignin' | 'OAuthCallback';
    };
}

/**
 * Signin page which allows user to sign-in/sign-up (depending on whether the user has already) using one of three OAuth providers
 */
const SignIn: FC<SignInPageProps> = ({ searchParams }) => {
    const { data } = useSession();
    const router = useRouter();

    if (data) {
        router.push('/');
        return null;
    }

    return (
        <div className="overflow-hidden">
            <m.div
                className="flex h-screen flex-col items-center justify-center gap-4"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-2xl">Sign in with</span>
                <div className="flex flex-row gap-3">
                    <button className="button" type="button" onClick={() => signIn('google', { callbackUrl: '/' })}><BrandGoogle /></button>
                    <button className="button" type="button" onClick={() => signIn('discord', { callbackUrl: '/' })}><BrandDiscord /></button>
                    <button className="button" type="button" onClick={() => signIn('github', { callbackUrl: '/' })}><BrandGithub /></button>
                </div>
                {searchParams.error === 'OAuthAccountNotLinked' && <ErrorBox>Your account was created with a different provider, please login with that provider</ErrorBox>}
            </m.div>
        </div>
    );
};

export default SignIn;
