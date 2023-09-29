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
                    <div class="m-box" :class="{ active: allActive }">
                        <div
                            :class="['u-box', '', { active: number === active }]"
                            v-for="(number, index) in boxList"
                            :key="index"
                            @click="change(number)"
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
                                    :src="item"
                                />
                                <img
                                    v-for="(item, index) in prizeList"
                                    :key="`prize_end${index}`"
                                    @load="onLoadPrizeList"
                                    :src="item"
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
                        <img :src="`${__imgRoot}random.png`" class="u-img random" alt="随机开盒" @click="openBox" />
                        <img :src="`${__imgRoot}open.png`" class="u-img open" alt="十连开盒" @click="openBox('all')" />
                        <!-- 中奖记录 -->
                        <div class="m-history box u-img" :class="history ? 'history' : 'close'">
                            <div class="m-title">
                                <img :src="`${__imgRoot}history.png`" alt="开盒记录" @click="openHistory" />
                                <img :src="`${__imgRoot}close.png`" class="u-close" alt="关闭" @click="closeHistory" />
                            </div>
                            <History :id="ID" :show="history" @update="showPrizes" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-goods" :class="{ active: hasPrize }">
            <div class="m-item">
                <div class="u-item box" v-for="(item, i) in myPrizes" :key="i">
                    <template v-if="item.prize_type == 'vip_asset'">
                        <img :src="`${__imgRoot}points.png`" />
                        <span>{{ item.vip_asset_once_give }}</span>
                    </template>
                    <template v-else>
                        <img :src="item.goods.goods_images[0]" />
                        <span>{{ item.goods.title }}</span>
                    </template>
                </div>
            </div>
            <img :src="`${__imgRoot}get.png`" class="u-get" alt="拿下" @click="hasPrize = false" />
        </div>
    </div>
</template>

<script>
const KEY = "blindbox";
import User from "@jx3box/jx3box-common/js/user";
import { getTopic } from "@/service/topic";
import { getBlindBox, goodLucky, getMyLucky } from "@/service/pay";
import { cloneDeep } from "lodash";
import History from "./History.vue";
export default {
    name: "Index",
    inject: ["__imgRoot"],
    data: function () {
        return {
            ID: 0,
            prizeList: [],
            points: 0,
            index: 0,

            animationDuration: "0s",
            active: "",
            allActive: false,
            boxList: new Array(10).fill(1).map((item, index) => index + 1),
            activeList: [],
            replay: 0,
            historyList: [],
            status: {
                0: "全部",
                1: "抽奖中",
                2: "中奖",
                3: "未中奖",
            },

            history: false,
            close: false,

            hasPrize: false,
            myPrizes: [],
        };
    },
    components: {
        History,
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
    mounted() {
        this.init();
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
                        const asset = {
                            point: `${this.__imgRoot}points.png`,
                            boxcoin: `${this.__imgRoot}boxcoin.png`,
                        };
                        this.prizeList = data.prize.map((item) => {
                            if (item.prize_type != "mall_goods" && asset[item.vip_asset_type])
                                return asset[item.vip_asset_type];
                            return item.mall_goods.goods_images[0];
                        });
                        this.refreshBox();
                    });
            });
        },
        // 显示抽奖盒子
        showBox(index) {
            return this.activeList.includes(index + 1);
        },
        // 刷新box
        refreshBox() {
            this.allActive = false;
            this.activeList = cloneDeep(this.boxList);
            this.replay++;
        },
        // 奖品滚动速度
        onLoadPrizeList() {
            // 根据给的奖品参数计算动画时间两份图只滚动一份，所以/100再/2
            this.animationDuration = `${this.$refs.scrollBlock.offsetWidth / 60}s`;
        },
        // 选择盒子抽奖
        change(number) {
            this.active = number;
            setTimeout(() => {
                this.activeList = this.activeList.filter((item) => item !== number);
                this.show_goods = true;
            }, 1800);
            this.hasLucky();
        },
        openHistory() {
            this.history = true;
        },
        closeHistory() {
            this.history = false;
        },
        // 打开盒子
        openBox(key) {
            if (key === "all") {
                this.allActive = true;
                setTimeout(() => {
                    this.activeList = [];
                }, 1800);
                this.hasLucky();
            } else {
                const number = this.activeList[Math.floor(Math.random() * this.activeList.length)];
                this.change(number);
            }
        },
        // 登录
        toLogin() {
            this.$confirm("参与抽奖必须登录, 是否登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                User.toLogin();
            });
        },
        // 抽奖
        hasLucky() {
            let batch = 1;
            if (this.allActive) batch = 10;
            goodLucky(this.ID, batch).then((res) => {
                const _id = res.data?.data.id;
                this.showPrizes(_id);
                this.allActive = false;
            });
        },
        // 显示中奖
        showPrizes(id) {
            if (!id) return;
            getMyLucky(id).then((res) => {
                this.myPrizes = res.data?.data.prizes || [];
                console.log(this.myPrizes);
                if (this.myPrizes.length) this.hasPrize = true;
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/blindbox/index.less";
</style>
