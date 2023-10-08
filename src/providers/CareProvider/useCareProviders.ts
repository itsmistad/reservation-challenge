import React, { useContext } from 'react';
import { CareProviderContext } from './CareProviderContext';

export const useCareProviders = () => {
    const state = useContext(CareProviderContext);

    return state;
};
