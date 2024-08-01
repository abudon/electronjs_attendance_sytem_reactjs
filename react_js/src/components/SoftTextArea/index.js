import * as React from 'react';
import { styled } from '@mui/system';

const TextArea = styled('textarea')(({ theme }) => ({
    boxSizing: 'border-box',
    width: 540,
    fontFamily: 'IBM Plex Sans, sans-serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: '8px 12px',
    borderRadius: 8,
    color: theme.palette.mode === 'dark' ? '#C7D0DD' : '#1C2025',
    background: theme.palette.mode === 'dark' ? '#1C2025' : '#fff',
    border: `1px solid ${theme.palette.mode === 'dark' ? '#434D5B' : '#E5EAF2'}`,
    boxShadow: `0px 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'}`,
    '&:hover': {
        borderColor: '#3399FF',
    },
    '&:focus': {
        borderColor: '#3399FF',
        boxShadow: `0 0 0 3px ${theme.palette.mode === 'dark' ? '#0072E5' : '#DAECFF'}`,
    },
    '&:focus-visible': {
        outline: 0,
    },
}));

export default function SoftTextarea({ value, onChange }) {
    return (
        <TextArea
            rows={4}
            placeholder="Send Your Notification"
            value={value}
            onChange={onChange}
        />
    );
}
