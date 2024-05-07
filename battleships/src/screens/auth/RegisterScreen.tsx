import { register } from "../../api/Api"
import Register from "../../component/Register"
import { useAuth } from "../../hooks/authContext"

const RegisterScreen = () => {
    const auth = useAuth()
    return <Register onSubmit={auth.register} gotoLogin={function (): void {
        throw new Error("Function not implemented.")
    } } />
}

export default RegisterScreen