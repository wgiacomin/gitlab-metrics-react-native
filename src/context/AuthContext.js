import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import * as RootNavigation from '../../RootNavigation.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

function authReducer(state, action) {
    switch (action.type) {
        case "signIn":
            return {
                ...state,
                access_token: action.payload,
                error: "",
            };
        case "error":
            return {
                ...state,
                access_token: null,
                error: action.payload,
            };
        case "signOut":
            return {
                ...state,
                access_token: null,
                error: "",
            };
        default:
            return { ...state };
    }
}

const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        access_token: null,
        error: "",
    });

    const tryLocalSignIn = async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        if (access_token) {
            dispatch({ type: 'signIn', payload: access_token });
              RootNavigation.navigate('Home');
        }
        else {
            dispatch({ type: 'signOut' });
              RootNavigation.navigate('Login');
        }

    }

    const signIn = async ({ username, password }) => {
        try {
            const response = await axios({
                method: "post",
                url: "https://gitlab.tadsufpr.net.br/oauth/token",
                data: {
                    grant_type: "password",
                    username,
                    password,
                },
            });
            await AsyncStorage.setItem('access_token', response.data.access_token);
            dispatch({ type: "signIn", payload: response.data.access_token });
            RootNavigation.navigate("Home");
        } catch (err) {
            dispatch({
                type: "error",
                payload: "Problemas para autenticar usuário.",
            });
        }
    };

    const logout = async () => {
        try{
            dispatch({type: 'signOut'})
            await AsyncStorage.removeItem('access_token')
        } catch (err) {
            dispatch({
                type: "error",
                payload: "Problemas no logout.",
            });
        }
    }

    return (
        <AuthContext.Provider
            value={{
                authState,
                signIn,
                tryLocalSignIn,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
