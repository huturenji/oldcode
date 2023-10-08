<template>
    <div class="channeAdd">
        <div v-if="addAuth">
            <!-- 基础信息开始 -->
            <div class="baseInfo">
                <div class="infoTitle">
                    基础信息
                </div>
                <div style="padding: 0 0 1px;">
                    <div class="infoListBox">
                        <div 
                            class="infoLi imgfa" 
                            style="margin:0 0 16px 0"
                            v-if="channelType=='parent'"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>平台ID :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px;"
                                    :maxlength="16"
                                    clearable
                                    v-model="channelBasicInfo.channelId"
                                    placeholder="由仓库管理员分配"
                                ></el-input>
                            </div>
                        </div>
                        <div 
                            class="infoLi imgfa" 
                            style="margin:0 0 16px 0"
                            v-if="channelType=='children'"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道ID :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px;"
                                    :maxlength="16"
                                    clearable
                                    v-model="channelBasicInfo.channelId"
                                    disabled
                                    placeholder="自动生成(平台+渠道标识)"
                                ></el-input>
                            </div>
                        </div>
                        <div 
                            v-if="channelType=='children'"
                            class="infoLi imgfa" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                店铺标识 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px;"
                                    :maxlength="16"
                                    clearable
                                    v-model="channelBasicInfo.identifier"
                                    @input="identifierChange"
                                    placeholder="请输入店铺标识"
                                ></el-input>
                            </div>
                        </div>                        
                        <div
                            class="infoLi"
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道全称 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    :maxlength="64"
                                    clearable
                                    v-model.trim="channelBasicInfo.name"
                                    placeholder="如有多套环境，需清晰表示当前环境"
                                ></el-input>
                            </div>
                        </div>
                        <div
                            class="infoLi"
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道简称 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    :maxlength="10"
                                    clearable
                                    v-model.trim="channelBasicInfo.shortName"
                                    placeholder="如有多套环境，需清晰表示当前环境"
                                ></el-input>
                            </div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>结算方式 :
                            </div>
                            
                            <el-radio-group v-model="channelBasicInfo.paymentType">
                                <el-radio :label="1">
                                    账期
                                </el-radio>
                                <!-- <el-radio :label="2">月结</el-radio> -->
                            </el-radio-group>
                            
                        </div>
                    </div>
                </div>
          
                
            </div>
            <!-- 基础信息结束 -->
            <!-- 支付方式开始 -->
            <!-- <div class="payTypeInfo">
                <div class="infoTitle">渠道接入配置</div>
                <div>                  
                    <div class="infoListBox">
                        <div v-for="(item,index) in Object.keys(channelConfigTextMaps)" :key="index"
                            class="infoLi imgfa"  style="margin: 0px 0 16px 0">
                            <div class="infoMsg">{{channelConfigTextMaps[item].name}}</div>
                            <div>
                                <el-input 
                                    style="width:800px"
                                    clearable
                                    :maxlength="1024"
                                    v-model.trim="findChannelConfig1(configList,item).configValue"
                                    :placeholder="channelConfigTextMaps[item].placeholder"></el-input>
                            </div>
                        </div>
                        
                    
                    </div>
                </div>
                 
                
            </div> -->
            <!-- 按钮list开始 -->
            <div class="btnList">
                <el-button 
                    @click="addChannel" 
                    :loading="loads" 
                    type="primary"
                >保存</el-button>
                <el-button @click="$router.go(-1)">
                    取消
                </el-button>
            </div>
            <!-- 按钮list结束 -->
            
           
        </div>
        <el-dialog
            :visible.sync="hasAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="485px"
            center
        >
            <div 
                slot="title" 
                class="header-title"
            >
                <span class="confirmTitle">权限确认</span>
                <span
                    class="cancelBtn"
                    @click="hasAuth=false"
                >×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div 
                slot="footer" 
                class="dialog-footer"
            >
                <el-button 
                    type="primary" 
                    @click="hasAuth=false"
                >我知道了</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import channelHandler from "bislibs/requestHandler/channelhandler";
import permissionManager from "bislibs/permissionhandler/eventlistenerhandler";
import utils from "bislibs/utils";


export default {
    data() {
        return {
            loads: false, //控制重复点击
            channelConfigTextMaps:utils.channelConfigTextMap(),
            channelBasicInfo: {
                name: null,
                channelId: null,
                shortName:null,
                paymentType:null
            },
            // publicKey: null,
            // subjectIssuer: null,
            addAuth: permissionManager.hasAuth("channelmgr"),
            hasAuth: false,
            configList: [],
            channelType:this.$route.query.channelType // parent  children
        };
    },
    beforeCreate() {},
    created() {
        if (!this.addAuth) {
            this.hasAuth = true;
        }
        Object.keys(this.channelConfigTextMaps).forEach(element => {
            this.configList.push({
                configKey:element,
                configValue:""
            })                
        });               
    },
    methods: {
        findChannelConfig1(configList, key){
            return utils.findChannelConfig(configList, key)
        },          
        //返回
        goBack() {
            this.$router.go(-1);
        },

        // 获取渠道信息
        getChannelInfo() {},

        identifierChange(value){
            const platformId = this.$route.query.platformId
            if (value){
                this.channelBasicInfo.channelId = `${platformId}_${value}`
            } else {
                this.channelBasicInfo.channelId = ''
            }
        },

        // 请求公钥
        // confirm() {
        //     let params = {
        //         channelId: this.channelBasicInfo.channelId, //ID
        //         channelName: this.channelBasicInfo.channelName, //渠道name
        //         publicKey: this.publicKey, //渠道公钥
        //         subjectIssuer: this.subjectIssuer //公钥地址
        //     };
        //     request("/addIdp", params, {
        //         show: this.publicKey ? "" : "show"
        //     }).then(res => {
        //         if (res && res.resultCode == 0) {
        //             utils.showToast("保存成功");
        //             this.loads = false;
        //             this.$router.push("/channelAllocation");
        //         }
        //     });
        // },
        // 新增配置
        addChannel() {
            if (!this.channelBasicInfo.channelId) {
                utils.showToast("请输入渠道ID");
                return false;
            }
            if (!this.channelBasicInfo.name) {
                utils.showToast("请输入渠道全称");
                return false;
            }
            if (!this.channelBasicInfo.shortName) {
                utils.showToast("请输入渠道简称");
                return false;
            }
            if (!this.channelBasicInfo.paymentType) {
                utils.showToast("请选择结算方式");
                return false;
            }
            // if (this.publicKey && !this.subjectIssuer) {
            //     utils.showToast("请输入渠道颁发地址");
            //     return false;
            // }
            // if (!this.publicKey && this.subjectIssuer) {
            //     utils.showToast("请输入渠道公钥");
            //     return false;
            // }

            // configValue有值得时候才会将审批节日地址传入
            // 审批接入地址为空的时候相当于不添加配置信息
                    

            this.loads = true;
            channelHandler.addChannel(this.channelBasicInfo).then(res => {
                if (res && res.resultCode == 0) {
                    // if (this.publicKey) {
                    //     this.confirm();
                    // } else {
                    utils.showToast("保存成功");
                    this.loads = false;
                    this.$router.push("/channellist");
                    // }
                } else {
                    this.loads = false;
                }
            }).catch(e=>{
                console.log(e)
                this.loads = false;
            });
        }
    },

    filters: {},
    watch: {}
};
</script>
<style lang="less" scoped>
.channeAdd {
    font-size: 14px;
    min-height: 100%;
    .baseInfo {
        border-radius: 8px;
        background-color: #fff;
    }
    .payTypeInfo {
        border-radius: 8px;
        background-color: #fff;
        margin: 16px 0 0 0;
        padding-bottom: 1px;
    }

    .infoTitle {
        font-size: 14px;
        font-weight: bold;
        padding: 16px 32px 8px;
        border-bottom: 2px solid #eeeeee;
        color: #272727;
    }

    .infoListBox {
        padding: 24px;
        box-sizing: border-box;
        border: 1px solid #eeeeee;
        margin: 24px 32px;
        border-radius: 8px;
        .infoLi {
            display: flex;
            align-items: center;
            .infoMsg {
                text-align: right;
                width: 105px;
                margin-right: 10px;
                word-break: break-all;
            }
        }
    }
    // }

    .requireMsg {
        color: #ff0000;
        padding-right: 4px;
    }
}

.uploadwrap {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
}
</style>
<style lang="less">
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    appearance: none;
    margin: 0;
}
/* 火狐浏览器样式清除 */
input[type="number"]{
    -moz-appearance:textfield;
}
.channeAdd {
    .el-input--suffix .el-input__inner {
        padding: 0 8px;
        line-height: 1px;
    }
    .el-textarea__inner {
        padding: 8px;
    }
}

.el-dialog--center .el-dialog__body {
    text-align: center;
}
.btnList {
    padding: 30px;
    text-align: center;
    .el-button {
        width: 144px;
        height: 48px;
        border-radius: 8px;
        &:hover {
            color: #fff;
            background-color: #478aee;
            border: 1px solid #478aee;
            opacity: 0.8;
        }
    }
    .el-button--primary {
        background-color: #478aee;
        border: 1px solid #478aee;
    }
    .el-button--default {
        color: #fff;
        background-color: #c2c2c2;
        border: 1px solid #c2c2c2;
    }
}
</style>
