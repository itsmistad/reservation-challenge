import { Dayjs } from 'dayjs';

export type ScheduleEntry = {
    startDate: Dayjs;
    endDate: Dayjs;
};

export type Reservation = ScheduleEntry & {
    clientId: string;
};

export type ProviderSchedule = {
    /**
     * An array of availability windows (including start and end times) and respective dates.
     *
     * Ideally, this should be cleaned up on the back-end before handed to the front-end with respect to the provider's appointments/reservations,
     * but, for the sake of the challenge, let's separate the two and handle the logic within the provider.
     */
    availability: Array<ScheduleEntry>;
    reservations: Array<Reservation>;
};

export type Provider = {
    id: string;
    firstName: string;
    lastName: string;
    schedule: ProviderSchedule;
};

export type CareProviderContextState = {
    providers?: Provider[];
    addAvailability: (params: { providerId: string } & ScheduleEntry) => void;
    addReservation: (params: { providerId: string } & Reservation) => void;
    getAvailabilityWindows: (params: { providerId: string; date: Dayjs }) => ScheduleEntry[];
    getAvailableSlots: (params: { providerId: string; date: Dayjs; durationInMinutes: number }) => ScheduleEntry[];
};
