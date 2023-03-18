import React, { createContext, useEffect, useState } from "react";
import api from './auth-request-api'


const AuthContext = createContext();
export const AuthActionType = {
    GET_LOGIN_USER: "GET_LOGIN_USER",
}
function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: "",
        email: "",
        profile:"",
    });
    useEffect(()=>{
        const getLogIn = async function () {
            const response = await api.getLoggedIn();
            authReducer({
                type: AuthActionType.GET_LOGIN_USER,
                payload: {
                    user: response.data.user.name,
                    email: response.data.user.email,
                    profile:response.data.user.profile
                }
            });
        }
        getLogIn();
    },[]);
    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    email: payload.email,
                    profile:payload.profile,
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