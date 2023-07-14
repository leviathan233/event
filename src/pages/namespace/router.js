import Vue from "vue";
import VueRouter from "vue-router";

const Index = () => import("./Index.vue");

Vue.use(VueRouter);

const routes = [
    { name: "index", path: "/", component: Index },
    {
        name: "index",
        path: "/",
        component: Index,
        children: [{
                name: "namespace",
                path: "/",
                component: () => import("./Index.vue"),
            },
            {
                name: "JX3",
                path: "/:id",
                component: () => import("./JX3.vue"),
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/namespace",
    routes,
});

export default router;