import React, { useCallback, useState } from 'react';
import { CareProviderContext } from './CareProviderContext';
import { getDefaultMockProviders } from './getDefaultMockProviders';
import dayjs, { Dayjs } from 'dayjs';
import { Reservation, ScheduleEntry } from './types';

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
            targetProvider.schedule.availability.sort((a, b) => {
                const firstStartTime = a.startDate;
                const secondStartTime = b.endDate;
                return firstStartTime.diff(secondStartTime);
            });

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
            targetProvider.schedule.availability.sort((a, b) => {
                const firstStartTime = a.startDate;
                const secondStartTime = b.endDate;
                return firstStartTime.diff(secondStartTime);
            });

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

            const dateAvailability = availability.find(
                ({ startDate }) => startDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
            );
            const dateReservations = reservations.filter(
                ({ startDate }) => startDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
            );

            // If there is no availability for the specified date, give an empty array of windows.
            if (!dateAvailability) {
                return [];
            }

            // If there are no reservations for the specified date, give the entire availability as the only window.
            if (dateReservations.length === 0) {
                return [dateAvailability];
            }

            // Otherwise, isolate the available windows for this date's total availability by skipping reserved slots.
            let startDate = dateAvailability.startDate;
            const windows: ScheduleEntry[] = [];
            for (let i = 0; i < reservations.length; i++) {
                const currentReservation = reservations[i];
                if (Math.abs(startDate.diff(currentReservation.startDate)) >= 60 * 1000) {
                    windows.push({
                        startDate,
                        endDate: currentReservation.startDate,
                    });
                }
                startDate = currentReservation.endDate;
                if (i === reservations.length - 1 && Math.abs(startDate.diff(dateAvailability.endDate)) >= 60 * 1000) {
                    windows.push({
                        startDate,
                        endDate: dateAvailability.endDate,
                    });
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

            const getStartDate = (offsetInMinutes?: number) => {
                let startDate = availabilityWindows[windowIndex].startDate.second(0).millisecond(0);
                if (offsetInMinutes) {
                    startDate = startDate.add(offsetInMinutes, 'minutes');
                }
                return startDate;
            };

            let windowIndex = 0,
                slotIndexInWindow = 0,
                currentStartDate: Dayjs = getStartDate();

            const endOfAvailiability = availabilityWindows[availabilityWindows.length - 1].endDate
                .second(0)
                .millisecond(0);

            while (currentStartDate.isBefore(endOfAvailiability)) {
                const endDate = currentStartDate.add(durationInMinutes, 'minutes');
                if (endDate.isAfter(availabilityWindows[windowIndex].endDate)) {
                    if (windowIndex + 1 === availabilityWindows.length) {
                        break;
                    }
                    windowIndex++;
                    currentStartDate = getStartDate();
                    continue;
                }
                slots.push({
                    startDate: currentStartDate,
                    endDate,
                });
                slotIndexInWindow++;
                currentStartDate = getStartDate(15 * slotIndexInWindow);
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
