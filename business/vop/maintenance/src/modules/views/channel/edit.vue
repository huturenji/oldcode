<template>
    <div class="channelEdit">
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
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道ID :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    :disabled="true"
                                    v-model.trim="channelBasicInfo.channelId"
                                    placeholder="请输入渠道ID，找行长确认"
                                ></el-input>
                            </div>
                           
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道全称 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    :maxlength="100"
                                    clearable
                                    v-model.trim="channelBasicInfo.channelName"
                                    placeholder="如有多套环境，请找行长确认，需清晰表示当前环境"
                                ></el-input>
                                    
                            </div>
                        </div>
                    </div>
                </div>
          
                
            </div>
            <!-- 基础信息结束 -->
            <!-- 支付方式开始 -->
            <div class="payTypeInfo">
                <div class="infoTitle">
                    渠道接入配置
                </div>
                <div>              
                    <div class="infoListBox">
                        <div
                            v-for="(item,index) in Object.keys(channelConfigTextMaps)"
                            :key="index" 
                            class="infoLi imgfa"
                            style="margin: 0px 0 16px 0"
                        >
                            <div class="infoMsg">
                                {{ channelConfigTextMaps[item].name }}
                            </div>
                            <div>
                                <el-input 
                                    style="width:800px"
                                    clearable
                                    :maxlength="1024"
                                    v-model.trim="findChannelConfig1(configList,item).configValue"
                                    :placeholder="channelConfigTextMaps[item].placeholder"
                                ></el-input>
                            </div>
                        </div>                     
                        <!-- <div 
                            class="infoLi imgfa" 
                            style="margin: 16px 0 16px 0">
                           
                            <div class="infoMsg">公钥颁发地址 : </div>
                            <div>
                                <el-input 
                                    style="width:800px"
                                    clearable
                                    :maxlength="1024"
                                    v-model.trim="subjectIssuer"
                                    placeholder="请输入公钥颁发地址"></el-input>
                            </div>
                        </div>
                        <div 
                            class="infoLi imgfa" >
                            <div class="infoMsg">渠道公钥 : </div>
                            <div>
                                <el-input 
                                    style="width:800px"
                                    type="textarea"
                                    show-word-limit
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    :maxlength="400"
                                    v-model.trim="publicKey"
                                    placeholder="请输入渠道公钥，用于在keycloak授权下的idtoken exchange"></el-input>
                            </div>
                        </div> -->
                    
                    </div>
                </div>
             
            </div>
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
            loads: false,
            channelConfigTextMaps:utils.channelConfigTextMap(),
            channelBasicInfo: {
                channelName: null,
                channelId: null
            },
            addAuth: permissionManager.hasAuth("channelmgr"),
            hasAuth: false,
            // publicKey: null,
            // subjectIssuer: null,
            configList: []
            // isrequr: false
        };
    },
    beforeCreate() {},
    created() {
        if (this.addAuth) {
            this.channelBasicInfo =
                JSON.parse(utils.getSession("info")) || {};
            Object.keys(this.channelConfigTextMaps).forEach(element => {
                this.configList.push({
                    configKey:element,
                    configValue:this.findChannelConfig1(this.channelBasicInfo.channelAccessConfigs,element).configValue||""
                })                
            });   
            // this.channelBasicInfo.channelAccessConfigs.length > 0
            //     ? (this.configList = this.channelBasicInfo.channelAccessConfigs)
            //     : "";

            // this.getChannelInfo();
        } else {
            this.hasAuth = true;
        }
    },
    methods: {
        findChannelConfig1(configList, key){
            return utils.findChannelConfig(configList, key)
        },        
        // 获取公钥信息
        // getChannelInfo() {
        //     let params = {
        //         channelId: this.channelBasicInfo.channelId
        //     };
        //     request("/getIdpInfo", params, {
        //         method: "GET"
        //     }).then(res => {
        //         if (res.resultCode == 0) {
        //             this.publicKey = res.result.publicKey;
        //             this.subjectIssuer = res.result.subjectIssuer;
        //             this.isrequr = !!res.result.publicKey;
        //         }
        //     });
        // },
        // post公钥
        // confirm() {
        //     let params = {
        //         channelId: this.channelBasicInfo.channelId,
        //         channelName: this.channelBasicInfo.channelName,
        //         publicKey: this.publicKey,
        //         subjectIssuer: this.subjectIssuer
        //     };
        //     request("/addIdp", params, {
        //         show: this.publicKey ? "" : "show" //show决定request的时候页面的loading,默认不传  传show则没有loading
        //     }).then(res => {
        //         if (res && res.resultCode == 0) {
        //             utils.showToast("保存成功");
        //             this.loads = false;
        //             this.$router.push("/channelAllocation");
        //         }
        //     });
        // },

        addChannel() {
            //保存渠道配置信息
            //先判断对应字段
            // configValue字段如果有就有对应的key /value   (与服务端协商两者同时为ture或者同时为false)
            if (!this.channelBasicInfo.channelName) {
                utils.showToast("请输入渠道全称");
                return false;
            }

            if (!this.channelBasicInfo.channelId) {
                utils.showToast("请输入渠道ID");
                return false;
            }
            // if (this.isrequr) {
            //     if (!this.publicKey && !this.subjectIssuer) {
            //         utils.showToast("请输入渠道公钥信息");
            //         return false;
            //     }
            //     if (this.publicKey && !this.subjectIssuer) {
            //         utils.showToast("请输入渠道颁发地址");
            //         return false;
            //     }
            //     if (!this.publicKey && this.subjectIssuer) {
            //         utils.showToast("请输入渠道公钥");
            //         return false;
            //     }
            // }
            // if (this.publicKey && !this.subjectIssuer) {
            //     utils.showToast("请输入渠道颁发地址");
            //     return false;
            // }
            // if (!this.publicKey && this.subjectIssuer) {
            //     utils.showToast("请输入渠道公钥");
            //     return false;
            // }

            // let url = {
            //     prefix: "/channel/v1",
            //     url: "/updateConfig"
            // };
            this.channelBasicInfo.channelAccessConfigs = this.configList.filter((item)=>{
                return !!item.configValue
            })
            this.loads = true;
            channelHandler.updateChannel(this.channelBasicInfo).then(res => {
                // 如果新增的时候有this.publicKey字段  编辑的时候也必须有
                // 有publicKey字段就去请求公钥接口   没有  直接返回
                if (res && res.resultCode == 0) {
                    this.loads = false;
                    // if (
                    //     this.isrequr ||
                    //     (this.publicKey && this.subjectIssuer)
                    // ) {
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
.channelEdit {
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
.requireMsg {
    color: #ff0000;
    padding-right: 4px;
}

.el-dialog--center .el-dialog__body {
    text-align: center;
}

.btnList {
    padding: 40px 0;
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
    .el-button + .el-button {
        margin-left: 24px;
    }
    .el-button--primary {
        margin-right: 14x;
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
