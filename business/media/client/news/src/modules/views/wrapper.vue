<template>
    <div>
        <!-- 路由匹配的组件dom渲染部门 -->
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'wrap',
    components:{
    },
    data(){
        return {
        }
    },
    watch:{
        /**
         * 监听路由的变化 处理底部footer的选中状态
         * @param val 路由对象
         */
        $route:{
            handler(){
                // for(let i = 0;i<this.footerMenu.length ;i++){
                //     const temp = this.footerMenu[i];
                //     if(val.path == temp.linkPath){
                //         this.$set(temp, 'active', true);
                //     }else{
                //         this.$set(temp, 'active', false);
                //     }
                // }
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
                    if(route.name == "wrapper"){
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
                path: item.linkPath,
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