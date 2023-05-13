'use client';

import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { TextField } from '@/components/TextField';
import { ErrorBox } from '@/components/Notification';
import { motion } from 'framer-motion';
import { trpc } from '@/common/trpc';
import { protectedClientPage } from '@/components/protectedClientPage';
import { useRouter } from 'next/navigation';
import { CreateOrganisationSchema } from '@/common/schema';

/**
 * Schema for validating the SignUp page fields
 */

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
                    onSubmit={async ({ name, description, location }, { setFieldError }) => {
                        const nameTaken = await trpc.client.organisation.nameTaken.query(name);

                        if (nameTaken) {
                            setFieldError('name', 'Name Taken');
                            return;
                        }

                        const organisation = await mutateAsync({
                            name,
                            description,
                            location,
                        });

                        router.push(`/organisations/${organisation.name}`);
                    }}
                    validationSchema={CreateOrganisationSchema}
                >
                    {({ submitForm, isSubmitting, status }) => (
                        <Form className="card flex flex-col items-center justify-around gap-5 p-10">
                            <TextField name="name" placeholder="Name" disallowSpaces />
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
