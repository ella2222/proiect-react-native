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
    margin-bottom: 30px;
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

    const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);

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

    const [shipConfigurations, setShipConfigurations] = useState(ships);

    const [shipsConfigured, setShipsConfigured] = useState(false);

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

    useEffect(() => {
        if(gameContext.game?.status === 'MAP_CONFIG') {
            shipConfigurations.forEach(ship => {
                placeShipOnBoard(ship);
            });
        }
    }, [shipConfigurations, gameContext.game?.status]); 

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


    const handleShipConfig = (config: any) => {
        setShipConfigurations(prevConfigs => {
            const newConfigs = prevConfigs.map(ship => 
                ship.shipId === config.shipId ? {...ship, ...config} : ship
            );
            return newConfigs;
        });
        placeShipOnBoard(config); 
    };

    const placeShipOnBoard = (ship: any) => {
        const newPlayerConfig = playerConfig.map(row => [...row]); 
        const startX = ship.pozX.charCodeAt(0) - 65;
        const startY = ship.pozY - 1;
        const length = ship.length;
        const direction = ship.direction;

        for (let i = 0; i < length; i++) {
            if (direction === 'HORIZONTAL') {
                newPlayerConfig[startY][startX + i] = 'S';
            } else if (direction === 'VERTICAL') {
                newPlayerConfig[startY + i][startX] = 'S';
            }
        }

        setPlayerConfig(newPlayerConfig); 
    };

    const validateAndPlaceShips = () => {
        const boardSize = 10;
        let isValid = true;
        const newPlayerConfig = createEmptyTable(); 

        console.log("Ship configurations:", shipConfigurations);

        shipConfigurations.forEach(ship => {
            const startX = ship.pozX.charCodeAt(0) - 65;
            const startY = ship.pozY - 1;
            const endX = ship.direction === 'HORIZONTAL' ? startX + ship.length - 1 : startX;
            const endY = ship.direction === 'VERTICAL' ? startY + ship.length - 1 : startY;

            if (endX >= boardSize || endY >= boardSize || startX < 0 || startY < 0) {
                isValid = false;
                console.log(`Invalid Position: Ship ${ship.shipId} is out of bounds.`);
                return;
            }

            // Check for overlap
            for (let i = 0; i < ship.length; i++) {
                const x = ship.direction === 'HORIZONTAL' ? startX + i : startX;
                const y = ship.direction === 'VERTICAL' ? startY + i : startY;
                if (newPlayerConfig[y][x] !== '') {
                    isValid = false;
                    console.log(`Overlap detected at position (${y}, ${x}) for ship ${ship.shipId}.`);
                }
                newPlayerConfig[y][x] = 'S'; 
            }
        });

        if (isValid) {
            setPlayerConfig(newPlayerConfig); 
            if (gameContext.game?.id) {
                sendMapConfig(auth.token, gameContext.game.id, newPlayerConfig)
                .then(() => {
                    console.log("Ships Placed: Waiting for opponent to place ships.");
                    setIsWaitingForOpponent(true); 
                    setShipsConfigured(true); 
                })
                .catch(error => {
                    console.error("Failed to send map configuration", error);
                });
            } else {
                console.log("Game ID is undefined");
            }
        }
        else {
            Alert.alert("Invalid Placement", `One or more ships are overlapping or out of bounds.`);
        }
    };

    
    
    const handleReplay = () => {
        setIsReplay(true);
        let newPlayerConfig = createEmptyTable();
        let newOpponentConfig = createEmptyTable();

        setPlayerConfigReplay(newPlayerConfig);
        setOpponentConfigReplay(newOpponentConfig);

        let index = 0;
        const moves = gameContext.game?.moves;
        if (!moves) {
            Alert.alert("No moves to replay");
            setIsReplay(false);
            return;
        }

        const intervalId = setInterval(() => {
            if (index < moves.length) {
                const move = moves[index];
                const pozX = move.x.charCodeAt(0) - 65;
                const pozY = move.y - 1;

                if (move.playerId === auth.id) {
                    newPlayerConfig[pozY][pozX] = move.result ? 'X' : 'M';
                } else {
                    newOpponentConfig[pozY][pozX] = move.result ? 'X' : 'M';
                }

                index++;
            } else {
                clearInterval(intervalId);
                setIsReplay(false);
            }

            setPlayerConfigReplay([...newPlayerConfig]);
            setOpponentConfigReplay([...newOpponentConfig]);
        }, 1000);
    }

    const handleStrike = async (cell: ICell) => {
        if (gameContext.game && gameContext.game.cuurentPlayerId === auth.id && gameContext.game.status === 'ACTIVE') {
            const cellcontent = playerConfigReplay[cell.y - 1][cell.x.charCodeAt(0) - 65];
            if(cellcontent === 'X' || cellcontent === 'O'){
                Alert.alert("Invalid Strike", "You cannot strike at a ship.");
                return;
            }

            strike(auth.token, gameContext.game?.id, cell.x, cell.y).then(() => {
                console.log("Strike sent");
                return gameContext.getGameDetails(route.params.gameId);
            }).then(() => {
                getOpponentConfig();
            }).catch(error => {
                console.error("Error sending strike", error);
            });
        }
    };

    const isParticipant = (auth.id === gameContext.game?.player1Id || auth.id === gameContext.game?.player2Id);
    const canConfigureShips = gameContext.game?.status === 'MAP_CONFIG' && isParticipant;

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
            {isReplay ? (
                <>
                    <Text style={styles.header}>Replay Mode</Text>
                    <View style={styles.board}>
                        <Table state={playerConfigReplay} />
                    </View>
                    <View style={styles.board}>
                        <Table state={opponentConfigReplay} />
                    </View>
                </>
            ) : (
                <>
                    {shipsConfigured ? (
                        <>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.header}>WAITING FOR OPPONENT TO CONFIGURE TABLE</Text>
                            <Text style={styles.header}>{gameContext.game.player1.email} vs {gameContext.game.player2?.email}</Text>
                        </>
                    ) : (
                        <>
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
                            {(gameContext.game.status === 'ACTIVE' || gameContext.game.status === 'MAP_CONFIG')&& auth.id !== gameContext.game.player1Id && auth.id !== gameContext.game.player2Id && (
                                <>
                                <Text style={styles.header}>{gameContext.game.player1.email} vs {gameContext.game.player2?.email}</Text>
                                </>
                            )}
                            {gameContext.game.status === 'ACTIVE' && (auth.id === gameContext.game.player1Id || auth.id === gameContext.game.player2Id) && (
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
                                            <Table state={opponentConfig} onCellClick={handleStrike}/>
                                        </View>
                                </View>
                                </>
                            )}
                        {canConfigureShips && (
                            <>
                                <Text style={styles.header}>Configure Your Ships</Text>
                                <View style={styles.board}>
                                    <Table state={playerConfig} />
                                </View>
                                {shipConfigurations.map((ship, index) => (
                                    <ShipMap
                                        key={index}
                                        shipId={ship.shipId}
                                        length={ship.length}
                                        onShipConfig={handleShipConfig}
                                    />
                                ))}
                                <Button onPress={validateAndPlaceShips}>
                                    <ButtonText>Place Ships</ButtonText>
                                </Button>
                            </>
                        )}
                        </>
                    )}
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

