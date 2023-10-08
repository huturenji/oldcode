<template>
    <view>
        <view v-if="showCustom" class="wrap">
            <view class="item">
                <view class="title">意见反馈</view>
                <view class="content">
                    <u--textarea v-model="value" height="240" placeholder="请填写意见或者建议，谢谢！" :maxlength="-1"></u--textarea>
                </view>
            </view>
            <view class="item item1">
                <view class="title">图片</view>
                <view class="content">提供问题截图</view>
            </view>
            <view class="item">
                <view class="title"></view>
                <view class="content">
                    <u-upload
                        :fileList="fileList1"
                        @afterRead="afterRead"
                        @delete="deletePic"
                        name="1"
                        width="120rpx"
                        height="120rpx"
                        multiple
                        :maxCount="10"
                    ></u-upload>
                </view>
            </view>
            <view class="item">
                <view class="title">反馈类型</view>
                <view class="content">
                    <u-radio-group
                        v-model="radiovalue1"
                        placement="column"
                        @change="groupChange"
                    >
                        <u-radio
                            :customStyle="{marginTop: '6px'}"
                            size="28"
                            labelSize="28"
                            iconSize="28"
                            v-for="(item, index) in radiolist1"
                            :key="index"
                            :label="item.name"
                            :name="item.name"
                            @change="radioChange"
                        >
                        </u-radio>
                    </u-radio-group>
                </view>
            </view>
            <view class="btn">
                <u-button @click="submit" type="primary" text="提交" shape="circle"></u-button>
            </view>
        </view>
    </view>
</template>

<script>
import { isNotEmpty } from '@/utils/common.js'
export default {
    data() {
        return {
            showCustom: false,
            value: '',
            fileList1: [],
            // 基本案列数据
            radiolist1: [{
                name: '功能吐槽',
                disabled: false
            },
            {
                name: '系统故障',
                disabled: false
            },
            {
                name: '改进建议',
                disabled: false
            }, 
            {
                name: '其他问题',
                disabled: false
            }],
            // u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
            radiovalue1: ''
            
        };
    },
    
    components: {},
    props: {},
    created(){
        // 初始化渠道配置
        this.initChannelOptions()
    },
        
    
    methods: {
        async initChannelOptions(){
            let { complaintUrl } = await window.getChannelOptions; // 运营后台配置的渠道相关配置
            if(isNotEmpty(complaintUrl) && complaintUrl.startsWith('http')){
                this.openPage(complaintUrl)
            }else{
                this.showCustom = true;
                this.setTitle()
            }
        },
        setTitle(){
            uni.setNavigationBarTitle({
                title: '举报投诉'
            });
        },
        openPage(url){
            window.location.href = url;
        },
        // 删除图片
        deletePic(event) {
            this[`fileList${event.name}`].splice(event.index, 1)
        },
        // 新增图片
        async afterRead(event) {
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            let lists = [].concat(event.file)
            let fileListLen = this[`fileList${event.name}`].length
            // eslint-disable-next-line array-callback-return
            lists.map(item => {
                this[`fileList${event.name}`].push({
                    ...item,
                    status: 'uploading',
                    message: '上传中'
                })
            })
            for (let i = 0; i < lists.length; i++) {
                const result = await this.uploadFilePromise(lists[i].url)
                let item = this[`fileList${event.name}`][fileListLen]
                this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
                    status: 'success',
                    message: '',
                    url: result
                }))
                fileListLen++
            }
        },
        uploadFilePromise() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('')
                }, 1000)
                // let a = uni.uploadFile({
                //     url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
                //     filePath: url,
                //     name: 'file',
                //     formData: {
                //         user: 'test'
                //     },
                //     success: (res) => {
                //         setTimeout(() => {
                //             resolve(res.data.data)
                //         }, 1000)
                //     }
                // });
            })
        },

        submit(){
            uni.showLoading()
            if(!this.value){
                uni.showToast({
                    title: "意见反馈内容不能为空",
                    icon:'none'
                })
                return 
            }
            setTimeout(() => {
                uni.showToast({
                    title: "提交成功，感谢您的反馈",
                    icon:'none'
                })
                this.reset()
            }, 1500)
        },

        reset(){
            this.value = '';
            this.fileList1 = [];
            this.radiovalue1 = '';
        },
        groupChange() {
        },
        radioChange() {
        }
        
    }
};
</script>

<style lang="scss" scoped>
page{
    background-color: #fff;
}
.wrap{
    padding: 30rpx 30rpx;
    .item{
        margin-bottom: 30rpx;
        display: flex;
        .title{
            width: 160rpx;
            font-size: 28rpx;
            color: #666;
        }
        .content{
            flex: 1;
            ::v-deep .u-textarea{
                background-color: #f6f9fd;
            }
        }
        &.item1{
            align-items: center;
            .content{
                color: #999;
            }
        }
    }
    .btn{
        margin-top: 80rpx;
        padding: 0 40rpx;
    }

}
</style>

