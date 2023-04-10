import React, { createContext, useEffect, useState } from "react";
import api from './auth-request-api'


const AuthContext = createContext();
export const AuthActionType = {
    GET_LOGIN_USER: "GET_LOGIN_USER",
    LOGOUT:"LOGOUT",
}
function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: "",
        email: "",
        profile:"",
        isGlobalDeveloper:"",
    });
    useEffect(()=>{
        const getLogIn = async function () {
            const response = await api.getLoggedIn();
            const response1 = await api.isGlobalDeveloper();
            authReducer({
                type: AuthActionType.GET_LOGIN_USER,
                payload: {
                    user: response.data.user.name,
                    email: response.data.user.email,
                    profile:response.data.user.profile,
                    isGlobalDeveloper:response1.data.isGlobalDeveloper
                }
            });
        }
        getLogIn();
    },[]);

    auth.logout=function(){
        authReducer({
            type:AuthActionType.LOGOUT,
        });
    }



    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    email: payload.email,
                    profile:payload.profile,
                    isGlobalDeveloper:payload.isGlobalDeveloper
                })
            }
            case AuthActionType.LOGOUT:{
                return setAuth({
                    user: null,
                    email: null,
                    profile:null,
                    isGlobalDeveloper:false
                })
            }
            default:
                return auth;
        }
    }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}
export default AuthContext;
export { AuthContextProvider };