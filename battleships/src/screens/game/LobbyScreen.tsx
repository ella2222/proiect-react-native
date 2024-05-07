// src/screens/game/LobbyScreen.tsx
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/authContext';
import GameListItems from '../../component/GameListItems';
import { createGame, listGames } from '../../api/Api';
import { useNavigation } from '@react-navigation/native';
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

export const LobbyScreen = () => {
    const { token } = useAuth();
    const navigation = useNavigation<any>();
    const [error, setError] = React.useState<string | null>(null);

    const handleCreateGame = async () => {
        try {
            const game = await createGame(token);
            console.log('Game created', game);
            navigation.navigate(GameRouteNames.TABLE);
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    const fetchGames = async () => {
        try {
            const gamesList = await listGames(token);

        } catch (error) {
            console.error('Failed to fetch games:', error);
            Alert.alert('Error', 'Failed to load games.');
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleViewProfile = () => {
        navigation.navigate(GameRouteNames.USER_DETAILS);
    };

    return (
        <Container>
            <ActionButton onPress={handleCreateGame}>
                <ButtonText>Create Game</ButtonText>
            </ActionButton>
            <GameListItems />
            <ActionButton onPress={handleViewProfile}>
                <ButtonText>View Profile</ButtonText>
            </ActionButton>
        </Container>
    );
};

export default LobbyScreen;
