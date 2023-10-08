<template>
    <div>
        <!-- 路由匹配的组件dom渲染部门 -->
        <router-view></router-view>
        
        <!-- 底部的导航组件 -->
        <div v-transfer-dom>
            <FooterComp v-if='showFooter' ref="footerComp" :footerMenu="footerMenu" @changeMenu="changeMenu"/>
        </div>   
    </div>
</template>
<script>
import FooterComp from "commonComp/base/FooterComp.vue";
import extendUtils from 'common/lib/utils';
export default {
    name:'wrap',
    components:{
        FooterComp
    },
    data(){
        return {
            //底部的菜单按钮数据data
            footerMenu:[
                {
                    name: '首页',
                    iconDefaultSvg: 'index_footer_default',
                    iconActiveSvg: 'index_footer_active',
                    active: false,
                    linkPath: ['/home', '/indexJD', '/indexSN'],
                    code: 'home',
                    query: {}
                },
                {
                    name: '分类',
                    iconDefaultSvg: 'sort_footer_default',
                    iconActiveSvg: 'sort_footer_active',
                    active: false,
                    linkPath: ['/category'],
                    code: 'category',
                    query: {}
                },
                {
                    name: '购物车',
                    id: 'footerCart',
                    iconDefaultSvg: 'cart_footer_default',
                    iconActiveSvg: 'cart_footer_active',
                    active: false,
                    linkPath: ['/iCart'],
                    code: 'cart',
                    query:{
                        fromIndex: true
                    }
                },
                {
                    name: '我的',
                    iconDefaultSvg: 'personal_footer.default',
                    iconActiveSvg: 'personal_footer.active',
                    active: false,
                    linkPath: ['/personal', '/personal/jd', '/personal/sn'],
                    code: 'personal',
                    query: {}
                },
            ],
        }
    },
    watch:{
        /**
         * 监听路由的变化 处理底部footer的选中状态
         * @param val 路由对象
         */
        $route:{
            handler(val){
                for(let i = 0;i<this.footerMenu.length ;i++){
                    const temp = this.footerMenu[i];
                    if(temp.linkPath.indexOf(val.path)>-1){
                         this.$set(temp, 'active', true);
                    }else{
                        this.$set(temp, 'active', false); 
                    }
                }
            },
            deep:true,
            immediate:true
        }
    },
    computed: {
        /**
         * 控制底部footer组件显隐的计算属性
         */
        showFooter(){
           return this.WhyShowFooter();
        }
    },
    created(){

    },  
    methods:{
        /**
         * 控制底部footer组件显隐的计算属性
         */        
        WhyShowFooter(){
            try{
                let that = this;
                return this.$router.options.routes.some(route => {
                    if(route.name == "wrapper" && extendUtils.getBizMateVersion()){
                        return route.children.some(child => {
                            return (child.path == that.$route.path)
                        })
                    }
                    return false;
                });
            }catch(e){
                console.error(e);
                return false;
            }
        },

        
        /**
         * 点击底部footer的首页不同的菜单
         * @param item 单个的底部按钮菜单对象
         */
        changeMenu(item){
            this.$router.push({
                path: item.linkPath[0],
                query: {
                    fromIndex: item.query.fromIndex //该参数表示首页跳转过去的
                }
            })
        }
    }
}
</script>
<style lang="less">
    
</style>