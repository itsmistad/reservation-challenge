import { CareProviderContextState } from './types';

export const defaultCareProviderContextState: CareProviderContextState = {
    addAvailability: () => {},
    addReservation: () => {},
    getAvailabilityWindows: () => [],
    getAvailableSlots: () => [],
};
