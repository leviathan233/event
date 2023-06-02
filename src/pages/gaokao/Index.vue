<template>
    <div class="p-event-content">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <span class="u-title">切换试卷</span>
            <div class="m-list">
                <span v-for="(item, i) in type" :key="i" :class="['u-paper', { active: showId == i }]" @click="jump(i)">
                    {{ item.name }}
                </span>
            </div>
        </div>
        <div :class="`m-paper m-paper-${key}`" v-for="(item, key) in paperList" :key="key">
            <Paper :paper="item" />
        </div>
    </div>
</template>

<script>
    import { postStat } from "@jx3box/jx3box-common/js/stat.js";
    import { getPaper } from "@/service/exam.js";
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
            loadData() {
                Object.keys(this.type).forEach((type) => {
                    const id = this.type[type].key;
                    getPaper(id).then((res) => {
                        let data = res.data;

                        // 发送统计
                        postStat("paper", id);

                        data.tags = JSON.parse(data.tags);
                        data.questionDetailList =
                            data?.questionDetailList?.map((item) => {
                                item.options = JSON.parse(item.options);
                                item.tags = JSON.parse(item.tags);

                                return item;
                            }) || [];
                        this.typeList[type].data = data;

                        this.typeList[type].list =
                            data?.questionDetailList?.map((item) => {
                                return {
                                    list: item,
                                };
                            }) || [];
                    });
                });
            },
            changeExam(i) {
                this.showId = i;
            },
            jump(i) {
                console.log(i);
            },
        },
        mounted() {
            this.loadData();
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
