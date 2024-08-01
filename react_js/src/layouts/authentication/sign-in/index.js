

import {useCallback, useEffect, useState} from "react";

// react-router-dom components
import {useNavigate,} from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/School-Building-3.jpg";

// Context
import {useLoginContext} from "../../../context/loggingConxtext";
import {Alert} from "@mui/material";
import {Password, Person} from "@mui/icons-material";

//Database
import {database} from "../../../utils/firebaseConfig"
import { ref, get, child} from "firebase/database"

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [logins, setLogins] = useState({
    userid: "",
    password: ""
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const [alert, setAlert] = useState(null);
  const {setUsername, setDepartment} = useLoginContext()


  useEffect(() => {
    console.log('Username updated:', logins);
  }, [logins]);


  const handleSetRememberMe = () => setRememberMe(!rememberMe);


  const handleonChange = useCallback((event) => {
    const { value, name } = event.target;
    setLogins((prevState) => ({ ...prevState, [name]: value }));
  }, []);


  // GET USER FROM FIREBASE DATABASE

  const handleLogin = useCallback(async () => {

    const fetchUser = async (userid) => {
      try {
        const databaseRef = ref(database);
        const snapshot = await get(child(databaseRef, `admin/${userid}`))
        if (snapshot.exists()) {
          const values = snapshot.val();
          if (logins.password === values.password) {

            setAlert(true);
            setMessage('Successfully Logged In');
            setUsername(`${values.firstName.charAt(0).toUpperCase()}${values.firstName.slice(1)}`);
            setDepartment(values.subjectTaught);

            return true;
          } else {
            setMessage('Wrong Email or Password or Admin Authorization Only');
            setAlert(false);
            console.error('Authentication failed');
            return false;
          }
        } else {
          setMessage('User does not exist');
          setAlert(false);
          console.error('User does not exist');
          return false;
        }
      } catch (e) {
        setMessage("Network Connection Error or Wrong Credentials");
        setAlert(false);
        return false;
      }
    };

    if (logins.userid ==='' ||  logins.password === '') {
      navigate('/record');
    }
    const isSuccess = await fetchUser(logins.userid)

    if (isSuccess) {
      navigate('/dashboard')
    } else {
      console.log("Authentication failed or user does not exist");
    }
  }, [logins.password, logins.userid, navigate, setUsername, setDepartment]);





  return (
    <CoverLayout
      title="Welcome back"
      description="Enter Your UserID and Password"
      image={curved9}
    >
      <SoftBox component="form" role="form">
        {
            alert !== null && (
                <Alert
                    style={{ backgroundColor: alert ? "green" : "#ef6321", textAlign: "center" }}
                    severity={alert ? "success" : "warning"}
                    onClose={() => setAlert(null)}
                >
                  {message}
                </Alert>
            )
        }
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              User ID
            </SoftTypography>
          </SoftBox>
          <SoftInput
              icon={{
                component:<Person/>,
                direction: "right"
              }}
              onChange={handleonChange}
              name={"userid"}
              type={"text"}
              placeholder="User ID" />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
              icon={{
                component: <Password/>,
                direction: "right"
              }}
              onChange={handleonChange}
              type={'password'}
              name="password"
              placeholder="Password" />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton
              onClick={()=>handleLogin()}
              variant="gradient"
              color="info"
              fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
