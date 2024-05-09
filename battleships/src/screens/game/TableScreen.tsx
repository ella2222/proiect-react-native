// src/screens/game/TableScreen.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { GameContext, useGameContext } from "../../hooks/gameContext";
import { useAuth } from "../../hooks/authContext";
import Table, { ICell } from "../../component/Table";
import ShipMap from "../../component/ShipMap";
import { joinGame, sendMapConfig, strike } from "../../api/Api";

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #f9f9f9;
`;

const Button = styled.TouchableOpacity`
    background-color: #007bff;
    padding: 15px;
    border-radius: 5px;
    align-self: center;
    min-width: 40%;
    margin-horizontal: 20px;
    margin-bottom: 20px;
`;

const createEmptyTable = () => Array.from({length: 10}, () => Array(10).fill(''));

const TableScreen = () => {
    const route = useRoute<any>();
    const auth = useAuth();
    const gameContext = useGameContext();

    const [playerConfig, setPlayerConfig] = useState(createEmptyTable());
    const [opponentConfig, setOpponentConfig] = useState(createEmptyTable());
    const [playerConfigReplay, setPlayerConfigReplay] = useState(createEmptyTable());
    const [opponentConfigReplay, setOpponentConfigReplay] = useState(createEmptyTable());

    const [replay, setReplay] = useState(false);

    useEffect(() => {
        gameContext.getGameDetails(route.params.gameId);
    }, []);

    const handleJoinGame = async () => {
        console.log('Joining game...');
        console.log(gameContext);
        if (gameContext.game) {
            console.log('hello');
            joinGame(auth.token, gameContext.game.id)
                .then(() => {
                    gameContext.getGameDetails(route.params.gameId);
                    console.log('Game joined');
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert("Error Joining Game", error.message, [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]);
                });
        }
    };
    
    return (
        <Button onPress={handleJoinGame}>
            <Text>Join</Text>
        </Button>
    )
};

export default TableScreen;
