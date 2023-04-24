<template lang="pug">
.play
    button.check(@click="check" v-if="!won") Check
    Grid(
        :cells="cells"
        :won="won"
        :selected="editing"
        @selectedCell="clickCell"
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
import Grid from "../components/Grid.vue"
import { CellData, Coordinate, State, coordinatesToIndex, findWrongCells, isFilled, isWon } from '../services/sudoku'
import { persistence } from '@/services/persistence'



export default Vue.extend({
    components: {
        Grid
    },
    props: {
        puzzleId: String
    },
    data() {
        return {
            cells: [] as CellData[],
            editing: null as CellData | null,
            won: false
        }
    },
    mounted() {
        persistence.loadIfPresent(this.puzzleId).then(saved => {
            if (saved) {
                this.cells = saved.cellData
                this.won = isWon(this.cells)
            }
        })
    },
    methods: {
        async check() {
            const serialize = (cs: Coordinate) => `${cs.col}_${cs.row}`;
            const wrongCells = new Set<string>(findWrongCells(this.cells).map(serialize));
            if (wrongCells.size === 0 && isFilled(this.cells)) {
                this.won = true;
            } else {
                this.cells.forEach(cell => {
                    cell.wrong = wrongCells.has(serialize(cell.coordinates));
                })
            }
            await persistence.update(this.puzzleId, this.cells);
        },
        clickCell(cell: CellData) {
            if (cell.fixed || this.won) {
                return;
            }
            if (this.editing === cell) {
                this.editing = null;
            } else {
                this.editing = cell;
            }
        },
        async clickEditorValue(value: number) {
            if (this.editing) {
                if (this.editing.label === value) {
                    this.editing.label = null;
                } else {
                    this.editing.label = value;
                    if (isFilled(this.cells)) {
                        this.won = isWon(this.cells);
                        if (this.won) {
                            this.editing = null;
                        }
                    }
                }
            }
            await persistence.update(this.puzzleId, this.cells);
        },
        async clickEditorHint(value: number) {
            if (!this.editing) {
                return;
            }
            if (this.editing.hints.includes(value)) {
                this.editing.hints = this.editing.hints.filter(e => e !== value);
            } else {
                this.editing.hints = [...this.editing.hints, value];
            }
            await persistence.update(this.puzzleId, this.cells);
        }
    },
    computed: {
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
            return rs;
        },
        possibleValues(): number[] {
            const r = [];
            for (let i = 0; i < 9; i++) {
                r.push(i + 1);
            }
            return r;
        }
    }
})
</script>

<style lang="scss">
.play {
    display: flex;
    flex-direction: column;
    align-items: center;
    a, .check {
        margin-bottom: 1em;
    }
}

.cell-editor {
    margin-top: 1em;

    font-size: 16px;

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
}</style>
