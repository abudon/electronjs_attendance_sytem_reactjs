import {createContext, useContext, useState} from 'react'


const login_context = createContext({
    username : '',
    setUsername: ()=>{} ,
    department : "",
    setDepartment: ()=>{}
})



const LoginProvider = ({children}) =>{
    const [username, setUsername] = useState("");
    const [department, setDepartment] = useState("");
    const initialValues = {
        username,
        setUsername,
        department,
        setDepartment
    }


    return(
        <login_context.Provider value={initialValues}>
            {children}
        </login_context.Provider>
    )
}

const useLoginContext = ()=>{

    const context = useContext(login_context);
    if (!context) {
        throw new Error("usePhotoLabContext should be used inside the PhotoLabContextProvider.");
    }

    return context;
    }

    export {
    LoginProvider, useLoginContext
    }
