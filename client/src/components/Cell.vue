<template lang="pug">
.cell.unselectable(:class="[...classes, {clickable: !fixed, selected: selected}]")
    .hints.top
        .hint(v-for="hint in topHints" :key="id + hint.value" :class="{hidden: !hint.enabled}") {{ hint.value }}
    .core(v-html="visualLabel" :class="{fixed: fixed, wrong: wrong}")
    .hints.bottom
        .hint(v-for="hint in bottomHints" :key="id + hint.value" :class="{hidden: !hint.enabled}") {{ hint.value }}
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type Hint = {
    value: number;
    enabled: boolean;
}
export default Vue.extend({
    props: {
        label: {
            type: Number,
            required: false
        },
        hints: Array as PropType<number[]>,
        coordinates: Object as PropType<{row: number, col: number}>,
        fixed: Boolean,
        selected: Boolean,
        wrong: Boolean
    },
    data() {
        return {
            id: (crypto as any).randomUUID()
        };
    },
    computed: {
        visualLabel(): string {
            return (this.label || "&nbsp").toString()
        },
        classes(): string[] {
            const r = [];
            if (this.coordinates.row % 3 === 2 && this.coordinates.row < 8) {
                r.push("strong-bottom");
            }
            if (this.coordinates.col % 3 === 2 && this.coordinates.col < 8) {
                r.push("strong-right");
            }
            if (this.coordinates.row % 3 === 0 && this.coordinates.row > 0) {
                r.push("strong-top");
            }
            if (this.coordinates.col % 3 === 0 && this.coordinates.col > 0) {
                r.push("strong-left");
            }
            return r;
        },
        topHints(): Hint[] {
            const r = [];
            for (let i = 1; i <= 5; i++) {
                r.push({
                    value: i,
                    enabled: this.hints.includes(i)
                })
            }
            return r;
        },
        bottomHints(): Hint[] {
            const r = [];
            for (let i = 6; i <= 9; i++) {
                r.push({
                    value: i,
                    enabled: this.hints.includes(i)
                })
            }
            return r;
        }
    }
})
</script>

<style lang="scss">
$size: 2.4em;
.cell {
    .hints {
        position: absolute;
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        font-size: 11px;
        &.top {
            top: 0;
            left: 0;
        }
        &.bottom {
            bottom: 0;
            left: 0;
        }
        .hint.hidden {
            visibility: hidden;
        }
    }
    position: relative;
    .core {
        font-size: 16px;
        &.fixed {
            font-weight: bold;
        }
        &.wrong {
            color: red;
        }
    }
    &.selected {
        background-color: lightgrey;
    }
    width: $size;
    height: $size;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid grey;
    &.strong-bottom {
        border-bottom: 1px solid black;
    }
    &.strong-right {
        border-right: 1px solid black;
    }
    &.strong-top {
        border-top: 1px solid black;
    }
    &.strong-left {
        border-left: 1px solid black;
    }
}
</style>