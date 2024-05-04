import Register from "../../component/Register";
import { register } from "../../api/Api";
import { useNavigation } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"
import { useAuth } from "../../hooks/authContext";

const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const handlegotoLogin= () => {
        navigation.navigate(AuthRouteNames.LOGIN)
    }
    const auth = useAuth();
    return <Register onSubmit={auth.register} gotoLogin={handlegotoLogin}/>
}

export default RegisterScreen;