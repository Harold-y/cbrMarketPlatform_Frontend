import PropTypes from 'prop-types'
import Button from './Button'
import { useLocation } from 'react-router-dom' // to get the routing location
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Avatar } from '@mui/material';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import {AiTwotoneHome} from 'react-icons/ai';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const MarketHeader = (props) => {
    const location = useLocation() // access location
    return (
        <>
            {!location.pathname.includes('admin') ? (
            <header className='header' style={{ backgroundColor:'#131921'}}>
                <Grid container spacing={2}>
                <Grid item xs={0.5}/>
                <Grid item xs={2}>
                <h2 style={{color:'#FFFFFF'}}>CBR Market Platform</h2>
                </Grid>
                <Grid item xs={1} style={{marginTop:'1.5rem'}}>
                <Link className='headerLink' to='/'><AiTwotoneHome/>Home Page</Link>
                </Grid>
                <Grid item xs = {5} style={{marginTop:'0.8rem', marginRight:'1.5rem'}}>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                    >
                    <FormGroup style={{backgroundColor:'#F3F3F3'}}>
                        <FormControlLabel control={<Checkbox defaultChecked style={{marginLeft:'1rem'}}/>} label="Search Seller" />
                    </FormGroup>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Item or Seller"
                        inputProps={{ 'aria-label': 'search item or seller' }}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    </Paper>
                </Grid>
                <Grid item xs={0.5}  style={{marginTop:'1.5rem'}}>
                <Link className='headerLink' to='/signin' style={{fontSize:'16px'}}>Sign In</Link>
                </Grid>
                <Grid item xs={0.8}  style={{marginTop:'1.5rem'}}>
                <Link className='headerLink' to='/signup' style={{fontSize:'16px'}}>Sign Up</Link>
                </Grid>
                <Grid item xs={0.7}  style={{marginTop:'1.5rem'}}>
                    <Link className='headerLink' to='/signup' style={{fontSize:'16px'}}><AiOutlineShoppingCart/>Cart</Link>
                </Grid>
                <Grid item xs={0.5}  style={{marginTop:'1.1rem'}}>
                    <Avatar alt="Remy Sharp" src="http://cheng-bing.top/wp-content/uploads/2020/12/20200811_083412415_iOS.png" />
                </Grid>
                
                </Grid>
            </header>
            ) : ''}
        </>
    )
}


export default MarketHeader
