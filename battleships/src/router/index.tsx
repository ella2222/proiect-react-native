import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import authroutes from "./auth.router";
import {useAuth} from '../hooks/authContext';
import gameroutes from "./game.router";
import { ActivityIndicator, SafeAreaView } from "react-native";

const Router: React.FC = () => {
    const auth = useAuth();

    if(auth.isLoading){
        return (
            <SafeAreaView style = {{
                display : 'flex',
                justifyContent : 'center',
                alignItems : 'center',
                flex : 1
            }}>
                <ActivityIndicator size = 'large' color = 'black'/>
            </SafeAreaView>
        )
    }

    return(
        <NavigationContainer>
            {auth.token ? gameroutes : authroutes}
        </NavigationContainer>
    )
}

export default Router;