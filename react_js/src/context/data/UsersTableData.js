// Import necessary Material-UI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../utils/firebaseConfig";
import { onValue, ref } from "firebase/database";

// COMPONENT AND FUNCTIONS
function Author({ name, grade, subject }) {
    const newValue = subject && subject.trim() !== "" ?
        subject : (grade && grade.trim() !== "" ? grade : "");

    return (
        <Box display="flex" alignItems="center" px={1}>
            <Box display="flex" flexDirection="column">
                <Typography variant="button" fontWeight="bold">
                    {name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {newValue}
                </Typography>
            </Box>
        </Box>
    );
}

const Gender = ({ gender, dob }) => {
    return (
        <Box
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            display="flex"
        >
            <Typography
                mt={1}
                variant={"button"}
                sx={{
                    backgroundColor: (gender.toLowerCase()) === "male" ? "#17c1e8" : "#cb0c9f",
                    borderRadius: 25,
                    color: "#fff",
                    padding: "5px 10px",
                    fontSize: "13px",
                }}
            >
                {gender.toUpperCase()}
            </Typography>
            <Typography
                variant="caption"
                sx={{ fontSize: "11px", fontWeight: "bold" }}
            >
                {dob}
            </Typography>
        </Box>
    );
};

const Role = ({ type, contact }) => {
    return (
        <Box
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            display="flex"
        >
            <Typography
                variant={'button'}
                sx={{
                    backgroundColor: type === "staff" ? "#ef6321" : "#82d616",
                    borderRadius: 25,
                    color: "#fff",
                    fontSize: "13px",
                    padding: "5px 10px"
                }}
            >
                {type?.toUpperCase()}
            </Typography>
            <Typography
                variant="caption"
                sx={{ fontSize: "11px", fontWeight: "bold" }}
            >
                {contact}
            </Typography>
        </Box>
    );
};

const Qualification = ({ value }) => {
    const newValue = value ?? "-";
    return <Typography variant="body1">{newValue}</Typography>;
};

const Action = ({ id }) => {
    const navigate = useNavigate();
    const handleEdit = (userId) => {
        navigate(`/edituser/${userId}`);
    };

    return (
        <Box alignItems="center" justifyContent="center" display="flex">
            <Button
                onClick={() => handleEdit(id)}
                variant="outlined"
                size="medium"
                color="warning"
                borderRadius={"25%"}
            >
                edit
            </Button>
        </Box>
    );
};

const UsersData = () => {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [totalNumberOfStudents, setTotalNumberOfStudents] = useState(0);
    const [totalNumberOfStaff, setTotalNumberOfStaff] = useState(0);
    const [studentsGradeNumber, setStudentsGradeNumber] = useState({});


    // GET ALL USERS FROM THE FIREBASE DATABASE
    const getUsers = async () => {
        const usersDatabaseReference = ref(database, "users/");

        onValue(usersDatabaseReference, (snapshot) => {
            if (snapshot.exists()) {
                const data2 = snapshot.val();
                const transformedData = [];

                for (const key in data2) {
                    if (data2.hasOwnProperty(key)) {
                        const values = data2[key];
                        const transformItem = {
                            userid: key,
                            fullname: `${values.firstName.toUpperCase()} ${values.lastName.toUpperCase()}`,
                            grade: values.grade,
                            gender: values.gender,
                            dateOfBirth: values.dateOfBirth,
                            email: values.email,
                            contact: values.contact,
                            address: values.address,
                            parentName: values.parentName,
                            emergencyContact: values.emergencyContact,
                            subjectTaught: values.subjectTaught,
                            highestQualification: values.highestQualification,
                            medic: values.medicalInformation,
                            type: values.type,
                        };
                        transformedData.push(transformItem);
                    }
                }
                setUsers(transformedData);
            }
        });
    };

    useEffect(() => {
        getUsers().then(() => console.log("success"));
    }, []);

    useEffect(() => {
        const newDedo = users.map((user) => {
            const alpha = {
                name: user.fullname,
                grade: user.grade,
                subject: user.subjectTaught,
            };
            const beta = {
                gender: user.gender,
                dob: user.dateOfBirth,
            };
            const gamma = {
                type: user.type,
                contact: user.contact,
            };

            return {
                userid: user.userid,
                fullname: alpha,
                gender: beta,
                role: gamma,
                qualification: user.highestQualification,
                action: user.userid,
            };
        });

        setData(newDedo);
    }, [users]);

    useEffect(() => {
        setTotalNumberOfStudents(users.filter(
            (user) => user.type.toLowerCase() === 'student'
        ).length);

        setTotalNumberOfStaff(users.filter(
            (user) => user.type.toLowerCase() === 'staff'
        ).length);

        const totalNumberOfStudentByGrade = () => {
            // Create a new object to hold the counts for each grade
            let newStudentsGradeNumber = {};

            // Loop through grades 1 to 10
            let classes = ['play group', 'pre-nursery', 'reception', '1','2','3','4','5','6']

            for (let grade in classes) {
                // Filter the users to find students in the current grade and get the count
                const count = users.filter(user => (
                    user.type.toLowerCase() === 'student' && user.grade.toLowerCase() === classes[grade]
                )).length;

                // Add the count to the newStudentsGradeNumber object
                newStudentsGradeNumber[`${classes[grade]}`] = count;
            }

            // Update the state with the new object
            setStudentsGradeNumber(newStudentsGradeNumber);


        };

        totalNumberOfStudentByGrade()


    }, [users]);




    // COLUMN DATA
    const columns = [
        { name: "userid", label: "User ID" },
        {
            name: "fullname",
            label: "Full Name",
            options: {
                customBodyRender: (value) => (
                    <Author name={value.name} grade={value.grade} subject={value.subject} />
                ),
            },
        },
        {
            name: "gender",
            label: "Gender",
            options: {
                customBodyRender: (value) => (
                    <Gender gender={value.gender} dob={value.dob} />
                ),
            },
        },
        {
            name: "role",
            label: "Role",
            options: {
                customBodyRender: (value) => (
                    <Role type={value.type} contact={value.contact} />
                ),
            },
        },
        {
            name: "qualification",
            label: "Qualification",
            options: {
                customBodyRender: (value) => (
                    <Qualification value={value} />
                ),
            },
        },
        {
            name: "action",
            label: "Action",
            options: {
                customBodyRender: (value) => (
                    <Action id={value} />
                ),
            },
        },
    ];

    return { columns, data, users, totalNumberOfStaff, totalNumberOfStudents, studentsGradeNumber  };
};

export default UsersData;

