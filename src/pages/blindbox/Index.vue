<template>
    <div class="p-event-blindbox">
        <!-- 判断是否登录，没有登录跳转登录 -->
        <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
        <!-- 模糊背景 -->
        <el-image :src="`${__imgRoot}bg.png`" class="m-bg" fit="cover" />
        <!-- 内容 -->
        <div class="p-event-content">
            <div class="m-content">
                <!-- 左侧 -->
                <div class="m-left">
                    <div class="logo">
                        <img :src="`${__imgRoot}logo.png`" alt="魔盒盲盒" />
                    </div>
                    <!-- 抽奖盒子 -->
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
                <!-- 右侧 -->
                <div class="m-right">
                    <!-- 积分现实 -->
                    <div class="m-point">{{ points }}</div>
                    <!-- 奖品轮播 -->
                    <div class="m-prize box">
                        <div class="m-title">
                            <img :src="`${__imgRoot}prize.png`" alt="奖品一览" />
                        </div>
                        <div class="m-item">
                            <div class="m-scroll-block" ref="scrollBlock" :style="{ animationDuration }">
                                <img
                                    v-for="(item, index) in prizeList"
                                    :key="`prize${index}`"
                                    @load="onLoadPrizeList"
                                    :src="item.url"
                                    :alt="item.name"
                                />
                                <img
                                    v-for="(item, index) in prizeList"
                                    :key="`prize_end${index}`"
                                    @load="onLoadPrizeList"
                                    :src="item.url"
                                    :alt="item.name"
                                />
                                <!--跑马灯效果需要展示两份图片以首尾衔接-->
                            </div>
                        </div>
                    </div>
                    <!-- 抽奖按钮 -->
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
const KEY = "blindbox";
import { getTopic } from "@/service/topic";
import { getBlindBox } from "@/service/pay";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Index",
    inject: ["__imgRoot"],
    data: function () {
        return {
            ID: 0,
            prizeList: [],
            points: 0,

            history: false,
            close: false,
            open: false,
            all: false,
            show_goods: false,
            active: "",
            replay: 0,
            activeList: [],

            animationDuration: "0s",
        };
    },
    computed: {
        data: function () {
            let _data = {};
            this.raw.forEach((item) => {
                if (!_data[item.subtype]) _data[item.subtype] = [];
                _data[item.subtype].push(item);
            });
            return _data;
        },
        isLogin() {
            return User.isLogin();
        },
    },
    watch: {
        isLogin: {
            immediate: true,
            handler: function (val) {
                val &&
                    User.getAsset().then((res) => {
                        this.points = res?.points || 0;
                    });
            },
        },
    },

    methods: {
        // 初始化，获取活动ID,并获取活动详情
        init() {
            getTopic(KEY).then((res) => {
                this.raw = res.data.data;
                this.ID = ~~this.data.ID[0].title;
                this.ID &&
                    getBlindBox(this.ID).then((res) => {
                        const data = res.data.data;
                        this.prizeList = data.prize;
                    });
            });
        },
        showBox(index) {
            return !this.activeList.includes(index);
        },
        // 刷新box
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
        toLogin() {
            this.$confirm("参与抽奖必须登录, 是否登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                User.toLogin();
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/blindbox/index.less";
</style>
