<template>
    <div class="p-event">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <span class="u-title">切换试卷</span>
            <div class="m-list">
                <span v-for="(item, i) in type" :key="i" :class="['u-paper', { active: showId == i }]">{{
                    item.name
                }}</span>
            </div>
        </div>
        <div class="m-index" :style="{ backgroundColor: item.color }" v-for="(item, key) in type" :key="key">
            <div class="m-header">
                <img :src="__imgRoot + 'text2.svg'" class="u-text u-text-1" alt="全力以赴" />
                <img :src="__imgRoot + 'text.svg'" class="u-text u-text-2" alt="2023剑三高考卷" />
            </div>
            <div class="m-exam">
                <div class="m-title">{{ showName }}</div>
                <div class="m-content" v-loading="loading">
                    <ExamCard
                        v-for="(item, index) in list"
                        :key="item.id"
                        :item="item.list"
                        :index="index + 1"
                        :answer="item.answer"
                        :isSubmitted="isSubmitted"
                        @changeVal="finalAnswer"
                    />
                    <div class="m-exam-submit" @click="submit" :class="{ isSubmitted }">
                        <el-button class="u-btn" :disabled="isSubmitted">提交</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { postStat } from "@jx3box/jx3box-common/js/stat.js";
    import { type } from "@/assets/data/exam.json";
    import { cloneDeep } from "lodash";
    import ExamCard from "./ExamCard.vue";
    import { getPaper, submitAnswer } from "@/service/exam.js";
    import User from "@jx3box/jx3box-common/js/user";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: { ExamCard },
        data: function () {
            return {
                type,
                showId: "1",
                year: "2023",

                data: {},
                list: [],
                answer: "",
                score: "",
                userAnswers: {},
                isSubmitted: false,
                loading: false,
            };
        },

        computed: {
            id() {
                return this.type[this.showId].key;
            },
            showName() {
                return this.type[this.showId].name;
            },
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
            loadData() {
                this.loading = true;

                getPaper(this.id)
                    .then((res) => {
                        let data = res.data;

                        // 发送统计
                        postStat("paper", this.id);

                        data.tags = JSON.parse(data.tags);
                        data.questionDetailList =
                            data?.questionDetailList?.map((item) => {
                                item.options = JSON.parse(item.options);
                                item.tags = JSON.parse(item.tags);

                                return item;
                            }) || [];
                        this.data = data;

                        this.list =
                            data?.questionDetailList?.map((item) => {
                                return {
                                    list: item,
                                };
                            }) || [];
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            finalAnswer(val) {
                this.userAnswers = {
                    ...this.userAnswers,
                    ...val,
                };
            },
            submit() {
                if (!User.isLogin()) return this.$message.error("请先登录");
                if (!Object.keys(this.userAnswers).length) {
                    this.$alert("不能交白卷哦~", "提交失败", {
                        type: "error",
                    });
                } else {
                    let list = this.data.questionDetailList;
                    let obj = this.userAnswers;
                    let submitList = {};
                    for (const key in obj) {
                        const item = list.find((l) => l.id === ~~key);
                        submitList[key] = obj[key].map((o) => item.options[o]);
                    }
                    let userAnswers = [];
                    for (let i in this.userAnswers) {
                        userAnswers.push({
                            id: [i],
                            myAnswer: this.userAnswers[i].sort(),
                        });
                    }
                    submitAnswer(this.id, submitList, true).then((res) => {
                        if (res.data.score) {
                            document.documentElement.scrollTop = 0;
                            const paper = res.data.paper;
                            this.list = this.list.map((item) => {
                                let answer = paper.questionDetailList.find((q) => q.id === item.list.id);
                                answer.answerList = answer.answerList.sort();
                                const myAnswer = userAnswers.find((q) => q.id == answer.id);
                                item.answer = { ...answer, ...myAnswer };
                                return item;
                            });
                            this.score = String(res.data.score.score);
                            this.isSubmitted = true;
                        }
                    });
                }
            },
            changeExam(i) {
                this.showId = i;
            },
        },
        watch: {
            id() {
                this.loadData();
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
