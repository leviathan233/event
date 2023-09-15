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
                            <img class="u-img" :src="`${__imgRoot}box.png`" alt="奖品" v-show="showBox(index)" />
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
                        <div class="m-item"></div>
                    </div>
                    <div class="m-lottery">
                        <img :src="`${__imgRoot}refresh.png`" class="u-img refresh" alt="刷新盲盒" />
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
            activeList: [],
        };
    },
    computed: {},

    methods: {
        showBox(index) {
            return !this.activeList.includes(index);
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
