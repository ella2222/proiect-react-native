import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

const Container = styled.TouchableOpacity<{color: string}>`
    padding: 10px;
    border: 1px solid ${({color}) => color};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    margin: 10px;
`


export interface IGameListItems{
    id: string;
    onPress?: () => void;
    status: string;
    color: string;
    player1email: string;
}

const GameListItems: React.FC<IGameListItems> = ({id, onPress, status, color, player1email}) => {
    return (
        <Container onPress={onPress} color={color}>
            <Text>{id}</Text>
            <Text>{status}</Text>
            <Text>{player1email}</Text>
        </Container>
    );
}

export default GameListItems;