import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useLoginContext} from "../../../context/loggingConxtext";

const SignOut = () => {
    const navigate = useNavigate();
    const {setUsername} = useLoginContext()

    useEffect(() => {
        // Clear localStorage
        localStorage.clear();
        setUsername(null)

        // Redirect the user to sign-in page
        navigate('/authentication/sign-in');
    }, [navigate, setUsername]);

    return null; // Since this component doesn't render any HTML view, return null
};

export default SignOut;
