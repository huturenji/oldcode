<template>
    <view class="container">
        <view class="list_cell m_t b_b" @click="navTo('/pages/user/info')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('个人信息')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <view class="list_cell m_t b_b" @click="navTo('/pages/member/collect')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('我的收藏')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <view class="list_cell b_b" @click="navTo('/pages/member/history')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('我的足迹')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <view class="list_cell" @click="navTo('/pages/address/list')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('收货地址')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <!-- <view class="list_cell m_t" @click="navTo('/pages/account/account')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('账号安全')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view> -->
        <!-- #ifdef APP-PLUS -->
        <view class="list_cell b_b m_t" @click="navTo('/pages/set/aboutUs')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('关于我们')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <view class="list_cell b_b" @click="navTo('/pages/privacyPolicy/privacyPolicy')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('用户协议和隐私政策')}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <view class="list_cell" @click="clearCache()" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('清除缓存')}}</text>
            <text class="size_cache">{{fileSizeString}}</text>
            <text class="cell_more iconfont icon_arrow_right"></text>
        </view>
        <!-- #endif -->
        <!-- <view class="log_out_btn flex_row_center_center" @click="loginOutDialog(true)">
            {{$L('退出登录')}}
        </view>  -->
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="确定要退出登录吗?" :duration="2000"  @close="loginOutDialog(false)" @confirm="confirmLoginOut"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import {  
    mapMutations,mapState
} from 'vuex';
export default {
    components: {
        uniPopup,
            
        uniPopupDialog
    },
    data() {
        return {
            fileSizeString:'' //app文件缓存大小
        };
    },
    computed: {
        ...mapState(['hasLogin', 'userCenterData']),
        userInfo:{
            get(){
                return this.$store.state.userInfo
            },
            set(){}
        }
    },
    mounted(){
        // #ifdef APP-PLUS
        this.formatSize(); //获取文件缓存
        // #endif
    },
    onLoad() {
        // // #ifdef APP-PLUS
        // this.formatSize(); //获取文件缓存
        // // #endif
    },
    methods:{
        ...mapMutations(['login','logout', 'setUserCenterData', 'userInfo']),
        navTo(url){
            this.$Router.push(url)
        },
        //退出登录
        confirmLoginOut(){
            this.$request({
                url:'v3/frontLogin/oauth/logout',
                method:'POST',
                data:{
                    refresh_token:this.userInfo.refresh_token
                }
            }).then(() => {
                this.logout();
                this.$Router.replace({path:`/pages/public/login`,query:{source:'loginOut'}});
            }).catch(() => {})
        },
        //退出登录提示
        loginOutDialog(type){
            if (type){
                this.$refs.popup.open();
            } else {
                this.$refs.popup.close();
            }
        },
        //获取文件缓存
        formatSize(){
            let that = this;
            plus.cache.calculate(function(size){
                let sizeCache = parseInt(size);
                if (sizeCache == 0){
                    that.fileSizeString = "0B";
                } else if (sizeCache < 1024){
                    that.fileSizeString = sizeCache + "B";
                } else if (sizeCache < 1048576){
                    that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
                } else if (sizeCache < 1073741824) {  
                    that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";  
                } else {  
                    that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";  
                }  
            })
        },
        //清除文件缓存
        clearCache(){
            let that = this;
            uni.showModal({
                title:'提示',
                content:'确定清除缓存?',
                success: (res) => {
                    if (res.confirm){
                        let os = plus.os.name;
                        if (os == 'Android') {  
                            let main = plus.android.runtimeMainActivity();  
                            let sdRoot = main.getCacheDir();  
                            let files = plus.android.invoke(sdRoot, "listFiles");  
                            let len = files.length;  
                            for (let i = 0; i < len; i++) {  
                                let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
                                plus.io.resolveLocalFileSystemURL(filePath, function(entry) {  
                                    if (entry.isDirectory) {  
                                        entry.removeRecursively(function() { //递归删除其下的所有文件及子目录  
                                            uni.showToast({  
                                                title: '缓存清理完成',  
                                                duration: 2000  
                                            });  
                                            that.formatSize(); // 重新计算缓存  
                                        }, function() {  
                                        });  
                                    } else {  
                                        entry.remove();  
                                    }  
                                }, function() {   
                                });  
                            }  
                        } else { // ios  
                            plus.cache.clear(function() {  
                                uni.showToast({  
                                    title: '缓存清理完成',  
                                    duration: 2000  
                                });  
                                that.formatSize();  
                            });  
                        }
                    } else if (res.cancel){
                            
                    }
                }
            })
                
        }
    }
}
</script>

<style lang='scss'>
    page{
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }
    .list_cell{
        display:flex;
        align-items:center;
        padding: 0 20rpx;
        line-height:100rpx;
        height: 100rpx;
        position:relative;
        background: #fff;
        justify-content: center;
        &.cell_hover{
            background:#fafafa;
        }
        &.b_b:after{
            left: 20rpx;
        }
        &.m_t{
            margin-top: 20rpx; 
        }
        .cell_more{
            color: $main-third-color;
            font-size: 18rpx;
            margin-left:10rpx;
        }
        .cell_tit{
            flex: 1;
            font-size: 28rpx;
            color: #2D2D2D;
            margin-right:10rpx;
        }
        .size_cache{
            font-size: 28rpx;
            color: #FC1C1C;
        }
    }
    .log_out_btn{
        position: fixed;
        width: 668rpx;
        margin: 0 41rpx;
        left: 50%;
        transform: translateX(-375rpx);
/*         left: 41rpx;
        right: 41rpx; */
        bottom: 80rpx;
        z-index: 95;
        font-size: 34rpx;
        color: $main-color;
        height: 88rpx;
        border:1px solid $main-color;
        border-radius:44px;
        letter-spacing: 1rpx;
    }
</style>
