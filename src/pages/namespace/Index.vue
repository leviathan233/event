<template>
    <div class="p-event-content">
        <!-- 添加 -->
        <div class="m-add">
            <div class="m-name">
                <img src="" alt="" srcset="" class="u-img" /><span class="u-name"
                    >用户名字用户名字用户名字用户名字用户名字</span
                >
            </div>
            <div class="m-button">
                <a :href="register_link" class="u-add"> 注册铭牌</a>
                <a :href="my_namespace_link" class="u-myNamespace"> 我的铭牌 </a>
            </div>
        </div>
        <div class="m-content">
            <!-- 搜索 -->
            <div class="m-search">
                <span class="u-title">铭牌大厅</span>
                <div class="m-search-box">
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
            </div>
            <!-- 列表 -->
            <ul class="m-list" v-loading="loading">
                <li class="m-item" v-for="(item, i) in list" :key="i">
                    <div class="m-title">
                        <span class="u-title">{{ item.key }}</span>
                        <span class="u-tag">剑网3.com/{{ item.key }}</span>
                    </div>
                    <span class="u-desc">{{ item.desc }}</span>
                    <div class="m-info">
                        <span>{{ item.user.display_name }}</span>
                        <span>{{ item.created }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { getNamespaceList } from "@/service/namespace.js";
    import { publishLink } from "@jx3box/jx3box-common/js/utils.js";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
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
                per: 12,
                total: 1,
                page: 1,

                search: "",
                query: "",
                loading: false,
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
                if (this.page != 1) {
                    this.page = 1;
                    return;
                }
                this.loadData();
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
