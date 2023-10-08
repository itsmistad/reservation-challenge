import { ScheduleEntry } from '@providers/CareProvider/types';

export const mapScheduleEntry = (entry: ScheduleEntry, i: number) => {
    const formattedStartTime = entry.startDate.format('h:mm A');
    const formattedEndTime = entry.endDate.format('h:mm A');
    return (
        <p key={i}>
            {entry.startDate.format('MMMM D, YYYY')} from {formattedStartTime} to {formattedEndTime}
        </p>
    );
};
