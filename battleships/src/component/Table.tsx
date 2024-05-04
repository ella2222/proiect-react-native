import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

interface ITable {
    state: string[][];
    onCellPress?: (cell: ICell) => void;
}

export interface ICell {
    x: string;
    y: number;
}

const Cell = styled.TouchableOpacity<ICell>`
    width: 25px;
    height: 25px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Row = styled.View`
    display: flex;
    flex-direction: row;
`

const TableContainer = styled.View`
    display: flex;
    flex-direction: column;
`

const Table: React.FC<ITable> = ({state, onCellPress}) => {
    return (
        <TableContainer>
            {state.map((row, i) => (
                <Row key={i}>
                    {row.map((cell, j) => (
                        <Cell onPress={() => {
                            if(onCellPress){
                                onCellPress({x: String.fromCharCode(65+j), y: i+1});

                            }
                        }} key={j} x={String.fromCharCode(65+j)} y={i}>
                            <Text>{cell}</Text>
                        </Cell>
                    ))}
                </Row>
            ))}
        </TableContainer>
    );
}