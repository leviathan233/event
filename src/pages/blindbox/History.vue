<template>
    <div class="m-history-content">
        <el-table class="m-table-box" :data="list">
            <el-table-column prop="created_at" label="抽奖时间"></el-table-column>
            <el-table-column prop="chance_count" label="抽奖次数" width="80px"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 2 ? 'success' : 'info'">
                        {{ scope.row.status == 2 ? "中奖" : "未中奖" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.status == 2" @click="look(scope.row.id)">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getMyHistory } from "@/service/pay";
export default {
    name: "History",
    inject: ["__imgRoot"],
    props: ["id", "show"],
    data: function () {
        return {
            list: [],
            index: 0,
            pageSize: 20,
        };
    },
    watch: {
        show: {
            immediate: true,
            handler: function (_id) {
                _id && this.load(_id);
            },
        },
    },
    methods: {
        load(luckyDrawId) {
            const params = { luckyDrawId, pageSize: this.pageSize, index: this.index };
            getMyHistory(params).then((res) => {
                this.list = res.data.data.list;
            });
        },
        look(id) {
            this.$emit("update", id);
        },
    },
};
</script>

<style lang="less">
.m-history-content {
    .flex;
    .pt(20px);
    flex-direction: column;
    .cell {
        .x;
    }
    .m-table-box {
        height: 400px;
        overflow: auto;
    }
}
</style>
