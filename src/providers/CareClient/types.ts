import { Reservation, ScheduleEntry } from '@providers/CareProvider/types';

export type Client = {
    id: string;
    firstName: string;
    lastName: string;
    primaryProviderId: string;
};

export type CareClientContextState = {
    clients?: Client[];
    getClientReservationsByProvider: (clientId: string, providerId: string) => Reservation[];
};
