<template>
    <div class="p-event-content">
        <div class="m-top"></div>
        <Content />
        <div class="m-bottom">
            <img :src="__imgRoot + 'man.png'" class="m-man">
            <img :src="__imgRoot + 'woman.png'" class="m-woman">
        </div>
    </div>
</template>

<script>
    import Content from "./Content";
    export default {
        name: "Index",
        inject: ["__imgRoot"],
        components: {
            Content,
        },
        data: function () {
            return {};
        },
        computed: {},
    };
</script>
