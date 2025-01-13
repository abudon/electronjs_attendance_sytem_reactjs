import React, { useCallback, useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import Card from '@mui/material/Card';
import SoftBox from '../../components/SoftBox';
import SoftTypography from '../../components/SoftTypography';
import SoftInput from '../../components/SoftInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SoftButton from '../../components/SoftButton';
import { Alert } from '@mui/material';
import SoftModal from '../../components/SoftModal';
import UsersTableData from '../../context/data/UsersTableData';
import { database } from '../../utils/firebaseConfig';
import { ref, remove, update } from 'firebase/database';


const EditUserPage = () => {
    // VARIABLES
    const { id } = useParams();
    const [userData, setUserData] = useState({});
    const [alert, setAlert] = useState(null);
    const [alertDelete, setAlertDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { users } = UsersTableData();
    const navigate = useNavigate();

    useEffect(() => {
        const user = users.find(user => user.userid === id);
        if (user) {
            const splitName = user.fullname.split(' ');
            let firstName, lastName;
            if (splitName.length === 2) {
                firstName = splitName[0];
                lastName = splitName[1];
            } else if (splitName.length >= 3) {
                firstName = splitName[0];
                lastName = splitName.slice(1).join(' ');
            } else {
                firstName = splitName[0];
                lastName = '';
            }
            setUserData({
                ...user,
                firstName: firstName.toUpperCase(),
                lastName: lastName.toUpperCase(),
            });
        }
    }, [id, users]);

    const handleOnChange = useCallback((event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    }, []);

    const handleDelete = () => {
        const userDataBaseReference = ref(database, `users/${id}`);
        remove(userDataBaseReference).then(() => {
            console.log('Deleted successfully');
            setAlertDelete(true);
            navigate("/user")
        }).catch(e => {
            console.error(e);
            setAlertDelete(false);
        });
    };

    const handleUpdate = () => {
        const userDataBaseReference = ref(database, `users/${id}`);
        update(userDataBaseReference, userData).then(() => {
            console.log('Data updated successfully in Firebase');
            setAlert(true);
        }).catch((error) => {
            console.error('Error updating data in Firebase:', error);
            setAlert(false);
        });
    };

    const AlertLogic = ({ message1, message2 }) => {
        switch (alert) {
            case true:
                return (<Alert severity="success" onClose={() => setAlert(null)}>{message1}</Alert>);
            case false:
                return (<Alert severity="error" onClose={() => setAlert(null)}>{message2}</Alert>);
            case null:
            default:
                return null;
        }
    };

    const AlertDeleteLogic = ({ message1, message2 }) => {
        switch (alertDelete) {
            case true:
                return (<Alert severity="success" onClose={() => setAlertDelete(null)}>{message1}</Alert>);
            case false:
                return (<Alert severity="error" onClose={() => setAlertDelete(null)}>{message2}</Alert>);
            case null:
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftModal open={open} setOpen={setOpen} message={message} handleDelete={handleDelete} />
            <SoftBox py={0}>
                <SoftBox mb={3}>
                    <Card>
                        <SoftBox p={3} mb={1} textAlign="center">
                            <SoftTypography fontFamily={'Poppins'} variant="h2" fontWeight="bold" mb={3}>
                                EDIT USERS
                            </SoftTypography>
                            <SoftBox component="form" role="form">
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>firstname</SoftTypography>
                                        <SoftInput type="text" value={userData.firstName || ''} name="firstName" onChange={handleOnChange} />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>lastname</SoftTypography>
                                        <SoftInput type="text" value={userData.lastName || ''} name="lastName" onChange={handleOnChange} />
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>email:</SoftTypography>
                                        <SoftInput type="email" value={userData.email || ''} name="email" onChange={handleOnChange} />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>password:</SoftTypography>
                                        <SoftInput type="text" value={userData.password || ''} name="password" onChange={handleOnChange} />
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>subject teacher / department:</SoftTypography>
                                        <SoftInput type="text" value={userData.subjectTaught || ''} name="subjectTaught" onChange={handleOnChange} />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>parent name:</SoftTypography>
                                        <SoftInput type="text" value={userData.parentName || ''} name="parentName" onChange={handleOnChange} />
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>highest qualification:</SoftTypography>
                                        <SoftInput type="text" value={userData.highestQualification || ''} name="highestQualification" onChange={handleOnChange} />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>date of birth:</SoftTypography>
                                        <SoftInput type="text" value={userData.dateOfBirth || ''} name="dateOfBirth" onChange={handleOnChange} />
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>phone number 1:</SoftTypography>
                                        <SoftInput type="text" value={userData.contact || ''} name="contact" onChange={handleOnChange} />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>phone number 2:</SoftTypography>
                                        <SoftInput type="text" value={userData.emergencyContact || ''} name="emergencyContact" onChange={handleOnChange} />
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>grade:</SoftTypography>
                                        <Select name="grade" value={userData.grade || ''} onChange={handleOnChange}>
                                            <MenuItem value={"play group"}>Play Group</MenuItem>
                                            <MenuItem value={"pre-nursery"}>Pre Nursery</MenuItem>
                                            <MenuItem value={"nursery"}>Nursery</MenuItem>
                                            <MenuItem value={"1"}>Grade 1</MenuItem>
                                            <MenuItem value={"2"}>Grade 2</MenuItem>
                                            <MenuItem value={"3"}>Grade 3</MenuItem>
                                            <MenuItem value={"4"}>Grade 4</MenuItem>
                                            <MenuItem value={"5"}>Grade 5</MenuItem>
                                            <MenuItem value={"6"}>Grade 6</MenuItem>
                                            <MenuItem value={"7"}>Grade 7</MenuItem>
                                            <MenuItem value={"8"}>Grade 8</MenuItem>
                                            <MenuItem value={"9"}>Grade 9</MenuItem>
                                        </Select>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>gender:</SoftTypography>
                                        <Select name="gender" value={userData.gender || ''} onChange={handleOnChange}>
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>role:</SoftTypography>
                                        <Select name="type" value={userData.type || ''} onChange={handleOnChange}>
                                            <MenuItem value="staff">Staff</MenuItem>
                                            <MenuItem value="student">Student</MenuItem>
                                        </Select>
                                    </SoftBox>
                                </SoftBox>
                                <SoftBox mb={0} mx={1} width={"100%"}>
                                    <SoftButton size={'small'} color={"success"} sx={{ marginRight: 3 }} onClick={handleUpdate}>
                                        Save Changes
                                    </SoftButton>
                                    <SoftButton size={'small'} color={"error"} sx={{ marginLeft: 3 }} onClick={() => {
                                        setMessage('user');
                                        setOpen(true);
                                    }}>
                                        Remove User
                                    </SoftButton>
                                </SoftBox>
                            </SoftBox>
                            <AlertLogic message1={"User Data Successfully Updated"} message2={"Error In Communication"} />
                            <AlertDeleteLogic message1={"User Deleted Successfully"} message2={"Error In Communication"} />
                        </SoftBox>
                    </Card>
                </SoftBox>
            </SoftBox>
        </DashboardLayout>
    );
};

export default EditUserPage;
