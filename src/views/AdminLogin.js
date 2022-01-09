import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Link as ReactLink,
} from "react-router-dom";
import axios from 'axios';
import { AiFillCaretLeft } from "react-icons/ai";
import { Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cheng-bing.top/">
        Harold CI, 澂冰
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function AdminLogin({isFresh}) {

  const[redirectState, setState] = useState(false);
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [warning, setWarning] = React.useState(false);
  
  useEffect(() => {
    const setInfo = () => {
      console.log(isFresh)
      if(isFresh)
        window.location.reload();
    };
    setInfo()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    if(!email || !pass)
    {
      setWarning(true);
      setTimeout(() => {
        setWarning(false)
      }, 2000)
    }
      axios({
        url:'http://localhost:8082/adminAuth/doLogin',
        method: 'post',
        params:{
          email: email,
          pwd: pass,
        }
    }).then((res) => {
        localStorage.removeItem('satoken');
        localStorage.setItem('satoken',res.data.msg)
        axios.defaults.headers.common['satoken'] = res.data.msg;
        if(res.data.code === 200)
          setState(true);
      }
    );
  }

    if (redirectState) {
      
      return <Navigate to='/adminPanel' />
    }

  return (
      <>
        <ThemeProvider theme={theme}>
        
        <Button variant="outlined" style={{marginTop:'5rem', marginLeft:'4rem'}}><ReactLink to='/' className='noUnderlineLink'><AiFillCaretLeft />Back to Home</ReactLink></Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {warning ? <Alert severity="warning">Please Fill in Required Fields! </Alert> : ''}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) =>{setEmail(e.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) =>{setPass(e.target.value)}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
      </>
    
  );
}
