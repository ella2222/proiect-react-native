// src/screens/game/TableScreen.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Alert, ScrollView, Text, TouchableOpacity, ActivityIndicator, View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { GameContext, useGameContext } from "../../hooks/gameContext";
import { useAuth } from "../../hooks/authContext";
import Table, { ICell } from "../../component/Table";
import ShipMap from "../../component/ShipMap";
import { joinGame, sendMapConfig, strike } from "../../api/Api";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
`;

const StatusText = styled(Text)`
    font-size: 18px;
    margin: 10px;
    text-align: center;
    color: #333;
`;

const Button = styled(TouchableOpacity)`
    background-color: #007bff;
    padding: 15px;
    border-radius: 5px;
    align-self: center;
    min-width: 40%;
    margin-top: 20px;
`;

const ButtonText = styled(Text)`
    color: white;
    text-align: center;
    font-size: 16px;
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

    const [isJoining, setIsJoining] = useState(false);
    const [isConfig, setIsConfig] = useState(false);

    const [isReplay, setIsReplay] = useState(false);

    const [ships, setShips] = useState<any[]>([
        {shipId: 0, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 1, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 2, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 3, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 4, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 5, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 6, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 7, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 8, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'},
        {shipId: 9, pozX: 'A', pozY: 1, length: 2, direction: 'VERTICAL'}
    ]);

    useEffect(() => {
        const fetchGame = async () => {
            await gameContext.getGameDetails(route.params.gameId);
        };
        fetchGame();
        const intervalId = setInterval(fetchGame, 1000); 
        return () => clearInterval(intervalId); 
    }, [route.params?.gameId]);

    useEffect(() =>{
        if(gameContext.game){
            getPlayerConfig();
            getOpponentConfig();
        }
    }, [gameContext.game]);

    const handleJoinGame = async () => {
        if (!gameContext.game) {
            Alert.alert("Game not loaded", "Please wait until the game is fully loaded.", [{ text: "OK" }]);
            return;
        }

        setIsJoining(true);
        try {
            await joinGame(auth.token, gameContext.game.id);
            await gameContext.getGameDetails(route.params.gameId);
            console.log('Game joined');
        } catch (error) {
            console.error(error);
            Alert.alert("Error Joining Game");
        } finally {
            setIsJoining(false);
        }
    };

    const getPlayerConfig = () => {
        const newconfig = playerConfig.map(row => [...row]);
        gameContext.game?.shipCoords?.forEach(ship => {
            const pozX = ship.x.charCodeAt(0) - 65;
            const pozY = ship.y - 1;

            newconfig[pozY][pozX] = ship.hit ? 'X' : 'O';
        });

        gameContext.game?.moves?.forEach(move => {
            const pozX = move.x.charCodeAt(0) - 65;
            const pozY = move.y - 1;

            if (move.playerId !== auth.id) {
                if(move.result === false){
                    newconfig[pozY][pozX] = 'M';
                }
            }
        });
        setPlayerConfig(newconfig);
    }

    const getOpponentConfig = () => {
        const newconfig = opponentConfig.map(row => [...row]);
        gameContext.game?.moves?.forEach(move => {
            const pozX = move.x.charCodeAt(0) - 65;
            const pozY = move.y - 1;

            if (move.playerId === auth.id) {
                newconfig[pozY][pozX] = move.result ? 'X' : 'O';
            }
        });
        setOpponentConfig(newconfig);
    }

    const placeShips = (config: any) => {
        if(areShipscorrect(config, ships)){
            const newShips = ships.map(ship => {
                if(ship.shipId === config.shipId){
                    return config;
                }
                return ship;
            });
            setShips(newShips);
        }
        else {
            Alert.alert('Invalid Ship Placement', 'Please make sure that the ship is placed correctly and does not overlap with other ships.');
        }
    }

    const getShipPosition = (X: string, Y: number, length: number, direction: string) => {
        const pozX = X.charCodeAt(0) - 65;
        const pozY = Y - 1;

        const positions = [];

        for (let i = 0; i < length; i++) {
            if (direction === 'VERTICAL') {
                positions.push({ x: pozX, y: pozY + i });
            } else {
                positions.push({ x: pozX + i, y: pozY });
            }
        }

        return positions;
    }

    const areShipscorrect = (newconfig: any, allconfigs: any[]) => {
        const newpoz = getShipPosition(newconfig.pozX, newconfig.pozY, newconfig.length, newconfig.direction);
        for(let pos of newpoz){
            if(pos.x < 0 || pos.x >= 10 || pos.y < 0 || pos.y >= 10){
                return false;
            }
            for(let config of allconfigs){
                const poz = getShipPosition(config.pozX, config.pozY, config.length, config.direction);
                for(let p of poz){
                    if(p.x === pos.x && p.y === pos.y){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    const handlesetmapconfig = () => {
        if(gameContext.game){
            sendMapConfig(auth.token, gameContext.game.id, ships).then(() => {
                gameContext.getGameDetails(route.params.gameId);
                setIsConfig(true);
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error setting configuration');
            });
        }
    };

    const handleStrike = (cell: ICell) => {
        if(gameContext.game && gameContext.game.status === 'ACTIVE' && gameContext.game.cuurentPlayerId === auth.id){
            const cellcontent = opponentConfig[cell.y - 1][cell.x.charCodeAt(0) - 65];
            if(cellcontent === 'X' || cellcontent === 'O'){
                return;
            }

            strike(auth.token, gameContext.game.id, cell.x, cell.y).then(() => {
                return gameContext.getGameDetails(route.params.gameId);
            })
            .then(() => {
                getOpponentConfig();
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error striking');
            });
        }
    };

    const getWinner = () => {
        if(gameContext.game?.status === 'FINISHED'){
            const lastmove = gameContext.game?.moves[gameContext.game?.moves.length - 1].playerId;
            if(lastmove === gameContext.game?.player1Id){
                return gameContext.game?.player1.email;
            }
            else {
                return gameContext.game?.player2.email;
            }
        }
        return '';
    }

    const handleReplay = () => {
        const moves = gameContext.game?.moves;

        if (!moves) {
            return;
        }

        setIsReplay(true);
        let counter = 0;

        const replaygame = () => {
            if(counter < moves.length){
                const newPlayerConfig = createEmptyTable();
                const newOpponentConfig = createEmptyTable();

                for(let i=0; i<=counter; i++){
                    const move = moves[i];
                    const pozX = move.x.charCodeAt(0) - 65;
                    const pozY = move.y - 1;

                    if(move.playerId === gameContext.game?.player1Id){
                        newOpponentConfig[pozY][pozX] = move.result ? 'X' : 'O';
                    } else {
                        newPlayerConfig[pozY][pozX] = move.result ? 'X' : 'O';
                    }
                }

                setPlayerConfigReplay(newPlayerConfig);
                setOpponentConfigReplay(newOpponentConfig);
                counter++;

                if(counter < moves.length){
                    setTimeout(replaygame, 1000);
                } else {
                    setIsReplay(false);
                }
            }
            else {
                setIsReplay(false);
            }
        }

        replaygame();
    }

    if(!gameContext.game){
        return (
            <Container>
                <ActivityIndicator size="large" color="#0000ff" />
                <StatusText>Loading game details...</StatusText>
            </Container>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {gameContext.game.status === 'CREATED' && gameContext.game.player1Id === auth.id && (
                <>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <StatusText>Waiting for an opponent...</StatusText>
                </>
            )}
            {gameContext.game.status === 'CREATED' && gameContext.game.player1Id !== auth.id && (
                <Button onPress={handleJoinGame}>
                    <ButtonText>Join Game</ButtonText>
                </Button>
            )}

            {gameContext.game.status === 'FINISHED' && (
                
                <>
                    <Text style={styles.winner}>Winner: {getWinner()}</Text>
                    <Button onPress={handleReplay} >
                        <ButtonText>Replay</ButtonText>
                    </Button>
                    <Text style={styles.header}>{gameContext.game.player1.email} vs {gameContext.game.player2?.email}</Text>
                    <View style={styles.boardContainer}>
                        <Text style={styles.boardLabel}>{gameContext.game.player1.email}'s Board:</Text>
                        <View style={styles.board}>
                            <Table state={playerConfig} />
                        </View>
                    </View>
                    <View style={styles.boardContainer}>
                        <Text style={styles.boardLabel}>{gameContext.game.player2?.email}'s Board:</Text>
                        <View style={styles.board}>
                            <Table state={opponentConfig} />
                        </View>
                    </View>
                </>
            )}
            {gameContext.game.status === 'ACTIVE' && auth.id !== gameContext.game.player1Id && auth.id !== gameContext.game.player2Id && (
                <>
                <Text style={styles.header}>{gameContext.game.player1.email} vs {gameContext.game.player2?.email}</Text>
                    <View style={styles.boardContainer}>
                        <Text style={styles.boardLabel}>{gameContext.game.player1.email}'s Board:</Text>
                        <View style={styles.board}>
                            <Table state={playerConfig} />
                        </View>
                    </View>
                    <View style={styles.boardContainer}>
                        <Text style={styles.boardLabel}>{gameContext.game.player2?.email}'s Board:</Text>
                        <View style={styles.board}>
                            <Table state={opponentConfig} />
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    boardContainer: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    boardLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    board: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    winner: {
        fontSize: 18,
        color: 'green',
        marginBottom: 20,
        textAlign: 'center',
    },
    watching: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
    }
});

export default () => (
    <GameContext>
        <TableScreen />
    </GameContext>
);