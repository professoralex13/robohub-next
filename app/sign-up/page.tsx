'use client';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { TextField } from '@/components/TextField';
import { motion } from 'framer-motion';
import { ErrorBox } from '@/components/Notification';
import { trpc } from '@/common/trpc';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Schema for validating the SignUp page fields
 */
const SignUpSchema = Yup.object().shape({
    email: Yup
        .string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Not valid email')
        .required('Required'),
    username: Yup
        .string()
        .min(2, 'Too short')
        .max(15, 'Too long')
        .required('Required'),
    password: Yup
        .string()
        .min(2, 'Too short')
        .max(15, 'Too long')
        .required('Required'),
    confirmPassword: Yup
        .string()
        // Yup.ref(...) returns the value of another field in the object
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .required('Required'),
});

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
                    onSubmit={async ({ email, username, password }, { setFieldError }) => {
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
