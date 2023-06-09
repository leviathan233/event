<template>
    <div class="m-navigation">
        <div class="m-list">
            <a class="u-item" :href="item.link" v-for="(item, i) in list" :key="i">
                <img :src="`${eventLink}${item.img}`" :alt="item.name" />
            </a>
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
