export type Coordinate = { row: number; col: number; }
export type CellData = {
    coordinates: Coordinate;
    label: number | null;
    hints: number[];
    fixed: boolean;
    wrong: boolean;
}

export const isWon = (cellData: CellData[]): boolean => {
    return isFilled(cellData) && findWrongCells(cellData).length === 0;
}

export const isFilled = (cellData: CellData[]): boolean => {
    return cellData.every(e => e.label !== null);
}

export const findWrongCells = (cellData: CellData[]): Coordinate[] => {
    const getColumn = (column: number): CellData[] => {
        return cellData.filter(c => c.coordinates.col === column);
    }
    const getRow = (row: number): CellData[] => {
        return cellData.filter(c => c.coordinates.row === row);
    }
    const getSquare = (coords: Coordinate): CellData[] => {
        const corner = {
            row: coords.row - coords.row % 3,
            col: coords.col - coords.col % 3
        };
        return cellData.filter(e => {
            const c = e.coordinates;
            return c.col >= corner.col && c.col < corner.col + 3 &&
                   c.row >= corner.row && c.row < corner.row + 3
        })
    }
    const wrong = new Set<CellData>();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const log = row === 0 && col === 2;
            const cell = cellData.find(e => e.coordinates.row === row && e.coordinates.col === col)
            if (log) {
                console.log(JSON.stringify(cell));
            }
            if (!cell) {
                throw new Error("Cannot find cell " + JSON.stringify({row,col}))
            }
            if (cell.label === null) {
                continue;
            }
            for (const candidates of [getColumn(col), getRow(row), getSquare({row,col})]) {
                for (const candidate of candidates) {
                    if (cell !== candidate) {
                        if (cell.label === candidate.label) {
                            wrong.add(candidate);
                            wrong.add(cell);
                        }
                    }
                }
            }
        }
    }
    return [...wrong].filter(e => !e.fixed).map(e => e.coordinates);
}