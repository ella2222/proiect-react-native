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
    

    const tokenExpired = (token: string): boolean => {
        if(token){
            const [, payload] = token.split('.');
            const data = JSON.parse(atob(payload));
            return data.exp * 1000 < Date.now();
        }
        return true;
    }

    useEffect(() => {
        setIsLoading(true);
        AsyncStorage.getItem('token').then(value => {
            if (value){
                if (tokenExpired(value)){
                    AsyncStorage.removeItem('token');
                    value = '';
                } else {
                    setToken(value);
                    getUserDetails(value).then((user) => {
                        setEmail(user.user.email);
                        setId(user.user.id);
                    });
                }
            }
        }).finally(() => setIsLoading(false));
    }, []);
    
    const handlelogin = async (email: string, password: string) => {
        try {
            const result = await login(email, password);
            setToken(result);
            AsyncStorage.setItem('token', result);

            getUserDetails(result).then((user) => {
                setEmail(user.user.email);
                setId(user.user.id);
            });
        } catch (error) {
            console.log(error);
            alert('Invalid email or password');
        }
    };
    const handleregister = async (email: string, password: string) => {
        try {
            
            await register(email, password);
            await handlelogin(email, password);

        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to register' + error); 
        }
    };

    const handlelogout = async () => {
        setToken('');
        setEmail('');
        setId('');
        await AsyncStorage.removeItem('token');
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