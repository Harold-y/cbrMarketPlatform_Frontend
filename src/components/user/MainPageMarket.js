import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Grid, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Avatar } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { IconButton } from '@mui/material';

import PublicIcon from '@mui/icons-material/Public';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {
        label: '1',
        imgPath:
            'http://127.0.0.1:8887/upload/rowRound/q.jpg?auto=format&fit=crop&w=590&h=470&q=60',
    },
    {
        label: '2',
        imgPath:
            'http://127.0.0.1:8887/upload/rowRound/q1.jpg?auto=format&fit=crop&w=590&h=470&q=60',
    },
    {
        label: '3',
        imgPath:
            'http://127.0.0.1:8887/upload/rowRound/q2.jpg?auto=format&fit=crop&w=590&h=470&q=60',
    },
    {
        label: '4',
        imgPath:
            'http://127.0.0.1:8887/upload/rowRound/q3.jpg?auto=format&fit=crop&w=590&h=470&q=60',
    },
];

const optionLists = [
    {
        "merchGenTypeId": 1,
        "merchGenTypeName": "Electronic Devices"
    },
    {
        "merchGenTypeId": 2,
        "merchGenTypeName": "Entertainments"
    },
    {
        "merchGenTypeId": 3,
        "merchGenTypeName": "Foods"
    },
    {
        "merchGenTypeId": 4,
        "merchGenTypeName": "Animal Related"
    },
    {
        "merchGenTypeId": 5,
        "merchGenTypeName": "Health & Care"
    },
    {
        "merchGenTypeId": 6,
        "merchGenTypeName": "Home"
    },
    {
        "merchGenTypeId": 7,
        "merchGenTypeName": "Books"
    },
    {
        "merchGenTypeId": 8,
        "merchGenTypeName": "Clothes"
    },
    {
        "merchGenTypeId": 9,
        "merchGenTypeName": "Luxury"
    },
    {
        "merchGenTypeId": 10,
        "merchGenTypeName": "Gift"
    },
    {
        "merchGenTypeId": 11,
        "merchGenTypeName": "Toy & Children"
    },
    {
        "merchGenTypeId": 12,
        "merchGenTypeName": "Sports"
    },
    {
        "merchGenTypeId": 13,
        "merchGenTypeName": "Outdoors"
    },
    {
        "merchGenTypeId": 14,
        "merchGenTypeName": "Pharmacy"
    },
    {
        "merchGenTypeId": 15,
        "merchGenTypeName": "Industrial & Scientific"
    },
    {
        "merchGenTypeId": 16,
        "merchGenTypeName": "Other"
    }
]


const MainPageMarket = () => {

    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const [uploadFolder, setUploadFolder] = React.useState('');

    const [guessLikeRows, setGuessLikeRows] = React.useState([]);
    const [topSaleRows, setTopSaleRows] = React.useState([]);

    const [getNextL, setGetNextL] = React.useState(false);

    useEffect(() => {
        const getFolder = () => {
            axios.get(`http://localhost:8082/util/uploadFolder`).then((res) => {
                setUploadFolder(res.data);
            })
        };
        getFolder()
      }, [])

    useEffect(() => {
        const getRegion = () => {
            axios.get(`http://localhost:8082/userMerch/selectMainPage`).then((res) => {
                setGuessLikeRows(res.data.t);
            }); 
        };
        getRegion()
    }, [getNextL])

    useEffect(() => {
        const getRegion = async () => {
            axios.get(`http://localhost:8082/userMerch/selectMainPageBySaleAmount`).then((res) => {
                setTopSaleRows(res.data.t);
            }); 
        };
        getRegion()
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <div style={{ backgroundColor: '#F2f2f2'}}>
            <Grid container spacing={2} style={{ marginTop: '0rem' }}>
                <Grid item xs={2}>
                    
                </Grid>
                <Grid item xs={1.5} style={{ backgroundColor: '#FFFFFF', marginRight: '2rem', borderRadius: '2rem', marginTop: '2rem' }}>
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        {optionLists.map((item) => {
                            return (
                                <div class='hoverDivCl' >
                                    <span style={{ margin: '1rem' }}>{item.merchGenTypeName}</span>
                                </div>
                            )
                        })}
                    </div>
                </Grid>
                <Grid item xs={4} style={{ backgroundColor: '#FFFFFF', borderRadius: '2rem', marginTop: '2rem' }}>
                    <Box sx={{ maxWidth: 590, flexGrow: 1 }} style={{ margin: '2rem', margin: '0 auto', marginTop: '3rem' }}>
                        <AutoPlaySwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                        >
                            {images.map((step, index) => (
                                <div key={step.label}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 470,
                                                display: 'block',
                                                maxWidth: 590,
                                                overflow: 'hidden',
                                                width: '100%',
                                            }}
                                            src={step.imgPath}
                                            alt={step.label}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </AutoPlaySwipeableViews>
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={handleNext}
                                    disabled={activeStep === maxSteps - 1}
                                >
                                    Next
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Back
                                </Button>
                            }
                        />
                    </Box>
                </Grid>

                <Grid item xs={1}>

                </Grid>
                <Grid item xs={1.5} style={{ backgroundColor: '#FFFFFF', marginRight: '2rem', borderRadius: '2rem', marginTop: '2rem' }}>
                    <Avatar alt="Hi!" src="http://localhost:8887/upload/newone.jpg" sx={{ width: 56, height: 56 }} style={{ margin: '0 auto', marginTop: '3rem' }} />
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Hi, Welcome !
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                        <Button size="small" style={{ fontSize: '1px' }}>Log In</Button>
                        <Button size="small" style={{ fontSize: '1px' }}>Sign Up</Button>
                    </Typography>                 
                    <Divider variant="middle"/>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', marginTop: '6rem' }}>
                        <PublicIcon style={{marginBottom:'-5px'}}/>   Global Shipment
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <CreditScoreIcon style={{marginBottom:'-5px'}}/>   Multiple Pay Methods
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <ShieldIcon style={{marginBottom:'-5px'}}/>   Order Protection
                    </Typography>
                </Grid>

                <Grid item xs={2}>

                </Grid>
                <Grid item xs={8} style={{ backgroundColor: '#FFFFFF', borderRadius: '2rem', marginTop: '2rem', marginBottom: '1rem', marginLeft: '1rem' }}>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'left', marginTop: '1rem', marginLeft: '3.5rem' }}>
                        Guess You Would Like
                        <IconButton aria-label="delete" onClick={() => {setGetNextL(!getNextL)}}>
                            <RefreshIcon />
                        </IconButton>
                    </Typography>
                    <div style={{ margin: '3rem', display: 'flex', flexWrap: 'wrap' }}>
                        {guessLikeRows.map((item) => {
                            return (
                                <Card sx={{ maxWidth: 305 }} style={{ margin: '1rem'}} >
                                    <CardActionArea>
                                    <CardMedia
                                            component="img"
                                            height="180"
                                            image={uploadFolder + '/merchandise/' + item.merch_photo_folder + '/' + item.merch_photo_set + '.jpg?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                            alt={item.merch_name}
                                        />
                                        <CardContent>
                                            <div style={{ display: 'flex' }}>
                                                <span style={{ fontSize: '16px', marginTop: '8px' }}>
                                                    $
                                                </span>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {parseInt(item.minprice)}
                                                </Typography>
                                                <Typography gutterBottom variant="h7" component="div" style={{ marginTop: '12px' }}>
                                                    {item.minprice.toString().split('.').length > 1 ? '.'+item.minprice.toFixed(2).toString().split('.')[1] : '.00'}
                                                </Typography>
                                            </div>
                                            <Typography variant="body2" style={{ fontSize: '16px' }}>
                                                {item.merch_name.length > 70 ? item.merch_name.substring(0, 70)+'...' : <span>{item.merch_name}<br></br><br></br><br></br></span>}
                                            </Typography>
                                            

                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions >
                                        <Grid container style={{ display: 'flex'}}>
                                                <Grid item xs={8}>
                                                    <Typography gutterBottom variant="body2" component="div" style={{ marginTop: '1rem' }}>
                                                        {item.personnel_first_name} {item.personnel_last_name === '' || item.personnel_last_name === null || item.personnel_last_name === undefined ? '' : item.personnel_last_name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography gutterBottom variant="body2" component="div" style={{ marginTop: '1rem' }}>
                                                        {item.merch_year_sale_stat === null || item.merch_year_sale_stat === '' || item.merch_year_sale_stat === undefined ? '0 sold' : item.merch_year_sale_stat + ' sold'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                    </CardActions>

                                </Card>
                            )
                        })}
                        
                    </div>

                </Grid>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={8} style={{ backgroundColor: '#FFFFFF', borderRadius: '2rem', marginTop: '2rem', marginBottom: '1rem', marginLeft: '1rem' }}>
                    <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'left', marginTop: '1rem', marginLeft: '3.5rem' }}>
                        Top Sales
                    </Typography>
                    <div style={{ margin: '3rem', display: 'flex', flexWrap: 'wrap' }}>
                        {topSaleRows.map((item) => {
                                return (
                                    <Card sx={{ maxWidth: 305 }} style={{ margin: '1rem'}} >
                                        <CardActionArea>
                                        <CardMedia
                                                component="img"
                                                height="180"
                                                image={uploadFolder + '/merchandise/' + item.merch_photo_folder + '/' + item.merch_photo_set + '.jpg?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                alt={item.merch_name}
                                            />
                                            <CardContent>
                                                <div style={{ display: 'flex' }}>
                                                    <span style={{ fontSize: '16px', marginTop: '8px' }}>
                                                        $
                                                    </span>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {parseInt(item.minprice)}
                                                    </Typography>
                                                    <Typography gutterBottom variant="h7" component="div" style={{ marginTop: '12px' }}>
                                                        {item.minprice.toString().split('.').length > 1 ? '.'+item.minprice.toFixed(2).toString().split('.')[1] : '.00'}
                                                    </Typography>
                                                </div>
                                                <Typography variant="body2" style={{ fontSize: '16px' }}>
                                                    {item.merch_name.length > 70 ? item.merch_name.substring(0, 70)+'...' : <span>{item.merch_name}<br></br><br></br><br></br></span>}
                                                </Typography>
                                                

                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions >
                                            <Grid container style={{ display: 'flex'}}>
                                                    <Grid item xs={8}>
                                                        <Typography gutterBottom variant="body2" component="div" style={{ marginTop: '1rem' }}>
                                                            {item.personnel_first_name} {item.personnel_last_name === '' || item.personnel_last_name === null || item.personnel_last_name === undefined ? '' : item.personnel_last_name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography gutterBottom variant="body2" component="div" style={{ marginTop: '1rem' }}>
                                                            {item.merch_year_sale_stat === null || item.merch_year_sale_stat === '' || item.merch_year_sale_stat === undefined ? '0 sold' : item.merch_year_sale_stat + ' sold'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                        </CardActions>

                                    </Card>
                                )
                            })}
                    </div>

                </Grid>

            </Grid>
        </div>

    )
}

export default MainPageMarket

