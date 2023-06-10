<template>
    <div class="m-navigation">
        <div class="m-list">
            <div class="m-list-scroll">
                <a class="u-item" :href="item.link" v-for="(item, i) in list" :key="i">
                    <span class="u-title">{{ item.name }}</span>
                    <el-image class="u-img" :src="`${eventLink}${item.img}`" fit="cover"></el-image>
                    <div class="u-mark"></div>
                </a>
            </div>
        </div>
        <div class="m-mark">
            <div class="mark"></div>
            <div class="bg"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="title">
                <span>魔盒活动</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
    import { list } from "@/assets/data/index.json";
    export default {
        name: "Index",
        data: function () {
            return {
                list,
                imgLink: __imgPath,
            };
        },
        computed: {
            eventLink() {
                return __imgPath + "topic/event/img/";
            },
        },
        methods: {},
    };
</script>

<style lang="less">
    @import "~@/assets/css/index.less";
</style>
