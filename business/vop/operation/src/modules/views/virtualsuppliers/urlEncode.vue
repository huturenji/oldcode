<template>
    <div
        class="codeBox"
    >
        <div class="option_item">
            <span>原始链接地址</span>
            <el-input
                placeholder="请输入链接地址"
                v-model="originalUrl"
            ></el-input>
        </div>
        <div class="option_item">
            <span>channelId(渠道id)</span>
            <el-input
                placeholder="请输入渠道ID，如：9729。非必填"
                v-model="channelId"
            ></el-input>
        </div>
        <div class="option_item">
            <span>companyId(公司id)</span>
            <el-input
                placeholder="请输入公司ID，非必填"
                v-model="companyId"
            ></el-input>
        </div>
        <div class="option_item">
            <span>userId(用户id)</span>
            <el-input
                placeholder="请输入用户ID，非必填"
                v-model="userId"
            ></el-input>
        </div>
        <div class="option_item">
            <span>appId(小程序id)</span>
            <el-input
                placeholder="请输入小程序ID，非必填"
                v-model="appId"
            ></el-input>
        </div>
        <div class="option_item">
            <span>openId(openid)</span>
            <el-input
                placeholder="请输入小程序用户ID，非必填"
                v-model="openId"
            ></el-input>
        </div>
        <div class="option_item flex_item">
            <span>编码后的url</span>
            <div class="url">
                {{ codingUrl }}
            </div>
            <div class="copy_btn">
                <el-button
                    @click="copyUrl"
                >
                    一键复制
                </el-button>
            </div>
        </div>
        <div class="btn_box">
            <el-button
                type="primary"
                @click="encodeUrl"
            >
                点击编码
            </el-button>
            <el-button
                type="primary"
                @click="reset"
            >
                重置
            </el-button>
        </div>
        <div class="tips">
            <div>原始链接地址示例：<span>原始链接中不要带channelId,companyId,userId,appId,openId,bp-param等参数，可能会出错。</span></div>
            <div>首页：https://cloud.sinosun.com/mallbbcg2bank/static/mobile/index.html#/</div>
            <div>专题页：https://cloud.sinosun.com/mallbbcg2bank/static/mobile/index.html#/pages/topic/index?id=111158</div>
            <div>商品详情页：https://cloud.sinosun.com/mallbbcg2bank/static/mobile/index.html?sku=PAABJD100006831451#/</div>
        </div>
    </div>
</template>

<script>
import utils from "bislibs/utils";
import { Base64 } from 'js-base64'
export default {
    data() {
        return {
            originalUrl:'',
            channelId:'',
            companyId:'',
            userId:'',
            openId:'',
            appId:'',
            codingUrl:'',
            bpparam:{}
        };
    },
    created() {},
    methods: {
        encodeUrl() {
            let callBackUrl = ''
            this.bpparam = {}
            if (this.channelId) {
                this.bpparam.channelId = this.channelId
            }
            if (this.companyId) {
                this.bpparam.companyId = this.companyId
            }
            if (this.userId) {
                this.bpparam.userId = this.userId
            }
            if (this.appId) {
                this.bpparam.appId = this.appId
            }
            if (this.openId) {
                this.bpparam.openId = this.openId
            }

            if (JSON.stringify(this.bpparam)!='{}') {
                if (this.originalUrl.indexOf('?') === -1) {  
                    if (this.originalUrl.indexOf('#/') == this.originalUrl.length - 2 || this.originalUrl.indexOf('#') == this.originalUrl.length - 1) {
                        callBackUrl = this.originalUrl + '?bp-param=' + this.setBpParam(this.bpparam)
                    } else {
                        callBackUrl = this.originalUrl + '#/?bp-param=' + this.setBpParam(this.bpparam)
                    }
                
                } else if (this.originalUrl.indexOf('#/') == this.originalUrl.length - 2 || this.originalUrl.indexOf('#') == this.originalUrl.length - 1) {
                    callBackUrl = this.originalUrl + '?bp-param=' + this.setBpParam(this.bpparam)
                } else {
                    callBackUrl = this.originalUrl + '&bp-param=' + this.setBpParam(this.bpparam)
                }
            } else {
                callBackUrl = this.originalUrl
            }
            this.codingUrl = callBackUrl
        },
        // 加密方法
        setBpParam(data) {
            let paramStr = ''
            if (data) {
                paramStr = Base64.encodeURI(JSON.stringify(data))
            }
            return paramStr
        },
        // 重置
        reset() {
            this.originalUrl = '';
            this.channelId = '';
            this.companyId = '';
            this.userId = '';
            this.appId = '';
            this.openId = '';
            this.codingUrl = '';
            this.bpparam = {};
        },
        copyUrl() {
            if (!this.codingUrl) {
                utils.showToast("请先生成链接");
                return
            }
            utils.copyToClipboard(this.codingUrl);
            utils.showToast("复制成功");
        }
    }
};
</script>

<style scoped lang='less'>
.codeBox {
    width: fit-content;
    padding: 20px;
    .option_item {
        display: flex;
        padding: 10px;
        span {
            width: 160px;
            margin-right: 20px;
            height: 40px;
            line-height: 40px;
            text-align: right;
        }
        .el-input {
            width: 800px;
        }
        div {
            width: 100%;
            max-width: 800px;
            word-break: break-all;
            color: green;
        }
        &.flex_item {
            display: flex;
            .url {
                width: 800px;
                min-height: 40px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                    border-radius: 4px;
                border: 1px solid #DCDFE6;
            }
            .copy_btn {
                width: fit-content;
                margin-left: 10px;
            }
        }
    }
    .btn_box {
        text-align: center;
    }
    .tips {
        margin-top: 20px;
        span {
            color: #f30300;
        }
    }
}
</style>