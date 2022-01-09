import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Welcome = () => {
    return (
        <div>
            <Typography variant="h3" gutterBottom component="div">
                It is nice to see you today!
            </Typography>
            <img src='/wallhaven1.jpg' alt='welcome' width='100%'></img>
        </div>
    )
}

export default Welcome
