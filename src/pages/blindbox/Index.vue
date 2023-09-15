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
                        <div class="u-box" v-for="item in 10" :key="item">
                            <img class="u-img" :src="`${__imgRoot}box.png`" alt="奖品" />
                        </div>
                    </div>
                </div>
                <div class="m-right">
                    <div class="m-point">9999</div>
                    <div class="m-prize box">
                        <h3>
                            <img :src="`${__imgRoot}prize.png`" alt="奖品一览" />
                        </h3>
                        <div class="m-item"></div>
                    </div>
                    <div class="m-lottery"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Index",
    inject: ["__imgRoot"],
    data: function () {
        return {};
    },
    computed: {},

    methods: {},
};
</script>

<style lang="less">
@import "~@/assets/css/blindbox/index.less";
</style>
