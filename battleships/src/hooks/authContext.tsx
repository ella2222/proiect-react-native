import React, { createContext, useState, useContext, ReactNode, ReactElement, useEffect } from 'react';
import { getUserDetails, login, register } from '../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface IAuthContext {
    token: string;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    logout: () => Promise<void>;
    email: string;
    id: string;
}

const AuthContext = createContext<IAuthContext>({
    token: '',
    login: async () => {},
    register: async () => {},
    isLoading: false,
    logout: async () => {},
    email: '',
    id: ''
});

export const AuthContextProvider: React.FC<{children: ReactNode}> = ({ children }) : ReactElement => {
    
    const [token, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [id, setId] = useState<string>('');
    
    useEffect(() => {
        setIsLoading(true);
        AsyncStorage.getItem('token')
        .then(value => {
            if (value) {
                setToken(value);
            }
        })
        .finally(() => setIsLoading(false));
    }, []);
    
    const handlelogin = async (email: string, password: string) => {
        try {
            const result = await login(email, password);
            console.log('login: ', result);
            setToken(result);
            await AsyncStorage.setItem('token', result);

            getUserDetails(result).then((user) => {
                setEmail(user.user.email);
                setId(user.user.id);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const handleregister = async (email: string, password: string) => {
        try {
            const result = await register(email, password);
            console.log('register: ', result);
            setToken(result);
            await AsyncStorage.setItem('token', result);

            getUserDetails(result).then((user) => {
                setEmail(user.user.email);
                setId(user.user.id);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handlelogout = async () => {
        setToken('');
        await AsyncStorage.removeItem('token');
        Alert.alert('Logged out');
    };

    return (
        <AuthContext.Provider value={{
            token,
            login: handlelogin,
            register: handleregister,
            isLoading,
            logout: handlelogout,
            email,
            id
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);