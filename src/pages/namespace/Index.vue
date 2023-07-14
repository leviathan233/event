<template>
    <!-- 专题页 -->
    <div class="p-event" :class="'v-' + page_name">
        <!-- <Header :overlayEnable="true"></Header> -->
        <div class="p-event-content">
            <div class="m-top"></div>
            <Content />
            <div class="m-bottom">
                <img :src="imgRoot + 'man.png'" class="m-man" />
                <img :src="imgRoot + 'woman.png'" class="m-woman" />
            </div>
        </div>
    </div>
</template>

<script>
import Content from "./Content";
import { postStat } from "@jx3box/jx3box-common/js/stat";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Index",
    components: {
        Content,
    },
    data: function () {
        return {
            imgRoot: __imgPath + "topic/namespace/",
        };
    },
    computed: {
        page_name: function () {
            return "namespace";
        },
    },
    created: function () {
        postStat("event", "namespace");
    },
};
</script>
