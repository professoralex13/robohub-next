'use client';

import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="flex w-screen flex-col items-center justify-center gap-10 pt-20">
            <span className="text-3xl text-navy-300">Error 404, Page not found</span>
            <button className="button" type="button" onClick={() => router.back()}>Go Back</button>
        </div>
    );
};

export default NotFound;
