import React, { useCallback, useState } from 'react';
import { CareProviderContext } from './CareProviderContext';
import { getDefaultMockProviders } from './getDefaultMockProviders';
import dayjs, { Dayjs } from 'dayjs';
import { Reservation, ScheduleEntry } from './types';
import { sortScheduleEntries } from '@utilities/sortScheduleEntries';

export const CareProviderProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [providers, setProviders] = useState(getDefaultMockProviders());

    // A proper reducer would be more performant than finding and filtering.

    const addAvailability = useCallback(({ providerId, ...entry }: { providerId: string } & ScheduleEntry) => {
        setProviders((previous) => {
            const targetProvider = previous.find(({ id }) => id === providerId);

            if (!targetProvider) {
                return previous;
            }

            targetProvider.schedule.availability.push(entry);
            targetProvider.schedule.availability.sort(sortScheduleEntries);

            return [targetProvider, ...previous.filter(({ id }) => id !== providerId)];
        });
    }, []);

    const addReservation = useCallback(({ providerId, ...reservation }: { providerId: string } & Reservation) => {
        setProviders((previous) => {
            const targetProvider = previous.find(({ id }) => id === providerId);

            if (!targetProvider) {
                return previous;
            }

            targetProvider.schedule.reservations.push(reservation);
            targetProvider.schedule.reservations.sort(sortScheduleEntries);

            return [targetProvider, ...previous.filter(({ id }) => id !== providerId)];
        });
    }, []);

    const getAvailabilityWindows = useCallback(
        ({ providerId, date }: { providerId: string; date: Dayjs }) => {
            const provider = providers.find(({ id }) => id === providerId);
            if (!provider) {
                return [];
            }

            const { availability, reservations } = provider.schedule;

            const targetDateAvailability = availability.filter(
                ({ startDate }) => startDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
            );
            const targetDateReservations = reservations.filter(
                ({ startDate }) => startDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
            );

            // If there is no availability for the specified date, give an empty array of windows.
            if (!targetDateAvailability) {
                return [];
            }

            // If there are no reservations for the specified date, give the entire availability as the only window.
            if (targetDateReservations.length === 0) {
                return [...targetDateAvailability];
            }

            // Otherwise, isolate the available windows for this date's total availability by skipping reserved slots.
            const windows: ScheduleEntry[] = [];
            for (let availabilityIndex = 0; availabilityIndex < targetDateAvailability.length; availabilityIndex++) {
                let availabilityStartDate = targetDateAvailability[availabilityIndex].startDate
                        .second(0)
                        .millisecond(0),
                    availabilityEndDate = targetDateAvailability[availabilityIndex].endDate.second(0).millisecond(0);
                const reservationsWithinAvailability = reservations.filter(
                    ({ startDate, endDate }) =>
                        (startDate.isSame(availabilityStartDate) || startDate.isAfter(availabilityStartDate)) &&
                        (endDate.isSame(availabilityEndDate) || endDate.isBefore(availabilityEndDate)),
                );

                if (reservationsWithinAvailability.length === 0) {
                    windows.push({
                        startDate: availabilityStartDate,
                        endDate: availabilityEndDate,
                    });
                    continue;
                }

                for (
                    let reservationIndex = 0;
                    reservationIndex < reservationsWithinAvailability.length;
                    reservationIndex++
                ) {
                    const currentReservation = reservationsWithinAvailability[reservationIndex];
                    const preceedingWindowHasValidDuration =
                        Math.abs(availabilityStartDate.diff(currentReservation.startDate)) >= 60 * 1000;
                    if (preceedingWindowHasValidDuration) {
                        windows.push({
                            startDate: availabilityStartDate,
                            endDate: currentReservation.startDate,
                        });
                    }

                    availabilityStartDate = currentReservation.endDate;

                    const isLastReservation = reservationIndex === reservationsWithinAvailability.length - 1;
                    const proceedingWindowHasValidDuration =
                        Math.abs(availabilityStartDate.diff(availabilityEndDate)) >= 60 * 1000;
                    if (isLastReservation && proceedingWindowHasValidDuration) {
                        windows.push({
                            startDate: availabilityStartDate,
                            endDate: availabilityEndDate,
                        });
                    }
                }
            }

            return windows;
        },
        [providers],
    );

    const getAvailableSlots = useCallback(
        ({ providerId, date, durationInMinutes }: { providerId: string; date: Dayjs; durationInMinutes: number }) => {
            const provider = providers.find(({ id }) => id === providerId);
            if (!provider) {
                return [];
            }

            const availabilityWindows = getAvailabilityWindows({ providerId, date });

            if (availabilityWindows.length === 0) {
                return [];
            }

            const slots: ScheduleEntry[] = [];

            const getStartDate = (windowIndex: number, offsetInMinutes?: number) => {
                let startDate = availabilityWindows[windowIndex].startDate.second(0).millisecond(0);
                if (offsetInMinutes) {
                    startDate = startDate.add(offsetInMinutes, 'minutes');
                }
                return startDate;
            };

            for (let windowIndex = 0; windowIndex < availabilityWindows.length; windowIndex++) {
                let slotIndexInWindow = 0,
                    slotStartDate: Dayjs = getStartDate(windowIndex);

                const windowEndDate = availabilityWindows[windowIndex].endDate.second(0).millisecond(0);

                while (slotStartDate.isBefore(windowEndDate)) {
                    const slotEndDate = slotStartDate.add(durationInMinutes, 'minutes');
                    if (slotEndDate.isAfter(windowEndDate)) {
                        break;
                    }
                    slots.push({
                        startDate: slotStartDate,
                        endDate: slotEndDate,
                    });
                    slotIndexInWindow++;
                    slotStartDate = getStartDate(windowIndex, 15 * slotIndexInWindow);
                }
            }

            const slotsAfter24Hours = slots.filter(
                (slot) => Math.abs(slot.startDate.diff(dayjs())) >= 24 * 60 * 60 * 1000,
            );

            return slotsAfter24Hours;
        },
        [providers, getAvailabilityWindows],
    );

    return (
        <CareProviderContext.Provider
            value={{
                providers,
                addAvailability,
                addReservation,
                getAvailabilityWindows,
                getAvailableSlots,
            }}
        >
            {children}
        </CareProviderContext.Provider>
    );
};
