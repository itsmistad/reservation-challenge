import { ScheduleEntry } from '@providers/CareProvider/types';

export const sortScheduleEntries = (a: ScheduleEntry, b: ScheduleEntry) => {
    const firstDate = a.startDate;
    const secondDate = b.startDate;
    return firstDate.diff(secondDate);
};
