import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useAuth } from '../hooks/authContext'; 
import { joinGame, listGames } from '../api/Api';
import { useNavigation } from '@react-navigation/native';
import { GameRouteNames } from '../router/route-names';

interface Game {
    id: string;
    status: string;
    otherPlayerEmail: string;
}

export const GameListItems = () => {
    const { token } = useAuth();
    const navigation = useNavigation<any>();
    const [games, setGames] = React.useState<Game[]>([]);

    React.useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesList = await listGames(token);
                setGames(gamesList); 
            } catch (error) {
                console.error('Failed to fetch games:', error);
                Alert.alert('Error', 'Failed to load games.');
            }
        };

        fetchGames();
    }, [token]);

    const handleJoinGame = async (gameId: string) => {
        try {
            await joinGame(token, gameId);
            navigation.navigate(GameRouteNames.TABLE, { gameId});
        } catch (error) {
            console.error('Failed to join game:', error);
            Alert.alert('Error', 'Failed to join game.');
        }
    };

    const renderItem = ({ item }: { item: Game }) => (
        <View style={styles.item}>
            <Text>Status: {item.status}</Text>
            <Text>Opponent: {item.otherPlayerEmail}</Text>
            <Button title="Join Game" onPress={() => handleJoinGame(item.id)} />
        </View>
    );

    return (
        <FlatList
            data={games}
            keyExtractor={item => item.id}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default GameListItems;