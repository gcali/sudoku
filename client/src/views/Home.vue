<template lang="pug">
.home
    button(@click="check") Check
    .grid
        .row(v-for="(row, index) in rows" :key="index")
            Cell(
                v-for="cell in row" 
                :key="cell.coordinates.col.toString() + cell.coordinates.row"
                :hints="cell.hints"
                :coordinates="cell.coordinates"
                :label="cell.label"
                :fixed="cell.fixed"
                :selected="cell === editing"
                :wrong="cell.wrong"
                @click.native="clickCell(cell)"
            )
    .cell-editor(v-if="editing")
        label Valore
        .value-editor
            .cell-value.clickable(
                v-for="value in possibleValues" 
                :key="value"
                @click="clickEditorValue(value)"
                :class="{ selected: value === editing.label }"
            ) {{ value }}
        label Possibili
        .value-editor
            .cell-value.clickable(
                v-for="value in possibleValues" 
                :key="value"
                @click="clickEditorHint(value)"
                :class="{ selected: editing.hints.includes(value)}"
            ) {{ value }}

</template>

<script lang="ts">
import Vue from 'vue'
import Cell from '../components/Cell.vue'
import { CellData, Coordinate, findWrongCells } from '../services/sudoku'

type State = {
puzzle: string, cellData: CellData[]
}

const serializeState = (state: State): string => {
    return JSON.stringify(state);
}

const deserializeState = (state: string): State  => {
    return JSON.parse(state);
}

const loadIfPresent = (): State | null => {
    const raw = localStorage.getItem("state");
    if (raw) {
        return deserializeState(raw);
    }
    return null;
}

const save = (state: State) => {
    const raw = serializeState(state);
    localStorage.setItem("state", raw);
}

const coordinatesToIndex = (c: Coordinate): number => {
    return c.row * 9 + c.col;
}

const storedToCellData = (stored: string): CellData[] => {
    return stored.split("").map((e, index) => {
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

const basicPuzzle = "41--75-----53--7--2-36-81--7-9--25-1-3--9-47--2-1-7---6587--9-----26-8--1925---47";

export default Vue.extend({
    components: {
        Cell
    },
    data() {
        return {
            puzzle:basicPuzzle,
            cells: storedToCellData(basicPuzzle),
            editing: null as CellData | null
        }
    },
    mounted() {
        const saved = loadIfPresent();
        if (saved) {
            this.puzzle = saved.puzzle;
            this.cells = saved.cellData;
        }
    },
    methods: {
        check() {
            const serialize = (cs: Coordinate) => `${cs.col}_${cs.row}`;
            const wrongCells = new Set<string>(findWrongCells(this.cells).map(serialize));
            this.cells.forEach(cell => {
                cell.wrong = wrongCells.has(serialize(cell.coordinates));
            })
            save(this.state);
        },
        clickCell(cell: CellData) {
            if (cell.fixed) {
                return;
            }
            if (this.editing === cell) {
                this.editing = null;
            } else {
                this.editing = cell;
            }
        },
        clickEditorValue(value: number) {
            if (this.editing) {
                if (this.editing.label === value) {
                    this.editing.label = null;
                } else {
                    this.editing.label = value;
                }
            }
            save(this.state);
        },
        clickEditorHint(value: number) {
            if (!this.editing) {
                return;
            }
            if (this.editing.hints.includes(value)) {
                this.editing.hints = this.editing.hints.filter(e => e !== value);
            } else {
                this.editing.hints = [...this.editing.hints, value];
            }
            save(this.state);
        }
    },  
    computed: {
        state(): State {
            return {
                puzzle: this.puzzle,
                cellData: this.cells
            };
        },
        rows(): CellData[][] {
            const rs = [];
            for (let row = 0; row < 9; row++) {
                const rowData: CellData[] = [];
                for (let col = 0; col < 9; col++) {
                    const cell = this.cells[coordinatesToIndex({ row, col })];
                    rowData.push(cell);
                }
                rs.push(rowData);
            }
            console.log(rs);
            return rs;
        },
        possibleValues(): number[] {
            const r = [];
            for (let i = 0; i < 9; i++) {
                r.push(i+1);
            }
            return r;
        }
    }
})
</script>

<style lang="scss">
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.grid {
    display: flex;
    flex-direction: column;
    border: 1px solid black;

    .row {
        display: flex;
        flex-direction: row;
    }
}
.cell-editor {
    margin-top: 1em;
    .value-editor {
        display: flex;
        .cell-value {
            &:not(:last-child) {
                margin-right: 0.5em;
            }
            border: 1px solid grey;
            padding: 0.2em 0.5em;
            &.selected {
                background-color: lightgrey;
            }
        }
    }
}
</style>
