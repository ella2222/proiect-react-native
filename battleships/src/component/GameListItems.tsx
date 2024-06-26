// src/component/GameListItems.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { GameRouteNames } from '../router/route-names';
import { useGameContext } from '../hooks/gameContext';

const Container = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    elevation: 2;
`;

const StatusIndicator = styled.View<{ statusColor: string }>`
    width: 15px;
    height: 15px;
    border-radius: 7.5px;
    background-color: ${({ statusColor }) => statusColor};
`;

const TextWrapper = styled.View`
    flex: 1;
    margin-left: 10px;
`;

interface IGameListItems {
    id: string;
    status: string;
    otherPlayerEmail: string;
    onPress?: () => void;
    onJoin?: () => void;
}

const statusColors = {
    mapconfig: 'red',
    finished: 'black',
    active: 'orange',
    created: 'green',
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'map_config':
            return statusColors.mapconfig;
        case 'finished':
            return statusColors.finished;
        case 'active':
            return statusColors.active;
        case 'created':
            return statusColors.created;
        default:
            return 'black';
    }
};

const GameListItems: React.FC<IGameListItems> = ({ id, status, otherPlayerEmail, onPress }) => {
    const navigation = useNavigation<any>();
    const gameContext = useGameContext();

    return (
        <Container onPress={onPress}>
            <StatusIndicator statusColor={getStatusColor(status)} />
            <TextWrapper>
                <Text style={styles.text}>Game ID: {id}</Text>
                <Text style={styles.text}>Opponent: {otherPlayerEmail}</Text>
                <Text style={styles.text}>Status: {status}</Text>
            </TextWrapper>
        </Container>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: '#333',
    },
    joinButton: {
        padding: 8,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default GameListItems;
