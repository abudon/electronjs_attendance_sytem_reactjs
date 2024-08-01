import React, {useState } from 'react';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import Card from '@mui/material/Card';
import SoftBox from '../../components/SoftBox';
import SoftTypography from '../../components/SoftTypography';
import SoftInput from '../../components/SoftInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SoftButton from '../../components/SoftButton';
import { Alert, AlertTitle, FilledInput, InputAdornment, FormControl } from '@mui/material';
import { database } from '../../utils/firebaseConfig';
import { ref, set } from 'firebase/database';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useFormik } from "formik";
import * as yup from 'yup';
import dayjs from 'dayjs';

const AddUserPage = () => {
    // VARIABLES
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
        parentName: "",
        idNumber: "",
        grade: "",
        gender: "",
        dateOfBirth: null,
        emergencyContact: "",
        subjectTaught: "",
        highestQualification: "",
        medicalInformation: "",
        password: "",
        type: ""
    };

    const checkoutSchema = yup.object().shape({
        firstName: yup.string().required("Required"),
        lastName: yup.string().required("Required"),
        email: yup.string().email("Invalid email!").required("Required"),
        contact: yup.string().matches(phoneRegExp, "Phone number is not valid!").required("Required"),
        address: yup.string().required("Required"),
        parentName: yup.string().required("Required"),
        idNumber: yup.string().required("Required"),
        gender: yup.string().required("Required"),
        emergencyContact: yup.string().matches(phoneRegExp, "Phone number is not valid!").required("Required"),
        password: yup.string().required("Required"),
        type: yup.string().required("Required")
    });

    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState(null);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: checkoutSchema,
        onSubmit: (values, { resetForm }) => {
            // Format dateOfBirth before submitting
            const formattedValues = {
                ...values,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null
            };

            const usersDataBaseReference = ref(database, 'users/' + formattedValues.idNumber);
            const adminDataBaseReference = ref(database, 'admin/' + formattedValues.idNumber);

            if (formattedValues.type === 'admin') {
                set(adminDataBaseReference, formattedValues).then(() => {
                    setAlert("success");
                    resetForm();
                }).catch(() => {
                    setAlert("failed due to network connection");
                });
            } else {
                set(usersDataBaseReference, formattedValues).then(() => {
                    setAlert("success");
                    resetForm();
                }).catch(() => {
                    setAlert("failed due to network connection");
                });
            }

            setTimeout(() => {
                setAlert("");
            }, 3000);
        }
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const AlertComponent = ({ message }) => {
        if (message === "success") {
            return (
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    It Stored <strong>Successfully</strong>
                </Alert>
            );
        } else {
            return (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    An <strong>Error</strong> Occurred
                </Alert>
            );
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={0}>
                <SoftBox mb={3}>
                    <Card>
                        <form onSubmit={formik.handleSubmit}>
                            <SoftBox p={3} mb={1} textAlign="center">
                                <SoftTypography fontFamily={'Poppins'} variant="h2" fontWeight="bold" mb={3}>
                                    ADD USERS
                                </SoftTypography>
                                <SoftBox sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>First Name</SoftTypography>
                                        <SoftInput
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.firstName}
                                            name="firstName"
                                            error={!!formik.touched.firstName && !!formik.errors.firstName}
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Last Name</SoftTypography>
                                        <SoftInput
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.lastName}
                                            name="lastName"
                                            error={!!formik.touched.lastName && !!formik.errors.lastName}
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>ID Number</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.idNumber}
                                            name="idNumber"
                                            error={!!formik.touched.idNumber && !!formik.errors.idNumber}
                                            helperText={formik.touched.idNumber && formik.errors.idNumber}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Medical Information</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.medicalInformation}
                                            name="medicalInformation"
                                            error={!!formik.touched.medicalInformation && !!formik.errors.medicalInformation}
                                            helperText={formik.touched.medicalInformation && formik.errors.medicalInformation}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"100%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Home Address</SoftTypography>
                                        <SoftInput
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.address}
                                            name="address"
                                            error={!!formik.touched.address && !!formik.errors.address}
                                            helperText={formik.touched.address && formik.errors.address}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Email</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="email"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            name="email"
                                            error={!!formik.touched.email && !!formik.errors.email}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>password</SoftTypography>
                                        <FormControl variant="filled" sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }} >
                                            <FilledInput
                                                fullWidth={true}
                                                id="filled-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                name="password"
                                                error={!!formik.touched.password && !!formik.errors.password}
                                                endAdornment={
                                                    <InputAdornment position="end" sx={{
                                                        marginLeft: 40
                                                    }}>
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"

                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            <SoftTypography variant="caption" color="error">
                                                {formik.touched.password && formik.errors.password}
                                            </SoftTypography>
                                        </FormControl>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Parent Name</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.parentName}
                                            name="parentName"
                                            error={!!formik.touched.parentName && !!formik.errors.parentName}
                                            helperText={formik.touched.parentName && formik.errors.parentName}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Contact</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.contact}
                                            name="contact"
                                            error={!!formik.touched.contact && !!formik.errors.contact}
                                            helperText={formik.touched.contact && formik.errors.contact}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Emergency Contact</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.emergencyContact}
                                            name="emergencyContact"
                                            error={!!formik.touched.emergencyContact && !!formik.errors.emergencyContact}
                                            helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Subject Taught</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.subjectTaught}
                                            name="subjectTaught"
                                            error={!!formik.touched.subjectTaught && !!formik.errors.subjectTaught}
                                            helperText={formik.touched.subjectTaught && formik.errors.subjectTaught}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Highest Qualification</SoftTypography>
                                        <SoftInput
                                            variant="filled"
                                            type="text"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.highestQualification}
                                            name="highestQualification"
                                            error={!!formik.touched.highestQualification && !!formik.errors.highestQualification}
                                            helperText={formik.touched.highestQualification && formik.errors.highestQualification}
                                        />
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Grade</SoftTypography>
                                        <Select
                                            variant="filled"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.grade}
                                            name="grade"
                                            error={!!formik.touched.grade && !!formik.errors.grade}
                                            fullWidth
                                        >
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
                                        <SoftTypography variant="caption" color="error">
                                            {formik.touched.grade && formik.errors.grade}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Gender</SoftTypography>
                                        <Select
                                            variant="filled"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.gender}
                                            name="gender"
                                            error={!!formik.touched.gender && !!formik.errors.gender}
                                            fullWidth
                                        >
                                            <MenuItem value={"Male"}>Male</MenuItem>
                                            <MenuItem value={"Female"}>Female</MenuItem>
                                            <MenuItem value={"Other"}>Other</MenuItem>
                                        </Select>
                                        <SoftTypography variant="caption" color="error">
                                            {formik.touched.gender && formik.errors.gender}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} >
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>Date of Birth</SoftTypography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker
                                                    value={formik.values.dateOfBirth}
                                                    onChange={(value) => formik.setFieldValue("dateOfBirth", value)}
                                                    renderInput={(params) => (
                                                        <SoftInput {...params} />
                                                    )}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <SoftTypography variant="caption" color="error">
                                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2} mx={1} shadow={'enable'} width={"50%"}>
                                        <SoftTypography fontSize={'small'} textAlign={'left'} variant={'h6'} fontWeight={'bold'}>User Type</SoftTypography>
                                        <Select
                                            variant="filled"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.type}
                                            name="type"
                                            error={!!formik.touched.type && !!formik.errors.type}
                                            fullWidth
                                        >
                                            <MenuItem value={"student"}>Student</MenuItem>
                                            <MenuItem value={"admin"}>Admin</MenuItem>
                                            <MenuItem value={"teacher"}>Teacher</MenuItem>
                                        </Select>
                                        <SoftTypography variant="caption" color="error">
                                            {formik.touched.type && formik.errors.type}
                                        </SoftTypography>
                                    </SoftBox>
                                </SoftBox>
                                {alert && <AlertComponent message={alert} />}
                                <SoftBox mt={4} mb={1}>
                                    <SoftButton variant="contained" color="success" type="submit" fullWidth>
                                        Submit
                                    </SoftButton>
                                </SoftBox>
                            </SoftBox>
                        </form>
                    </Card>
                </SoftBox>
            </SoftBox>
        </DashboardLayout>
    );
};

export default AddUserPage;
