import React, {useState} from 'react';
import styled from 'styled-components/native';
import { TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Register from './Register';
import authroutes from '../router/auth.router';

const Container = styled.SafeAreaView`
    border: 1px solid black;
    width : 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Input = styled.TextInput`
    width : 62%;
    height: 50px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: white;
    border: 1px solid black;
    margin-left: 70px;
`

const Button = styled.TouchableOpacity`
    width : 40%;
    height: 50px;
    border: 1px solid black;
    background-color: #c787e0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-left: 120px;
`
const TextReg = styled.Text`
    align-self: center;
    padding: 10px;
    margin-top: 30px;
`
const Titletext = styled.Text`
    align-self: center;
    padding: 20px;
`

export interface ILogin{
    onSubmit: (email: string, password: string) => void;
    gotoRegister: () => void;

}

const Login: React.FC<ILogin> = ({onSubmit, gotoRegister}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit(email, password);
    }

    return (
        <Container>
            <Titletext>Login</Titletext>
            <Input keyboardType='email-address' placeholder='email' onChangeText={setEmail}/>
            <Input secureTextEntry placeholder='password' onChangeText={setPassword}/>
            <Button onPress={handleSubmit}>
                <Text>Login</Text>
            </Button>
            <TextReg>Do you not have an account?</TextReg>
            <Button onPress={gotoRegister}>
                <Text>Register</Text>
            </Button>
        </Container>
    )
}

export default Login;