<!-- 发表评价 -->
<template>
    <view class="container">
        <view class="gap"></view>
        <view class="content" v-for="(item,index) in detailList" :key="index">
            <view class="goods_detail_wrap">
                <view class="goods_img_wrap">
                    <!-- <image :src="item.mainImage" mode="" class="goods_img"></image> -->
                    <!-- <coverImage :src="item.mainImage" width="140" height="140" class="goods_img"></coverImage> -->
                    <view class="goods_img" :style="'background-image:url('+(item.mainImage||defaultImage)+')'"></view>
                </view>
                <view class="goods_detail_right">
                    <view class="goods_name">{{item.skuName}}</view>
                    <view class="goods_spec" v-if="item.specValues">{{item.specValues}}</view>
                </view>
            </view>

            <view class="goods_rate">
                <view class="goods_rate_text">{{$L('整体评分')}}</view>
                <uni-rate :size="16" active-color="#FC1C1C" :evaItem='item' :margin="5" :value="item.score"
                    @change="onChange($event,item,index)" />
                <view class="rate_text">{{item.rate_text}}</view>
            </view>
            <view class="remark_con">
                <image class="evalute_icon" v-if="!item.content" :src="imgUrl+'goods/evalute-icon.png'" mode=""></image>
                <textarea v-model="item.content" :class="{input_state:item.content}" auto-height maxlength="200"
                    :placeholder="$L('宝贝满足你的条件吗？请说说使用心得吧')" />
            </view>

            <view class="remark_wrap">
                <view class="upload_img_wrap">
                    <view class="evaluate_img" v-for="(imgItem,index2) in item.goodsList" :key="index2">
                        <image :src="imgItem" mode="aspectFit" class="upload_img"></image>
                        <image :src="closeImg" mode="" class="close_img" @click="delUploadImg(index2,item)"></image>
                    </view>
                    <view class="upload_img_box" @click="uploadImg(item)" v-if="item.goodsList.length < 5">
                        <view class="upload_image">
                            <image :src="cameraImg" mode=""></image>
                            <view class="upload_text">
                                {{item.goodsList.length == 0? $L("添加图片"):item.goodsList.length+'/5'}}</view>
                            <view class="upload_img_text">{{$L('最多可上传5张')}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="empty-20">

            </view>
        </view>
        <view class="store_evaluate">
            <view class="store_evaluate_logo_name">
                <image class="store_logo" :src="imgUrl+'goods/store_logo.png'"></image>
                <text>{{store_info.storeName}}</text>
            </view>
            <view class="store_evaluate_list">
                <view class="store_evaluate_list_item">
                    <view class="goods_rate_text">{{$L('描述相符')}}</view>
                    <uni-rate class="uni_rate" v-model="store_info.description" :size="16" active-color="#FC1C1C"
                        text='description' :margin="5" @change="onChangeStore" />
                    <view class="rate_text">{{store_eva_text.description}}</view>
                </view>
                <view class="store_evaluate_list_item">
                    <view class="goods_rate_text">{{$L('物流服务')}}</view>
                    <uni-rate class="uni_rate" v-model="store_info.expressSpeed" :size="16" active-color="#FC1C1C"
                        text='expressSpeed' :margin="5" @change="onChangeStore" />
                    <view class="rate_text">{{store_eva_text.expressSpeed}}</view>
                </view>
                <view class="store_evaluate_list_item">
                    <view class="goods_rate_text">{{$L('服务态度')}}</view>
                    <uni-rate class="uni_rate" v-model="store_info.serviceAttitude" :size="16" active-color="#FC1C1C"
                        text='serviceAttitude' :margin="5" @change="onChangeStore" />
                    <view class="rate_text">{{store_eva_text.serviceAttitude}}</view>
                </view>
            </view>
        </view>
        <view class="submit_btn_wrap">
            <view class="submit_btn" @click="publishEvaluation">{{$L('发布')}}</view>
        </view>
    </view>
</template>

<script>

import {
    mapState
} from 'vuex';
import orderHandler from '@/components/order/handler';
import ossHandler from '@/utils/ossHandler';
export default {
    data() {
        return {
            onOff:true,
            cameraImg: getApp().globalData.imgUrl + 'order/camera.png',
            closeImg: getApp().globalData.imgUrl + 'common/icon/icon_search_clean.svg',
            orderSn: '', // 商品订单号
            detailList: [], //数据列表
            goodsList: [], //上传图片绝对路径
            imgList: [], //上传图片相对路径
            content: '', //评价内容
            value: 5, //星星评分1-5
            rate_text: '非常好', //评分文字说明
            sourceType: '', //页面来源    如果是从交易成功页面进入    则返回交易成功的上一页（订单详情 orderDetail，订单列表orderList），否则返回上一页
            windowHeight: '', //窗口高度
            imgUrl: getApp().globalData.imgUrl,
            store_info: {},
            store_eva_text: {
                serviceAttitude: '好评',
                description: '好评',
                expressSpeed: '好评'
            },
            defaultImage:'./static/shared/order/icon_mall_liwu.png'
                
        }
    },
    components: {
      
    },
    computed: {
        ...mapState(['userInfo'])

    },
    mounted(){
        this.orderSn = this.$Route.query.orderSn;
        this.sourceType = this.$Route.query.sourceType;

        this.loadData();
        uni.getSystemInfo({
            success: (res) => {
                this.windowHeight = res.windowHeight;
            }
        });
    },
    onLoad() {
        // this.orderSn = this.$Route.query.orderSn;
        // this.sourceType = this.$Route.query.sourceType;

        // this.loadData();
        // uni.getSystemInfo({
        //     success: (res) => {
        //         this.windowHeight = res.windowHeight;
        //     }
        // });
    },
    // 页面周期与 onLoad 同级
    onBackPress(e) {
        let _this = this
        if (e.from == 'backbutton') {
            uni.showModal({
                title: this.$L('确定要退出评价？'),
                content: this.$L('退出后编辑过的内容将不保存'),
                confirmText: this.$L('是'),
                cancelText: this.$L('否'),
                success: function(res) {
                    if (res.confirm) {
                        _this.$Router.back(1)
                    }
                }
            });
            return true; //阻止默认返回行为
        }
    },
    methods: {
        // 售后详情
        loadData() {
            let param = {
                orderSn: this.orderSn
            }
            orderHandler.getOrderDetail(param).then(res => {
                if (res.state == 200) {

                    this.store_info = res.data.childOrdersVOS[0]
                    this.detailList = res.data.childOrdersVOS[0].orderProductListVOList
                    this.detailList.forEach(item => {
                        this.$set(item, 'content', '')
                        this.$set(item, 'score', 5)
                        this.$set(item, 'rate_text', '非常好')
                        this.$set(item, 'goodsList', [])
                        this.$set(item, 'imgList', [])
                    })
                    this.$set(this.store_info, 'serviceAttitude', 5)
                    this.$set(this.store_info, 'description', 5)
                    this.$set(this.store_info, 'expressSpeed', 5)
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        // 商品价格格式化
        bigPrice(val) {
            return val.toFixed(2).toString().split('.')[0]
        },
        smallPrice(val) {
            return val.toFixed(2).toString().split('.')[1]
        },
        // 店铺评价时间
        onChangeStore(e) {
            if (e.value >= 4) {
                this.store_eva_text[e.text] = '好评'
            } else if (e.value > 1 && e.value < 4) {
                this.store_eva_text[e.text] = '中评'
            } else {
                this.store_eva_text[e.text] = '差评'
            }
        },

        onChange(e,item,index) {
            this.detailList[index].score=e.value;
            this.value = e.value
            if (this.value == 5) {
                item.rate_text = '非常好'
            } else if (this.value == 4) {
                item.rate_text = '好'
            } else if (this.value == 3) {
                item.rate_text = '一般'
            } else if (this.value == 2) {
                item.rate_text = '差'
            } else {
                item.rate_text = '非常差'
            }
            this.$forceUpdate()
        },
        // 上传评价图片
        async uploadImg(product) {
            //是否使用app上传文件
            let useAppUpload = await ossHandler.useAppUpload();
            console.log('useAppUpload:',useAppUpload)
            if (useAppUpload){
                let imgList = await ossHandler.appUploadImg();
                if (imgList.length > 0){
                    if (product.goodsList.length + imgList.length >= 5) {
                        uni.showToast({
                            title: '最多上传5张图片！',
                            icon: 'none'
                        })
                    } else {
                        imgList.forEach((imgItem)=>{
                            product.goodsList.push(imgItem.downloadUrl);
                            //去除域名赋值给imgList
                            let tempArr = imgItem.downloadUrl.replaceAll('https://').replaceAll('http://').split('/');
                            tempArr[0] = '';
                            product.imgList.push(tempArr.join('/'));
                        })
                    }
                } else {
                    uni.showToast({
                        title: '上传失败',
                        icon: 'none'
                    })
                }
            } else {
                this.uploadimgByHtml(product);
            }
        },
        //uni上传图片方法
        uploadimgByHtml(product){
            uni.chooseImage({
                count: 5,
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                success: function(res) {
                    // 只上传图片类型文件
                    let fileExt = res.tempFiles[0].type
                    if (fileExt.indexOf('image') === -1) {
                        uni.showToast({
                            title: '只支持上传图片类型文件！',
                            icon: 'none',
                            duration: 1000
                        })
                        return
                    }
                    setTimeout(() => {
                        uni.showLoading()
                    })
                        
                        
                    for (let index = 0;index<res.tempFilePaths.length;index++){
                        
                        if (product.goodsList.length+ index== 5) {
                            uni.hideLoading()
                            uni.showToast({
                                title: '最多上传5张图片！',
                                icon: 'none'
                            })
                            break;
                        }
                            
                            
                        uni.uploadFile({
                            url: getApp().globalData.apiUrl + 'v3/oss/common/upload',
                            filePath: res.tempFilePaths[index],
                            name: 'file',
                            formData: {
                                'source': 'evaluate'
                            },
                            success: (uploadFileRes) => {
                                let result = JSON.parse(uploadFileRes.data);
                                if (result.state == 200) {
                                    product.goodsList.push(result.data.url)
                                    product.imgList.push(result.data.path)
                                }
                            },
                            complete: () => {
                                uni.hideLoading()
                            }
                        });
                    }
                }
            });
        },
        // 删除评价图片
        delUploadImg(index, product) {
            product.goodsList.splice(index, 1)
            product.imgList.splice(index, 1)
        },
        // 提交评价
        publishEvaluation() {
            if (!this.onOff){
                return;
            }
            this.onOff = false;
            let param = {}

            let goodsCommentInfoList = []
            this.detailList.forEach(item => {
                let product = {}
                product.content = item.content
                product.spu = item.spu
                product.image = item.imgList.join(',')
                product.orderProductId = item.orderProductId
                product.sku = item.sku
                product.score = item.score
                goodsCommentInfoList.push(product)
            })
            param.url = 'v3/business/front/orderComment/addOrderComment'
            param.method = 'POST'
            param.header = {
                "Content-Type": "application/json"
            }
            param.data = {
                description: this.store_info.description,
                deliverSpeed: this.store_info.expressSpeed,
                serviceAttitude: this.store_info.serviceAttitude,
                orderSn: this.orderSn,
                goodsCommentInfoList: goodsCommentInfoList
            }
            this.$request(param).then(res => {
                if (res.state == 200) {
                    uni.showToast({
                        title: '评价成功！',
                        icon: 'none',
                        duration: 700
                    })
                    if (this.sourceType == 'orderDetail') {
                        setTimeout(() => {
                            this.$Router.push({path:'/pages/order/detail',query:{orderSn:this.orderSn}})
                        }, 1000)
                    } else if (this.sourceType == 'orderList') {
                        setTimeout(() => {
                            this.$Router.push({path:'/pages/order/list',query:{state:0}})
                        }, 1000)
                    } else {
                        setTimeout(() => {
                            this.$Router.back(1)
                        }, 1000)
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch((e) => {
                //异常处理
                console.error(e);
                this.onOff = true;
            })
        }
    }
}
</script>

<style lang="scss">
    page {
        width: 750rpx;
        margin: 0 auto;
    }

    page,
    .container {
        // background: $bg-color-split;
        height: 100%;
        position: relative;
        overflow: scroll;
    }

    page {
        background-color: white;
    }

    .gap {
        width: 100%;
        height: 20rpx;
        background-color: #f8f8f8;
    }

    .content {
        background-color: #fff;

        .goods_detail_wrap {
            padding: 20rpx;
            width: 100%;
            display: flex;

            .goods_img_wrap {
                width: 140rpx;
                height: 140rpx;
                border-radius: 14rpx;
                margin-right: 20rpx;

                .goods_img {
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 140rpx;
                    height: 140rpx;
                    border-radius: 14rpx;
                }
            }

            .goods_detail_right {
                width: 100%;
                display: flex;
                flex-direction: column;

                .goods_name {
                    margin-top: 20rpx;
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #343434;
                    width: 540rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                }

                .goods_spec {
                    font-size: 26rpx;
                    color: #949494;
                    margin-top: 16rpx;
                }
            }
        }

        .goods_rate {
            display: flex;
            align-items: center;
            padding: 0 20rpx 20rpx 20rpx;
            border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

            .goods_rate_text {
                font-size: 30rpx;
                color: #343434;
                font-weight: 600;
                margin-right: 38rpx;
            }

            .rate_text {
                font-size: 28rpx;
                color: #949494;
                margin-left: 10rpx;
            }
        }

        .remark_wrap {
            padding-bottom: 20rpx;
            box-sizing: border-box;
            width: 710rpx;
            margin: 0 auto;
        }

        .remark_con {
            display: flex;
            align-items: center;
            margin: 40rpx 0;

            image {
                width: 28rpx;
                height: 27rpx;
                margin-left: 23rpx;
            }

            textarea {
                width: 100%;
                font-size: 28rpx;
                color: #949494;
                // box-sizing: border-box;
                padding-left: 14rpx;
                line-height: 128%;
                // word-wrap : break-word;
            }
        }

        .upload_img_wrap {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            white-space: nowrap;
            /* 解决ios手机页面滑动卡顿问题 */
            -webkit-overflow-scrolling: touch;

            .evaluate_img {
                position: relative;
                width: 210rpx;
                height: 220rpx;
                padding-top: 10rpx;
                margin-right: 10rpx;

                .upload_img {
                    width: 210rpx;
                    height: 210rpx;
                }

                .close_img {
                    width: 30rpx;
                    height: 30rpx;
                    position: absolute;
                    right: -10rpx;
                    top: 0rpx;
                    z-index: 999;
                }
            }

            .upload_img_box {
                padding-top: 10rpx;

                .upload_image {
                    width: 210rpx;
                    height: 210rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 2rpx dashed #DEDEDE;

                    image {
                        width: 50rpx;
                        height: 40rpx;
                    }

                    .upload_text {
                        font-size: 26rpx;
                        color: #949494;
                        margin-top: 15rpx;
                    }

                    .upload_img_text {
                        font-size: 20rpx;
                        color: #949494;
                    }
                }
            }
        }

        // }
    }

    .input_state {
        padding: 0 24rpx !important;
        color: #333333 !important;
        line-height: 20rpx;
    }

    .store_evaluate {
        width: 750rpx;
        margin-bottom: 180rpx;

        .store_evaluate_logo_name {
            padding: 32rpx 0;

            .store_logo {
                width: 34rpx;
                height: 32rpx;
                margin-left: 30rpx;
            }

            text {
                font-size: 32rpx;
                color: #2d2d2d;
                margin-left: 10rpx;
            }
        }

        .store_evaluate_list {
            border-top: 1rpx solid #f2f2f2;
            padding: 0 32rpx;
            font-size: 28rpx;

            .store_evaluate_list_item {
                display: flex;
                align-items: center;
                margin-top: 44rpx;

                .rate_text {
                    margin-left: 48rpx;
                }

                .goods_rate_text {
                    margin-right: 50rpx;
                }
            }
        }
    }

    .empty-20 {
        width: 750rpx;
        height: 20rpx;
        background: #F5F5F5;
    }

    .submit_btn_wrap {
        width: 750rpx;
        display: flex;
        justify-content: center;
        position: fixed;
        bottom: 0;
        right: auto;
        left: auto;
        background-color: white;

        .submit_btn {
            width: 668rpx;
            height: 88rpx;
            font-size: 36rpx;
            color: #FEFEFE;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F30300;
            // box-shadow: 1rpx 3rpx 15rpx 0rpx rgba(252, 30, 28, 0.26);
            border-radius: 44rpx;
            margin-bottom: 20rpx;
        }
    }
</style>
