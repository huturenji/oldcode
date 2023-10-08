<template>
    <div class="channeltaile">
        <div v-if="addAuth">
           
            <!-- <div class="handleBtn" >
                <el-button  
                    type="primary" 
                    @click="editChannel">编辑</el-button >
            </div> -->
            <!-- 基础信息开始 -->
            <div class="baseInfo">
                <div class="infoTitle">
                    基础信息
                </div>
                <div>
                    <div class="infoListBox">
                        <div 
                            v-if="channelType=='parent'"
                            class="infoLi" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                平台ID :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.platformId }}
                            </div>
                        </div>
                        <div 
                            v-if="channelType=='children'"
                            class="infoLi" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                渠道ID :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.channelId }}
                            </div>
                        </div>
                        <div
                            v-if="channelType=='children'"
                            class="infoLi" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                店铺标识 :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.identifier }}
                            </div>
                        </div>                        
                        <div 
                            class="infoLi" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                渠道全称 :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.name }}
                            </div>
                        </div>
                        <div 
                            class="infoLi" 
                            style="margin:0 0 16px 0"
                        >
                            <div class="infoMsg">
                                渠道简称 :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.shortName }}
                            </div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                结算方式 :
                            </div>
                            <div class="channelInfo">
                                {{ channelBasicInfo.paymentType | paymentFormat }}
                            </div>
                        </div>
                    </div>
                </div>
          
                
            </div>
            <!-- 基础信息结束 -->
            <!-- 支付方式开始 -->
            <!-- <div class="payTypeInfo" >
                <div class="infoTitle">渠道接入配置</div>
                <div>
                    <div class="infoListBox" v-if="flag">
                        <div class="infoLi imgfa" style="margin:0 0 16px 0" v-for="item in Object.keys(channelConfigTextMaps)" :key="item">
                            <div class="infoMsg">{{channelConfigTextMaps[item].name}}</div>
                            <div class="configValue">
                                <div>{{findChannelConfig1(channelBasicInfo.channelAccessConfigs,item).configValue||"--"}}</div>
                                <div v-if="channelConfigTextMaps[item].keyDesc" class="keydesc">（{{channelConfigTextMaps[item].keyDesc}}）</div>
                            </div>
                        </div>
                    </div>
                </div>
 
                <div class="noconfig" v-show="!flag">
                    <b> 当前渠道暂无配置项</b>
                </div>
                
            </div> -->
           
           
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
import permissionManager from 'bislibs/permissionhandler/eventlistenerhandler';
import utils from "bislibs/utils";

export default {
    data() {
        return {
            channelBasicInfo: {},
            channelConfigTextMaps:utils.channelConfigTextMap(),
            addAuth: permissionManager.hasAuth("channelmgr"),
            hasAuth: false,
            publicKey: "",
            subjectIssuer: "",
            configValue: "",
            channelType:this.$route.query.channelType
        };
    },
    computed: {
        // 判断对应的元素是否显示
        flag() {
            return (
                this.channelBasicInfo.channelAccessConfigs.length > 0 ||
                this.publicKey ||
                this.subjectIssuer
            );
        }
    },

    created() {
        // 先判断权限
        // 从缓存读取数据
        if (this.addAuth) {
            this.channelBasicInfo = JSON.parse(utils.getSession("info")) || {};
            // this.getChannelInfo();
        } else {
            this.hasAuth = true;
        }
    },

    methods: {
        findChannelConfig1(configList, key){
            return utils.findChannelConfig(configList, key)
        },
        // 跳转编辑
        editChannel() {
            this.$router.push({
                path: "/channeledit"
            });
        }

        // 获取公钥信息
        // getChannelInfo() {
        //     let params = {
        //         channelId: this.channelBasicInfo.channelId
        //     };
        //     apiHandler.request("/getIdpInfo", params, {
        //         method: "GET",
        //         show: "show"
        //     }).then(res => {
        //         if (res.resultCode == 0) {
        //             this.publicKey = res.result.publicKey;
        //             this.subjectIssuer = res.result.subjectIssuer;
        //         }
        //     });
        // }
    },

    filters: {
        paymentFormat(val) {
            if (val=="1"){ return "账期" }
            else if (val=="2"){ return "月结" }
            return "-"
        }
    },
    watch: {}
};
</script>
<style lang="less" scoped>
.channeltaile {
    font-size: 14px;
    min-height: 100%;
    .baseInfo {
        border-radius: 8px;
        background-color: #fff;
    }
    .configValue,
    .channelInfo {
        flex: 1;
        word-break: break-all;
    }
    .keydesc{
        color: red;
    }
    .noconfig {
        padding: 24px 56px;
        color: #ccc;
        text-align: center;
    }
    .payTypeInfo {
        border-radius: 8px;
        background-color: #fff;
        margin: 16px 0;
    }

    .infoTitle {
        font-size: 14px;
        font-weight: bold;
        padding: 16px 32px 8px 32px;
        border-bottom: 2px solid #eeeeee;
        color: #272727;
    }

    .infoListBox {
        padding: 24px 32px;
        box-sizing: border-box;
        .infoLi {
            display: flex;

            .infoMsg {
                text-align: right;
                width: 105px;
                margin-right: 10px;
                word-break: break-all;
            }
        }
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
.handleBtn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 56px 12px;
    .statusBtn {
        margin: 0 15px;
    }

    .el-button--primary {
        height: 32px;
        padding: 8px 24px;
        background-color: #478aee;
        border-color: #478aee;
        border-radius: 6px;
        font-size: 12px;

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
