<template>
    <div class="p-event">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <span class="u-title">切换试卷</span>
            <div class="m-list">
                <span v-for="(item, i) in type" :key="i" :class="['u-paper', { active: showId == i }]" @click="jump(i)">
                    {{ item.name }}
                </span>
            </div>
        </div>
        <Paper v-for="(item, key) in type" :key="key" :paper="item" />
    </div>
</template>

<script>
    import { type } from "@/assets/data/exam.json";
    import { cloneDeep } from "lodash";
    import Paper from "./Paper.vue";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: { Paper },
        data: function () {
            return {
                type,
                showId: "1",
                year: "2023",
            };
        },

        computed: {
            showColor() {
                return this.type[this.showId].color;
            },
            typeList() {
                const obj = cloneDeep(this.type);
                delete obj[this.showId];
                Object.keys(obj).forEach((item) => {
                    if (item == this.showId) obj[item] = obj[this.showId];
                });
                return obj;
            },
        },
        methods: {
            changeExam(i) {
                this.showId = i;
            },
            jump(i) {
                console.log(i);
            },
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
