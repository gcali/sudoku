<template lang="pug">
.home
    .actions
        button(@click="createPuzzle") Create
    .summaries
        .summary.clickable(
            v-for="summary in summaries" :key="summary.id"
            @click="select(summary)"
        )
            .difficulty {{ summary.difficulty }}
            .date {{ showDate(summary.updateDate) }}
            .date {{ showTime(summary.updateDate) }}
            .state {{ summary.state }}
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

import {persistence} from "../services/persistence";
import {SudokuSummary, generateSudoku} from "../services/sudoku";
import { formatDate, formatTime } from "@/services/date";

export default Vue.extend({
    data() {
        return {
            summaries: [] as SudokuSummary[]
        }
    },
    mounted() {
        persistence.init().then(() => {
            persistence.getList().then(e => this.summaries = e);
        })
    },
    methods: {
        select(s: SudokuSummary) {
            this.$router.push({name: "play", params: {puzzleId: s.id}} )
        },
        showDate(d: Date) {
            return formatDate(d);
        },
        showTime(d: Date) {
            return formatTime(d);
        },
        async createPuzzle() {
            await persistence.addNew(generateSudoku("easy"));
            this.summaries = await persistence.getList();
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
.summaries {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 50em;
    .summary {
        border: 1px solid grey;
        padding: 1em 2em;
        margin: 0.5em 1em;
    }
}
</style>