'use client';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { TextField } from '@/components/TextField';
import { motion } from 'framer-motion';
import { ErrorBox } from '@/components/Notification';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInSchema = Yup.object().shape({
    emailUsername: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
});

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
                <span className="text-6xl">Sign In to <span className="text-navy-300">robohub</span></span>
                <Formik
                    initialValues={{ emailUsername: '', password: '' }}
                    onSubmit={async ({ emailUsername, password }, { setStatus }) => {
                        const value = await signIn('credentials', { redirect: false, emailUsername, password });
                        // Page will be redirected because this page cannot be viewed while logged in before the status is seen
                        setStatus(value?.error);
                    }}
                    validationSchema={SignInSchema}
                >
                    {({ submitForm, isSubmitting, status }) => (
                        <Form className="card flex flex-col items-center justify-around gap-5 p-10">
                            <TextField name="emailUsername" placeholder="Email / Username" />
                            <TextField name="password" placeholder="Password" type="password" />

                            {status && (
                                <ErrorBox>{status}</ErrorBox>
                            )}

                            {isSubmitting ? <Oval stroke="#64a9e9" />
                                : <button type="submit" onClick={submitForm} className="button">Submit</button>}
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
};

export default SignIn;
