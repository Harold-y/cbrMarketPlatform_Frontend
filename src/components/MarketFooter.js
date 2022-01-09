import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import {Link as ReactLink} from 'react-router-dom';
import { useLocation } from 'react-router-dom' // to get the routing location

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Harold CI
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function MarketFooter() {
  const location = useLocation() // access location
  return (
    <>
      {!location.pathname.includes('admin') ? 
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '12vh',
        }}
      >
        <CssBaseline />
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              CBR Market Platform
            </Typography>
            <Typography variant="body1">
              <ReactLink style={{ color:'#111111', textAlign:'center' }} to='/adminLogin'>Admin Login</ReactLink>
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
      : ''}
    </>
  );
}