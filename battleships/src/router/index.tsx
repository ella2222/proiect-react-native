import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import authroutes from "./auth.router";
import {useAuth} from '../hooks/authContext';

const Router: React.FC = () => {
    const auth = useAuth();
    return(
        <NavigationContainer>
            {authroutes}
        </NavigationContainer>
    )
}

export default Router;