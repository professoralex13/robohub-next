'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

const ErrorPage: FC<{ error: Error }> = () => {
    const router = useRouter();

    return (
        <div className="flex w-screen flex-col items-center justify-center gap-10 pt-20">
            <span className="text-3xl text-navy-300">Oops, we encountered an Error</span>
            <span className="text-xl text-slate-400">This may be because you do not have permission to view this page</span>
            <span className="text-xl text-slate-400">If this is an organisation page, you may not be a member of the organisation</span>
            <span className="text-xl text-slate-400">
                If this is a team page, you may not be a member of the team.
                Note that being part of an organisation does not make you part of all its teams
            </span>
            <button className="button" type="button" onClick={() => router.back()}>Go Back</button>
        </div>
    );
};

export default ErrorPage;
