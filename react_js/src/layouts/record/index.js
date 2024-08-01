import React, {useEffect, useState} from 'react'
import PageLayout from "../../examples/LayoutContainers/PageLayout";
import rgba from "../../assets/theme/functions/rgba";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import SoftBox from "../../components/SoftBox";
import bgImage from "../../assets/images/New-Logo-2-removebg-preview-300x300.png"
import SoftTypography from "../../components/SoftTypography";
import MUIDataTable from "mui-datatables";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {parse} from "date-fns";
import AttendanceData from "../../context/data/AttendanceRecordData";




function Name({ name }) {
    return (
        <Typography variant="button" fontWeight="bold">
            {name.toUpperCase()}
        </Typography>
    );
}

function Time({ time, type }) {
    const parsedTime = parse(time, "EEE MMM dd, yyyy hh:mm a", new Date());
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    let backgroundColor = "#82d616"; // default color

    if (type.toLowerCase() === "staff") {
        if ((hours >= 7 && minutes >= 30 && hours < 10) || (hours >= 13 && hours < 16)) {
            backgroundColor = "red";
        }
    } else if (type.toLowerCase() === "student") {
        if (hours >= 8 && hours < 11) {
            backgroundColor = "red";
        }
    }

    return (
        <Typography
            variant={'button'}
            sx={{
                backgroundColor: backgroundColor,
                borderRadius: 25,
                color: "#fff",
                fontSize: "10px",
                padding: "5px 10px"
            }}
        >
            {time}
        </Typography>
    );
}







function CurrentRecord() {

    const [data, setData] = useState([]);
    const { attendance } = AttendanceData();

    const columns = [
        { name: "userid", label: 'User ID' },
        { name: 'name', label: 'Full Name', options: { customBodyRender: (value) => <Name name={value} /> } },
        { name: 'contact', label: 'Contact', options: { customBodyRender: (value) => <Name name={value} /> } },
        { name: 'time', label: 'Time', options: { customBodyRender: (value, tableMeta) => <Time time={value} type={tableMeta.rowData[5]} /> } },
        { name: 'check', label: 'Checks', options: { customBodyRender: (value) => <Name name={value} /> } },
        { name: 'type', label: 'Category', options: { customBodyRender: (value) => <Name name={value} /> } },
    ];


    const styles = {
        background: {
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'fixed',
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            opacity: .15,
            zIndex: -1
        },
        recordsContainer: {
            display: "flex",
            flexDirection: "column",
            width: "80%",
            marginX: "auto"
        },
        header:{
            padding: 5,
            marginTop: 6
        },
        recordTableContainer:{
            borderRadius: 1,
            marginBottom: 4,
        },
        typography: {
            header: {
                fontWeight: "900",
                fontStyle: "italic",
            }
        }
    }

    const getMuiTheme = () => createTheme({
        typography: {
            fontFamily: 'Poppins',
            fontWeightBold: 'semi-bold',
        },
        palette: {
            background:{
                paper: 'white',
                default: "white"
            }
        },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        padding: "10px 4px"
                    },
                    body: {
                        padding: "7px 15px"
                    },
                    footer: {

                    },
                }
            }
        }
    })







    const options = {
        selectableRows: false,
        rowsPerPage: 100,
    };

    useEffect(() => {
        if (attendance) {
            setData(attendance.reverse().map(user => ({
                userid: user.registrarId,
                name: user.name,
                contact: user.contact,
                time: user.time,
                check: user.check,
                type: user.type
            })));
        }
    }, [attendance]);





    return (
        <PageLayout background={rgba ([239, 99, 33],.15)}>
            <SoftBox sx={styles.background}></SoftBox>
            <SoftBox sx={styles.recordsContainer}>
                <DefaultNavbar/>
                <SoftBox sx={styles.header}>
                    <SoftTypography variant={'h3'} sx={styles.typography.header}>
                        Attendance
                    </SoftTypography>
                </SoftBox>
                <SoftBox
                    shadow
                    bgColor={'white'}
                    sx={styles.recordTableContainer}>
                    <ThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={"Users List"}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </SoftBox>

            </SoftBox>



        </PageLayout>
    )
}

export default CurrentRecord
