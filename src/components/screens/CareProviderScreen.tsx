import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useCareProviders } from '@providers/CareProvider';
import { Provider } from '@providers/CareProvider/types';
import { mapScheduleEntry } from '@utilities/mapScheduleEntry';

export const CareProviderScreen = () => {
    const { providers, addAvailability } = useCareProviders();
    const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

    const onSubmit = useCallback(() => {
        if (!currentProvider || !date || !startTime || !endTime) {
            return;
        }
        addAvailability({
            providerId: currentProvider.id,
            startDate: date.startOf('day').hour(startTime.hour()).minute(startTime.minute()),
            endDate: date.startOf('day').hour(endTime.hour()).minute(endTime.minute()),
        });
        setDate(null);
        setStartTime(null);
        setEndTime(null);
    }, [date, startTime, endTime, addAvailability, currentProvider]);

    const onProviderChange = useCallback(
        (event: SelectChangeEvent) => {
            const targetId = event.target.value as string;
            const targetProvider = providers?.find(({ id }) => id === targetId);
            if (!targetProvider) {
                setCurrentProvider(null);
                return;
            }
            setCurrentProvider(targetProvider);
        },
        [providers],
    );

    return (
        <Stack spacing={2} width={600}>
            <FormControl>
                <InputLabel id="care-provider-select-label">Care Provider</InputLabel>
                <Select
                    labelId="care-provider-select-label"
                    id="care-provider-select"
                    defaultValue=""
                    label="Care Provider"
                    onChange={onProviderChange}
                >
                    {providers?.map((provider) => (
                        <MenuItem
                            value={provider.id}
                            key={provider.id}
                        >{`${provider.firstName} ${provider.lastName}`}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <MobileDatePicker
                disabled={!currentProvider}
                label="Date"
                openTo="day"
                views={['day']}
                defaultValue={dayjs()}
                format="YYYY-MM-DD"
                onChange={(value) => setDate(value)}
            />
            <MobileTimePicker
                disabled={!currentProvider}
                label="Start"
                openTo="hours"
                views={['hours', 'minutes']}
                defaultValue={dayjs().hour(9).minute(0)}
                onChange={(value) => setStartTime(value)}
            />
            <MobileTimePicker
                disabled={!currentProvider}
                label="End"
                openTo="hours"
                views={['hours', 'minutes']}
                defaultValue={dayjs().hour(17).minute(0)}
                onChange={(value) => setEndTime(value)}
            />
            <Button variant="contained" onClick={onSubmit} disabled={!currentProvider}>
                Submit
            </Button>
            <Stack style={{ alignItems: 'flex-start' }}>
                <h3>Availability</h3>
                {currentProvider?.schedule.availability.map(mapScheduleEntry)}
                <h3>Reservations</h3>
                {currentProvider?.schedule.reservations.map(mapScheduleEntry)}
            </Stack>
        </Stack>
    );
};
