import * as yup from 'yup';

const { env: ENV } = process;

const EnvironmentSchema = yup.object().shape({
    GOOGLE_CLIENT_ID: yup.string().required(),
    GOOGLE_CLIENT_SECRET: yup.string().required(),
    DISCORD_CLIENT_ID: yup.string().required(),
    DISCORD_CLIENT_SECRET: yup.string().required(),
    GITHUB_CLIENT_ID: yup.string().required(),
    GITHUB_CLIENT_SECRET: yup.string().required(),

    CDN_URL: yup.string().required(),
    CDN_ACCESS_KEY: yup.string().required(),
    CDN_SECRET_KEY: yup.string().required(),
    PUBLIC_BUCKET_NAME: yup.string().required(),
});

export const env = EnvironmentSchema.validateSync(ENV);
export const PUBLIC_BUCKET_URL = `https://${env.CDN_URL}/${env.PUBLIC_BUCKET_NAME}`;
