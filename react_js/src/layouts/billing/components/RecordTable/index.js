import Card from "@mui/material/Card";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AttendanceData from "../../../../context/data/AttendanceRecordData";
import Typography from "@mui/material/Typography";
import SoftTypography from "../../../../components/SoftTypography";
import SoftBox from "../../../../components/SoftBox";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { parse } from 'date-fns'; // Import date-fns for date parsing

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

const RecordTable = () => {
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

    const styles = {
        header: {
            padding: 1,
            marginTop: 1
        },
        recordTableContainer: {
            borderRadius: 1,
        },
        typography: {
            fontWeight: "900",
            fontStyle: "italic",
            fontFamily: "Poppins"
        }
    };

    const getMuiTheme = () => createTheme({
        typography: {
            fontFamily: 'Poppins',
            fontWeightBold: 'semi-bold',
        },
        palette: {
            background: {
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
                }
            }
        }
    });

    const options = {
        selectableRows: 'none',
        rowsPerPage: 20,
    };

    return (
        <Card color={'white'} elevation={4}>
            <SoftBox sx={styles.header}>
                <SoftTypography variant={'h3'} sx={styles.typography}>
                    Attendance
                </SoftTypography>
            </SoftBox>
            <SoftBox shadow bgColor={'white'} sx={styles.recordTableContainer}>
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </SoftBox>
        </Card>
    );
}

export default RecordTable;
