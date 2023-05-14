import { useField } from 'formik';
import { FC } from 'react';
import { ErrorBox } from '@/components/Notification';

interface FileUploadProps {
    name: string;
    existingImageUrl?: string;
    acceptedTypes?: string[];
    maxSize?: number;
}

export const ImageUpload: FC<FileUploadProps> = ({ name, existingImageUrl, acceptedTypes = ['image/png', 'image/jpeg'], maxSize = 4000000 }) => {
    const [{ value }, { error }, { setValue, setError, setTouched }] = useField<File>(name);

    const handleSelect = () => {
        const element = document.createElement('input');
        element.type = 'file';
        element.accept = acceptedTypes.join();

        element.click();
        setTouched(true);

        element.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                return;
            }
            if (!acceptedTypes.includes(file.type)) {
                setError('Unexpected file type');
                return;
            }
            if (file.size > maxSize) {
                setError(`File size cannot be more than than ${(maxSize / 1000000).toFixed(1)} MB`);
                return;
            }

            setValue(file);
        };
    };

    return (
        <div onClick={handleSelect} className="flex flex-col items-center gap-3">
            {existingImageUrl ? (
                <button className="group relative cursor-pointer" type="button">
                    {/* next/image crashes without width/height props */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value ? URL.createObjectURL(value) : existingImageUrl}
                        alt="profile"
                        className="h-36 w-36 rounded-full duration-200 group-hover:opacity-50"
                    />
                    <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 opacity-0 duration-200 group-hover:opacity-100">Change Avatar</span>
                </button>
            ) : <button className="button" type="button">{value ? 'Change Image' : 'Select Image'}</button>}
            {error && <ErrorBox>{error}</ErrorBox>}
        </div>
    );
};
