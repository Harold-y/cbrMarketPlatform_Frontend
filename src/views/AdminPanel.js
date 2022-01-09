import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useEffect } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
//import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AnchorIcon from '@mui/icons-material/Anchor';
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';

import {Link as ReactLink} from 'react-router-dom';

import Country from '../components/areas/Country';
import States from '../components/areas/States';
import City from '../components/areas/City';
import AuthenItem from '../components/auth/AuthenItem';
import AuthenNormalClearance from '../components/auth/AuthenNormalClearance';
import PersonnelType from '../components/auth/PersonnelType';
import Personnel from '../components/auth/Personnel';
import MerchandiseGenType from '../components/merchandise/MerchandiseGenType';
import MerchandiseType from '../components/merchandise/MerchandiseType';
import MerchandisePropertyType from '../components/merchandise/MerchandisePropertyType';
import Merchandise from '../components/merchandise/Merchandise';
import PersonnelProfile from '../components/personal/PersonnelProfile';
import MerchandiseSeller from '../components/merchandise/MerchandiseSeller';
import Welcome from '../components/util/Welcome';



const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );
  
  /**const AdminPanel = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  **/
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));
  
  export default function PersistentDrawerLeft() {

    const [uploadFolder, setFolder] = React.useState('');
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [adminList, setAdminList] = React.useState([]);

    useEffect(() => {
      const getFolder = () => {
          axios.get(`http://localhost:8082/util/getPermissionList`).then((res) => {
            setAdminList(res.data);
          });
      };
      getFolder()
    }, [])

    useEffect(() => {
      const getFolder = () => {
          axios.get(`http://localhost:8082/util/uploadFolder`).then((res) => {
              setFolder(res.data);
          });
      };
      getFolder()
    }, [])

    useEffect(() => {
      const getFolder = () => {
          axios.get(`http://localhost:8082/personnelProfile/getLoginId`).then((res) => {
                  setPhotoUrl(uploadFolder+"/personnel/"+res.data.t+".jpg");
          })
      };
      getFolder()
    }, [uploadFolder])

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [showPage, setShowPage] = React.useState(-1);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const logOut = () => {
      axios({
        url:'http://localhost:8082/adminAuth/logout',
        method: 'post',
    }).then(() => {
      //localStorage.removeItem('satoken');
    })
      
    }
  
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Panel
            </Typography>
            <Stack direction="row" spacing={2} style={{ position:'absolute', right:'3rem' }}>
                <Avatar style={{ marginLeft:'50%' }}
                    alt="User"
                    src={photoUrl}
                    sx={{ width: 40, height: 40 }}
                />
            </Stack>
            <Button style={{ position:'absolute', right:'5rem' }} onClick={logOut}>
                <ReactLink className='noUnderlineLink' style={{ color:'#F5ECE7', fontSize:'16px' }} to={{pathname:'/adminLogin', isFresh:true}}>Log Out</ReactLink>
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          {adminList.indexOf("Grand Pass") !== -1 ? <>
          <Divider />
          <List>
              <ListItem button key='Country (Region)' onClick={() => {setShowPage(0)}}>
                <ListItemIcon>
                  <PublicIcon/>
                </ListItemIcon>
                <ListItemText primary='Country (Region)' />
              </ListItem>

              <ListItem button key='States' onClick={() => {setShowPage(1)}}>
                <ListItemIcon>
                  <MapIcon/>
                </ListItemIcon>
                <ListItemText primary='States' />
              </ListItem>

              <ListItem button key='City' onClick={() => {setShowPage(2)}}>
                <ListItemIcon>
                  <LocationOnIcon/>
                </ListItemIcon>
                <ListItemText primary='City' />
              </ListItem>
          </List></>
          : ''}
          {adminList.indexOf("Authen") !== -1 ? <>
          <Divider />
          <List>
            <ListItem button key='Authen Item' onClick={() => {setShowPage(3)}}>
                <ListItemIcon>
                  <AnchorIcon/>
                </ListItemIcon>
                <ListItemText primary='Authen Item' />
            </ListItem>
            <ListItem button key='Authen Job Names and Clearance' onClick={() => {setShowPage(4)}}>
                <ListItemIcon>
                  <WorkIcon/>
                </ListItemIcon>
                <ListItemText primary='Authen Job Names and Clearance' />
            </ListItem>
          </List></>
         : '' }
          {adminList.indexOf("Personnel") !== -1 ? <>
          <Divider />
          <List>
            <ListItem button key='Personnel Type' onClick={() => {setShowPage(5)}}>
                <ListItemIcon>
                  <AccountBoxIcon/>
                </ListItemIcon>
                <ListItemText primary='Personnel Type and Clearance' />
            </ListItem>
            <ListItem button key='Personnel' onClick={() => {setShowPage(6)}}>
                <ListItemIcon>
                  <PersonAddIcon/>
                </ListItemIcon>
                <ListItemText primary='Personnel' />
            </ListItem>
          </List>
          </> : '' }
          {adminList.indexOf("Personnel") !== -1 ? <>
          <Divider />
          <List>
            <ListItem button key='Merchandise General' onClick={() => {setShowPage(7)}}>
                      <ListItemIcon>
                      <CategoryIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Merchandise General' />
              </ListItem>
            <ListItem button key='Merchandise Type' onClick={() => {setShowPage(8)}}>
                      <ListItemIcon>
                      <FormatAlignJustifyIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Merchandise Type' />
              </ListItem>
              <ListItem button key='Merchandise Property Type' onClick={() => {setShowPage(9)}}>
                      <ListItemIcon>
                      <SettingsIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Merchandise Property Type' />
              </ListItem>
              <ListItem button key='Merchandise' onClick={() => {setShowPage(10)}}>
                      <ListItemIcon>
                      <LocalMallIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Merchandise' />
              </ListItem>
          </List></>
          : '' }
          {adminList.indexOf("Seller") !== -1 ? <>
          <Divider />
          <List>
            <ListItem button key='Manage My Merchandise' onClick={() => {setShowPage(11)}}>
                    <ListItemIcon>
                    <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary='Manage My Merchandise' />
            </ListItem>
          </List></>
          : '' }
          <Divider />
          <List>
            <ListItem button key='Personal Profile' onClick={() => {setShowPage(12)}}>
                      <ListItemIcon>
                      <AccountCircleIcon/>
                      </ListItemIcon>
                      <ListItemText primary='Personal Profile' />
              </ListItem>
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {showPage === -1 ? <><Welcome/></> : ''}
          {showPage === 0 ? <><Country/></> : ''}
          {showPage === 1 ? <><States/></> : ''}
          {showPage === 2 ? <><City/></> : ''}
          {showPage === 3 ? <><AuthenItem/></> : ''}
          {showPage === 4 ? <><AuthenNormalClearance/></> : ''}
          {showPage === 5 ? <><PersonnelType/></> : ''}
          {showPage === 6  ? <><Personnel/></> : ''}
          {showPage === 7  ? <><MerchandiseGenType/></> : ''}
          {showPage === 8  ? <><MerchandiseType/></> : ''}
          {showPage === 9  ? <><MerchandisePropertyType/></> : ''}
          {showPage === 10  ? <><Merchandise/></> : ''}
          {showPage === 11  ? <><MerchandiseSeller/></> : ''}
          {showPage === 12  ? <><PersonnelProfile/></> : ''}
          
        </Main>
      </Box>
    );
  }
