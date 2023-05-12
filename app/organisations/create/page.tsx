'use client';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { TextField } from '@/components/TextField';
import { ErrorBox } from '@/components/Notification';
import { motion } from 'framer-motion';
import { trpc } from '@/common/trpc';
import { protectedClientPage } from '@/components/protectedClientPage';
import { useRouter } from 'next/navigation';
import { cache } from 'react';

/**
 * Schema for validating the SignUp page fields
 */
const CreateOrganisationSchema = Yup.object().shape({
    name: Yup
        .string()
        // TODO: Automatically replace spaces with hyphen as name is typed to ensure name available values are same as stored
        .test('is-available', 'Name taken', cache(async (value) => !(await trpc.client.organisation.nameTaken.query(value))))
        .required('Required'),
    description: Yup
        .string()
        .min(10, 'Too short')
        .required('Required'),
    location: Yup
        .string()
        .min(2, 'Too short')
        .required('Required'),
});

const CreateOrganisation = protectedClientPage(() => {
    const router = useRouter();

    const { mutateAsync } = trpc.react.organisation.create.useMutation();

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex h-screen flex-col items-center justify-center gap-16"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <span className="text-6xl">Create Organisation</span>
                <Formik
                    initialValues={{ name: '', description: '', location: '' }}
                    onSubmit={async ({ name, description, location }) => {
                        mutateAsync({
                            name,
                            description,
                            location,
                        }).then((organisation) => {
                            // Push returned organisation name incase of character replacements
                            router.push(`/organisations/${organisation.name}`);
                        });
                    }}
                    validationSchema={CreateOrganisationSchema}
                >
                    {({ submitForm, isSubmitting, status }) => (
                        <Form className="card flex flex-col items-center justify-around gap-5 p-10">
                            <TextField name="name" placeholder="Name" />
                            <TextField name="description" placeholder="Description" />
                            <TextField name="location" placeholder="Location" />

                            {status && (
                                <ErrorBox>{status}</ErrorBox>
                            )}

                            {isSubmitting ? <Oval stroke="#64a9e9" />
                                : <button type="submit" onClick={submitForm} className="button">Create</button>}
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
});

export default CreateOrganisation;
