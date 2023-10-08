import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export type HeaderProps = {
    showBackButton: boolean;
    onBackPressed: () => void;
};

export const Header = ({ showBackButton, onBackPressed }: HeaderProps) => {
    return (
        <header className="App-header">
            <Container style={{ display: 'flex', flex: 1, padding: '20px' }}>
                <h2 style={{ flex: 1, textAlign: 'left' }}>Reservation Challenge</h2>
                {showBackButton && (
                    <Button variant="text" onClick={onBackPressed}>
                        X
                    </Button>
                )}
            </Container>
        </header>
    );
};
