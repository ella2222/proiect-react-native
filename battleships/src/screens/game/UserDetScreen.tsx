// src/screens/game/UserDetailsScreen.tsx
import React from 'react';
import styled from 'styled-components/native';
import { useAuth } from '../../hooks/authContext';
import { getUserDetails } from '../../api/Api';
import { Alert } from 'react-native';

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #f9f9f9;
    align-items: center;
    justify-content: center;
`;

const InfoText = styled.Text`
    font-size: 18px;
    margin: 10px;
    color: #333;
`;

const DetailsBox = styled.View`
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    width: 90%;
    shadow-color: #000;
    shadow-opacity: 0.1;
    shadow-radius: 5px;
    elevation: 3;
    align-items: center;
`;

const LogoutButton = styled.TouchableOpacity`
    margin-top: 20px;
    background-color: #dc3545;
    padding: 10px 20px;
    border-radius: 5px;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    text-align: center;
`;

const UserDetailsScreen = () => {
    const { email, id, logout, token } = useAuth();
    const [gamesWon, setGamesWon] = React.useState<number>(0);
    const [gamesLost, setGamesLost] = React.useState<number>(0);
    const [totalGames, setTotalGames] = React.useState<number>(0);

    const handleLogout = () => {
        logout()
        .then(() => {
            Alert.alert("Logout Success", "You have been logged out successfully.");
        })
        .catch(error => {
            console.error('Logout failed:', error);
            Alert.alert("Logout Error", "Failed to logout.");
        });
    };

    const fetchUserDetails = async () => {
        try {
            const userDetails = await getUserDetails(token);
            setGamesWon(userDetails.stats.gamesWon);
            setGamesLost(userDetails.stats.gamesLost);
            setTotalGames(userDetails.stats.totalGames);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            Alert.alert('Error', 'Failed to fetch user details.');
        }
    };

    return (
        <Container>
            <DetailsBox>
                <InfoText>Email: {email}</InfoText>
                <InfoText>User ID: {id}</InfoText>
                <LogoutButton onPress={handleLogout}>
                    <ButtonText>Logout</ButtonText>
                </LogoutButton>
            </DetailsBox>
        </Container>
    );
};

export default UserDetailsScreen;
