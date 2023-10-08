<template>
    <view class="container">
        <!-- 装修我的页面 -->
        <home-deco
            ref="homeDecoComp"
            :deco_info="deco_data"
            :topic_name="topic_name"
            :is_from_found="false"
            :isDecoReady="isDecoReady"
            :isPageShowCart="true"
            v-if="!isGuest"
        ></home-deco>
        <!-- 游客缺省页  默认图片 + 个人信息 + 缺省图-->
        <view v-if="isGuest">
            <img class="bg" :src="imgUrl + 'member/topbg@2x.png'" />
            <personal-center :decoItem="decoItem" @click.native="openFun" />
            <view class="flex_column_start_center empty_part">
                <view class="img"></view>
                <text class="tip_con">{{ $L('尊敬的游客，欢迎你~') }}</text>
            </view>
        </view>
    </view>
</template>
<script>
import indexMixin from "@/common/mixin/indexMixin.vue";
import sobot from '@/common/mixin/sobotOut' //智齿客服
import {disableIosBounce} from "@/common/mixin/bounceMixin";
import homeDeco from '@/components/decorate';
import personalCenter from '@/components/decorate/personal-center/personal-center.vue'
import { mapState, mapGetters } from 'vuex'
import redpoint from '@/components/redpoint/index';
export default {
    components: {
        homeDeco,
        personalCenter
    },
    computed: {
        ...mapState(['hasLogin']),
        ...mapGetters(['isGuest'])
    },
    mixins: [indexMixin, disableIosBounce, sobot],
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            topic_id: null, // 专题id
            topicKey:'personalcenterId',//页面key
            decoItem: {
                props : {
                    isShowStyle:true,
                    showAvatarData:true,//是否展示头像
                    showNameData : true,//是否展示名称
                    showRightData:true//是否展示右侧图标
                },
                styles:[{
                    padding:['15','15','','15'],
                    margin:['','','',''],
                    background:{
                        color:'',//背景颜色
                        img:'',//背景图
                        opacity:'100',//背景透明度
                        scroll:true//固定模式
                    }
                }],
                data : [
                    {
                        avatarData:{
                            url: '', //链接值
                            url_type: ''//链接类型
                        },
                        nameData:{
                            url: '', //链接值
                            url_type: ''//链接类型
                        },
                        rightData:{ 
                            img: getApp().globalData.imgUrl + 'member/btn_wode_kefu.svg',//图片绝对地址
                            img_path: '',//图片相对地址
                            imgWidth: '',
                            title:'我的客服',
                            url: '', //链接值
                            url_type: ''//链接类型
                        }
                    }
                ]
            }
        }
    },
    onShow(){
        // 页面显示重新初始化红点数据 防止红点数据不实时更新
        redpoint?.reset?.();
    },
    mounted() {},
    methods: {
        // 如果是游客的话点击跳转到登陆页面
        openFun(){
            this.$moduleGate()
        }
    }
}
</script>

<style lang="scss">
//document不可滚动，至少从装修容器这一级才可滚动
page{
    height: 100%;
    overflow: hidden;
}
.container {
    height: 100%;
    .bg {
        position: absolute;
        left: 0;
        top:  0;
        width: 100%;
        height: calc(434rpx + var(--titleBarFillHeight));
    }

    .empty_part {
        position: fixed;
        display: flex;
        width: 750rpx;
        height: 516rpx;
        background: #fff;
        top: calc(434rpx + var(--titleBarFillHeight) + 20rpx);
        left: 50%;
        margin-left: -375rpx;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
            margin-top: 88rpx;
        }

        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }

        .ope_btn {
            color: $main-color;
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: rgba(252, 28, 28, .1);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }
}
</style>
