'use client';

import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { TextField } from '@/components/TextField';
import { motion } from 'framer-motion';
import { ErrorBox } from '@/components/Notification';
import { trpc } from '@/common/trpc';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SignUpSchema } from '@/common/schema';

const SignUp = () => {
    const { data } = useSession();
    const router = useRouter();

    const { mutateAsync } = trpc.react.auth.signUp.useMutation();

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
                <span className="text-6xl">Sign Up for <span className="text-navy-300">robohub</span></span>
                <Formik
                    initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                    onSubmit={async ({ email, username, password, confirmPassword }, { setFieldError }) => {
                        const [usernameTaken, emailTaken] = await Promise.all([
                            trpc.client.auth.usernameTaken.query(username),
                            trpc.client.auth.emailTaken.query(email),
                        ]);

                        if (emailTaken) {
                            setFieldError('email', 'Email Taken');
                        }

                        if (usernameTaken) {
                            setFieldError('username', 'Username Taken');
                        }

                        if (emailTaken || usernameTaken) {
                            return;
                        }

                        await mutateAsync({
                            email,
                            username,
                            password,
                            confirmPassword,
                        });

                        router.push('/');

                        await signIn('credentials', { emailUsername: email, password });
                    }}
                    validationSchema={SignUpSchema}
                >
                    {({ submitForm, isSubmitting, status }) => (
                        <Form className="card flex flex-col items-center justify-around gap-5 p-10">
                            <TextField name="email" placeholder="Email" />
                            <TextField name="username" placeholder="Username" disallowSpaces />
                            <TextField name="password" placeholder="Password" type="password" />
                            <TextField name="confirmPassword" placeholder="Confirm Password" type="password" />

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

export default SignUp;
