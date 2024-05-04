import React, { useContext, useEffect, useState } from 'react';
import { createGame, listGames, getGamebyid } from '../../api/Api';
import { GameContext } from '../../hooks/gameContext';
import { GameRouteNames } from '../../router/route-names';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import GameListItems from '../../component/GameListItems';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/authContext';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@react-navigation/stack';

const Container = styled.View`
    flex: 1;
    background-color: #b734eb;
    align-items: center;
    justify-content: center;
`;

const Headercont = styled.View`
    flex: 1;
    background-color: #b734eb;
    align-items: center;
    justify-content: center;
`;

const CreateButton = styled.TouchableOpacity`
    width: 100px;
    height: 50px;
    background-color: #c787e0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const Titletext = styled.Text`
    align-self: center;
    padding: 20px;
    font-size: 20px;
    font-weight: bold;
`;



const LobbyScreen = () => {
    const auth = useAuth();
    const navigation = useNavigation<any>();
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        listGames(auth.token).then(setGames);
    }, []);

    const fetchgames = async () => {
        try {
            const response = await listGames(auth.token);
            setGames(response.games);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleCreateGame = async () => {
        await createGame(auth.token);
        await listGames(auth.token).then(setGames);
    }

    return (
        <>
            <Headercont>
                <Titletext>Lobby</Titletext>
                <CreateButton onPress={handleCreateGame}>
                    <Text>Create Game</Text>
                </CreateButton>
            </Headercont>

            <Container>
                <FlatList 
                data={games} 
                renderItem={({item}) => <GameListItems id={item.id} status={item.status} onPress={() => navigation.navigate(GameRouteNames.TABLE, {gameId: item.id})} color={item.color} player1email={item.player1email}/>}
                keyExtractor={item => item.id}
                />
            </Container>
        </>
    );
}

export default LobbyScreen;