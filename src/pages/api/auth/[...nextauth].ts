import { nextAuthOptions } from '@/common/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(nextAuthOptions);

export default handler;
