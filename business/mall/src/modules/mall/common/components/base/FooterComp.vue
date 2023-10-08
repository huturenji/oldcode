<template>
    <div class="footer fixed-dom-part">
        <div class="item"
            @click="changeLink(item, index)"
            :class="{active: item.active, animat: item.active}"
            v-for="(item, index) in footerMenu" :key="index">
            <div class="icon-box" :id='item.id'>
                <div v-if="item.code=='cart' && cartNum > 0">
                    <numThumb :number="Number(cartNum) > 99 ? '99+' : Number(cartNum)"/>
                </div>
                <Icon :type='!!item.active ? item.iconActiveSvg : item.iconDefaultSvg' :size="!!item.active ? '.56' : '.52'"/>
            </div>
            <p>{{item.name}}</p>
        </div>
    </div>
</template>
<script>
import Bus from 'common/lib/bus/bus.js';
import Icon from 'common/components/base/Icon';
import numThumb from 'common/components/cartThumb/numThumb';
export default {
    name:'footerComp',
    props:{
        footerMenu:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    components:{
        Icon,
        numThumb
    },
    data(){
        return {
        
        }
    },
    computed:{
        cartNum(){
            var numbers = this.$store.state.cartNumber;
            return numbers;
        }
    },
    created(){           
        //分发获取购物车数量的接口 在vuex里面
        this.$store.dispatch('getCartNum');
    },
    methods:{
        /**
        *切换底部导航栏的回调
        *@param item 当前切换的单个的导航栏
        *@param index 当前导航栏的索引
        */
        changeLink(item, index){
            // if(!!item.active){ //该代码块模拟京东已经选中的菜单栏点击仍会触发动画的效果 目前暂时屏蔽
            //     this.$set(item, 'active', false);
            //     setTimeout(()=>{
            //         this.$set(item, 'active', true);
            //     },10)
            // }
            //当前页面再次点击图标时，触发下拉刷新（如果有）
            //TODO  保活页面有bug，会使所有保活状态的页面都触发这个事件。因此功能暂时屏蔽
            // if(item.active){
            //     Bus.$emit('triggerDownScroll')
            // }
            this.$emit('changeMenu', item);
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
// 底部导航栏的动画
.animat{
    animation: mymove 0.1s ease-in-out 0s 1;
    -webkit-animation: mymove 0.1s ease-in-out 0s 1; /*Safari and Chrome*/
}

@keyframes mymove{
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(0.53);
    }
    100%{
        transform: scale(1.06);
    }
}
/*Safari and Chrome*/
@-webkit-keyframes mymove {
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(0.53);
    }
    100%{
        transform: scale(1.06);
    }
}

.footer{
    position: fixed;
    max-width: @max-content-width;
    z-index: 650;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 0.48rem;
    height: 1rem;
    box-shadow:0px -4px 12px 0px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .item{
        cursor: pointer;
        text-align: center;
        font-size: 0.2rem;
        color: #A4ACB2;
        position: relative;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 1s;
        .icon-box{
            position: relative;
        }
        p{
            line-height: 0.28rem;
        }

        &.active{
            color: #081228;
        }

        /deep/ .cart-num{
            right: -.2rem;
            &.middle{
                right: -.3rem;
            }
            &.big{
                right: -.46rem;
            }
        }
    }
}
</style>
