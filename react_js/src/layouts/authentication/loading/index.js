import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import SoftBox from "../../../components/SoftBox";
import backgroundImage from '../../../assets/images/hero2.png'
import SoftTypography from "../../../components/SoftTypography";



function Loader() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        setTimeout(()=>{
            setLoaded(true)
        }, 15000)
    }, []);

    useEffect(() => {
        if (loaded){
            setTimeout(()=>{
                navigate('/authentication/sign-in')
            }, 10000)
        }
    }, [loaded, navigate]);


    useEffect(() => {
        // Simulating a loading delay
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 10;

                if (newProgress === 100) {
                    clearInterval(interval);
                    setLoaded(true);
                }

                return newProgress;
            });
        }, 500);
    }, []);


    const styles = {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99,
            position: 'fixed',

        },
        overlay: {
            display: 'flex',
            position: "absolute",
            height: '100%',
            width: '100%',
            backgroundColor: "rgba(0,0,0,.3)",
            backdropFilter: "blur(5px)",
            opacity: loaded ? 0 : 1,
            transition: 'opacity 5s'
        },
        background:{
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundColor: '#ef6321',
            backgroundBlendMode: 'overlay',
            transform: 'rotate(-25deg) ',
            transformOrigin: 'center center',
            zIndex: -1,
            opacity: .2

        },
        section: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingY: 2
        },
        logo_image: {
            width: loaded? "150%" : "50%",
            height: loaded? "150%" : "50%",
            transition: 'width 5s, height 5s'
        },
        bottomContainer: {
            weight: "100%",
            height: loaded? "100%": 0,
            opacity: loaded? 1 : 0,
            transition: 'height 5s, opacity 5s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: "column"
        },
        typography:{
            heading: {
                color: "#ef6321",
                fontWeight: "900",
                fontStyle: "italic"
            }
        },
        preloaderContainer: {
            width: "100%",
            height: '10px',
            display: 'flex',
            alignItems: "center",
            justifyContent: "center",
            marginY:2,

        },
        preloader: {
            height: "100%",
            width: `${progress}%`,
            backgroundColor: '#ef6321',
            transition: "width 10s",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#ef6321",
            borderRadius: "50%"
        }
    }

    return (
        <SoftBox flex={1} sx={styles.container} variant={'div'}>
            <SoftBox sx={styles.background}></SoftBox>
            <SoftBox sx={styles.overlay}></SoftBox>
            <SoftBox
                sx={styles.section}
            >
                <img
                    style={styles.logo_image}
                    src={require('../../../assets/images/New-Logo-2-removebg-preview-300x300.png')}
                    alt={'logo-mage'}></img>

            </SoftBox>
            <SoftBox
               sx={styles.section}
            >
                <SoftBox sx={styles.bottomContainer}>
                        <SoftTypography
                            sx={styles.typography.heading}
                            variant={'h1'}
                            gutterBottom>
                            FORTVILLE ecoSYSTEM
                        </SoftTypography>
                        <SoftTypography
                            fontWeight={"bold"}
                            variant={'body'}
                            gutterBottom>
                            Automated Attendance System Management
                        </SoftTypography>
                    <SoftBox sx={styles.preloaderContainer}>
                        <SoftBox sx={styles.preloader}></SoftBox>
                    </SoftBox>

                </SoftBox>


            </SoftBox>
        </SoftBox>
    )

    }




export default Loader
