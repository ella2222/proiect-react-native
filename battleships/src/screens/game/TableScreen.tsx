import { useNavigation, NavigationProp } from "@react-navigation/native"
import { AuthRouteNames } from "../../router/route-names"
import { useAuth } from "../../hooks/authContext"
import { Text } from 'react-native'
import { useEffect, useState } from "react"
import { listGames } from "../../api/Api"
import { GameRouteNames } from "../../router/route-names"
import GameListItems from "../../component/GameListItems"

const TableScreen = () => {
    const auth = useAuth();
    const [games, setGames] = useState<any[]>([]);
    const navigation = useNavigation<any>();

    useEffect(() => {
        listGames(auth.token).then(setGames);
    }, []);

    return(
        <>
        </>
    )
}

export default TableScreen;