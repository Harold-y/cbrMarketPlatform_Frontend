import React from 'react'
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useEffect } from 'react';
import axios from 'axios';
import { Modal, Fade, Box, Backdrop,Alert,Button,Grid,Container,Avatar,TextField } from '@mui/material';
import qs from 'qs';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const Input = styled('input')({
    display: 'none',
  });

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const PersonnelProfile = () => {

    const [uploadFolder, setFolder] = React.useState('');
    const [photoUrl, setPhotoUrl] = React.useState('');
    const [fName, setFName] = React.useState('');
    const [mName, setMName] = React.useState('');
    const [lName, setLName] = React.useState('');
    const [enrollTime, setEnrollTime] =  React.useState('');
    const [editfName, setEditFName] = React.useState('');
    const [editmName, setEditMName] = React.useState('');
    const [editlName, setEditLName] = React.useState('');

    const [email, setEmail] = React.useState('');
    const [editEmail, setEditEmail] = React.useState('');
    const [position, setPosition] = React.useState('');
    
    const [editNameOpen, setEditNameOpen] = React.useState(false);
    const [editEmailOpen, setEditEmailOpen] = React.useState(false);
    const handleNameModal = () => {setEditNameOpen(!editNameOpen)};
    const handleEmailModal = () => {setEditEmailOpen(!editEmailOpen)};

    const [opSuccess, setOpSuccess] = React.useState(false);
    
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

    useEffect(() => {
        const setInfo = () => {
            axios.get(`http://localhost:8082/personnelProfile/selectPersonnelProfileById`).then((res) => {
                if(res.data.t.personnel_mid_name === null || res.data.t.personnel_mid_name === undefined)
                {

                }else
                {
                    setMName(res.data.t.personnel_mid_name);
                }
                setFName(res.data.t.personnel_first_name);
                setLName(res.data.t.personnel_last_name);
                setEmail(res.data.t.personnel_email);
                setPosition(res.data.t.personnel_type_name);
                setEnrollTime(res.data.t.personnel_enroll_time.split("T")[0]);
            })
        };
        setInfo()
      }, [opSuccess])

      useEffect(() => {
        const getFolder = () => {
            setEditFName(fName);
            setEditMName(mName);
            setEditLName(lName);

            setEditEmail(email);
        };
        getFolder()
      }, [fName, email, mName, lName])

      const updateNameFunction = () => {
          axios.post(`http://localhost:8082/personnelProfile/updatePersonnelProfileName`, qs.stringify({
                personnelFirstName: editfName,
                personnelMidName: editmName,
                personnelLastName: editlName
            })).then(function (response) {
                if(response.data === 1)
            {
                setEditNameOpen(false);
                setOpSuccess(true);
                setTimeout(() => {setOpSuccess(false)}, 2000)
            }
            });
      }

      const updateEmailFunction = () => {
        axios.post(`http://localhost:8082/personnelProfile/updatePersonnelEmail`, qs.stringify({
                personnelEmail: editEmail,
      })).then((res) => {
            if(res.data === 1)
            {
                setEditEmailOpen(false);
                setOpSuccess(true);
                setTimeout(() => {setOpSuccess(false)}, 2000)
            }
        })
      }

      const updatePhotoFunction = () => {
        var formData = new FormData();
        var inp = document.getElementById("icon-button-file").files[0];
        if(!inp)
        {
          return
        }
        formData.append('img', inp);
        axios({
            url:'http://localhost:8082/personnelProfile/updateProfileImg',
            method: 'post',
            headers:{'Content-Type':'multipart/form-data'},
            data:formData
        }).then((res) => {
            if(res.data.t === 1)
            {
                setOpSuccess(true);
                setTimeout(() => {setOpSuccess(false)}, 2000)
                setTimeout(() => {window.location.reload()}, 2000)
            }
          }
        )
      }

    return (
        <div>
            <Container maxWidth="sl" style={{marginTop:'1rem', marginLeft:'2rem'}}>
                    <Typography variant="h3" gutterBottom component="div" style={{ marginBottom:'4rem'}}>
                        Profile
                    </Typography>
                    {opSuccess ? <Alert severity="success">Operation Successful !</Alert> : ''}
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Avatar
                                alt={lName}
                                src={photoUrl}
                                sx={{ width: 130, height: 130 }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <div class="characteristics">
                                Name
                            </div>
                            <div class="valueDiv">
                                {fName + " " + mName + " " + lName}
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div class="characteristics">
                                Position Name
                            </div>
                            <div class="valueDiv">
                                {position}
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div class="characteristics">
                                Email
                            </div>
                            <div class="valueDiv">
                                {email}
                            </div>
                        </Grid>
                        
                        <Grid item xs={8} style={{ marginTop:'4rem', marginBottom:'2rem'}}>
                            <span class="infoSpans">
                                You Joined at {enrollTime}
                            </span>
                        </Grid>
                    </Grid>
            </Container>
            <Divider variant="middle"/>
            <Container maxWidth="sl" style={{marginTop:'1rem', marginLeft:'2rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={8} style={{ marginTop:'2rem', marginBottom:'2rem'}}>
                        <span class="infoSpans">
                            Update Name
                         </span>
                         <Button variant="outlined" size="medium" style={{ marginLeft:'10rem'}} onClick={() => {setEditNameOpen(true)}}>
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Divider variant="middle"/>
            <Container maxWidth="sl" style={{marginTop:'1rem', marginLeft:'2rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={8} style={{ marginTop:'2rem', marginBottom:'2rem'}}>
                        <span class="infoSpans">
                            Update Email
                         </span>
                         <Button variant="outlined" size="medium" style={{ marginLeft:'10rem'}} onClick={() => {setEditEmailOpen(true)}}>
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Divider variant="middle"/>
            <Container maxWidth="sl" style={{marginTop:'1rem', marginLeft:'2rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={8} style={{ marginTop:'2rem', marginBottom:'2rem'}}>
                        <span class="infoSpans">
                            Update Photo
                         </span>
                            <label htmlFor="icon-button-file">
                                <Input accept="image/*" id="icon-button-file" type="file" />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                    </IconButton>
                            </label>
                         <Button variant="outlined" size="medium" style={{ marginLeft:'7.3rem'}} onClick={updatePhotoFunction}>
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Divider variant="middle"/>

            <Modal
                open={editNameOpen}
                onClose={handleNameModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={editNameOpen}>
                <Box sx={style}>
                    <form onSubmit={updateNameFunction}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Name
                    </Typography>
                    <TextField required fullWidth label="First Name" value={editfName}
                        style={{ marginTop: '1rem' }} onChange={(e) => setEditFName(e.target.value)} />
                    <TextField required fullWidth label="Middle Name" value={editmName}
                        style={{ marginTop: '1rem' }} onChange={(e) => setEditMName(e.target.value)} />
                    <TextField required fullWidth label="Last Name" value={editlName}
                        style={{ marginTop: '1rem' }} onChange={(e) => setEditLName(e.target.value)} />
                    <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={updateNameFunction}>
                        Update Name
                    </Button>
                    </form>
                </Box>
                </Fade>

            </Modal>

            <Modal
                open={editEmailOpen}
                onClose={handleEmailModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={editEmailOpen}>
                <Box sx={style}>
                    <form onSubmit={updateEmailFunction}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Email
                    </Typography>
                    <TextField required fullWidth label="Property Type Name" value={editEmail}
                        style={{ marginTop: '1rem' }} onChange={(e) => setEditEmail(e.target.value)} />
                    <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={updateEmailFunction}>
                        Update Email
                    </Button>
                    </form>
                </Box>
                </Fade>

            </Modal>
        </div>
    )
}

export default PersonnelProfile
