'use client';

import { MembershipType } from '@/common';
import { Organisation, Team } from '@prisma/client';
import { FC, PropsWithChildren, createContext, useContext } from 'react';

export type TeamContextType = Team & { membershipType: MembershipType, organisation: Organisation }

const TeamContext = createContext<TeamContextType>(undefined!);

export const useTeam = () => useContext(TeamContext);

export const TeamContextProvider: FC<PropsWithChildren<{ value: TeamContextType }>> = ({ value, children }) => (
    <TeamContext.Provider value={value}>
        {children}
    </TeamContext.Provider>
);
