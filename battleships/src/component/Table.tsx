import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity } from 'react-native';

interface ITable {
    state: string[][];
    onCellClick?: (cell: ICell) => void;
}

export interface ICell {
    x: string;
    y: number;
}

const Cell = styled(TouchableOpacity)`
    width: 35px;
    height: 35px;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
`;

const Row = styled.View`
    flex-direction: row;
`;

const TableContainer = styled.View`
    align-items: center;
    margin: 10px;
`;

const HeaderRow = styled(Row)`
    margin-bottom: 5px;
`;

const HeaderCell = styled.View`
    width: 35px;
    height: 35px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
`;

const HeaderText = styled.Text`
    font-weight: bold;
`;

const Table: React.FC<ITable> = ({ state, onCellClick }) => {
    const headerColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    return (
        <TableContainer>
            <HeaderRow>
                <HeaderCell />
                {headerColumns.map((column, index) => (
                    <HeaderCell key={index}>
                        <HeaderText>{column}</HeaderText>
                    </HeaderCell>
                ))}
            </HeaderRow>
            {state.map((row, rowIndex) => (
                <Row key={rowIndex}>
                    <HeaderCell>
                        <HeaderText>{rowIndex + 1}</HeaderText>
                    </HeaderCell>
                    {row.map((cell, columnIndex) => (
                        <Cell
                            key={columnIndex}
                            onPress={() => {
                                if (onCellClick) {
                                    onCellClick({ x: String.fromCharCode(65 + columnIndex), y: rowIndex + 1 });
                                }
                            }}
                        >
                            <Text>{cell}</Text>
                        </Cell>
                    ))}
                </Row>
            ))}
        </TableContainer>
    );
};

export default Table;
