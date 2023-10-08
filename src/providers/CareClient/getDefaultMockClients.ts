import { Client } from './types';
import { v4 as uuid } from 'uuid';

export const getDefaultMockClients = (primaryProviderId: string): Client[] => {
    return [
        {
            id: uuid(),
            firstName: 'John',
            lastName: 'Doe',
            primaryProviderId,
        },
    ];
};
