<template lang="pug">
.grid
    .row(v-for="(row, index) in rows" :key="index")
        Cell(
            v-for="cell in row" 
            :key="cell.coordinates.col.toString() + cell.coordinates.row"
            :hints="cell.hints"
            :coordinates="cell.coordinates"
            :label="cell.label"
            :fixed="cell.fixed"
            :selected="cell === selected"
            :wrong="cell.wrong"
            :won="won"
            @click.native="$emit('selectedCell', cell)"
        )

</template>

<script lang="ts">

import { CellData, coordinatesToIndex } from "@/services/sudoku";
import Vue, { PropType } from "vue";
import Cell from './Cell.vue'

export default Vue.extend({
    components: {
        Cell
    },
    props: {
        cells: {
            type: Array as PropType<CellData[]>,
            required: true
        },
        won: Boolean,
        selected: Object as PropType<CellData>
    },
    computed: {
        rows(): CellData[][] {
            const rs = [];
            if (this.cells.length === 0) {
                return [];
            }
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
    }
});
</script>

<style lang="scss">
.grid {
    display: flex;
    flex-direction: column;
    border: 1px solid black;

    .row {
        display: flex;
        flex-direction: row;
    }
}

</style>