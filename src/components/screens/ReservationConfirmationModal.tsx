import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Dayjs } from 'dayjs';
import Countdown, { CountdownRendererFn } from 'react-countdown';

export type ReservationConfirmationModalProps = {
    timerStartDate: Dayjs;
    onTimerElapsed: () => void;
    onConfirmPress: () => void;
    onCancelPress: () => void;
    durationInSeconds: number;
};

const renderCountdown: CountdownRendererFn = ({ minutes, seconds, completed }) => {
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return (
        <p>
            Your reservation will expire in {minutes}:{formattedSeconds}.
        </p>
    );
};

export const ReservationConfirmationModal = ({
    timerStartDate,
    onTimerElapsed,
    onConfirmPress,
    onCancelPress,
    durationInSeconds,
}: ReservationConfirmationModalProps) => {
    return (
        <Stack spacing={2}>
            <Countdown
                date={timerStartDate.toDate().getTime() + durationInSeconds * 1000}
                renderer={renderCountdown}
                onComplete={onTimerElapsed}
            />
            <p>Would you like to confirm your reservation?</p>
            <Button variant="contained" onClick={onConfirmPress}>
                Confirm
            </Button>
            <Button variant="outlined" onClick={onCancelPress}>
                Cancel
            </Button>
        </Stack>
    );
};
