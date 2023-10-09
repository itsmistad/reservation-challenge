import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useCareProviders } from '@providers/CareProvider';
import { Reservation, ScheduleEntry } from '@providers/CareProvider/types';
import { useCareClients } from '@providers/CareClient';
import { Client } from '@providers/CareClient/types';
import { mapScheduleEntry } from '@utilities/mapScheduleEntry';
import { ReservationConfirmationModal } from './ReservationConfirmationModal';

export const SLOT_DURATION_IN_MINUTES = 15;

export const CareClientScreen = () => {
    const { getAvailableSlots, addReservation: addProviderReservation } = useCareProviders();
    const { clients, getClientReservationsByProvider } = useCareClients();
    const [currentClient, setCurrentClient] = useState<Client | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [isConfirming, setIsConfirming] = useState(false);

    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [availableSlots, setAvailableSlots] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        if (!currentClient?.id || !currentClient.primaryProviderId || !date) {
            return;
        }

        setAvailableSlots(
            getAvailableSlots({
                providerId: currentClient.primaryProviderId,
                date,
                durationInMinutes: SLOT_DURATION_IN_MINUTES,
            }),
        );
    }, [currentClient?.id, currentClient?.primaryProviderId, date, getAvailableSlots]);

    useEffect(() => {
        if (!currentClient?.id || !currentClient.primaryProviderId) {
            return;
        }
        setReservations(getClientReservationsByProvider(currentClient.id, currentClient.primaryProviderId));
    }, [currentClient?.id, currentClient?.primaryProviderId, getClientReservationsByProvider]);

    const onClientChange = useCallback(
        (event: SelectChangeEvent) => {
            const targetId = event.target.value as string;
            const targetClient = clients?.find(({ id }) => id === targetId);
            if (!targetClient) {
                setCurrentClient(null);
                return;
            }
            setCurrentClient(targetClient);
        },
        [clients],
    );

    const onTimeSlotChange = useCallback((event: SelectChangeEvent) => {
        const targetValue = event.target.value as string;
        const targetStartDate = dayjs(targetValue.split('|')[0]);
        const targetEndDate = dayjs(targetValue.split('|')[1]);
        setStartDate(targetStartDate);
        setEndDate(targetEndDate);
    }, []);

    const onConfirm = useCallback(() => {
        if (!currentClient || !startDate || !endDate || !date) {
            return;
        }

        addProviderReservation({
            providerId: currentClient.primaryProviderId,
            clientId: currentClient.id,
            startDate,
            endDate,
        });
        setReservations(getClientReservationsByProvider(currentClient.id, currentClient.primaryProviderId));
        setAvailableSlots(
            getAvailableSlots({
                providerId: currentClient.primaryProviderId,
                date,
                durationInMinutes: SLOT_DURATION_IN_MINUTES,
            }),
        );
        setIsConfirming(false);
    }, [
        currentClient,
        startDate,
        endDate,
        date,
        getAvailableSlots,
        getClientReservationsByProvider,
        addProviderReservation,
    ]);

    const onCancel = useCallback(() => {
        setIsConfirming(false);
    }, []);

    const onReserve = useCallback(() => {
        setIsConfirming(true);
    }, []);

    return (
        <Stack spacing={2} width={340}>
            <FormControl>
                <InputLabel id="care-client-select-label">Care Client</InputLabel>
                <Select
                    labelId="care-client-select-label"
                    id="care-client-select"
                    value={currentClient?.id ?? ''}
                    label="Care Client"
                    onChange={onClientChange}
                >
                    {clients?.map((provider) => (
                        <MenuItem
                            value={provider.id}
                            key={provider.id}
                        >{`${provider.firstName} ${provider.lastName}`}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <MobileDatePicker
                disabled={!currentClient}
                label="Date"
                openTo="day"
                views={['day']}
                value={date ?? dayjs()}
                format="YYYY-MM-DD"
                onChange={(value) => setDate(value)}
            />
            <FormControl disabled={!currentClient || !date}>
                <InputLabel id="slot-select-label">15-Min Time Slot</InputLabel>
                <Select
                    labelId="slot-select-label"
                    id="slot-select"
                    value={!startDate || !endDate ? '' : `${startDate.toString()}|${endDate.toString()}`}
                    label="15-Min Time Slot"
                    onChange={onTimeSlotChange}
                >
                    {availableSlots?.map((slot, i) => (
                        <MenuItem
                            value={`${slot.startDate.toString()}|${slot.endDate.toString()}`}
                            key={i}
                        >{`${slot.startDate.format('hh:mm A')} - ${slot.endDate.format('hh:mm A')}`}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {isConfirming ? (
                <ReservationConfirmationModal
                    timerStartDate={dayjs()}
                    durationInSeconds={30 * 60}
                    onCancelPress={onCancel}
                    onConfirmPress={onConfirm}
                    onTimerElapsed={onCancel}
                />
            ) : (
                <Button variant="contained" onClick={onReserve} disabled={!currentClient || !startDate || !endDate}>
                    Reserve
                </Button>
            )}
            <Stack style={{ alignItems: 'flex-start' }}>
                <h3>Reservations</h3>
                {reservations.map(mapScheduleEntry)}
            </Stack>
        </Stack>
    );
};
