<template>
    <view :style='rootStyle' v-margin="decoItem">
        <view class="activityWrap">
            <view v-if="decoItem.props.show_style ==='one'" class="styleOneWrap">
                <view class="leftWrap" :style="setStyle(decoItem.data[0].areaOne)">
                    <activityItem :decoData='decoItem.data[0].areaOne' />
                </view>
                <view class="rightWrap">
                    <image :src="decoItem.data[0].areaTwo.img" mode="widthFix" @click="goDetail(decoItem.data[0].areaTwo.link)"/>
                    <image :src="decoItem.data[0].areaThree.img" mode="widthFix" @click="goDetail(decoItem.data[0].areaThree.link)"/>
                </view>
            </view>
            <view v-if="decoItem.props.show_style ==='two'" class="styleTwoWrap">
                <view class="leftWrap">
                    <view @click="goDetail(decoItem.data[0].areaTwo.link)">
                        <image :src="decoItem.data[0].areaTwo.img" mode="widthFix"/>
                    </view>
                    <view @click="goDetail(decoItem.data[0].areaThree.link)">
                        <image :src="decoItem.data[0].areaThree.img" mode="widthFix"/>
                    </view>
                </view>
                <view class="rightWrap" :style="setStyle(decoItem.data[0].areaOne)">
                    <activityItem :decoData='decoItem.data[0].areaOne'  />
                </view>
            </view>
            <view v-if="decoItem.props.show_style ==='three'" class="styleThreeWrap">
                <view class="leftWrap">
                    <activityItem :decoData='decoItem.data[0].areaOne' />
                </view>
                <view class="rightWrap">
                    <activityItem :decoData='decoItem.data[0].areaTwo' />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import activityItem from './activityItem.vue'
import {
    skipTo
} from '@/utils/common.js'
export default {
    name: "deco-goods-hotsale",
    data() {
        return {
            isFirstLoading:false
        }
    },
    components:{
        activityItem
    },
    props: {
        decoItem:{
            type: Object,
            default: () => {}
        }
    },
    computed: {
        rootStyle() {
            let styleObj = {}
            if (this.decoItem.props.isShowStyle && this.decoItem.styles[0].background) {
                let style = this.decoItem.styles[0].background
                styleObj = {
                    background: style.img?`url(${style.img}) center/100% 100% no-repeat`:style.color,
                    opacity: style.opacity/100<1?style.opacity/100:1
                }
            }
            return styleObj
        },
        setStyle(){
            return item=>{
                let setStyle = {}
                if(item.style=='one'){
                    setStyle.width = '324rpx'
                }else if(item.style=='two'){
                    setStyle.width = '344rpx'
                }
                return setStyle
            } 
        }
    },
    watch: {
        decoItem: {
            handler(val) {
                console.log(val);
            },
            deep: true,
            immediate: true
        }               
    },
    mounted(){
    },
    methods:{
        goDetail(item) {
            skipTo(item,this)
        }
    }
}
</script>

<style lang="scss">
.activityWrap{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .styleOneWrap{
        display: flex;
        width: 100%;
        .leftWrap{
            height: 324rpx;
        }
        .rightWrap{
            display: flex;
            flex-direction: column;
            flex: 1;
            image{
                width: 100%;
                height: 100%;
            }
        }
    }
    .styleTwoWrap{
        display: flex;
        width: 100%;
        .leftWrap{
            flex: 1;
            display: flex;
            flex-direction: column;
            image{
                width: 100%;
                height: 100%;
            }
            
        }
        .rightWrap{
            height: 324rpx;
        }
    }
    .styleThreeWrap{
        display: flex;
        width: 100%;
        .leftWrap{
            width: 50%;
            height: 324rpx;
        }
        .rightWrap{
            width: 50%;
            height: 324rpx;
        }
    }
}
    
</style>