<template>
<div class='tab-container'>
    <div class="tab-content" ref='container'>
        <div class='tab-item' ref='tabItem' v-for="(item, index) in list" :class='{"selected": index==value}' @click='clickTab(item, index)' :key="item.productCategoryId">
            <span class='real-text'>{{item.productCategoryName}}</span>
            <div class='tab-ink-bar-container'><div class='tab-ink-bar'></div></div>
        </div>
        <slot name='last'></slot>
    </div>
</div>
</template>
<script>
import Flip from 'commonComp/flip';
export default {
    props:{
        list:{
            type: Array,
            default: null
        },
        value: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            lastScrollLeft: 0, // 路由切换时tab横向滚顶条的位置
        }
    },
    watch: {
        value(_new, _old){
            try{
                this.go(parseInt(_new) - parseInt(_old));
            }catch(e){
                console.error(e);
            }
        },
        list(_new){
            if(_new && _new.length>0){
                this.$nextTick(()=>{
                    this.go()
                })
            }
        }
    },
    mounted(){
        this.go();
        window.addEventListener('resize', this.go)
    },

    activated(){
        //保活的时候记住上次滚动的位置
        let container = this.$refs.container;
        container.scrollLeft = this.lastScrollLeft
    },
    methods: {
        clickTab(index, item){
            this.$emit('input', index);
            this.$emit('click', index, item);
        },
        go(space=0, delay=0){
            let that = this;
            this.$nextTick(()=>{
                setTimeout(()=>{
                    if(!that.$refs.tabItem){
                        return;
                    }
                    let barArr = document.querySelectorAll('.tab-ink-bar-container')
                    let currBar = barArr[that.value].children[0];
                    let preIndex = that.value-space;
                    let preBar = preIndex<barArr.length ? barArr[preIndex].children[0] : null;
                    Array.prototype.forEach.call(barArr, bar=>{
                        bar.children[0].style.visibility = 'hidden'
                    })
                    currBar.style.visibility = 'visible'
                    let flip = new Flip({easing: 'linear', duration:200});
                    preBar && flip.read(preBar);
                    flip.play(currBar);
                    let currTab = document.querySelectorAll('.tab-container .tab-item')[that.value];
                    let container = that.$refs.container;
                    let containerWidth = container.offsetWidth;
                    let tabOffsetLeft = parseFloat(currTab.offsetLeft);
                    

                    
                    let left = 0;
                    if(that.value==barArr.length-1){
                        left = containerWidth;
                    }
                    left = tabOffsetLeft - (containerWidth/2);
                    that.scrollAnimation(container,left-container.scrollLeft,15)
                    
                    that.lastScrollLeft = container.scrollLeft;
              
                },delay * 1000)
            })
        },
        /**
         * 滚动动画方法
         * @param navDom 滚动的dom
         * @param left 需要滚动的距离
         * @param loop 动画帧数
         */  
        scrollAnimation(navDom,left,loop){
            let count = 0;
            const step = () => {
                const scrollDuration = loop;
                const nav = navDom;
                nav.scrollLeft += (left / scrollDuration);
                if (++count < scrollDuration) {
                    window.requestAnimationFrame(step)
                }
            }
            window.requestAnimationFrame(step)
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';

@height: .88rem;
.tab-container{
    width: 100%;
    height: @height;
    line-height: @height;
    z-index: 99;
    background: transparent;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    .tab-content{
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        text-align: left;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;/*解决ios滑动卡顿 */
        .tab-item{
            position: relative;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: stretch;
            text-align: center;
            height: .88rem;
            line-height: initial;
            padding: 0 .15rem;
            .flex-box();
            .align-items(center);
            .real-text{
                transition: transform .3s linear;
                font-size: .3rem;
            }
            &.selected{
                transition: transform .3s linear;
                .real-text{
                    color: #fff;
                    font-weight: bold;
                    transform: scale(1.1);
                    transform-origin: bottom;
                }
            }
        }
    
        .tab-ink-bar-container{
            position: absolute;
            bottom: .08rem;
            left: 0;
            right: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            .tab-ink-bar{
                width: .4rem;
                height: .05rem;
                border-radius: .03rem;
                background: #fff;
                visibility: hidden;
            }
        }
    
    }
}
</style>