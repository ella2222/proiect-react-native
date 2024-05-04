import Login from "../../component/Login"
import { login } from "../../api/Api"
import { useNavigation } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"
import { useAuth } from "../../hooks/authContext"

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const handlegotoRegister = () => {
        navigation.navigate(AuthRouteNames.REGISTER)
    }
    const auth = useAuth();
    return <Login onSubmit={auth.login} gotoRegister={handlegotoRegister}/>
}

export default LoginScreen;