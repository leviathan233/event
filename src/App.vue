<template>
    <div id="app"></div>
</template>

<script>
    import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
    export default {
        name: "App",
        props: [],
        data: function () {
            return {};
        },
        computed: {},
        methods: { getAppIcon },
        components: {},
    };
</script>

<style lang="less">
    @import "~@/assets/css/app.less";
</style>
