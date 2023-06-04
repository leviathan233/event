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
        <Paper
            v-for="(item, i) in paperList"
            :key="i"
            :paper="item"
            :showKey="showKey"
            :showId="showId"
            class="m-paper"
        />
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
                types: {
                    2023: exam2023,
                },
                showId: 1,
            };
        },
        watch: {
            pathId: {
                immediate: true,
                handler: function (id) {
                    Object.keys(this.type).forEach((index) => {
                        if (this.type[index].key == id) this.showId = index;
                    });
                },
            },
        },
        computed: {
            showKey() {
                return this.type[this.showId].key;
            },
            showColor() {
                return this.type[this.showId].color;
            },
            pathId() {
                return this.$route.query.paper;
            },
            year() {
                return this.$route.query.year;
            },
            type() {
                return this.types[this.year] ? this.types[this.year] : this.types["2023"];
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
                this.$router.push({ path: "/", query: { paper: this.type[i].key } });
                window.scrollTo(0, 0);
            },
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
