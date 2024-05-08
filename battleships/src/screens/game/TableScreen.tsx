import React, { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import {joinGame, sendMapConfiguration, strike, getDetailsOfGame} from "../../api/Api";
import { useAuth } from "../../hooks/authContext";
import Table, { ICell} from "../../component/Table";
import { useRoute } from "@react-navigation/native";
import { useGameContext } from "../../hooks/gameContext";

const TableScreen = () => {
    const route = useRoute<any>();
    const auth = useAuth();
    const gameCont = useGameContext();

    useEffect(() => {
        gameCont.getGameDetails(route.params.gameId);
    }, []);

    return (
        <SafeAreaView>
            <Text> Game </Text>
        </SafeAreaView>
    )
}

export default TableScreen;