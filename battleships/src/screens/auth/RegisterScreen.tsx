import Register from "../../component/Register";
import { register } from "../../api/Api";
import { useNavigation } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"

const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const handlegotoLogin= () => {
        navigation.navigate(AuthRouteNames.LOGIN)
    }
    return <Register onSubmit={register} gotoLogin={handlegotoLogin}/>
}

export default RegisterScreen;