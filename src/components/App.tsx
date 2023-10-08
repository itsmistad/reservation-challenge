import React, { useCallback, useMemo, useState } from 'react';
import '@assets/App.css';
import { Providers } from '@providers/Providers';
import { Header } from './Header';
import { ScreenSelector } from './ScreenSelector';
import { CareClientScreen, CareProviderScreen } from './screens';
import Stack from '@mui/material/Stack';

export const App = () => {
    const [currentUser, setCurrentUser] = useState<'client' | 'provider' | null>(null);
    const showBackButton = useMemo(() => currentUser != null, [currentUser]);

    const onCareProviderPressed = useCallback(() => {
        setCurrentUser('provider');
    }, []);

    const onCareClientPressed = useCallback(() => {
        setCurrentUser('client');
    }, []);

    const onBackPressed = useCallback(() => {
        setCurrentUser(null);
    }, []);

    return (
        <div className="App">
            <Providers>
                <Header showBackButton={showBackButton} onBackPressed={onBackPressed} />
                <Stack
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {!currentUser && (
                        <ScreenSelector
                            onCareProviderPressed={onCareProviderPressed}
                            onCareClientPressed={onCareClientPressed}
                        />
                    )}
                    {currentUser === 'client' && <CareClientScreen />}
                    {currentUser === 'provider' && <CareProviderScreen />}
                </Stack>
            </Providers>
        </div>
    );
};
