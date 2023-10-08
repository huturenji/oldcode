<template>
    <view class="container">
        <view class="about_us_img_wrap">
            <image :src="site_logo" mode="aspectFit" class="about_us_img"></image>
            <view class="img_bottom_text">{{site_name}}</view>
        </view>
        <view class="about_us_item">
            <view class="about_us_item_text">{{$L('去评价')}}</view>
            <view class="about_us_icon iconfont icon_arrow_right"></view>
        </view>
        <view class="about_us_item" style="border:none;" @click="navTo('/pages/privacyPolicy/privacyPolicy')">
            <view class="about_us_item_text">{{$L('隐私政策')}}</view>
            <view class="about_us_icon iconfont icon_arrow_right"></view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return {
            site_name:'', //网站名称
            site_logo:'' //网站logo
        }
    },
    mounted(){
        this.getSettingInfo()
    },
    onLoad(){
        // this.getSettingInfo()
    },
    methods:{
        getSettingInfo(){
            let param = {}
            param.url = 'v1/front/setting/getSettings'
            param.method = 'GET'
            param.data = {
                names:'basic_site_name,main_site_logo'
            }
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.site_name = res.data[0]
                    this.site_logo = res.data[1]
                }
            })
        },
        navTo(url){
            this.$Router.push(url)
        }
    }
}
</script>

<style lang="scss">
    page{
        background:#F5F5F5;
    }
    .container{
        border-top:1rpx solid rgba(0,0,0,0.1);
        background-color: #fff;
        .about_us_img_wrap{
            height:380rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            .about_us_img{
                width: 230rpx;
                height:230rpx;
                margin-top:85rpx;
                background: #f8f8f8;
            }
            .img_bottom_text{
                font-size: 24rpx;
                color:#2d2d2d;
                font-weight: 600;
            }
        }
        
        .about_us_item{
            padding:0 20rpx;
            height:100rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid rgba(0,0,0,0.1);
            .about_us_item_text{
                font-size:28rpx;
                color:#2d2d2d;
                font-weight: 600;
            }
            .about_us_icon{
                color: $main-third-color;
                font-size: 18rpx;
                margin-left:10rpx;
            }
        }
    }
</style>
