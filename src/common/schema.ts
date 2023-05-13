import * as yup from 'yup';

export const SignUpSchema = yup.object({
    email: yup.string()
        .email()
        .max(320)
        .required(),
    username: yup.string()
        .min(3)
        .max(30)
        .matches(/^\S+$/, 'username cannot have spaces')
        .required(),
    password: yup
        .string()
        .min(8)
        .max(30)
        .required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'Passwords do not match')
        .required(),
});

export const SignInSchema = yup.object().shape({
    emailUsername: yup
        .string()
        .max(320)
        .required(),
    password: yup
        .string()
        .max(30)
        .required(),
});

// TODO: Decide max values these based on UI
export const CreateOrganisationSchema = yup.object().shape({
    name: yup
        .string()
        .min(3)
        .matches(/^\S+$/, 'name cannot have spaces')
        .required(),
    description: yup
        .string()
        .min(10)
        .max(150)
        .required(),
    location: yup
        .string()
        .min(2)
        .max(20)
        .required(),
});
