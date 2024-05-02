import Login from "../../component/Login"
import { login } from "../../api/Api"
import { useNavigation } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const handlegotoRegister = () => {
        navigation.navigate(AuthRouteNames.REGISTER)
    }
    return <Login onSubmit={login} gotoRegister={handlegotoRegister}/>
}

export default LoginScreen;