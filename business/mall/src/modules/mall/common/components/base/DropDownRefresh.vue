<!-- 
@dropTips:下拉时显示的文字
@enableRefresh: 是否开启下拉刷新
@DropFresh：下拉动作刷新调用的方法
-->
<template lang="html">
    <div class="yo-scroll"
        :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
        @touchstart="touchStart($event)"
        @touchmove="touchMove($event)"
        @touchend="touchEnd($event)">
            <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
                <header class="pull-refresh" v-show="refreshShow">
                    <slot name="pull-refresh">
                    <span class="down-tip">
                        <i class="icon-bottom"></i>
                        <span class='drop-tips'>{{dropTips}}</span>
                    </span>
                    <span class="up-tip">
                        <i class="icon-top"></i>
                        <span class='drop-tips'>松开刷新</span>
                    </span>
                    </slot>
                </header>
                <slot></slot>
            </section>
    </div>
</template>

<script>
export default {
  props: {
    dropTips:{
        type:String,
        default:'阳光 高效 简单 快乐'
    },
    offset: {
        type: Number,
        default: 40
    },
    //是否开启下拉刷新
    enableRefresh: {
        type: Boolean,
        default: true
    },

  },
  data() {
    return {
        top: 0,
        state: 0,
        startY: 0, //保存开始滑动时，y轴位置
        touching: false,
        refreshShow: true,
        showLoad: false
    };
  },
    created() {
        if (this.enableRefresh === false) {
            this.refreshShow = false;
        }
  },
    methods: {
        touchStart(e) {
            // console.log(1)
            //记录手指触摸位置y轴位置
            if (!this.enableRefresh) return;
            this.startY = e.targetTouches[0].pageY;
            this.startScroll = this.$el.scrollTop || 0;
            //开启滑动记录
            this.touching = true;
        },
        touchMove(e) {
            // console.log(2)
            // console.log(e.preventDefault)
            // this.$el.scrollTop = 0 时代表复原在顶部
            // 这里控制是否可以上下拉    代表正在滑动
            if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
                return;
            }
            //  获取拉取的间隔差   当前移动的y点      初始的y点        初始顶部距离
            let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
            //如果是往上滑的话，就取消事件
            if (diff > 0) e.preventDefault();
            // 对状态进行处理，看是否处于刷新中
            this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0);
            if (this.state === 2) {
                // in refreshing
                return;
            }
            if (this.top >= this.offset) {
                this.state = 1;
            } else {
                this.state = 0;
            }
        },
        touchEnd(e) {
            // console.log(e)
            if (!this.enableRefresh) return;
            this.touching = false;
            if (this.state === 2) {
                // in refreshing
                this.state = 2;
                this.top = this.offset;
                return;
            }
            if (this.top >= this.offset) {
                // do refresh
                this.refresh();
            } else {
                // cancel refresh
                this.state = 0;
                this.top = 0;
            }
        },
        refresh() {
            // 表示在刷新状态
            this.state = 2;
            this.top = this.offset;
            this.onRefresh();
        },
        //刷新完成的处理
        onRefresh(){
            this.state = 0;
            setTimeout(()=>{
                this.top = 0;
            },500)
            this.$emit('DropFresh')
        },
    },
};
</script>
<style lang="less" scoped>
.command{
    display: inline-block;
    width: .6rem;
    height: .6rem;
    vertical-align: -40%;
    margin-right: 4px;
}
.yo-scroll{
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
}
.inner{
    transition-duration: 300ms;
}
.pull-refresh{
    position: absolute;
    left: 0;
    top: -40px;
    width: 100%;
    padding: 0.2rem 0 0.1rem 0;
}
.yo-scroll.touch .inner{
    transition-duration: 0ms;
}
.down-tip,.up-tip{
    text-align: center;
}
.yo-scroll.down .down-tip{
    display: block;
}
.drop-tips{
    color:#999;
    font-size: 0.26rem;
}
.yo-scroll.up .up-tip{
    display: block;
}
.yo-scroll.refresh .refresh-tip{
    display: block;
    margin-top: .1rem ;
}
.yo-scroll .down-tip,
.yo-scroll .refresh-tip,
.yo-scroll .up-tip{
    display: none;
}
</style>