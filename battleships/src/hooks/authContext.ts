import React, { createContext, useState, useContext, ReactNode, ReactElement } from 'react';
import { login, register } from '../api/Api';

interface IAuthContext {
    token: string;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
    token: '',
    login: async () => {},
    register: async () => {},
});

export const AuthContextProvider: React.FC<{children: ReactNode}> = ({ children }) : ReactElement => {
    
    const [token, setToken] = useState<string>('')
    
    const handlelogin = async (email: string, password: string) => {
        try {
            const result = await login(email, password);
            console.log('login: ', result);
            setToken(result);
        } catch (error) {
            console.log(error);
        }
    };
    const handleregister = async (email: string, password: string) => {
        try {
            const result = await register(email, password);
            console.log('register: ', result);
            setToken(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{
            token,
            login: handlelogin,
            register: handleregister
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);