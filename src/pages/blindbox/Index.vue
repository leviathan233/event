<template>
    <div class="p-event-blindbox">
        <!-- 模糊背景 -->
        <el-image :src="`${__imgRoot}bg.jpg`" class="m-bg" fit="cover" />
        <!-- 内容 -->
        <div class="p-event-content">
            <div class="m-content">
                <!-- 左侧 -->
                <div class="m-left">
                    <div class="logo">
                        <img :src="`${__imgRoot}logo.svg`" alt="魔盒盲盒" />
                        <el-tooltip effect="light" placement="right-start">
                            <img class="u-info" :src="`${__imgRoot}desc.png`" alt="活动说明" />
                            <div class="m-blindbox-info" slot="content">
                                <h2>活动说明：</h2>
                                <span>1.点击盲盒或者右侧按钮可以打开盲盒，每次消耗一定数量的银铛；</span>
                                <span>2.虚拟奖品奖励将实时到账，请注意查收站内信息；</span>
                                <span>3.实体奖品需要填写收件信息，并在中奖后7个工作日内发货，请耐心等待；</span>
                                <span>4.本活动最终解释权归魔盒团队所有。</span>
                            </div>
                        </el-tooltip>
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
                                :src="`${__imgRoot}box.svg`"
                                alt="奖品"
                                :key="replay + 'box' + index"
                                v-show="showBox(index)"
                            />
                        </div>
                        <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                        <div class="u-mark" :class="{ active: mark || !activeList.length }"></div>
                    </div>
                </div>
                <!-- 右侧 -->
                <div class="m-right">
                    <!-- 积分现实 -->
                    <div class="m-point">{{ points }}</div>
                    <!-- 奖品 -->
                    <div class="m-prize box">
                        <div class="m-title">
                            <img :src="`${__imgRoot}prize.png`" class="u-prize" alt="奖品一览" />
                        </div>
                        <!-- 展示奖品 -->
                        <div class="m-scroll">
                            <div class="m-scroll-box" ref="scroll">
                                <a
                                    :href="aLink(item)"
                                    v-for="(item, index) in prizeList"
                                    :key="index"
                                    target="_blank"
                                    :data-index="index"
                                    class="m-item"
                                >
                                    <img :src="item.img" />
                                </a>
                                <a
                                    :href="aLink(item)"
                                    v-for="(item, index) in prizeList"
                                    :key="'v' + index"
                                    target="_blank"
                                    :data-index="index"
                                    class="m-item"
                                >
                                    <img :src="item.img" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- 抽奖按钮 -->
                    <div class="m-lottery" v-if="draw.length">
                        <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                        <img
                            :src="`${__imgRoot}refresh.svg`"
                            class="u-img refresh"
                            @click="refreshBox"
                            alt="刷新盲盒"
                        />
                        <div
                            class="m-random u-img"
                            :class="{ disabled: !activeList.length || points < draw[0][1] }"
                            @click="openBox"
                        >
                            <span class="u-price"> x {{ draw[0][0] }}</span>
                        </div>
                        <div
                            class="m-open u-img"
                            :class="{ disabled: !activeList.length || points < draw[1][1] }"
                            @click="openBox('all')"
                        >
                            <span class="u-price u-discount"> x {{ draw[1][1] }}</span>
                            <span class="u-price"> x {{ draw[0][1] * 10 }}</span>
                        </div>
                        <!-- 中奖记录 -->
                        <div class="m-history box u-img" :class="history ? 'history' : 'close'">
                            <div class="m-title">
                                <img
                                    :src="`${__imgRoot}history.png`"
                                    class="u-history"
                                    alt="开盒记录"
                                    @click="openHistory"
                                />
                                <img
                                    :src="`${__imgRoot}close.png`"
                                    width="42px"
                                    class="u-close"
                                    alt="关闭"
                                    @click="closeHistory"
                                />
                            </div>
                            <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
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
                        <img class="u-img" :src="`${__imgRoot}points.png`" />
                        <span>{{ item.vip_asset_once_give + asset[item.vip_asset_type] }}</span>
                    </template>
                    <template v-if="item.prize_type == 'thanks'">
                        <img class="u-img" :src="`${__imgRoot}thanks.png`" />
                        <span>感谢参与</span>
                    </template>
                    <template v-if="item.prize_type == 'mall_goods'">
                        <img class="u-img" :src="item.goods.goods_images[0]" />
                        <span>{{ item.goods.title }}</span>
                    </template>
                </div>
            </div>
            <img :src="`${__imgRoot}${history ? 'ok' : 'get'}.png`" class="u-get" alt="拿下" @click="closePrize" />
        </div>
    </div>
</template>

<script>
let x = 0;
const KEY = "blindbox";
import User from "@jx3box/jx3box-common/js/user";
import { getTopic } from "@/service/topic";
import { getBlindBox, goodLucky, getMyLucky } from "@/service/pay";
import { cloneDeep, debounce, zip } from "lodash";
import History from "./History.vue";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Index",
    inject: ["__imgRoot"],
    data: function () {
        return {
            raw: {},
            ID: 0,
            draw: {},
            prizeList: [],
            points: 0,
            index: 0,

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
            asset: {
                boxcoin: "盒币（重制）",
                boxcoin_origin: "盒币（缘起）",
                point: "积分",
            },

            mark: false,
            history: false,
            close: false,

            hasPrize: false,
            myPrizes: [],

            scrollInterval: null,
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
        optionLeft() {
            return {
                step: 0.8,
                direction: 2, // 0向下 1向上 2向左 3向右
                // limitMoveNum: this.dataList.length,// 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true,
                openTouch: false,
            };
        },
    },
    watch: {
        isLogin: {
            immediate: true,
            handler: function (val) {
                val && this.myPoints();
            },
        },
    },
    mounted() {
        this.init();
        this.scrollInterval = setInterval(this.scroll, 100);
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
                        this.draw = zip(data.allow_once_try_count, data.allow_once_try_count_cost_points);
                        this.prizeList = data.prize.map((item) => {
                            if (item.prize_type != "mall_goods" && asset[item.vip_asset_type])
                                return { img: asset[item.vip_asset_type] };
                            return { id: item.mall_goods.id, img: item.mall_goods.goods_images[0] };
                        });
                        const userLevelLimit = data.user_level_limit;
                        const userLevel = User.getLevel(1)
                        if (userLevelLimit > userLevel) {
                            this.$alert('很抱歉，您的用户等级不足','无法进行当前活动',{
                                type: "error",
                            })
                        }
                        this.refreshBox();
                    });
            });
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
        // 显示抽奖盒子
        showBox(index) {
            return this.activeList.includes(index + 1);
        },
        // 返回奖品链接
        aLink({ id }) {
            return id ? __Root + "vip/mall/" + id : "";
        },
        // 获取积分
        myPoints() {
            User.getAsset().then((res) => {
                this.points = res?.points || 0;
            });
        },
        // 滚动
        scroll() {
            let all = 0;
            let count = this.$refs.scroll.childElementCount;
            for (let i = 0; i < count; i++) {
                all += this.$refs.scroll.children[i].offsetWidth;
            }
            let half = all >> 1;
            if (x < 1 - half) {
                x = 0;
            }
            x -= 2;
            this.$refs.scroll.style.transform = "translateX(" + x + "px)";
        },
        // 刷新box
        refreshBox() {
            this.allActive = false;
            this.activeList = cloneDeep(this.boxList);
            this.replay++;
        },
        // 打开盒子
        openBox: debounce(function (key) {
            if (key === "all") {
                this.allActive = true;
                setTimeout(() => {
                    this.activeList = [];
                    this.hasPrize = true;
                    this.allActive = false;
                }, 1600);
                this.hasLucky();
            } else {
                const number = this.activeList[Math.floor(Math.random() * this.activeList.length)];
                this.change(number);
            }
        }, 1000),
        // 选择盒子抽奖
        change(number) {
            this.active = number;
            this.mark = true;
            setTimeout(() => {
                this.activeList = this.activeList.filter((item) => item !== number);
                this.hasPrize = true;
                this.mark = false;
                this.active = "";
            }, 1600);
            this.hasLucky();
        },
        // 抽奖
        hasLucky() {
            let batch = 1;
            if (this.allActive) batch = 10;
            goodLucky(this.ID, batch).then((res) => {
                const _id = res.data?.data.id;
                this.showPrizes(_id, { show: true });
                this.myPoints();
            });
        },
        // 查询中奖
        showPrizes(id, show) {
            if (!id) return;
            if (!show) this.hasPrize = true;
            getMyLucky(id).then((res) => {
                this.myPrizes = res.data?.data.prizes || [];
                if (show) {
                    const prizeLength = res.data?.data?.prizes?.length || 0;
                    const thanksLength = res.data?.data.chance_count - prizeLength;
                    const thanksPrizes = new Array(thanksLength).fill({ prize_type: "thanks" });
                    this.myPrizes = this.myPrizes.concat(thanksPrizes);
                    // 不要随机排序就把下面这行删掉
                    this.myPrizes.sort(function () {
                        return 0.5 - Math.random();
                    });
                }
            });
        },
        // 关闭奖品弹窗
        closePrize() {
            this.hasPrize = false;
            this.myPrizes = [];
        },
        openHistory() {
            this.history = true;
        },
        closeHistory() {
            this.history = false;
        },
    },
    destroyed() {
        clearInterval(this.scrollInterval);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/blindbox/index.less";
</style>
