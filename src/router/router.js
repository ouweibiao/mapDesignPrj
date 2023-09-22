import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [

    {
        path: '/page',
        name: 'page',
        component: () => import('../views/homePage.vue')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index.vue')
    },
    {
        path: '/anhui',
        name: 'anhui',
        component: () => import('../views/provinceMap/anHui.vue')
    },
    {
        path: '/aomen',
        name: 'aomen',
        component: () => import('../views/provinceMap/aoMen.vue')
    },
    {
        path: '/beijing',
        name: 'beijing',
        component: () => import('../views/provinceMap/beiJing.vue')
    },
    {
        path: '/chongqing',
        name: 'chongqing',
        component: () => import('../views/provinceMap/chongQing.vue')
    },
    {
        path: '/fujian',
        name: 'fujian',
        component: () => import('../views/provinceMap/fuJian.vue')
    },
    {
        path: '/gansu',
        name: 'gansu',
        component: () => import('../views/provinceMap/ganSu.vue')
    },
    {
        path: '/guangdong',
        name: 'guangdong',
        component: () => import('../views/provinceMap/guangDong.vue')
    },
    {
        path: '/guangxi',
        name: 'guangxi',
        component: () => import('../views/provinceMap/guangXi.vue')
    },
    {
        path: '/guizhou',
        name: 'guizhou',
        component: () => import('../views/provinceMap/guiZhou.vue')
    },
    {
        path: '/hainan',
        name: 'hainan',
        component: () => import('../views/provinceMap/haiNan.vue')
    },
    {
        path: '/hebei',
        name: 'hebei',
        component: () => import('../views/provinceMap/heBei.vue')
    },
    {
        path: '/hunan',
        name: 'hunan',
        component: () => import('../views/provinceMap/huNan.vue')
    },
    {
        path: '/jiangxi',
        name: 'jiangxi',
        component: () => import('../views/provinceMap/jiangXi.vue')
    },
    {
        path: '/jilin',
        name: 'jilin',
        component: () => import('../views/provinceMap/jiLin.vue')
    },
    {
        path: '/liaoning',
        name: 'liaoning',
        component: () => import('../views/provinceMap/liaoNing.vue')
    },
    {
        path: '/neimenggu',
        name: 'neimenggu',
        component: () => import('../views/provinceMap/neiMengGu.vue')
    },
    {
        path: '/ningxia',
        name: 'ningxia',
        component: () => import('../views/provinceMap/ningXia.vue')
    },
    {
        path: '/qinghai',
        name: 'qinghai',
        component: () => import('../views/provinceMap/qingHai.vue')
    },
    {
        path: '/beijing',
        name: 'beijing',
        component: () => import('../views/provinceMap/beiJing.vue')
    },
    {
        path: '/shandong',
        name: 'shandong',
        component: () => import('../views/provinceMap/shanDong.vue')
    },
    {
        path: '/shanghai',
        name: 'shanghai',
        component: () => import('../views/provinceMap/shangHai.vue')
    },
    {
        path: '/shanxi',
        name: 'shanxi',
        component: () => import('../views/provinceMap/shanXi.vue')
    },
    {
        path: '/shanx',
        name: 'shanx',
        component: () => import('../views/provinceMap/shanXi1.vue')
    },
    {
        path: '/taiwan',
        name: 'taiwan',
        component: () => import('../views/provinceMap/taiWan.vue')
    },
    {
        path: '/jiangsu',
        name: 'jiangsu',
        component: () => import('../views/provinceMap/jiangSu.vue')
    },
    {
        path: '/henan',
        name: 'henan',
        component: () => import('../views/provinceMap/heNan.vue')
    },
    {
        path: '/hubei',
        name: 'hubei',
        component: () => import('../views/provinceMap/huBei.vue')
    },
    {
        path: '/heilongjiang',
        name: 'heilongjiang',
        component: () => import('../views/provinceMap/heiLongJiang.vue')
    },
    {
        path: '/tianjin',
        name: 'tianjin',
        component: () => import('../views/provinceMap/tianJin.vue')
    },
    {
        path: '/xianggang',
        name: 'xianggang',
        component: () => import('../views/provinceMap/xiangGang.vue')
    },
    {
        path: '/xinjiang',
        name: 'xinjiang',
        component: () => import('../views/provinceMap/xinJiang.vue')
    },
    {
        path: '/xizang',
        name: 'xizang',
        component: () => import('../views/provinceMap/xiZang.vue')
    },
    {
        path: '/yunnan',
        name: 'yunnan',
        component: () => import('../views/provinceMap/yunNan.vue')
    },
    {
        path: '/sichuan',
        name: 'sichuan',
        component: () => import('../views/provinceMap/siChuan.vue')
    },
    {
        path: '/zhejiang',
        name: 'zhejiang',
        component: () => import('../views/provinceMap/zheJiang.vue')
    },
    {
        path: "/world",
        name: "world",
        component: () => import("../views/world.vue"),
    },
    {
        path: "/cities",
        name: "cities",
        component: () => import("../views/chinaCity.vue")
    },
    {
        path: "/contour",
        name: "contour",
        component: () => import("../views/chinaContour.vue")
    },
    {
        path: "/",
        redirect: "/page"
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
