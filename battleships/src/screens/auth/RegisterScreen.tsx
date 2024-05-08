import { useNavigation } from "@react-navigation/native"
import { login, register } from "../../api/Api"
import Register from "../../component/Register"
import { AuthRouteNames } from "../../router/route-names"
import { useAuth } from "../../hooks/authContext"

const RegisterScreen = () => {
    const navigation = useNavigation<any>()
    const handleGoToLogin = () => {
        navigation.navigate(AuthRouteNames.LOGIN)
    }
    const auth = useAuth()
    return <Register onSubmit={auth.register} gotoLogin={handleGoToLogin} />
}

export default RegisterScreen