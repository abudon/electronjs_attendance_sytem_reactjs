

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Context
import {useLoginContext} from "../../context/loggingConxtext";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import Card from "@mui/material/Card";
import moment from "moment";
import SoftAvatar from "../../components/SoftAvatar";
import morningIcon from "../../assets/images/small-logos/morning_icon.png"
import afternoonIcon from "../../assets/images/small-logos/afternoon_icon.png"
import eveningIcon from "../../assets/images/small-logos/evening_icon.png"
import "react-day-picker/dist/style.css";
import MyCalendar from "../../examples/calender";
import UsersTableData from "../../context/data/UsersTableData";
import AttendanceRecordData from "../../context/data/AttendanceRecordData";

function Dashboard() {



  const {username} = useLoginContext()
  const navigate = useNavigate()

  const {totalNumberOfStaff, totalNumberOfStudents} = UsersTableData()
  const {presentStudent, presentStaff, lateStudent, lateStaff} = AttendanceRecordData()


  const [currentTime, setCurrentTime] = useState(moment().format('LTS'));
  const [greetingIcon, setGreetingIcon] = useState(morningIcon);
  const getHour = new Date().getHours()



  if (!username) {
    // Navigate to the dashboard route if user is logged in
    navigate('/authentication/sign-in');
  }


  useEffect(() => {
    const greetingPix = () => {
      const icon =
          (getHour >= 13 && getHour < 16)? afternoonIcon:
              (getHour >=16)? eveningIcon:morningIcon;
      setGreetingIcon(icon)
    }
    greetingPix()
  }, [setGreetingIcon, getHour]);


  useEffect(() => {
    const interval = setInterval(()=>{
      setCurrentTime(moment().format('LTS'))
    },1000)

    return () => clearInterval(interval)
  }, []);







  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container md={12} spacing={3} >
            <Grid item px={1} md={3}>

              <Card>
                <SoftBox
                    bgColor={'white'}
                    variant={'gradient'}
                >
                  <SoftBox p={2}  sx={{
                    display: "flex",
                    flexDirection: "column"
                  }}>
                   <SoftBox sx={{
                     display: 'flex',
                     flexDirection:'row',
                     justifyContent: 'space-around',
                     alignItems: "center"
                   }}>
                     <SoftBox>
                       <SoftAvatar alt={'Icon'} src={greetingIcon}/>
                     </SoftBox>
                     <SoftBox sx={{
                       display: "flex",
                       flexDirection: "column"
                     }}>
                       <SoftTypography sx={
                         {
                           fontSize: '22px',
                           fontWeight: "700",
                           fontStyle: "italic",
                           fontFamily: "Poppins"
                         }
                       }>{currentTime}</SoftTypography>
                       <SoftTypography sx={{
                         fontSize: '11px',
                         fontWeight: "bold",
                         fontStyle: "italic",
                         fontFamily: "Poppins"
                       }}>
                         Realtime Insight
                       </SoftTypography>
                     </SoftBox>
                   </SoftBox>
                    <SoftBox mt={6}>
                      <SoftTypography
                          sx={{
                            fontSize: '24px',
                            fontWeight: "800",
                            fontStyle: "italic",
                            fontFamily: "Poppins"
                          }}
                          textGradient>
                        Today:
                      </SoftTypography>
                      <SoftTypography sx={{
                        fontSize: '16px',
                        fontWeight: "800",
                        fontStyle: "italic",
                        fontFamily: "Poppins"
                      }}>{moment().format('dddd')}</SoftTypography>
                      <SoftTypography sx={{
                        fontSize: '14px',
                        fontWeight: "800",
                        fontStyle: "italic",
                        fontFamily: "Poppins"
                      }}>{moment().format('LL')}</SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>

            <Grid item sx={{
              borderLeftWidth: 1,
              borderLeftColor: "#82d616",
              borderLeftStyle: "solid"
            }}  md={9} >
             <Grid  container md={12} spacing={1}  >
               <Grid item md={4}>
                     <MiniStatisticsCard
                         title={{ text: "Total Student" , fontWeight:"bold"}}
                         count={totalNumberOfStudents}
                         percentage={{ color: "success", text: "" }}
                         icon={{ color: "success", component: "face" }}
                     />
                   </Grid>
               <Grid item md={4}>
                 <MiniStatisticsCard
                     title={{ text: "Total Staff" }}
                     count={totalNumberOfStaff}
                     percentage={{ color: "success", text: "" }}
                     icon={{ color: "success", component: "person" }}
                 />
               </Grid>
               <Grid item md={4} >
                 <MiniStatisticsCard
                     title={{ text: "Present Staff" }}
                     count={presentStaff}
                     percentage={{ color: "success", text: "" }}
                     icon={{ color: "success", component: "group_add" }}
                 />
               </Grid>
             </Grid>

              <Grid mt={2}  container md={12} spacing={1} >
                <Grid item md={4} >
                  <MiniStatisticsCard
                      title={{ text: "Present Student" }}
                      count={presentStudent}
                      percentage={{ color: "success", text: "" }}
                      icon={{ color: "success", component: "add_reaction" }}
                  />
                </Grid>
                <Grid item md={4} >
                  <MiniStatisticsCard
                      title={{ text: "Late Staff" }}
                      count={lateStaff}
                      percentage={{ color: "success", text: "" }}
                      icon={{ color: "success", component: "alarm_off" }}
                  />
                </Grid>
                <Grid item md={4} >
                  <MiniStatisticsCard
                      title={{ text: "Late Student" }}
                      count={lateStudent}
                      percentage={{ color: "success", text: "" }}
                      icon={{ color: "success", component: "alarm_off" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SoftBox>



        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid  item xs={12} md={7}>
                <DefaultInfoCard
                    description={'you just got a new message'}
                    icon={'notification_add'}
                    color={'success'}
                    title={'New Notification'}/>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card>
                <SoftBox
                    bgColor={'white'}
                    variant={'gradient'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItem={'center'}
                >
                  <MyCalendar/>
                </SoftBox></Card>


            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Dashboard;
