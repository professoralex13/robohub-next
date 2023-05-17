import * as yup from 'yup';


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

export const CreateTeamSchema = yup.object().shape({
    id: yup
        .string()
        .matches(/^[1-9][0-9]{1,4}[A-Z]$/, 'Invalid ID, eg: 99999V')
        .required(),
    name: yup
        .string()
        .matches(/^\S+$/, 'name cannot have spaces')
        .min(3)
        .max(20)
        .required(),
});
