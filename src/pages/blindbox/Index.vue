<template>
    <div class="p-event-blindbox">
        <el-image :src="`${__imgRoot}bg.png`" class="m-bg" fit="cover" />
        <div class="p-event-content">
            <div class="m-content">
                <div class="m-left">
                    <div class="logo">
                        <img :src="`${__imgRoot}logo.png`" alt="魔盒盲盒" />
                    </div>
                    <div class="m-box">
                        <div
                            :class="['u-box', { active: index === active }]"
                            v-for="(item, index) in 10"
                            :key="item"
                            @click="change(index)"
                        >
                            <img
                                :class="`u-img u-img-${index + 1}`"
                                :src="`${__imgRoot}box.png`"
                                alt="奖品"
                                :key="replay + 'box' + index"
                                v-show="showBox(index)"
                            />
                        </div>
                        <div :class="['u-mark', { active }]"></div>
                    </div>
                </div>
                <div class="m-right">
                    <div class="m-point">9999</div>
                    <div class="m-prize box">
                        <div class="m-title">
                            <img :src="`${__imgRoot}prize.png`" alt="奖品一览" />
                        </div>
                        <div class="m-item">
                            <div class="m-scroll-block" ref="scrollBlock" :style="{animationDuration}">
                                <img v-for="(item, index) in prizeList" :key="`prize${index}`" @load="onLoadPrizeList" :src="item.url" :alt="item.name" />
                                <img v-for="(item, index) in prizeList" :key="`prize_end${index}`" @load="onLoadPrizeList" :src="item.url" :alt="item.name" />
                                <!--跑马灯效果需要展示两份图片以首尾衔接-->
                            </div>
                        </div>
                    </div>
                    <div class="m-lottery">
                        <img
                            :src="`${__imgRoot}refresh.png`"
                            class="u-img refresh"
                            @click="refreshBox"
                            alt="刷新盲盒"
                        />
                        <img :src="`${__imgRoot}random.png`" class="u-img random" alt="随机开盒" />
                        <img :src="`${__imgRoot}open.png`" class="u-img open" alt="十连开盒" />
                        <div class="m-history box u-img" :class="{ history, close }">
                            <div class="m-title">
                                <img :src="`${__imgRoot}history.png`" alt="开盒记录" @click="openHistory" />
                                <img :src="`${__imgRoot}close.png`" class="u-close" alt="关闭" @click="closeHistory" />
                            </div>
                            <div class="m-history-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-goods" :class="{ active: show_goods }">
            <div class="m-item">
                <div class="u-item box" v-for="item in 10" :key="item"></div>
            </div>
            <img :src="`${__imgRoot}get.png`" class="u-get" alt="拿下" @click="show_goods = false" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",
    inject: ["__imgRoot"],
    data: function () {
        return {
            history: false,
            close: false,
            open: false,
            all: false,
            show_goods: false,
            active: "",
            replay: 0,
            activeList: [],
            prizeList: [],
            animationDuration: '0s',
        };
    },
    computed: {},
    mounted() {
        this.prizeList = [];
    },
    methods: {
        showBox(index) {
            return !this.activeList.includes(index);
        },
        refreshBox() {
            this.activeList = [];
            this.replay++;
        },
        onLoadPrizeList() {
            // 根据给的奖品参数计算动画时间两份图只滚动一份，所以/100再/2
            this.animationDuration = `${this.$refs.scrollBlock.offsetWidth / 200}s`;
        },
        change(index) {
            this.active = ~~index;
            setTimeout(() => {
                this.activeList.push(~~index);
                this.show_goods = true;
                this.active = "";
            }, 1800);
        },
        openHistory() {
            this.history = true;
            this.close = false;
        },
        closeHistory() {
            this.history = false;
            this.close = true;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/blindbox/index.less";
</style>
