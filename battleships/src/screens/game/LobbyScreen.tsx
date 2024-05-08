// src/screens/game/LobbyScreen.tsx
import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/authContext';
import GameListItems from '../../component/GameListItems';
import { createGame, getDetailsOfGame, joinGame, listGames } from '../../api/Api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GameRouteNames } from '../../router/route-names';
import { Alert } from 'react-native';

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #f9f9f9;
`;

const ActionButton = styled.TouchableOpacity`
    margin-top: 20px;
    background-color: #007bff;
    padding: 15px;
    border-radius: 5px;
    align-self: center;
    min-width: 40%;
    margin-horizontal: 20px;
    margin-bottom: 20px;
`;

const ButtonText = styled.Text`
    color: white;
    text-align: center;
    font-size: 16px;
`;

const GameList = styled.ScrollView`
    flex: 1;
    margin-bottom: 50px;
`;

export const LobbyScreen = () => {
    const { token } = useAuth();
    const navigation = useNavigation<any>();
    const [games, setGames] = React.useState<any[]>([]);
    const auth = useAuth();

    const fetchGames = useCallback( async() => {
        try {
            const gamesList = await listGames(token);
            setGames(gamesList.games);

        } catch (error) {
            console.error('Failed to fetch games:', error);
            Alert.alert('Error', 'Failed to load games.');
        }
    }, [token]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    useFocusEffect(
        React.useCallback(() => {
            fetchGames();
        }, [fetchGames])
    );
    
    const handleCreateGame = async () => {
        try {
            const game = await createGame(token);
            await fetchGames();
            console.log('Game created', game);
            navigation.navigate(GameRouteNames.TABLE);
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    

    const handleViewProfile = () => {
        navigation.navigate(GameRouteNames.USER_DETAILS);
    };

    const handleJoinGame = async (gameId: string) => {
        try {
            await joinGame(token, gameId);
            navigation.navigate(GameRouteNames.TABLE, {gameId});
        } catch (error) {
            console.error('Failed to join game:', error);
        }
    }

    return (
        <Container>
            <ActionButton onPress={handleCreateGame}>
                <ButtonText>Create Game</ButtonText>
            </ActionButton>

            <GameList>
                {games.map(game => (
                    <GameListItems
                        key={game.id}
                        id={game.id}
                        status={game.status}
                        otherPlayerEmail={game.player1.email}
                        onJoin={() => handleJoinGame(game.id)}
                        onPress={() => {navigation.navigate(GameRouteNames.TABLE, {gameId: game.id}),
                                getDetailsOfGame(auth.token, game.id)}}
                    />
                ))}
            </GameList>

            <ActionButton onPress={handleViewProfile}>
                <ButtonText>View Profile</ButtonText>
            </ActionButton>
        </Container>
    );
};

export default LobbyScreen;
