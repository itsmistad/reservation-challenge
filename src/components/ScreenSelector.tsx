import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

export type ScreenSelectorProps = {
    onCareClientPressed: () => void;
    onCareProviderPressed: () => void;
};

export const ScreenSelector = ({ onCareClientPressed, onCareProviderPressed }: ScreenSelectorProps) => {
    return (
        <Container style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack spacing={2}>
                <Button variant="contained" onClick={onCareClientPressed}>
                    I am a care client
                </Button>
                <Button variant="contained" onClick={onCareProviderPressed}>
                    I am a care provider
                </Button>
            </Stack>
        </Container>
    );
};
