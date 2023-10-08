<template>
    <div class="order-psg">
        <div v-for="(item, index) in orderInfo.psgList" :key="index" class="psg-item">
            <span class="name_wrap">
                <i><icon type="icon_route_people" size=".28" /></i>
                <span class="name">{{item.psgName}}</span>
            </span>
        </div>
    </div>
</template>

<script>
import icon from 'components/icon';
export default {
    components:{
        icon
    },
    props:{
        orderInfo: {
            type: Object,
            default(){
                return {};
            }
        }
    },
    methods:{}
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.order-psg{
    .psg-item{
        opacity: .7;
        .name_wrap{
            display: inline-block;
            width: 100%;

            overflow: hidden;
        }
        .icon_route_people{
            fill: @sub-background-color;
            margin-right: .08rem;
            
        }
        i{
            display: inline-block;
            vertical-align: middle;
        }
        .name{
            display: inline-block;
            vertical-align: middle;
            margin-top: -0.03rem;
            max-width: 80%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: left;
        }

    }
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    font-size: 0.26rem;
    & > div{
        width: 30%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 0.34rem;   
        box-sizing: border-box;
        &:nth-child(3n){
            text-align: right;
            border-left: 1px solid  rgba(255, 255, 255, .35);
        }
        &:nth-child(3n-1){
            width: 40%;
            text-align: center;
            border-left: 1px solid  rgba(255, 255, 255, .35);
           
        }
        &:nth-child(3n-2){
            text-align: left;
        }
       
    }

}
</style>