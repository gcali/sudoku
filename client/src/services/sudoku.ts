import { getSudoku } from "sudoku-gen";
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

export type Coordinate = { row: number; col: number; }
export type CellData = {
    coordinates: Coordinate;
    label: number | null;
    hints: number[];
    fixed: boolean;
    wrong: boolean;
}

export type State = {
    puzzle: string,
    difficulty: string,
    cellData: CellData[]
}

export type SudokuState = "empty" | "won" | "started";

export type SudokuSummary = {
    id: string;
    difficulty: string;
    creationDate: Date;
    updateDate: Date;
    state: SudokuState;
}

export type FullSudoku = {
    summary: SudokuSummary;
    state: State;
}

const puzzleToCellData = (puzzle: string): CellData[] => {
    return puzzle.split("").map((e, index) => {
        const coordinates = {
            row: Math.floor(index / 9),
            col: index % 9
        };
        return {
            coordinates,
            hints: [],
            label: e === "-" ? null : parseInt(e, 10),
            fixed: e !== "-",
            wrong: false
        };
    })
}


export const generateSudoku = (difficulty: Difficulty): FullSudoku => {
    const id = btoa((crypto as any).randomUUID());
    const puzzle = getSudoku(difficulty);
    const date = new Date();
    return {
        summary: {
            creationDate: date,
            difficulty,
            id,
            updateDate: date,
            state: "empty"
        },
        state: {
            cellData: puzzleToCellData(puzzle.puzzle),
            difficulty,
            puzzle: puzzle.puzzle
        }
    }
}


export const coordinatesToIndex = (c: Coordinate): number => {
    return c.row * 9 + c.col;
}

export const indexToCoordinates = (index: number): Coordinate => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    return { row, col };
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