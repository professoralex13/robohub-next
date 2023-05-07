'use client';

import { getSession, useSession } from 'next-auth/react';
import useSWR from 'swr';

export const useUser = () => {
    const { data } = useSWR(useSession(), () => getSession(), { suspense: true });

    return data?.user;
};
