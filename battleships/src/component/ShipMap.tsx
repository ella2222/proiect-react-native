import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Container = styled.View`
    flex: 1;
    padding: 20px;
    background-color: #fff; 
`;

const ShipPoz = styled.View<{ length: number }>`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    flex-direction: row;
    align-items: center; 
`;

const ShipDropdown = styled.View`
    flex: 1;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #007bff; 
    background-color: #f0f0f0;
`;

const DirectionButton = styled.TouchableOpacity`
    background-color: #007bff;
    padding: 10px;
    border-radius: 5px;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
`;

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        height: 90, 
    },
    pickerItem: {
        color: '#007bff',
        fontSize: 16,
        height: 90,
    },
});

const ShipMap = ({ shipId, length, onShipConfig }: { shipId: number, length: number, onShipConfig: any }) => {
    const [pozX, setPozX] = useState('A');
    const [pozY, setPozY] = useState(1);
    const [direction, setDirection] = useState("VERTICAL");

    const handlePositionChange = (newPozX: string, newPozY: number) => {
        setPozX(newPozX);
        setPozY(newPozY);
        onShipConfig({ shipId, pozX: newPozX, pozY: newPozY, direction });
    };

    const handleDirectionChange = () => {
        const newDirection = direction === "VERTICAL" ? "HORIZONTAL" : "VERTICAL";
        setDirection(newDirection);
        onShipConfig({ shipId, pozX, pozY, direction: newDirection });
    };

    return (
        <Container>
            <ShipPoz length={length}>
                <ShipDropdown>
                    <Picker
                        selectedValue={pozX}
                        onValueChange={(itemValue, itemIndex) => handlePositionChange(itemValue, pozY)}
                        mode="dropdown"
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)).map(letter => (
                            <Picker.Item key={letter} label={letter} value={letter} />
                        ))}
                    </Picker>
                </ShipDropdown>
                <ShipDropdown>
                    <Picker
                        selectedValue={pozY}
                        onValueChange={(itemValue, itemIndex) => handlePositionChange(pozX, itemValue)}
                        mode="dropdown"
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(number => (
                            <Picker.Item key={number} label={`${number}`} value={number} />
                        ))}
                    </Picker>
                </ShipDropdown>
                <DirectionButton onPress={handleDirectionChange}>
                    <ButtonText>{direction}</ButtonText>
                </DirectionButton>
            </ShipPoz>
        </Container>
    );
};

export default ShipMap;
