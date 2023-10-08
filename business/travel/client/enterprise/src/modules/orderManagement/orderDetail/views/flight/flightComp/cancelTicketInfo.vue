<template>
    <div class="cancel-ticket-container">
        <ul class="content" v-for="(psg,index) in psgList" :key="index">
            <li>
                <span>乘机人</span>
                <span>{{psg.psgName}}</span>
            </li>
            <li class="airline-info">
                <span>航班信息</span>
                <span class="airline-info-content">
                    <div>
                        {{airline.airLineName+airline.flightNo}}
                    </div>
                    <div>
                        {{airline.beginDate | dateFormat}} {{airline.beginTime}}
                        {{airline.sAirportName+airline.sTerminal}}-{{airline.eAirportName+airline.eTerminal}}
                    </div>
                </span>
            </li>
            <li class="customerInsuranceWrap">
                <div class="insuranceleft cursorp" @click="$emit('showInsuranceOption',true)">
                    <Icon type="icon_common_prompt" class="icon icon-btn" size='.36'/>
                    已购保险
                </div>
                <div class="insuranceright" v-if="!!psg.insuranceOrders && 0 < psg.insuranceOrders.length">
                    <div class="customerInsuranceLine cursorp"
                        v-for="(insurance,index) in psg.insuranceOrders" :key="index"
                        @click="$emit('showInsuranceOrder',insurance)">
                        <div class="insurancetext">{{insurance.insuranceProduct.productShortName}}</div>
                        <div v-if="'ALREADY_REFUND'==insurance.insuranceChildOrder.status" class="insurancetips">已退保</div>
                        <div v-else-if="insuranceStatus[insurance.insuranceChildOrder.status].canCancel" class="insurancetips red">退票成功后系统将自动退保</div>
                        <!-- <div v-else-if="isUpCabin" class="insurancetips">可正常使用</div> -->
                        <!-- <div v-else-if="isStartDay" class="insurancetips red">退票成功后需自行退保</div> -->
                        <!-- <div v-else class="insurancetips red">退票成功后需自行退保</div> -->
                        <!-- <div v-else class="insurancetips">退票成功后系统将自动退保</div> -->
                        <Icon type="right" class="icon icon-btn" size='.24'/>
                    </div>
                </div>
                <div class="insuranceright" v-else>
                    <div class="customerInsuranceLine">
                        <div class="insurancetext">无</div>
                    </div>
                </div>
            </li>
        </ul>
        <ul class="content">
            <li class="cancel-reason-title">
                <span>请选择退票原因</span>
            </li>
            <li class="cancel-reason cursorp" @click="showCancelReason=true;">
                <span>
                    {{cancelReason[cancelReasonId].text}}
                </span>
                <span>
                    <i class="icon-arrow"></i>
                </span>
            </li>
        </ul>

        <div class="attachment-container" v-if="cancelReason[cancelReasonId].attachment">
            <div class="title">上传凭证</div>
            <div class="content">
                <div class="tips">
                    <p v-for="(tips,index) in cancelReason[cancelReasonId].tips" :key="index">
                        <template v-if='typeof(tips)=="function"'>
                            {{tips()}}
                        </template>
                        <template v-else>
                            {{tips}}
                        </template>
                    </p>
                </div>
                <div class="attachments-container">
                    <div class="attachments" v-for="(file,index) in uploadFiles" :key="index">
                        <div class="preview">
                            <div class="del cursorp" @click="delAttachment(index)"></div>
                            <img :src="file.path" />
                        </div>
                        <div class="error-file" v-if="!file.uploadStatu" @click="showUploadError(file.errorReason)">上传失败</div>
                    </div>
                    <img id="imgContent">
                    <div class="addAttachment">
                        <Icon type="icon_mall_shangchuan" class="icon" size='.48'/>
                        <div class='text'>最多九张</div>
                        <input type="file" class="addAttachment" multiple @change="addAttachmentFile" accept="image/*" />
                        <div class="upload-tips" >上传凭证</div>
                    </div>
                </div>
            </div>
        </div>

        <ul class="content">
            <li>
                <span>可退金额</span>
                <span>以航空公司审核为准</span>
            </li>
        </ul>

        <div class="cancel-notice">
            <div class="title">退票须知</div>
            <div>
                退票申请一经提交将会取消机位，如因航班变动或病退原因提交申请，则具体审核结果以航空公司为准，如航空公司审核不通过，将直接按照自愿退票申请进行退款。
            </div>
            <div v-if='orderDetail.providerType==0' style='margin-top: .1rem;'>
                供应商在线改签时间为07:00-23:59，其他时间将暂停服务。
            </div>
        </div>
        <div class='btn-group'>
            <SnButton class="btn-submit normal-btn cursorp" type="primary" @click="submitApply">提交申请</SnButton>
        </div>

        <footer>
            <span>问题没有解决？</span>
            <span class="customer-service icon-btn cursorp" @click="$emit('callPhone')">联系客服</span>
        </footer>

        <div v-if="showCancelReason" class="cancel-reason-container">
            <div class="title">请选择退票原因</div>
            <ul>
                <li v-for="(reason,key) in cancelReason" :key="key" class="normal-btn cursorp" :class="{selected: key==cancelReasonId}"
                    @click="chooseReason(key)">
                    <div>{{reason.text}}</div>
                    <div v-if="reason.attachment" class="tips">需提交相关凭证</div>
                </li>
            </ul>
        </div>

        <div v-transfer-dom>
            <loading :show="uploading" text=""></loading>
        </div>

        <!-- 遮罩层：当前页作为子组件引入父组件时，当前popup自带的遮罩层会和父组件的popup遮罩层冲突而不可使用，所以需要自己实现一个 -->
        <div class="mask cursorp" v-show="showCancelReason" @click="showCancelReason=false"></div>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
// import requestHandler from 'orderCommon/requestHandler.js';
// import scrollLockMixin from 'orderCommon/scrollLockMixin'
import {insuranceStatus} from 'orderCommon/enum/orderStatusEnum.js'
import {
    TransferDom,
    Loading
} from 'vux';
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    directives: {
        TransferDom
    },
    components: {
        Loading,SnButton, Icon
    },
    props: {
        baseConfig: {
            type: Object,
            default: function() {
                return {evidencesSize: 1}
            }
        },
        providerShortName: {
            type: String
        },
        orderDetail: {
            type: Object,
            default: function() {
                return {}
            }
        },
        airline: {
            type: Object,
            default: function() {
                return {}
            }
        },
        psgList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data: function () {
        let managerData = extendUtils.stateManager.setData([
            //展示退票原因
            {
                name: 'showCancelReason',
                parent: '$refs.cancelTicketInfo',
                hide: {
                    title: '退票申请'
                }
            }
        ])
        return Object.assign(managerData, {
            psgNames: null,
            uploadFiles: [],//上传的附件
            cancelReasonId: 0,
            attachmentFile: null,//附件
            uploading: false,//上传进度loading
            cancelReason: {
                0: {
                    id: 0,
                    text: '我的行程有变，不飞了',
                    attachment: 0,//不需要凭证
                    refundType: 1//自愿退票
                },
                1: {
                    id: 1,
                    text: '填错名字、选错日期、选错航班',
                    attachment: 0,
                    refundType: 1//自愿退票
                },
                2: {
                    id: 2,
                    text: '航班延误或取消，航班时刻变更',
                    attachment: 1,//需要凭证
                    tips: [
                        '请上传航变资料，如：航司开具的延误证明，拍照或截图上传即可',
                        '证明资料以航空公司的规定为准，提交成功后我们会尽快处理，请您耐心等待',
                        ()=>`凭证总大小不能超过${this.baseConfig.evidencesSize || 1}MB`
                    ],
                    refundType: 2//非自愿退票
                },
                3: {
                    id: 3,
                    text: '身体原因且有相关医院证明',
                    attachment: 1,
                    tips: [
                        '凭证内容说明：',
                        '二甲医院以上病例、诊断证明书、不适宜乘机证明',
                        ()=>`凭证总大小不能超过${this.baseConfig.evidencesSize || 1}MB`
                    ],
                    refundType: 2//非自愿退票
                }
            },
            insuranceStatus:insuranceStatus//保险订单状态
        })
    },
    filters: {
        dateFormat: function (value) {
            try {
                let startDate = new Date(value);
                let dateStr = startDate.format("MM月dd日");
                let week = extendUtils.indexToWeek(startDate.getDay());
                return dateStr + " " + week;
            } catch (e) {
                return null;
            }
        }
    },
    watch: {
        airline: function (newValue) {
            this.airline = newValue;
        },
        psgList: function (newValue) {
            if (newValue) {
                let psgNameArr = [];
                newValue.forEach((e) => {
                    e && psgNameArr.push(e.psgName);
                });
                this.psgNames = psgNameArr.join(",");
                console.log(newValue)
            }
        },
        baseConfig: function (newValue) {
            this.baseConfig = newValue;
        }
    },
    created: function () {
    },
    mounted() {
    },
    methods: {
        /**
             * 初始化页面内容
             */
        init() {
            this.psgNames = null;
            this.showCancelReason = false;//展示退票原因
            this.cancelReasonId = 0;
            this.attachmentFile = null;//附件
            this.uploadFiles = [];//上传的附件
            this.uploading = false;//上传进度loading
        },
        /**
             * 选择退票原因
             * @param id 原因id
             */
        chooseReason(id) {
            this.cancelReasonId = id;
            this.showCancelReason = false;
        },
        /**
             * 上传附件
             * @param event
             */
        addAttachmentFile(event) {
            const that = this;
            const maxLength = this.baseConfig.evidencesAmount;
            const fileSize = this.baseConfig.evidencesSize;
            const eventFiles = [...event.currentTarget.files];
            const length = eventFiles.length;//当前上传的文件个数

            //总文件数量限制
            if (that.uploadFiles.length+length > maxLength) {
                extendUtils.showToast('凭证数量不可超过' + maxLength + '个');
                event.currentTarget.value = '';//清空文件，否则再次选择同一个文件不会除非change事件
                return;
            }

            //文件类型判断
            const regex = /^image\s*/;
            for (let j = 0; j < length; j++) {
                if (!regex.test(eventFiles[j].type)) {
                    extendUtils.showToast('仅支持上传图片文件');
                    return;
                }
            }

            let fileArray = [];
            for (let i = 0; i < length; i++) {
                let uploadStatu = true;//上传状态，默认成功
                let errorReason = null;//上传失败原因
                let imgId = new Date().getTime();//图片唯一标识
                //单个文件大小限制，如果超过限制，则不上传，只预览
                if (eventFiles[i].size > fileSize * 1024 * 1000) {
                    uploadStatu = false;
                    errorReason = `图片大小超过${fileSize}MB，上传失败`;
                }

                let imgObj = {
                    id: imgId,
                    uploadStatu: uploadStatu,
                    errorReason: errorReason
                }
                //预览上传的图片
                that.previewImg(eventFiles[i], imgObj);

                //如果图片校验失败，则不上传，只预览
                if (!uploadStatu){
                    that.uploadFiles.push(imgObj)
                    continue;
                }

                that.uploading = true;
                let file = eventFiles[i];
                file.businessType = 'postsale';
                file.imgObj = imgObj;
                fileArray.push(file);
            }
            if (fileArray.length>0){
                extendUtils.uploadhandler.upload2Ceph(fileArray).then(data=>{
                    that.uploading = false;
                    fileArray.forEach(file=>{
                        let resultFile = data.find(d => d && d.fileName==file.name)
                        if (!!resultFile){
                            file.imgObj.serverPath = resultFile.downLoadUrl;//文件服务器的路径
                        } else {
                            file.imgObj.errorReason = '网络异常，上传失败';
                            file.imgObj.uploadStatu = false;
                        }
                        that.uploadFiles.push(file.imgObj)
                    })
                }).catch((e) => {
                    that.uploading = false;
                    let errorCode = e.resultCode;
                    extendUtils.showToast('网络异常，上传失败' + (errorCode ? `(${errorCode})` : ''));
                    console.error(e);
                });
            }
            event.currentTarget.value = '';//清空文件，否则再次选择同一个文件不会除非change事件
        },
        /**
             * 生成预览图
             */
        previewImg(file, imgObj) {
            let that = this;
            if (window.FileReader) {
                var filereader = new FileReader();
                filereader.onload = function (event) {
                    var srcpath = event.target.result;
                    imgObj.path = srcpath;
                    that.$forceUpdate()
                };
                filereader.readAsDataURL(file);
            }
        },
        /**
             * 展示图片上传错误的原因
             */
        showUploadError(msg){
            extendUtils.showToast(msg);
        },
        /**
             * 删除上传的附件
             */
        delAttachment(index) {
            this.uploadFiles.splice(index, 1);
        },
        /**
             * 确认提交退票申请
             */
        onConfirm() {
            let obj = {};
            obj.path = [];
            this.uploadFiles.forEach(file=>{
                file.uploadStatu && obj.path.push(file.serverPath);
            });
            obj.refundType = this.cancelReason[this.cancelReasonId].refundType;
            obj.remark = this.cancelReason[this.cancelReasonId].text;
            this.$emit('onConfirm', obj);
        },
        /**
             * 点击提交按钮
             */
        submitApply() {
            let that = this;
            if (this.cancelReason[this.cancelReasonId].attachment && (!this.uploadFiles || this.uploadFiles.filter(file=>{ return file.uploadStatu }).length == 0)) {
                extendUtils.showToast('请上传凭证');
                return;
            }
            extendUtils.showConfirm('确定提交退票申请？', function () {
                that.onConfirm();
            }, 2, '取消', '确定', null, function () {}, true);
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';
    @import '~styles/mixins/mixinsStyle.less';

    .cancel-ticket-container {
        font-size: .32rem;
        min-height: 100%;
        color: @text-color;
        background: @background-color;
        overflow: auto;
        position: relative;
        padding-bottom: 1.2rem;

        ul.content {
            width: 100%;
            padding: 0 .3rem;
            background: @sub-background-color;
            margin-bottom: .2rem;

            li {
                display: flex;
                justify-content: space-between;
                min-height: .92rem;
                line-height: .92rem;
                font-size: .32rem;

                &:not(:last-of-type) {
                    .bbpx(1px, @border-color-base);
                }

                span {
                    .no-wrap;

                    .icon-arrow {
                        font-size: .2rem;
                        color: @third-text-color;
                        margin-left: @white-space-sm
                    }

                    &:first-of-type {
                        width: 1.5rem;
                        color: @secondary-text-color;
                    }

                    &:last-of-type {
                        max-width: calc(~"100% - 1.5rem");
                        color: @text-color;
                        text-align: right;

                        &.blue {
                            color: @theme-color;
                        }
                    }
                }

                &.cancel-reason-title {
                    span {
                        max-width: initial;
                        width: auto;
                        color: @third-text-color;
                    }
                }

                &.cancel-reason {
                    span {
                        text-align: left;
                        color: @text-color;
                        max-width: initial;
                        width: auto;

                        .icon-arrow {
                            float: none;
                        }
                    }
                }

                &.airline-info {
                    min-height: 1.52rem;
                    height: initial;

                    .airline-info-content {
                        .flex-box;
                        flex-direction: column;
                        line-height: initial;

                        div {
                            &:first-of-type {
                                margin-bottom: .16rem;
                                padding-top: .2rem;
                            }

                            &:last-of-type {
                                padding-bottom: .2rem;
                            }
                        }
                    }
                }
            }
        }

        .cancel-notice {
            color: @third-text-color;
            font-size: .26rem;
            padding: 0 .3rem;
            margin: .2rem 0 1rem;

            .title {
                font-weight: bold;
                font-size: .28rem;
                margin-bottom: .15rem;
            }
        }

        .btn-group{
            margin: 0 .3rem;
            .btn-submit {
                margin: .5rem 0 0;
            }
        }

        footer {
            width: 100%;
            color: @third-text-color;
            font-size: .24rem;
            text-align: center;
            margin: .3rem 0 .42rem;
            position: absolute;
            bottom: 0;

            span {
                display: inline-block;
                line-height: .31rem;
                height: .31rem;
            }

            .customer-service {
                color: @theme-color;
                margin-left: .05rem;
            }

            &:before,
            &:after {
                display: inline-block;
                vertical-align: middle;
                content: '';
                font-size: 0;
                position: relative;
                width: .74rem;
                border-top: .01rem solid #C2C2C2;
                margin: 0 .2rem;
                height: .01rem;
            }

            &.fixed-bottom {
                position: absolute;
                bottom: .12rem;
            }
        }

        .attachment-container {
            background: #fff;
            padding: 0 .3rem  .4rem;
            margin-bottom: .2rem;

            .title {
                .bbpx(1px, @border-color-base);
                height: .92rem;
                line-height: .92rem;
            }

            .content {
                padding: .32rem 0;

                .tips {
                    font-size: .28rem;
                    color: #555;

                    p {
                        margin-bottom: .31rem;
                    }
                }
                .attachments-container {
                    .clear;

                    .upload-tips{
                        margin-top: .05rem;
                        font-size: .24rem;
                    }

                    .attachments {
                        float: left;
                        margin-right: .44rem;
                        position: relative;
                        height: 1.5rem;
                        width: 1.25rem;

                        .error-file{
                            background: url(~assets/img/compment/icon_tips_red.png) left center no-repeat transparent;
                            background-size: .23rem;
                            text-indent: .25rem;
                            margin-top: .05rem;
                            font-size: .22rem;
                            color: @danger-color-light ;
                        }


                        .preview{
                            height: 1rem;
                            width: 1rem;
                            position: relative;
                            margin: 0 auto;
                            img {
                                height: 1rem;
                                width: 1rem;
                                border: none;
                                border-radius: @border-radius-sm;
                            }

                            .del {
                                position: absolute;
                                width: .44rem;
                                height: .44rem;
                                background: url(~assets/img/compment/icon_attachment_del.png) center no-repeat transparent;
                                background-size: contain;
                                top: -.22rem;
                                right: -.22rem;
                                border-radius: 50%;
                            }
                        }

                    }

                    .addAttachment {
                        position: relative;
                        height: 1rem;
                        width: 1rem;
                        background-color: @background-color;
                        border: none;
                        float: left;
                        border-radius: @border-radius-sm;

                        .text{
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            transform: translateX(-50%) scale(.5);
                            white-space: nowrap;
                            font-size: .32rem;
                            color:@third-text-color;
                        }

                        .icon{
                            fill: @text-color;
                            position: absolute;
                            top: .16rem;
                            left: 50%;
                            transform: translateX(-50%);
                        }

                        input {
                            opacity: 0;
                        }
                    }
                }

            }
        }
        .customerInsuranceWrap {
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.05rem;

            .insuranceleft {
                display: flex;
                align-items: center;
                height: 1.34rem;
                width: 2.08rem;
                font-size: .28rem;
                color: @third-text-color;

                .icon {
                    fill: @warning-color-light;
                    vertical-align: middle;
                    width: .3rem;
                    padding-left: inherit;
                    margin-right: .1rem;
                }

            }
            .insuranceright {
                font-size: .28rem;
                color: @text-color;
                flex: 1;

                .icon-btn{
                    fill: @placeholder-color;
                }

                .customerInsuranceLine {
                    display: flex;
                    align-items: flex-end;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    text-align: right;
                    padding-right: .4rem;
                    height: 1.34rem;
                    line-height: initial;

                    .icon{
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        margin-left: @white-space-sm;
                        font-size: .16rem;
                        color: @third-text-color;
                    }


                    .insurancetext{
                        font-size: .28rem;
                    }

                    .insurancetips {
                        padding-top: 0.08rem;
                        color: @success-color;
                        font-size: .26rem;

                        &.red {
                            color: @danger-color-light;
                        }

                    }

                    &:not(:last-of-type) {
                        .bbpx(1px, @border-color-base);
                    }

                }
            }

        }

    }


    .mask {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        tap-highlight-color: transparent;
        z-index: 501;
        transition: opacity .4s;
    }

    .cancel-reason-container {
        position: absolute;
        top: 10vh;
        left: 5vw;
        z-index: 502;
        background: #fff;
        border-radius: .3rem;
        width: 90vw;
        padding: .5rem 0;
        color: @text-color;

        .title {
            font-size: .32rem;
            margin: 0 auto .3rem;
            font-weight: bold;
            text-align: center;
        }

        ul {
            padding: 0 .4rem;

            li {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-direction: column;
                padding: .35rem .1rem;
                height: 1.1rem;
                border-bottom: .01rem solid #e5e5e5;
                text-align: left;

                .tips {
                    color: @theme-color;
                    font-size: .24rem;
                }

                &:last-of-type {
                    border-bottom-color: transparent;
                }

                &.selected {
                    background: url(~assets/img/compment/icon_choosed.png) right .1rem center no-repeat;
                    background-size: contain;
                    background-origin: content-box;
                }
            }
        }
    }

</style>
