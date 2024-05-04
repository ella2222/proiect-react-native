import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./authContext";
import { getGameDetails, getGamebyid } from "../api/Api";

enum GameStatus {
    CREATED = "CREATED",
    MAP_CONFIG = "MAP_CONFIG",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

interface User {
    id: string;
    email: string;
}

interface Move {
    id: string;
    x: string;
    y: number;
    gameId: string;
    playerId: string;
    result: boolean;
}

interface Shipcoord {
    id: string;
    x: string;
    y: number;
    gameId: string;
    playerId: string;
    hit: boolean;
}

interface Game {
    id: string;
    status: GameStatus;
    player1: User;
    player2: User;
    player1Id: string;
    player2Id: string;
    cuurentPlayerId: string;
    moves: Move[];
    shipCoords?: Shipcoord[];
}

interface IGameContext {
    game: Game | null;
    getGame: (id: string) => Promise<void>;
}

const Context = createContext<IGameContext>({
    getGame: () => Promise.resolve(),
    game: null
});

export const GameContext: React.FC<{children: React.ReactNode}> = ({children}) => {
    const auth = useAuth();
    const [game, setGame] = useState<Game | null>(null);

    const handleloadGame = async (id: string) => {
        try {
            const game = await getGamebyid(auth.token, id);
            setGame(game);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Context.Provider value={{
            game,
            getGame: handleloadGame
        }}>
            {children}
        </Context.Provider>
    );
}

export const useGameContext = () => useContext(Context);
        