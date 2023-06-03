<template>
    <div class="p-event-content">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <span class="u-title">切换试卷</span>
            <div class="m-list">
                <span
                    v-for="(item, i) in type"
                    :key="i"
                    :class="['u-paper', { active: showId == i }]"
                    @click="changeExam(i)"
                >
                    {{ item.name }}
                </span>
            </div>
        </div> 
        <Paper v-for="(item, i) in paperList" :key="i" :paper="item" :showKey="showKey" class="m-paper" />
    </div>
</template>

<script>
    import { exam2023 } from "@/assets/data/exam.json";
    import Paper from "./Paper.vue";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: { Paper },
        data: function () {
            return {
                type: exam2023,
                showId: 1,
            };
        },

        computed: {
            showKey() {
                return this.type[this.showId].key;
            },
            showColor() {
                return this.type[this.showId].color;
            },
            paperList() {
                const id = ~~this.showId;
                const last = id - 1 == 0 ? Object.keys(this.type).length : id - 1;
                const next = id + 1 > 7 ? 1 : id + 1;
                return {
                    1: this.type[last],
                    2: this.type[id],
                    3: this.type[next],
                };
            },
        },
        methods: {
            changeExam(i) {
                this.showId = i;
                window.scrollTo(0, 0);
            },
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
