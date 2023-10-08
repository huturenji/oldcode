
<!-- 活动标签组件-->
<template>
    <TransitionGroup tag="ul" name="fade" class="container">
        <div v-for="item in items" class="item" :key="item">
            <view :style="{backgroundImage: 'url(' + item.url + ')'}" class="unick"></view>
            <view class="name">
                {{filters.toAnonymous(item.name)}}已下单
            </view>
        </div>
    </TransitionGroup>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
export default {
    name: "bubbleLabel",

    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            items: [],//渲染数组
            list:[],
            index:0,//取值
            nextNum: 10,
            timer:null,
            count:10
        };
    },
    created(){
        //随机生成拼单数据
        let nameList = []
        for(var i=0; i < 7; i++){
            let name = this.generationNick()
            let link = this.imgUrl + this.generationPhoto(i+1)
            nameList.push({name:name,url:link})
        }
        this.list = nameList
        // 定时器
        this.init()
    },
    methods: {
        init(){
            this.timer = setInterval(()=>{
                if (this.index == this.list.length){
                    this.index = 0
                }
                this.items.push(this.list[this.index])

                if (this.items.length>3){
                    this.items.shift()
                }
                this.index++
            },1250)
        },
        // 随机生成昵称
        generationNick(length){
            let name = ''
            const nameArr = [
                ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
                ['0','1','2','3','4','5','6','7','8','9']
            ]
            for(var i=0; i < 6; i++){
                let index = Math.floor(Math.random() * 2);
                let zm = nameArr[index][Math.floor(Math.random() * nameArr[index].length)];
                if(index ===1 && Math.random() > 0.5){
                    zm = zm.toUpperCase();
                }
                name += zm;
            }
            return name
        },
        // 随机生成头像
        generationPhoto(id){
            let urlArr = 'portrait/img_yqm_touxiang'+ id +'.png'
            return urlArr
        }
    }
};
</script>

<style lang='scss' scoped>

.container {
    position: relative;
    padding: 0;
    min-height: 56rpx;
    .item {
        display: flex;
        align-items: center;
        width: 230rpx;
        height: 56rpx;
        background: rgba(0,0,0,0.35);
        border-radius: 200rpx;
        backdrop-filter: blur(10rpx);
        margin: 10rpx;
        .unick{
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            margin: 0 8rpx 0 4rpx;
            background-size:100% 100% ;
        }
        .name{
            width: fit-content;
            height: 34rpx;
            font-size: 24rpx;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: 34rpx;
            margin-right: 16rpx;
        }
    }
}
/* 1. 声明过渡效果 */
.fade-leave-active {
  position: absolute;
}
.fade-move,
.fade-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter{
  opacity: 1;
  transform: translate(0px, 30px);
}
.fade-leave{
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  z-index: -99;
  transform:scale(0)  ;
}

</style>
