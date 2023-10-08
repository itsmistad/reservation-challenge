import { useContext } from 'react';
import { CareClientContext } from './CareClientContext';

export const useCareClients = () => {
    const state = useContext(CareClientContext);

    return state;
};
