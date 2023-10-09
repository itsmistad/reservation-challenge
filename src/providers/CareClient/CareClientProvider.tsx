import React, { useCallback, useMemo } from 'react';
import { CareClientContext } from './CareClientContext';
import { getDefaultMockClients } from './getDefaultMockClients';
import { useCareProviders } from '@providers/CareProvider';
import { sortScheduleEntries } from '@utilities/sortScheduleEntries';

export const CareClientProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const { providers } = useCareProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const clients = useMemo(() => (providers?.length ? getDefaultMockClients(providers?.[0].id) : []), []);

    const getClientReservationsByProvider = useCallback(
        (clientId: string, providerId: string) => {
            const provider = providers?.find(({ id }) => id === providerId);
            if (!provider) {
                return [];
            }

            const reservations = provider.schedule.reservations.filter((entry) => entry.clientId === clientId);
            reservations.sort(sortScheduleEntries);
            return reservations;
        },
        [providers],
    );

    return (
        <CareClientContext.Provider
            value={{
                clients,
                getClientReservationsByProvider,
            }}
        >
            {children}
        </CareClientContext.Provider>
    );
};
