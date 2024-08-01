///////////// IMPORTS ///////////////////
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VerticalBarChart from "../../examples/Charts/BarCharts/VerticalBarChart";
import GradientLineChart from "../../examples/Charts/LineCharts/GradientLineChart";
import UsersTableData from "../../context/data/UsersTableData";
import AttendanceRecordData from "../../context/data/AttendanceRecordData";
import SoftTypography from "../../components/SoftTypography";
import SoftBox from "../../components/SoftBox";
import RecordTable from "./components/RecordTable";

function AnalyticsPage() {
    ///////////// VARIABLES AND INITIALIZATION ///////////////////
    const { studentsGradeNumber } = UsersTableData();
    const {
        studentsPresentbyGrade,
        dailyStaffAttendance,
        dailyStudentAttendance,
        monthlyStaffAttendance,
        monthlyStudentAttendance,
    } = AttendanceRecordData();
    const initializeLinelabel = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [comparisonLabel, setComparisonLabel] = useState(initializeLinelabel);
    const initializeLineData = [50, 40, 300, 220, 500, 250, 400, 230, 500]
    const [comparisonStudentData, setComparisonStudentData] = useState(initializeLineData);
    const [comparisonStaffData, setComparisonStaffData] = useState(initializeLineData);


///////////// FUNCTIONS ///////////////////
    useEffect(() => {
        if (dailyStaffAttendance && dailyStudentAttendance){
            setComparisonLabel(dailyStaffAttendance.dates)
            setComparisonStudentData(dailyStudentAttendance.percentages)
            setComparisonStaffData(dailyStaffAttendance.percentages)
            console.log(dailyStaffAttendance.dates)
            console.log(dailyStaffAttendance.percentages)
            console.log(dailyStudentAttendance.percentages)
        }
    }, [dailyStaffAttendance, dailyStudentAttendance]);
///////////// CALLS AND LISTENERS ///////////////////
///////////// EXPORTS ///////////////////












    const data = useMemo(() => {
        const result = [];
        const classes = ["play group", "pre-nursery", "reception", "1", "2", "3", "4", "5"];
        for (let grade of classes) {
            result.push((studentsPresentbyGrade[grade] / studentsGradeNumber[grade]) * 100);
        }
        return result;
    }, [studentsPresentbyGrade, studentsGradeNumber]);

    const handleDaily = useCallback(() => {
        setComparisonLabel(dailyStaffAttendance.dates || []);
        setComparisonStudentData(dailyStudentAttendance.percentages || []);
        setComparisonStaffData(dailyStaffAttendance.percentages || []);
    }, [dailyStaffAttendance, dailyStudentAttendance]);

    const handleMonthly = useCallback(() => {
        setComparisonLabel(monthlyStudentAttendance.months || []);
        setComparisonStudentData(monthlyStudentAttendance.percentages || []);
        setComparisonStaffData(monthlyStaffAttendance.percentages || []);
    }, [monthlyStudentAttendance, monthlyStaffAttendance]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox mt={4}>
                <SoftBox mb={1.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <Card>
                                        <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                            <SoftTypography sx={{ fontSize: 15 }}>Attendance Comparison Chart</SoftTypography>
                                            <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                                <SoftTypography
                                                    variant="button"
                                                    onClick={handleDaily}
                                                    sx={{
                                                        fontSize: 9,
                                                        fontWeight: "800",
                                                        fontStyle: "italic",
                                                        border: "#000 2px solid",
                                                        padding: "1px",
                                                        borderRadius: "20%",
                                                        width: 60,
                                                        height: "auto",
                                                        textAlign: "center",
                                                        "&:hover": {
                                                            background: "black",
                                                            color: "#fff",
                                                        },
                                                    }}
                                                >
                                                    daily
                                                </SoftTypography>
                                                <SoftTypography
                                                    variant="button"
                                                    onClick={handleMonthly}
                                                    sx={{
                                                        fontSize: 9,
                                                        fontWeight: "800",
                                                        fontStyle: "italic",
                                                        border: "#000 2px solid",
                                                        padding: "1px",
                                                        borderRadius: "20%",
                                                        width: 60,
                                                        height: "auto",
                                                        textAlign: "center",
                                                        marginLeft: 1.5,
                                                        "&:hover": {
                                                            background: "black",
                                                            color: "#fff",
                                                        },
                                                    }}
                                                >
                                                    monthly
                                                </SoftTypography>
                                            </SoftBox>
                                        </SoftBox>
                                        <GradientLineChart
                                            chart={{
                                                labels: comparisonLabel,
                                                datasets: [
                                                    {
                                                        label: "Student",
                                                        color: "warning",
                                                        data: comparisonStudentData,
                                                    },
                                                    {
                                                        label: "Staff",
                                                        color: "success",
                                                        data: comparisonStaffData,
                                                    },
                                                ],
                                            }}
                                        />
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <VerticalBarChart
                                        title="Classes Daily Attendance"
                                        chart={{
                                            labels: [
                                                "Reception",
                                                "Play Group",
                                                "PreNursery",
                                                "Nursery",
                                                "Grade 1",
                                                "Grade 2",
                                                "Grade 3",
                                                "Grade 4",
                                                "Grade 5",
                                            ],
                                            datasets: [
                                                {
                                                    label: "Attendance by Grade",
                                                    color: "success",
                                                    data: data,
                                                },
                                            ],
                                        }}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <RecordTable />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox my={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}></Grid>
                        <Grid item xs={12} md={5}></Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </DashboardLayout>
    );
}

export default AnalyticsPage;
