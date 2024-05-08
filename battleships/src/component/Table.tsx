import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity} from 'react-native';

interface ITable {
    state: string[][];
    onCellClick?: (cell: ICell) => void;
}

export interface ICell {
    x: string;
    y: number;
}

const Cell = styled.TouchableOpacity<ICell>`
    width: 50px;
    height: 50px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Row = styled.View`
    display: flex;
    flex-direction: row;
`

const Tablecont = styled.View`
    display: flex;
    flex-direction: column;
`

const Table: React.FC<ITable> = ({state, onCellClick}) => {
    return (
        <Tablecont>
            {state.map((row, i) => (
                <Row key={i}>
                    {row.map((cell, j) => (
                        <Cell onPress={() => {
                            if (onCellClick) {
                                onCellClick({x: String.fromCharCode(65 + j), y: i + 1});
                            }
                        }} key = {j} x={String.fromCharCode(65 + j)} y={i }>
                            <Text>{cell}</Text>
                        </Cell>
                    ))}
                </Row>
            ))}
        </Tablecont>
    )
}

export default Table;