import { database } from "../../utils/firebaseConfig";
import { onValue, ref } from "firebase/database";
import {useEffect, useState} from "react";
import UsersData from "./UsersTableData";

const AttendanceData = () => {
    const [attendance, setAttendance] = useState([]);
    const [presentStaff, setPresentStaff] = useState(0);
    const [presentStudent, setPresentStudent] = useState(0);
    const [lateStaff, setLateStaff] = useState(0);
    const [lateStudent, setLateStudent] = useState(0);
    const [studentsPresentbyGrade, setStudentsPresentbyGrade] = useState({});
    const [dailyStudentAttendance, setDailyStudentAttendance] = useState([]);
    const [dailyStaffAttendance, setDailyStaffAttendance] = useState([]);
    const [monthlyStudentAttendance, setMonthlyStudentAttendance] = useState([]);
    const [monthlyStaffAttendance, setMonthlyStaffAttendance] = useState([]);
    const {users} =UsersData()

    const getAttendance = async () => {
        const databaseReference = ref(database,'notifications/')
        onValue(databaseReference, (snapshot)=>{
            if (snapshot.exists()){
                const data = snapshot.val()
                const transformedData = [];
                for (const key in data){
                    if(data.hasOwnProperty(key)){
                        const item = data[key];
                        const dateObj = new Date(item.time);

                        const day = dateObj.toLocaleString('default', { weekday: 'short' });
                        const date = dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
                        const time = dateObj.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });

                        const transformedItem = {
                            Id: key,
                            registrarId: item.registrarId,
                            name: item.name,
                            type: item.type,
                            time: `${day} ${date} ${time}`,
                            check: item.check,
                            contact: item.contact,
                        }

                        transformedData.push(transformedItem);
                    }
                }
                setAttendance(transformedData)
            }
        })
    }

    useEffect(()=>{
        getAttendance()
    },[])

    useEffect(() => {
        const getCurrentFormattedDate = () => {
            const dateObj = new Date();
            const date = dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
            return date;
        };

        const specificDate = getCurrentFormattedDate();

        const studentCount = attendance.filter((user) => {
            const datePart = user.time.split(' ').slice(1, 4).join(' ');
            return (
                user.type.toLowerCase() === 'student' &&
                datePart === specificDate
            );
        }).length;

        const staffCount = attendance.filter((user) => {
            const datePart = user.time.split(' ').slice(1, 4).join(' ');
            return (
                user.type.toLowerCase() === 'staff' &&
                datePart === specificDate
            );
        }).length;

        setPresentStudent(studentCount);
        setPresentStaff(staffCount);

        const convertTo24Hour = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            return `${hours}:${minutes}`;
        };

        const staffCount1 = attendance.filter((user) => {
            const datePart = user.time.split(' ').slice(1, 4).join(' ');
            const timePart = user.time.split(' ').slice(4).join(' ');
            const time24h = convertTo24Hour(timePart);

            return user.type.toLowerCase() === 'staff' &&
                datePart === specificDate &&
                time24h > '07:30' && time24h < '12:00';
        }).length;

        const studentCount1 = attendance.filter((user) => {
            const datePart = user.time.split(' ').slice(1, 4).join(' ');
            const timePart = user.time.split(' ').slice(4).join(' ');
            const time24h = convertTo24Hour(timePart);

            return user.type.toLowerCase() === 'student' &&
                datePart === specificDate &&
                time24h > '08:00' && time24h < '12:00';
        }).length;

        setLateStaff(staffCount1);
        setLateStudent(studentCount1);



        const totalNumberOfStudentByGrade = () => {
            const specificDate = getCurrentFormattedDate();
            const newStudentsGradeNumber = {};

            const classes = ['play group', 'pre-nursery', 'reception', '1', '2', '3', '4', '5', '6'];

            for (let grade of classes) {
                const count = attendance.filter(user => {
                    const datePart = user.time.split(' ').slice(1, 4).join(' ');
                    const findUser = users.find(item => item.userid === user.registrarId);
                    const exactGrade = findUser ? findUser.grade.toLowerCase() : '';

                    return (
                        user.type.toLowerCase() === 'student' &&
                        exactGrade === grade &&
                        datePart === specificDate
                    );
                }).length;

                newStudentsGradeNumber[`${grade}`] = count;
            }

            setStudentsPresentbyGrade(newStudentsGradeNumber);
        };

        totalNumberOfStudentByGrade();


        const uniqueDates = [...new Set(attendance.map(user => {
            const dateObj = new Date(user.time.split(' ').slice(1, 4).join(' '));
            return dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        }))];
        const calculateDailyAttendance = (type) => {


            const attendancePercentages = uniqueDates.map(date => {
                const totalUsersOfType = users.filter(user => user.type.toLowerCase() === type).length;
                const presentUsersOnDate = attendance.filter(user => {
                    const datePart = user.time.split(' ').slice(1, 3).join(' ').replace(',', '');
                    return user.type.toLowerCase() === type && datePart === date;
                }).length;


                return totalUsersOfType > 0 ? (presentUsersOnDate / totalUsersOfType) * 100 : 0;
            });

            if (type === 'student') {
                setDailyStudentAttendance({ dates: uniqueDates, percentages: attendancePercentages });
            } else {
                setDailyStaffAttendance({ dates: uniqueDates, percentages: attendancePercentages });
            }
        };

        const calculateMonthlyAttendance = (type) => {
            const uniqueMonths = [...new Set(attendance.map(user => {
                const dateObj = new Date(user.time.split(' ').slice(1, 4).join(' ').replace(',', ''));
                return dateObj.toLocaleDateString('default', { month: 'short' });
            }))];

            const attendancePercentages = uniqueMonths.map(month => {
                const dailyPercentages = uniqueDates.filter(date => {
                    const dateObj = new Date(date);
                    return dateObj.toLocaleDateString('default', { month: 'short' }) === month;
                }).map(date => {
                    const totalUsersOfType = users.filter(user => user.type.toLowerCase() === type).length;
                    const presentUsersOnDate = attendance.filter(user => {
                        const datePart = user.time.split(' ').slice(1, 3).join(' ').replace(',', '');
                        return user.type.toLowerCase() === type && datePart === date;
                    }).length;
                    return totalUsersOfType > 0 ? (presentUsersOnDate / totalUsersOfType) * 100 : 0;
                });

                const sumOfDailyPercentages = dailyPercentages.reduce((acc, percentage) => acc + percentage, 0);
                const averagePercentage = dailyPercentages.length > 0 ? sumOfDailyPercentages / dailyPercentages.length : 0;

                return averagePercentage;
            });

            if (type === 'student') {
                setMonthlyStudentAttendance({ months: uniqueMonths, percentages: attendancePercentages });
            } else {
                setMonthlyStaffAttendance({ months: uniqueMonths, percentages: attendancePercentages });
            }
        };

        calculateDailyAttendance('student');
        calculateDailyAttendance('staff');
        calculateMonthlyAttendance('student');
        calculateMonthlyAttendance('staff');



    }, [attendance, users]);






    return {
        attendance,
        presentStaff,
        presentStudent,
        lateStaff, lateStudent,
        studentsPresentbyGrade,
        dailyStudentAttendance,
        dailyStaffAttendance,
        monthlyStudentAttendance,
        monthlyStaffAttendance
    }

}
export default AttendanceData
