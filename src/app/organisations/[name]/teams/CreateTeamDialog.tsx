'use client';

import { X } from 'tabler-icons-react';
import { useDialogContext } from '@/app/contexts/DialogContext';
import { m } from 'framer-motion';
import { FC } from 'react';
import { Form, Formik } from 'formik';
import { TextField } from '@/components/TextField';
import { ErrorBox } from '@/components/Notification';
import { Oval } from 'react-loading-icons';
import { trpc } from '@/common/trpc';
import { useRouter } from 'next/navigation';
import { CreateTeamSchema } from '@/common/schema';
import { Organisation } from '@prisma/client';

interface CreateTeamDialogProps {
    organisation: Organisation;
}

/**
 * Dialog popup allowing user to create a team in the current organisation
 */
export const CreateTeamDialog: FC<CreateTeamDialogProps> = ({ organisation }) => {
    const openDialog = useDialogContext();

    const { mutateAsync } = trpc.react.organisation.createTeam.useMutation();

    const router = useRouter();

    return (
        <m.div
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            className="card absolute flex flex-col items-center gap-5 p-7"
        >
            <X className="absolute right-3 top-3 cursor-pointer duration-200 hover:stroke-red-500" size={30} onClick={() => openDialog(null)} />
            <span className="text-center text-4xl">Create Team for <strong>{organisation.name}</strong></span>
            <Formik
                initialValues={{ id: '', name: '' }}
                onSubmit={async ({ id, name }, { setFieldError }) => {
                    // Fetch status of id and name use in parallel
                    const [idTaken, nameTaken] = await Promise.all([
                        trpc.client.teams.idTaken.query(id),
                        trpc.client.organisation.teamNameTaken.query({ organisationId: organisation.id, teamName: name }),
                    ]);

                    if (idTaken) {
                        setFieldError('id', 'Id Taken');
                    }

                    if (nameTaken) {
                        setFieldError('name', 'Name Taken in organisation');
                    }

                    // If either id or name are taken, we return from onSubmit as to not make the request to create the org
                    if (idTaken || nameTaken) {
                        return;
                    }

                    await mutateAsync({
                        id,
                        name,
                        organisationId: organisation.id,
                    });

                    router.refresh();
                    openDialog(null);
                }}
                validationSchema={CreateTeamSchema}
            >
                {({ status, isSubmitting, submitForm }) => (
                    <Form className="flex flex-col items-center justify-around gap-5 p-10">
                        <TextField name="id" placeholder="id" />
                        <TextField name="name" placeholder="name" disallowSpaces />

                        {status && (
                            <ErrorBox>{status}</ErrorBox>
                        )}

                        {isSubmitting ? <Oval stroke="#64a9e9" /> : <button type="submit" onClick={submitForm} className="button">Submit</button>}
                    </Form>
                )}
            </Formik>
        </m.div>
    );
};
