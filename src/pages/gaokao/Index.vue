<template>
    <div class="p-event-content">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <span class="u-title">切换试卷</span>
            <div class="m-list">
                <span v-for="(item, i) in type" :key="i" :class="['u-paper', { active: showId == i }]" @click="changeExam(i)">
                    {{ item.name }}
                </span>
            </div>
        </div>
        <Paper v-for="(item, i) in paperList" :key="i" :paper="item" :showKey="showKey" class="m-paper m-paper-left" />
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
                typeList: {},
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
                const last = this.showId - 1 == 0 ? Object.keys(this.type).length : this.showId - 1;
                return {
                    1: this.typeList[last],
                    2: this.typeList[this.showId],
                    3: this.typeList[this.showId + 1],
                };
            },
        },
        watch: {
            type: {
                immediate: true,
                handler: function (obj) {
                    this.typeList = cloneDeep(obj);
                },
            },
        },
        methods: {
            changeExam(i) {
                this.showId = i;
            },
         
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
