import { Provider, ProviderSchedule } from './types';
import dayjs from 'dayjs';

export const getDefaultMockProviders = (): Provider[] => {
    const availability: ProviderSchedule['availability'] = [];
    for (let day = 9; day < 23; day++) {
        const date = dayjs().startOf('day').month(9).date(day).second(0).millisecond(0);
        availability.push({
            startDate: date.hour(8).minute(0),
            endDate: date.hour(15).minute(0),
        });
    }

    return [
        {
            id: '25ac8771-a325-495f-a746-6f2dea1a73e1',
            firstName: 'Jane',
            lastName: 'Doe',
            schedule: {
                availability,
                reservations: [],
            },
        },
    ];
};
