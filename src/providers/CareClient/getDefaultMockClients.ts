import { Client } from './types';

export const getDefaultMockClients = (primaryProviderId: string): Client[] => {
    return [
        {
            id: 'a5b6651c-7134-4689-8d47-71dc13edcec9',
            firstName: 'John',
            lastName: 'Doe',
            primaryProviderId,
        },
    ];
};
