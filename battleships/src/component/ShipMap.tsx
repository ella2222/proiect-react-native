import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Text, Button, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ShipPoz = styled.View<{length: number}>`
    width: 100%;
    padding: 20px;
    margin-bottom: 20px;
`;

const ShipDropdown = styled(Picker)`
    width: 100%;
    height: 50px;
    background-color: #f9f9f9;
    border: 1px solid #333;
`;

const DirectionButton = styled(TouchableOpacity)`
    width: 100%;
    height: 50px;
    background-color: #007bff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;
const ButtonText = styled.Text`
    color: white;
    font-size: 16px;
`;

const ShipMap: React.FC<{shipId: number, length: number, onShipConfig:any}> = ({shipId, length, onShipConfig}) => {
    const [pozX, setPozX] = useState<string>('A');
    const [pozY, setPozY] = useState<number>(1);
    const [direction, setDirection] = useState<string>("VERTICAL");

    const toggleDirection = () => {
        setDirection(direction === "VERTICAL" ? "HORIZONTAL" : "VERTICAL");
    };

    const sendConfig = () => {
        const config = {
            shipId,
            pozX,
            pozY,
            length,
            direction
        }
        onShipConfig(config);
    };
    
    useEffect(() => {
        sendConfig();
    }, [pozX, pozY, direction]);


    async function onValueChangeX(value: string) {
        setPozX(value);
    }

    async function onValueChangeY(value: number) {
        setPozY(value);
    }

    async function onValueChangeDirection(value: string) {
        setDirection(value);
    }

    return (
        <ShipPoz length={length}>
            <ShipDropdown
                selectedValue={pozX}
                onValueChange={(itemValue: any) => {
                    setPozX(itemValue);
                }}
            >
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
                <Picker.Item label="D" value="D" />
                <Picker.Item label="E" value="E" />
                <Picker.Item label="F" value="F" />
                <Picker.Item label="G" value="G" />
                <Picker.Item label="H" value="H" />
                <Picker.Item label="I" value="I" />
                <Picker.Item label="J" value="J" />
            </ShipDropdown>
            <ShipDropdown
                selectedValue={pozY}
                onValueChange={(itemValue: any) => {
                    setPozY(itemValue);
                }}
            >
                <Picker.Item label="1" value={1} />
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
                <Picker.Item label="5" value={5} />
                <Picker.Item label="6" value={6} />
                <Picker.Item label="7" value={7} />
                <Picker.Item label="8" value={8} />
                <Picker.Item label="9" value={9} />
                <Picker.Item label="10" value={10} />
            </ShipDropdown>

            <DirectionButton onPress={toggleDirection}>
                <ButtonText>{direction}</ButtonText>

            </DirectionButton>
        </ShipPoz>
    );

}

export default ShipMap;