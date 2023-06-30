<template>
    <div class="p-event-content">
        <div class="m-top"></div>
        <Content />
        <div class="m-bottom"></div>
    </div>
</template>

<script>
    import Content from "./Content";
    export default {
        name: "Index",
        components: {
            Content,
        },
        data: function () {
            return {};
        },
        computed: {},
    };
</script>
