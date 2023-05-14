import * as yup from 'yup';

const { env: ENV } = process;

const EnvironmentSchema = yup.object().shape({
    GOOGLE_CLIENT_ID: yup.string().required(),
    GOOGLE_CLIENT_SECRET: yup.string().required(),
    DISCORD_CLIENT_ID: yup.string().required(),
    DISCORD_CLIENT_SECRET: yup.string().required(),
    GITHUB_CLIENT_ID: yup.string().required(),
    GITHUB_CLIENT_SECRET: yup.string().required(),
});

export const env = EnvironmentSchema.validateSync(ENV);

export const ContentDeliveryRoot = 'https://storage.googleapis.com/robohub-public/';
