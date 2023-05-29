<template>
    <div class="m-index">
        <div class="m-header">
            <img :src="__imgRoot + 'text2.svg'" class="u-text u-text-1" alt="全力以赴" />
            <img :src="__imgRoot + 'text.svg'" class="u-text u-text-2" alt="2023剑三高考卷" />
        </div>
        <div class="m-exam">
            <div class="m-title">
                <div class="u-show-title">理综卷</div>
                <div class="m-title-box">
                    <span class="u-title" v-for="item in 6" :key="item">文综卷</span>
                </div>
            </div>
            <div class="m-content"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: {},
        data: function () {
            return {};
        },

        computed: {},
        methods: {},
    };
</script>

<style lang="less">
    @import "../../assets/css/2023exam/index.less";
</style>
