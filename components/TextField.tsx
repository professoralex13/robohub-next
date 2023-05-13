'use client';

import { ChangeEvent, FC } from 'react';
import { Field, FieldAttributes, useField } from 'formik';
import clsx from 'clsx';

export const TextField: FC<FieldAttributes<any> & { disallowSpaces?: boolean }> = ({ type = 'text', disallowSpaces, ...props }) => {
    const [field, meta, { setValue }] = useField(props);

    const hasError = meta.error && meta.touched;

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disallowSpaces) {
            setValue(e.target.value.replace(/[-\s]+/g, '-').replace(/^-/, ''));
        } else {
            setValue(e.target.value);
        }
    };

    return (
        <div className="relative flex flex-col">
            <span
                className={clsx(
                    !field.value && 'opacity-0',
                    hasError ? 'text-red-400' : 'text-neutral-50',
                    'absolute left-2 top-[-0.7rem] bg-navy-800 px-1 duration-100',
                )}
            >
                {props.placeholder}
            </span>
            <Field {...props} onChange={onChange} type={type} className={clsx(hasError && 'error')} />
            <span
                className={clsx(
                    !hasError && 'opacity-0',
                    'text-xs text-red-400 duration-100',
                )}
            >
                &nbsp;{meta.error}
            </span>
        </div>
    );
};
