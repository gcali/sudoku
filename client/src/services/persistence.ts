import { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { CellData, Coordinate, FullSudoku, State, SudokuState, SudokuSummary, generateSudoku, indexToCoordinates, isWon } from "./sudoku";

export type PackedState = string;

const pack = (state: State): PackedState => {
    const basePacked = {
        puzzle: state.puzzle,
        difficulty: state.difficulty,
        cellData: state.cellData.map(cell => ({
            l: cell.label || 0,
            h: cell.hints,
            f: cell.fixed && 1 || 0,
            w: cell.wrong && 2 || 0
        })).map(e => `${e.l}_${e.h.join("")}_${e.f | e.w}`).join("|")
    };
    return `v1$${basePacked.puzzle}$${basePacked.difficulty}$${basePacked.cellData}`;
}

const unpack = (basePacked: PackedState): State | null => {
    const [version, puzzle, difficulty, rawCellData] = basePacked.split("$");

    if (version !== serializedVersion) {
        return null;
    }

    const cellData = rawCellData.split("|").map((token, index) => {
        const [l, h, rawFlags] = token.split("_");
        const flags = parseInt(rawFlags, 10);
        const fixed = Boolean(flags & 1);
        const wrong = Boolean(flags & 2) && !fixed;
        const label = parseInt(l, 10) || null;
        const hints = h.split("").map(e => parseInt(e, 10));
        return {
            label,
            fixed,
            wrong,
            hints,
            coordinates: indexToCoordinates(index)
        }
    });

    return {
        puzzle: puzzle,
        difficulty: difficulty,
        cellData
    };
}

export const serializeState = (state: State): string => {
    const packed = pack(state);
    return packed;
}

export const deserializeState = (state: string): State | null => {
    return unpack(state);
}

const serializedVersion = "v1"

const summaryKey = "list";

type Task = {
    type: "syncList"
} | {
    type: "syncSoduku";
    id: string;
};

const sortList = (summaries: SudokuSummary[]): SudokuSummary[] => {
    return summaries.sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime());
}

const taskKey = "tasks";

class TaskHandler {

    private hasStarted = false;

    public start = () => {
        if (!this.hasStarted) {
            this.hasStarted = true;
            this.handleTask();
        }
    }

    private handleTask = () => {
        let handled = 0;
        console.log("Starting handling...");
        while (true) {
            const task = this.getTask();
            if (task === null) {
                break;
            }
            handled++;
            console.log(task);
        }
        console.log("Finished handling, tasks: " + handled);
        setTimeout(this.handleTask, 30000);
    }

    private getList = (): Task[] => {
        const raw = localStorage.getItem(taskKey);
        if (!raw) {
            return [];
        }
        const tasks: Task[] = JSON.parse(raw);
        return tasks;
    }

    private saveList = (tasks: Task[]): void => {
        localStorage.setItem(taskKey, JSON.stringify(tasks));
    }


    getTask = (): Task | null => {
        const list = this.getList();
        const task = list.pop();
        if (!task) {
            return null;
        }
        this.saveList(list);
        return task;
    }

    addTask = (task: Task): void => {
        const list = this.getList();
        const matching = list.filter(l => l.type === task.type && (task.type === "syncList" || (l.type === "syncSoduku" && task.id === l.id)));
        if (matching.length > 0) {
            return;
        }
        list.push(task);
        this.saveList(list);
    }

}

export const taskHandler = new TaskHandler();
taskHandler.start();

// const basicPuzzle = "41--75-----53--7--2-36-81--7-9--25-1-3--9-47--2-1-7---6587--9-----26-8--1925---47";

const calculateState = (cellData: CellData[]): SudokuState => {
    const isEmpty = cellData.filter(e => !e.fixed).filter(e => e.label !== null).length === 0;
    if (isEmpty) {
        return "empty";
    }
    const isFinished = isWon(cellData);
    if (isFinished) {
        return "won";
    }
    return "started";
}

const localStorageWrapper = {
    saveSudoku(puzzleId: string, state: State) {
        localStorage.setItem("sudoku_" + puzzleId, serializeState(state));
        taskHandler.addTask({
            type: "syncSoduku",
            id: puzzleId
        });
    },
    loadSudoku(puzzleId: string): State | null {
        const raw = localStorage.getItem("sudoku_" + puzzleId);
        if (!raw) {
            return null;
        }
        return deserializeState(raw);
    },
    saveList(summaries: SudokuSummary[]) {
        const serialized = JSON.stringify(summaries);
        localStorage.setItem(summaryKey, serialized);
        taskHandler.addTask({ type: "syncList" });
    },
    getList(): SudokuSummary[] {
        const list = localStorage.getItem(summaryKey);
        if (!list) {
            //TODO: integrate with BE
            return [];
        }
        const res = JSON.parse(list).map((e: any) => ({
            ...e,
            updateDate: new Date(e.updateDate),
            creationDate: new Date(e.creationDate)
        })) as SudokuSummary[];
        return res;
    }
}

export const persistence = {
    async init() {
        if (!localStorage.getItem(summaryKey)) {
            const full = generateSudoku("easy");
            this.addNew(full);
        }
    },
    async addNew(sudoku: FullSudoku) {
        await this.addToList(sudoku.summary);
        await this.save(sudoku);
    },
    async save(sudoku: FullSudoku) {
        const {cellData, difficulty, puzzle} = sudoku.state;
        localStorageWrapper.saveSudoku(sudoku.summary.id, {
            cellData,
            difficulty,
            puzzle
        });
        sudoku.summary.state = calculateState(sudoku.state.cellData);
        await this.updateList(sudoku.summary);
    },
    async update(puzzleId: string, cellData: CellData[]) {
        const existing = await this.loadIfPresent(puzzleId);
        if (!existing) {
            throw new Error("Could not find puzzle " + puzzleId);
        }
        existing.cellData = cellData;
        localStorageWrapper.saveSudoku(puzzleId, existing);
        const listExisting = await this.getList().then(e => e.find(x => x.id === puzzleId));
        if (listExisting) {
            const newState = calculateState(cellData);
            listExisting.state = newState;
            await this.updateList(listExisting);
        }
    },
    async addToList(summary: SudokuSummary) {
        const list = await this.getList();
        list.push(summary);
        await this.saveList(list);
    },
    async saveList(summaries: SudokuSummary[]) {
        localStorageWrapper.saveList(summaries);
    },
    async updateList(newSummary: SudokuSummary) {
        const list = await this.getList();
        const existing = list.find(e => e.id === newSummary.id);
        if (!existing) {
            await this.addToList({
                ...newSummary,
                updateDate: new Date()
            });
        } else {
            existing.state = newSummary.state;
            existing.updateDate = new Date();
            await this.saveList(list);
        }
    },
    async loadIfPresent(id: string | null = null): Promise<State | null> {
        if (id === null) {
            const [top] = await this.getList();
            if (!top) {
                return null;
            }
            id = top.id;
        }
        return localStorageWrapper.loadSudoku(id);
    },
    async getList(): Promise<SudokuSummary[]> {
        const res = localStorageWrapper.getList();
        return sortList(res);
    }
}