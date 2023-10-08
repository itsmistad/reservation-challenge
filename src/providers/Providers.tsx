import React from 'react';
import { CareProviderProvider } from './CareProvider';
import { CareClientProvider } from './CareClient';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const Providers = ({ children }: React.PropsWithChildren) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CareProviderProvider>
                <CareClientProvider>{children}</CareClientProvider>
            </CareProviderProvider>
        </LocalizationProvider>
    );
};
