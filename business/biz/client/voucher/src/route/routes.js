import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)
const routers = new VueRouter({
    routes: [
        { 
            path: '/signedGift/receive',
            component: resolve =>require(['modules/views/signedGift/receive/index.vue'], resolve),
            name: 'receiveGift',
            meta: {
                needAnimation:false,
                keepAlive: true,
                title: '签约有礼',
                titleBar: {
                    title: {
                        showTitle: false,
                        themeMode: "light",
                        opacity:0,
                        color:"#fff",
                        suspend: true
                    },
                    status: {
                        themeMode: "light",
                        opacity:0,
                        suspend: true
                    }
                }
            }
        }, 
        { 
            path: '/brief/receive',
            component: resolve =>require(['modules/views/brief/receive/index.vue'], resolve),
            name: 'brief',
            meta: {
                needAnimation:false,
                keepAlive: true,
                title: '发布会',
                titleBar: {
                    title: {
                        showTitle: false,
                        themeMode: "light",
                        opacity:0,
                        color:"#fff",
                        suspend: true
                    },
                    status: {
                        themeMode: "light",
                        opacity:0,
                        suspend: true
                    }
                }
            }
        },         
        {
            path: '/404',
            component: resolve =>require(['modules/views/404.vue'], resolve),
            name: ''
        }
    ],
    scrollBehavior () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0 })
            }, 10)
        })
    }
});
export default routers;