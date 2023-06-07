<template>
    <div class="p-event-content">
        <div class="m-paper-box" :style="{ backgroundColor: showColor }">
            <img :src="`${__imgRoot}previous.png`" class="u-previous" @click="changeShow" />
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
            :showYear="showYear"
            class="m-paper"
        />

        <div class="m-change-paper" v-show="show" :style="{ backgroundColor: showColor }">
            <img class="u-close" :src="`${__imgRoot}close.svg`" @click="show = false" />
            <div class="m-title">往届考题</div>
            <div class="m-content">
                <span
                    v-for="(item, key) in types"
                    :key="key"
                    @click="changeYear(key)"
                    class="u-year"
                    :style="{ backgroundColor: showBackground, color: showFont }"
                    >{{ key }}</span
                >
            </div>
        </div>
        <div class="m-mark" v-show="show"></div>
    </div>
</template>

<script>
    import { exams } from "@/assets/data/exam.json";
    import Paper from "./Paper.vue";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: { Paper },
        data: function () {
            return {
                types: { ...exams },
                showId: 1,
                show: false,
                showYear: "2023",
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
            showBackground() {
                return this.type[this.showId].background;
            },
            showFont() {
                return this.type[this.showId].font;
            },
            pathId() {
                return this.$route.query.paper;
            },
            year() {
                return this.$route.query.year || this.showYear;
            },
            type() {
                return this.types[this.year];
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
            changeShow() {
                this.show = !this.show;
            },
            changeYear(year) {
                this.showYear = year;
                this.show = false;
                this.showId = 1;
                window.scrollTo(0, 0);
            },
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/2023exam/index.less";
    @import "~@/assets/css/2023exam/card.less";
</style>
