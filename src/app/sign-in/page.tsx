'use client';

import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
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
            </motion.div>
        </div>
    );
};

export default SignIn;
