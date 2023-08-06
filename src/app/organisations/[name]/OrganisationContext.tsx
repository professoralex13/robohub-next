'use client';

/**
 * Context for passing current organisation data down to child client components/pages
 */

import { MembershipType } from '@/common';
import { Organisation } from '@prisma/client';
import { FC, PropsWithChildren, createContext, useContext } from 'react';

export type OrganisationContextType = Organisation & { membershipType: MembershipType }

const OrganisationContext = createContext<OrganisationContextType>(undefined!);

export const useOrganisation = () => useContext(OrganisationContext);

export const OrganisationContextProvider: FC<PropsWithChildren<{ value: OrganisationContextType }>> = ({ value, children }) => (
    <OrganisationContext.Provider value={value}>
        {children}
    </OrganisationContext.Provider>
);
