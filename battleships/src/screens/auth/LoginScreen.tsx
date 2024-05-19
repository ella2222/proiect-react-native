import { useNavigation } from "@react-navigation/native"
import { login } from "../../api/Api"
import Login from "../../component/Login"
import { AuthRouteNames } from "../../router/route-names"
import { useAuth } from "../../hooks/authContext"

const LoginScreen = () => {
    const navigation = useNavigation<any>()
    const handleGoToRegister = () => {
        navigation.navigate(AuthRouteNames.REGISTER)
    }
    const auth = useAuth()
    
    return <Login onSubmit={auth.login} gotoRegister={handleGoToRegister} />
}

export default LoginScreen