'use client';

/**
 * Default page which redirects to /overview
 */

import { usePathname, redirect } from 'next/navigation';

export default function _() {
    const path = usePathname();

    redirect(`${path}/overview`);
}
