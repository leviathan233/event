<template>
    <div class="m-content">
        <div class="m-user-info">
            <div class="m-name">
                <template v-if="isLogin">
                    <img :src="userInfo.avatar" class="u-img" />
                    <span class="u-name">{{ userInfo.name }}</span>
                </template>
            </div>
            <div class="m-button">
                <a :href="register_link" target="_blank" class="u-btn u-register">注册铭牌</a>
                <a :href="my_namespace_link" target="_blank" class="u-btn u-mine">我的铭牌 </a>
            </div>
        </div>
        <div class="m-namespace">
            <!-- 搜索 -->
            <div class="m-search">
                <div class="m-tabs">
                    <span
                        :class="[{ active: type == item.value }, 'u-tab']"
                        v-for="(item, i) in tabs"
                        :key="i"
                        @click="change(item.value)"
                        >{{ item.label }}</span
                    >
                </div>
                <div class="u-search" slot="search-before" key="namespace-search">
                    <el-input
                        placeholder="请输入搜索内容"
                        v-model.trim.lazy="search"
                        clearable
                        @clear="onSearch"
                        @keydown.native.enter="onSearch"
                        class="input-with-select"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                    </el-input>
                </div>
            </div>
            <!-- 列表 -->
            <div class="m-list" v-loading="loading">
                <a :href="item.link" target="_blank" class="m-item" v-for="(item, i) in list" :key="i">
                    <div class="m-title">
                        <div class="u-title"><i class="el-icon-postcard"></i><span>{{ item.key }}</span></div>
                        <span class="u-tag">剑网3.com/{{ item.key }}</span>
                    </div>
                    <span class="u-desc">{{ item.desc }}</span>
                    <div class="m-info">
                        <span><i class="el-icon-user"></i>{{ item.user.display_name }}</span>
                        <span><i class="el-icon-date"></i>{{ dataFormat(item.created) }}</span>
                    </div>
                </a>
            </div>
            <!-- 分页 -->
            <div class="m-namespace-pages">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :hide-on-single-page="true"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { getNamespaceList } from "@/service/namespace.js";
    import { publishLink } from "@jx3box/jx3box-common/js/utils.js";
    import User from "@jx3box/jx3box-common/js/user";
    import { showDate } from "@jx3box/jx3box-common/js/moment";
    export default {
        name: "Content",
        data: function () {
            return {
                type: "all",
                tabs: [
                    { label: "全部", value: "all" },
                    { label: "玩家", value: "player" },
                    { label: "团队", value: "team" },
                    { label: "系统", value: "system" },
                    { label: "自定义", value: "custom" },
                ],

                list: "",
                per: 9,
                total: 1,
                page: 1,

                search: "",
                query: "",
                loading: false,

                isLogin: User.isLogin(),
                userInfo: User.getInfo(),
            };
        },
        computed: {
            register_link: function () {
                return publishLink("namespace");
            },
            my_namespace_link: function () {
                return publishLink("bucket/namespace");
            },
            params: function () {
                let _params = {
                    source_type: this.type == "all" ? "" : this.type,
                    page: this.page,
                    per: this.per,
                    status: 1,
                };
                return _params;
            },
        },
        watch: {
            type: function () {
                this.page = 1;
            },
            params: {
                deep: true,
                immediate: true,
                handler: function (newVal) {
                    this.query = "";
                    this.loadData();
                },
            },
        },
        methods: {
            change(key) {
                this.type = key;
            },
            loadData: function () {
                this.loading = true;
                const params = this.removeEmpty(
                    Object.assign({}, this.params, {
                        key: this.search,
                    })
                );
                getNamespaceList(params)
                    .then((res) => {
                        this.list = res.data.data.list || [];
                        this.total = res.data.data.total;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            removeEmpty: function (obj) {
                Object.keys(obj).forEach((key) => {
                    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
                        delete obj[key];
                    }
                });
                return obj;
            },
            onSearch: function () {
                if (this.page != 1) return (this.page = 1);
                this.loadData();
            },
            dataFormat: function(val) {
            return (val && showDate(~~val * 1000)) || "-";
        },
        },
        created: function () {
            this.query = this.$route.query.namespace; 
        },
    };
</script>

<style lang="less">
    @import "~@/assets/css/namespace/index.less";
</style>
