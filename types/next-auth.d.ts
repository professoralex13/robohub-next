import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
    interface User {
        id: string;
        name: string;
        email: string;
        image: string;
    }
}
