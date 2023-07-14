import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("./Index.vue");
const JX3 = () => import("./JX3.vue");

Vue.use(VueRouter);

const routes = [{
    name: "index",
    path: "/",
    component: Index,
    children: [{
        name: "JX3",
        path: "/:id",
        component: JX3,
    }, ],
}, ];

const router = new VueRouter({
    mode: "history",
    base: "/namespace",
    routes,
});

export default router;