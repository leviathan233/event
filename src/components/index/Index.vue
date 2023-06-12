<template>
    <div class="m-navigation">
        <div class="m-list">
            <div class="m-list-scroll" :class="{ isShort }">
                <a class="u-item" target="_blank" :href="eventLink + item.link" v-for="(item, i) in list" :key="i">
                    <span class="u-title">{{ item.name }}</span>
                    <el-image class="u-img" :src="`${imgLink}${item.img}`" fit="cover"></el-image>
                    <div class="u-mark"></div>
                </a>
            </div>
        </div>
        <div class="m-bg">
            <div class="u-mark"></div>
            <div class="u-dot"></div>
            <div class="u-left"></div>
            <div class="u-right"></div>
            <div class="u-title">
                <span>魔盒活动</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { __imgPath, __Root } from "@jx3box/jx3box-common/data/jx3box.json";
    import { list } from "@/assets/data/index.json";
    export default {
        name: "Index",
        data: function () {
            return {
                list,
                eventLink: __Root + "event",
            };
        },
        computed: {
            imgLink() {
                return __imgPath + "topic/event/img/";
            },
            isShort() {
                return this.list.length <= 4;
            },
        },
        methods: {},
    };
</script>

<style lang="less">
    @import "~@/assets/css/index.less";
</style>
