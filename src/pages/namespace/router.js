import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("./Index.vue");
const Key = () => import("./Key.vue");
Vue.use(VueRouter);

const routes = [
    {
        name: "index",
        path: "/",
        component: Index,
    },
    {
        name: "key",
        path: "/:key",
        component: Key,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.NODE_ENV === 'development' ? '/namespace' : '',
    routes,
});

export default router;

