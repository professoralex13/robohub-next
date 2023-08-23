'use client';

import { Formik } from 'formik';
import { protectedClientPage } from '@/components/protectedClientPage';
import { ImageUpload } from '@/components/ImageUpload';
import { trpc } from '@/common/trpc';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loading-icons';

/**
 * Page for the current logged in users personal preferences.
 */
const Settings = protectedClientPage(({ user }) => {
    const { mutateAsync: createPresignedUrl } = trpc.react.account.uploadAvatarPresignedUrl.useMutation();

    const router = useRouter();

    return (
        <div className="flex flex-col items-center gap-5 pt-10">
            <span className="text-3xl">User Settings</span>
            <Formik<{ file: File | undefined }>
                initialValues={{ file: undefined }}
                onSubmit={async ({ file }) => {
                    if (!file) {
                        return;
                    }

                    // This function calls the createPresignedUrl endpoint to get a signed url
                    // Allowing this image to be uploaded to the s3 bucket for storage

                    const { postURL, formData } = await createPresignedUrl();

                    const body = new FormData();

                    // Create formData with data returned from presignedUrl endpoint, and the file to upload
                    Object.entries({ ...formData, file }).forEach(([key, value]) => {
                        body.append(key, value);
                    });

                    // ? This throws a CORS error but still works for some reason
                    await fetch(postURL, {
                        method: 'POST',
                        body,
                    }).catch(() => { });

                    router.refresh();
                    router.push('/');
                }}
            >
                {({ values, submitForm, isSubmitting }) => (
                    <div className="card flex flex-col items-center gap-5 p-3">
                        <ImageUpload name="file" acceptedTypes={['image/png', 'image/jpeg']} existingImageUrl={user.image} maxSize={9000000} />
                        {values.file && (isSubmitting ? <Oval /> : <button className="button" type="submit" onClick={submitForm}>Upload Avatar</button>)}
                    </div>
                )}
            </Formik>
        </div>
    );
});

export default Settings;
