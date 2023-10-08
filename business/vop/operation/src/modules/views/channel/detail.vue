<template>
    <div class="channelMgrContentBox">
        <div v-if="seeAuth">
             
            <div 
                class="handleBtnBox" 
                v-if="crumbs =='detail'&& seeAuth"
            >
                <div
                    @click="goBack()"
                    class="backBtn"
                >
                    <i class="el-icon el-icon-arrow-left"></i>渠道详情
                </div>
                <div class="handleBtn">
                    <el-button  
                        v-if="channelBasicInfo.state==false&&setAuth"
                        type="primary" 
                        plain
                        @click="changeStatus(true)"
                        class="statusBtn"
                    >启用</el-button>
                    <el-button  
                        v-if="channelBasicInfo.state==true&&setAuth"
                        type="danger"  
                        @click="changeStatus(false)"
                        class="statusBtn"
                    >停用</el-button>
                    <el-button  
                        type="primary" 
                        v-if="editAuth"
                        @click="editChannel"
                    >编辑</el-button>
                </div>
            </div>
            <!-- 基础信息开始 -->
            <div class="baseInfo">
                <div class="infoTitle">
                    基础信息
                </div>
                <div v-if="crumbs =='add'">
                    <div class="infoListBox">
                        <div class="infoLi imgfa">
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道全称 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    
                                    :maxlength="100"
                                    clearable 
                                    v-model.trim="channelBasicInfo.name"
                                    placeholder="请输入渠道全称"
                                ></el-input>
                            </div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道简称 :
                            </div>
                            <div>
                                <el-input 
                                    style="width:402px"
                                    :maxlength="20"
                                    clearable 
                                    v-model.trim="channelBasicInfo.shortName"
                                    placeholder="请输入渠道简称"
                                ></el-input>
                            </div>
                        </div>
                        <div 
                            v-show="edits" 
                            class="infoLi"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>{{ channelType =='parent'?'平台':'渠道' }}ID :
                            </div>
                            <div style="padding:0 8px">
                                {{ channelBasicInfo.channelId }}
                            </div>
                        </div>
                        <div 
                            v-show="edits" 
                            class="infoLi"
                            v-if="channelType=='children'"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>店铺标识 :
                            </div>
                            <div style="padding:0 8px">
                                {{ channelBasicInfo.identifier }}
                            </div>
                        </div>                        
                    </div>
                </div>
                <div v-else>
                    <div class="infoListBox talist">
                        <div 
                            class="infoLi"
                        >
                            <div class="infoMsg">
                                状态 :
                            </div>
                            <div>
                                <span 
                                    v-show="channelBasicInfo.state==false" 
                                    style="color:#EE6747"
                                >已停用</span>
                                <span 
                                    style="color:#23B45D;" 
                                    v-show="channelBasicInfo.state==true"
                                >已启用</span>
                            </div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                <span class="requireMsg"></span>渠道全称 :
                            </div>
                            <div style="flex: 1;word-break: break-all;">
                                {{ channelBasicInfo.name }}
                            </div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                <span class="requireMsg"></span>渠道简称 :
                            </div>
                            <div>{{ channelBasicInfo.shortName }}</div>
                        </div>
                        <div class="infoLi">
                            <div class="infoMsg">
                                {{ channelType =='parent'?'平台':'渠道' }}ID :
                            </div>
                            <div>{{ channelBasicInfo.channelId }}</div>
                        </div>
                        <div 
                            class="infoLi"
                            v-if="channelType=='children'"
                        >
                            <div class="infoMsg">
                                店铺标识 :
                            </div>
                            <div>{{ channelBasicInfo.identifier }}</div>
                        </div>                        
                    </div>
                </div>
                
            </div>
            <!-- 基础信息结束 -->
            <!-- 支付方式开始 -->
            <div class="payTypeInfo">
                <div class="infoTitle">结算方式<span 
                    v-show="crumbs == 'add'"
                    style="font-size: 14px;font-weight: 100;margin-left: 10px;color:#515a6e;"
                >(选择结算方式)</span></div>
                <div v-if="crumbs =='add'">
                    <div class="payTypeList">
                        <el-radio-group v-model="channelBasicInfo.paymentType">
                            <el-radio :label="1">
                                账期
                            </el-radio>
                            <!-- <el-radio :label="2">月结</el-radio> -->
                        </el-radio-group>
                    </div>
                </div>
                <div v-else>
                    <div class="payTypeList">
                        <div
                            class="iconMsg" 
                            style="display: flex;align-items: center;"
                        >
                            <div class="payName">
                                {{ channelBasicInfo.paymentType | paymentFormat }}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <!-- 支付方式结束 -->
            <!-- 操作日志开始 -->
            <div 
                class="handleLog" 
                v-show="crumbs =='detail'"
            >
                <div class="infoTitle">
                    操作日志
                </div>
                <el-table
                    max-height="800" 
                    stripe
                    :data="systemLogs"
                    :highlight-current-row="true"
                    :header-cell-style="{background:'#f2f2f2',padding: '6px 0',color:'#666666'}"
                    style="border: 1px solid #EBEEF5;border-radius: 8px;border-bottom:0"
                >
               
                    <el-table-column
                        prop="updateTime"
                        label="时间"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.updateTime |msgFormat }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        label="操作人"
                    >
                    </el-table-column>
                 
                    <el-table-column
                        prop="content"
                        label="内容"
                    >
                    </el-table-column>
                </el-table>
                <div class="pagebox">
                    <el-pagination
                        background
                        v-show="totalse>0"
                        @size-change="pSizeChange"
                        @current-change="changePage"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpts"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper,sizes"
                        :total="totalse"
                    >
                    </el-pagination>
                </div>
            <!-- 操作日志结束 -->
            </div>
            <!-- 按钮list开始 -->
            <div 
                class="btnList" 
                v-if="crumbs =='add'"
            >
                <el-button  
                    v-if="edits"
                    type="primary" 
                    :loading="loads"
                    @click="editchanel"
                >保存</el-button>
                <el-button @click="canceladit">
                    取消
                </el-button>
            </div>
            <!-- 按钮list结束 -->
            <!-- 二次确认弹框开始 -->
       
            <el-dialog
                :title="'确定'+statuTitle+'该渠道？'"
                :visible.sync="action"
                customClass="nochannel"
                width="560px"
                center
                :modal-append-to-body="false"
            >
                <div 
                    slot="title" 
                    class="header-title"
                >
                    <div 
                        slot="title" 
                        class="header-title"
                    >
                        <span class="confirmTitle">{{ statuTitle }}渠道</span>
                    </div>
                </div>
                <div class="inconContent">
                    <p style="font-size:16px;">
                        {{ statuTitle }}后，B+平台将{{ statuTitle=="停用"?"不再":'' }}提供该渠道服务<br />
                        <span v-if="channelType=='parent'">该渠道下的子渠道也会同步{{ statuTitle }}</span>
                    </p>
                  
                </div>
                
                <div slot="footer">
                    <el-button   
                        @click="cancelStatus"
                    >取消</el-button>
                    <el-button  
                        type="primary" 
                        :loading="loads"
                        @click="commitStatus"
                    >确定</el-button>
                 
                </div>
            </el-dialog>
            <el-dialog 
                width="30%"
                customClass="watchfile"
                :visible.sync="showPreview"
                :modal-append-to-body="false"
                :fullscreen="true"
                :footer-hide="true"
                :mask-closable="false"
            >
                <iframe 
                    :src="url" 
                    style="width:100%;height:calc(100vh - 82px )"
                ></iframe>
            </el-dialog>
            <!-- 二次确认弹框结束 -->
            <div id="uploadButton"></div>
        
         
        </div>
      
        <el-dialog
            :visible.sync="hasAuth"
            :modal-append-to-body="false"
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
import utils from 'bislibs/utils';
// import cloudservices from 'libs/cloudservices'
import channelhandler from 'bislibs/requestHandler/channelhandler';
// const agreementSummary = () => import("biscomponents/channel/agreementsummaryht.vue");

export default {
    components: {
        // agreementSummary
    },    
    data() {
        return {
            loads: false,
            hasAuth: false,
            seeAuth: utils.hasAuth('seeChannel'),
            editAuth: utils.hasAuth('updateChannel'),
            setAuth: utils.hasAuth('setChannelState'),
            defaultUrl: "",
            pageSize: 10,
            totalse: 0,
            currentPage: 1,
            isBtnLoading: false,

            statuTitle: "",
            action: false,
            edits: false,
            crumbs: "",
            channelName: "",
            showPreview: false,
            url: "",
            dataList: [],

            imgSrc: "", //logo图片src

            modalTitle: "添加图片",

            payList: [],

            protocolInfos: [],

            status: 1,
            checkPaymentMethods: [], //已经选择的支付方式,
            channelBasicInfo: {},

            pageSizeOpts: [5, 10, 20, 50, 100],
            systemLogs: [],
            urls: "",
            channelType:this.$route.query.channelType
        };
    },
    beforeCreate() {},
    created() {
        if (this.seeAuth) {
            //判断权限
            var _this = this;
            this.urls = location.origin //兼容ie10   1 ie10无origin属性  2不支持模板字符串
                ? location.origin
                : location.protocol + "//" + location.host;
            // this.urls = 'https://bplusdev.sinosun.com:18180/'
            _this.crumbs = this.$route.query.crumbs;
            if (_this.crumbs == "detail") {
                //详情 掉对应的接口
                _this.getChannelInfo();
                _this.getSystormLogs();
            }
        } else {
            this.hasAuth = true;
        }
    },
    mounted: function() {},
    methods: {
        goBack: function() {
            sessionStorage.removeItem("channelId");
            this.$router.go(-1);
        },
        // 获取渠道信息
        getChannelInfo() {
            var json = {
                // channelId保证一定可以取到
                channelId:
                    this.$route.query.channel.channelId ||
                    sessionStorage.getItem("channelId")
            };
            this.$iLoading.show();
            channelhandler.getChannel(json).then(res => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0) {
                    this.channelBasicInfo = res.result;
                    if (res.result.logo.substring(0, 4) == "http") {
                        //兼容https的img
                        this.imgSrc = res.result.logo;
                    } else {
                        this.imgSrc = location.origin
                            ? location.origin +
                              "/mallvop/file/v1/content" +
                              res.result.logo
                            : location.protocol +
                              "//" +
                              location.host + //ie10没有origin
                              "/mallvop/file/v1/content" +
                              res.result.logo;
                    }

                    if (
                        !!res.result.protocolInfos &&
                        res.result.protocolInfos.length > 0
                    ) {
                        let myProInfos = res.result.protocolInfos
                        //这里必有有空声明，否则el-checkbox在赋值后 无法刷新                       
                        for (let i=0;i<myProInfos.length;i++){  
                            if (i==0){
                                this.$set(this.fileList[i], "protocolId", myProInfos[i].protocolId);
                                this.$set(this.fileList[i], "fileName", myProInfos[i].fileName);
                                this.$set(this.fileList[i], "protocolFileUrl", myProInfos[i].protocolFileUrl);
                                this.$set(this.fileList[i], "protocolName", myProInfos[i].protocolName);
                                this.$set(this.fileList[i], "remark", myProInfos[i].remark);
                                this.$set(this.fileList[i], "showPositionList", myProInfos[i].showPositionList);
                                this.$set(this.fileList[i], "summary", [myProInfos[i].summary] || myProInfos[i].summaryList);
                            } else {
                                this.$set(this.fileList, i, myProInfos[i]);
                                this.$set(this.fileList[i], "posSourceList", []);
                                this.$set(this.fileList[i], "summary", [myProInfos[i].summary] || myProInfos[i].summaryList);
                            }
                        }                   

                        this.fileList.forEach(item=>{
                            //组件的输出
                            item.protocolSummaryRes = ""
                            //组件的输入
                            if (item.summary && item.summary.length > 0){
                                item.protocolSummaryIn = {summaryList : item.summary}
                            } else {
                                item.protocolSummaryIn = ""
                            }
                            //协议显示位置 数据处理
                            item.posSourceList = [{name:"京东企业购", checked:false, type:"jd"}, {name:"苏宁易购", checked:false, type:"sn"}, {name:"西域", checked:false, type:"xy"}]
                            item.showPositionListName=""
                            if (item.showPositionList && item.showPositionList.length > 0){
                                item.showPositionList.forEach(element => {
                                    for (let j =0;j<item.posSourceList.length;j++){
                                        if (item.posSourceList[j].type == element){
                                            item.posSourceList[j].checked = true
                                            item.showPositionListName += item.posSourceList[j].name + "、"
                                            j = item.posSourceList.length
                                        }
                                    }                                  
                                });
                            }
                            if (item.showPositionListName){
                                item.showPositionListName = item.showPositionListName.substring(0, item.showPositionListName.length-1)
                            }
                        })
                        // 数组的第一项默认展开
                        this.$set(this.fileList[0], "showDetail", true);
                    }
                    this.checkPaymentMethods = res.result.paymentMethods;
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 查询操作日志
        getSystormLogs() {
            var json = {
                channelId:
                    this.$route.query.channel.channelId ||
                    sessionStorage.getItem("channelId"),
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            this.$iLoading.show();
            channelhandler.getSystemLogs(json).then(res => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0) {
                    this.systemLogs = res.result.operationLogVoList;
                    this.totalse = res.result.total;
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        //每页显示条数变化
        pSizeChange(pSize) {
            this.pageSize = pSize;
            this.currentPage = 1;
            this.getSystormLogs();
        },
        changePage: function(page) {
            this.currentPage = page;
            this.getSystormLogs();
        },
        // 启用,停用
        changeStatus(status) {
            if (status) {
                this.statuTitle = "启用";
            } else {
                this.statuTitle = "停用";
            }
            this.status = status;
            this.action = true;
        },
        // 停/启用请求
        commitStatus() {
            let json = {
                // userId: channelhandler.userInfo.userId,
                // companyId: 0, //和服务端协商,运营端直接写死
                // userName: channelhandler.userInfo.mgrName,
                channelId: this.channelBasicInfo.channelId,
                state: this.status
            };
            this.loads = true;
            this.$iLoading.show();
            channelhandler.setState(json).then(res => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0) {
                    utils.showToast("操作成功");
                    this.action = false;
                    this.getChannelInfo();
                    this.getSystormLogs();
                }
                this.loads = false;
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        cancelStatus() {
            this.action = false;
        },
        //编辑渠道
        editChannel: function() {
            this.edits = true;
            let orgin = location.origin //兼容ie10   1 ie10无origin属性  2不支持模板字符串
                ? location.origin
                : location.protocol + "//" + location.host;
            this.crumbs = "add";
            this.defaultUrl =
                this.channelBasicInfo.logo && this.channelBasicInfo.logo.substring(0, 4) == "http"
                    ? this.channelBasicInfo.logo
                    : orgin +
                      "/mallvop/file/v1/content" +
                      this.channelBasicInfo.logo;
            // this.getPayMode();
        },
        // 查询支付方式列表
        getPayMode() {
            let that = this;
            let json = {
                channelId: this.channelBasicInfo.channelId
            };
            this.$iLoading.show();
            channelhandler.getAvailableMethods(json).then(res => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0) {
                    let arr = res.result.payTypes;
                    arr.map(item => {
                        return (item.paymentMethodState = false);
                    });
                    this.payList = arr;
                    // 编辑的时候回显;
                    // 双重循环所有方式和该渠道下的方式 取到相同默认为选中
                    if (that.edits) {
                        that.payList.forEach(item => {
                            that.channelBasicInfo.paymentMethods && that.channelBasicInfo.paymentMethods.forEach(
                                haveitem => {
                                    if (
                                        item.payTypeName == haveitem.payTypeName
                                    ) {
                                        item.paymentMethodState = true;
                                    }
                                }
                            );
                        });
                    }
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        //选择支付方式
        selPayType: function(state, index, event) {
            //根据event来判断触发事件的元素
            if (event.target.className == "changeIconBtn") {
                return false;
            }
            //选择支付方式设置选中状态
            this.payList[index].paymentMethodState = !state;
            // 深拷贝  避免对视图数据影响
            this.checkPaymentMethods = JSON.parse(
                JSON.stringify(this.payList)
            ).filter(item => {
                return item.paymentMethodState == 1;
            });
            //paymentMethodState字段作为页面回显  服务端不需要该字段  删除操作
            this.checkPaymentMethods.forEach(item => {
                delete item.paymentMethodState;
            });
        },
        canceladit() {
            this.edits = false;
            this.crumbs = "detail";
            // 触发编辑,面包屑对应文字修改,组件重新渲染
            this.getChannelInfo();
        },
        
        editchanel() {
            //保存编辑
            
            if (!this.channelBasicInfo.name) {
                utils.showToast("渠道全称不能为空");
                return false;
            }
            if (!this.channelBasicInfo.shortName) {
                utils.showToast("渠道简称不能为空");
                return false;
            }
            // 弹框之前先校验 判断是否所有的都有名字
            // let havename = this.protocolInfos.every(item => {
            //     return item.protocolName;
            // });
            
            //将协议显示位置处理一下，这个不是必填项
            // this.protocolInfos.forEach(item => {
            //     item.showPositionList = [];
            //     item.posSourceList.forEach(pos=>{
            //         if(pos.checked){
            //             item.showPositionList.push(pos.type)
            //         }
            //     })
            //     delete item["posSourceList"]
            //     delete item["showPositionListName"]
            // });     

            let json = {
                userId: channelhandler.userInfo.userId,
                companyId: 0,
                channelId: this.channelBasicInfo.channelId,
                name: this.channelBasicInfo.name,
                shortName: this.channelBasicInfo.shortName,
                paymentType: this.channelBasicInfo.paymentType,
                state:this.channelBasicInfo.state
                // logo: this.channelBasicInfo.logo,
                // paymentMethods: this.checkPaymentMethods,
                // protocolInfos: this.protocolInfos
            };
            this.loads = true;
            this.$iLoading.show();
            channelhandler.update(json).then(res => {
                this.$iLoading.hide();
                if (res && res.resultCode == 0) {
                    utils.showToast("编辑成功");
                    this.edits = false;
                    this.loads = false;
                    this.crumbs = "detail";
                    this.getChannelInfo();
                    this.getSystormLogs();
                } else {
                    this.loads = false;
                }
            }).catch(() => {
                this.$iLoading.hide();
                this.loads = false;
            });
        }

    },
    beforeRouteEnter(to, from, next) {
        // 进入之前把面包屑的状态重置一次
        next(() => {
        });
    },
    filters: {
        msgFormat(val) {
            var dates = new Date(val).toJSON();
            return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,'')
        },
            
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
.channelMgrContentBox {
    font-size: 14px;
    min-height: 100%;
    .channelMgrHeader {
        background-color: #fff;
        padding-left: 30px;
        height: 97px;
        .headerTop {
            line-height: 55px;
        }
        .headerName {
            font-size: 20px;
            font-weight: bold;
            color: #333333;
            display: flex;
            align-items: center;
        }
    }

    .handleBtnBox {
        display:flex;
        align-items: center;
        .backBtn{font-size: 18px;font-weight: 600;cursor: pointer;}
        .handleBtn {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 16px 56px;
            flex: 1;
            .statusBtn {
                margin: 0 16px;
            }
        }
    }
    .baseInfo {
        border-radius: 8px;
        background-color: #fff;
    }
    .payTypeInfo {
        border-radius: 8px;
        background-color: #fff;
        margin: 16px 0;
        .payTypeList {
            display: flex;
            flex-wrap: wrap;
            margin: 24px 32px 0;
            padding-bottom: 24px;
            .payTypeLi {
                padding: 15px 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin: 8px 32px;
                display: flex;
                width: 220px;
                height: 76px;
                box-sizing: border-box;
                .iconBox {
                    width: 44px;
                    height: 44px;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .iconImg {
                        width: 44px;
                        height: 44px;
                    }
                }
                .iconMsg {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .payName {
                        flex: 1;
                        font-size: 14px;
                        color: #333333;
                        box-sizing: border-box;
                        padding: 20px;
                        border: 1px solid #999;
                        border-radius: 5px;
                    }
                    .changeIcon {
                        display: flex;
                        text-align: right;
                        justify-content: space-between;
                        .changeIconBtn {
                            color: #478aee;
                        }
                    }
                    img {
                        width: 16px;
                        height: 16px;
                    }
                }
            }
            .payTypeLiSel {
                border: 1px solid #1890ff;
            }
        }
    }
     .payName {
        flex: 1;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        padding: 20px;
        border: 1px solid #999;
        border-radius: 5px;
    }
    .serAgreementInfo {
        border-radius: 8px;
        background-color: #fff;
        padding-bottom: 1px;
        .agreementList {
            .agreementName_left {
                font-weight: bold;
            }
            .showDetail {
                transition: 0.2s;
            }
            .agreementLi {
                border-radius: 8px;
                border: 1px solid rgba(235, 235, 235, 1);
                margin-bottom: 24px;
            }
            .hideDetail {
                max-height: 0;
                transition: 0.2s;
                overflow: hidden;
                padding: 0;
            }
            .showDetailIcon {
                transform: rotate(180deg) !important;
                transition: 0.5s;
            }
            .hideDetailIcon {
                transform: rotate(90deg) !important;
                transition: 0.5s;
            }
            .agreementName {
                height: 36px;
                display: flex;
                align-items: center;
                background-color: #f8f8f8;
                cursor: pointer;
                padding-right: 32px;
                padding-left: 8px;
                justify-content: space-between;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                &_left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                }
                &_right {
                    text-align: center;
                }
                .agreementNameIcon {
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                    transform: rotate(180deg);
                }
                span {
                    color: #666666;
                    word-break: break-all;
                    max-width: 900px;
                    display: inline-block;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
            .agreementFile {
                padding: 5px 15px;
                position: relative;
                background: rgba(248, 248, 248, 1);
                color: #478aee;
                border-radius: 4px;
                vertical-align: middle;
                position: relative;
                max-width: 500px;

                img {
                    &:first-child {
                        width: 24px;
                        height: 24px;
                        vertical-align: middle;
                    }
                    &:nth-child(2) {
                        width: 18px;
                        height: 18px;
                        position: absolute;
                        right: -8px;
                        cursor: pointer;
                    }
                }
                .delAgreementFile {
                    top: -8px;
                    width: 18px;
                    height: 18px;
                }
                .showFile {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    right: -10px;
                    cursor: pointer;
                    bottom: -10px;
                }
            }
        }
        .addAgreement {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            border: 1px dashed #ddd;
            border-radius: 5px;
            background-color: #fafafa;
            cursor: pointer;
            margin: 16px 0 32px;
            font-size: 14px;
            font-weight: 400;
            color: #478aee;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .handleLog {
        margin: 16px 0 24px;
        background-color: #fff;
        overflow: hidden;
        border-radius: 8px;
        .dataList {
            display: flex;
            li {
                flex: 1;
                display: flex;
                align-items: center;
                padding: 0 40px;
            }
        }
        .listTheader {
            height: 40px;
            line-height: 40px;
            background-color: #f8f8f9;
            border: 1px solid #dddeee;
            margin: 0 0 -1px 0;
            font-weight: bold;
        }
        .listTbody {
            height: 55px;
            border: 1px solid #dddeee;
            margin: 0 0 -1px 0;
            .payment {
                span {
                    width: 100%;
                    overflow: hidden; //超出的文本隐藏
                    text-overflow: ellipsis; //溢出用省略号显示
                    white-space: nowrap; //溢出不换行
                }
            }
        }
        .listTbody:nth-child(even) {
            background: #f8f8f9;
        }
        .listTbody:hover {
            background-color: #ebf7ff !important;
        }
    }
    .infoTitle {
        font-size: 14px;
        font-weight: bold;
        padding: 16px 32px 8px;
        border-bottom: 1px solid #eeeeee;
        color: #333333;
    }
    .infofather {
        margin: 24px;
    }
    .infoListBox {
        padding: 32px;
        .infoLiremak {
            display: flex;
            margin-bottom: 16px;
            align-items: center;
            .infoMsg {
                text-align: right;
                width: 115px;
                margin-right: 10px;
                padding-top: 10px;
            }
            &_right {
                flex: 1;
                word-break: break-all;
            }
        }
        .infoLi {
            display: flex;
            align-items: center;
            padding: 8px 0;
            box-sizing: border-box;
            &:last-child {
                padding-bottom: 0;
            }
            &:first-child {
                padding-top: 0;
            }
            .infoMsg {
                text-align: right;
                width: 115px;
                margin-right: 8px;
            }
            &_right {
                flex: 1;
                word-break: break-all;
            }
        }
        .channelLogoBox {
            // height: 70px;
            .logoBox {
                position: relative;
                .logoImg {
                    height: 72px;
                    width: 72px;
                    border-radius: 5px;
                }
                .delBtn {
                    cursor: pointer;
                    width: 15px;
                    position: absolute;
                    top: -5px;
                    right: -5px;
                }
            }
            .chooseBtn {
                cursor: pointer;
                display: flex;
                width: 104px;
                height: 104px;
                border: 1px dashed #ddd;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            &_content {
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
        }
    }
    .ipimgbox {
        position: relative;
        .defaultUrl {
            border-radius: 6px;
        }
        .delicon {
            position: absolute;
            width: 18px;
            height: 18px;
            right: -10px;
            top: -10px;
            cursor: pointer;
        }
    }

    .chooseImgBtn {
        width: 72px;
        height: 72px;
        text-align: center;
        line-height: 72px;
        background-color: #f6f6f6;
        display: block;
        border-radius: 8px;
        cursor: pointer;
        #chooseImg {
            display: none;
        }
        .uploadIcon {
            font-size: 20px;
            font-weight: bold;
            color: #478aee;
            line-height: 72px;
        }
    }
    .btnList {
        padding: 24px;
        text-align: center;
        .el-button {
            width: 140px;
            margin-right: 14px;
            height: 48px;
            border-radius: 8px;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
                opacity: 0.8;
            }
        }
        .el-button--primary {
            background-color: #478aee;
            border: 1px solid #478aee;
        }
        .el-button--default {
            color: #fff;
            background: #c2c2c2;
        }
    }

    .requireMsg {
        color: #ff0000;
        padding-right: 4px;
    }
    .pagebox {
        padding: 0 32px 24px;
        text-align: right;
    }
    .talist {
        .infoMsg {
            color: #999999;
        }
    }
    .fileName {
        display: flex;
        align-items: center;
        cursor: pointer;
        em {
            max-width: 220px;
            font-style: normal;
            display: inline-block;
            word-wrap: break-word;
            word-break: keep-all;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .fileNameURL {
        display: inline-block;
        max-width: 1000px;
        word-wrap: break-word;
        text-overflow: ellipsis;
        // white-space: nowrap;
    }
}
.notext {
    padding: 10px;
    text-align: center;
    border: 1px solid #dddeee;
    border-top: 0;
    span {
        font-size: 12px;
    }
}
.uploadwrap {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
}
.selectFile {
    position: absolute;
    z-index: 10;
    top: -5px;
    left: -5px;
    opacity: 0;
    height: 45px;
    width: 132px;
    font-size: 0;
    cursor: pointer;
}
.file-open {
    width: 120px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    text-align: center;
    color: #478aee;
    border: 1px solid rgba(71, 138, 238, 1);
    border-radius: 4px;
    display: inline-block;
    b {
        vertical-align: middle;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByElEQVRYR+2WwUrDQBCG/4mKohbb3EQ8CoJX36ENCJ58AVEqKoq2qfoG0rRKRcWi+AI9CULTZ/AugkdRPDUtValadqSCpZWYbCKll+xx59/9v5nJZpfQ40E99kcA8K8KLOTLY80WFuJq1W8rfQNoGSshBPabxoqC3WIykvUD4QtAMyo7gsW3+c8gYM9MqR1zMkCeAbR0JSkgDLvNiZSUqYdtY3/BeAKIZawtFnzglBkptG0mI4cy2Tc10gAxw9pg5pzMxkS0aeqRIymtjCiaLq8BOJbRtmnWSyn1xG2NawWimcoKmE/B7KrtMCNiEK2WkuEzx5Y5BTWjsizAec/mraNBrIDiRT187vkj1LLWohC48G3eDqFgqZiIXNqeHLvJuVx1qvEu7hisuPVQJk4g0T+oTF9vjt3/1tv2dT77NlkX9VswRmUM3DQE1Ab7hmauEsMPUgBN0cIJj9Y+axMdCz4aNwyEHA0JLzTQP9uuCQ2EHgtr9CLdgr8MooZlgTnsknG1lFLdNK0tPB2tACCoQFCBoAIxo/zEjHHH65XwbOqqo6Z9vacfUSxTXmVGGowRWwjCKxg7Mg+R1mXpdpF0O+6pAt2ACQC+ACOhvyHtMrWVAAAAAElFTkSuQmCC);
        background-size: cover;
        background-repeat: no-repeat;
        position: absolute;
        left: 19px;
        top: 8px;
    }
    span {
        margin-left: 14px;
    }
}
.imgfa {
    img {
        width: 72px;
        height: 72px;
        vertical-align: middle;
        margin-right: 16px;
    }
    b {
        padding-left: 20px;
        color: red;
    }
}
/deep/ .el-dialog__wrapper {
    .el-dialog {
        border-radius: 8px;
        .el-dialog__header {
            overflow: hidden;
            padding: 0;
            border-bottom: 1px solid #efefef;
            .header-title {
                position: relative;
                .confirmTitle {
                    font-size: 16px;
                    color: #333;
                    font-weight: bold;
                    line-height: 56px;
                }
                .cancelBtn {
                    position: absolute;
                    right: 15px;
                    top: 6px;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                }
                .cancelBtn:hover {
                    color: #409eff;
                }
            }
        }
        .el-dialog__body {
            padding: 32px 25px;
            color: #333;
            .inconContent {
                p {
                    font-size: 16px;
                    text-align: center;
                }
            }
        }
        .el-dialog__footer {
            padding: 0 20px 48px;
            .el-button {
                font-size: 16px;
                width: 144px;
                height: 48px;
                border-radius: 8px;
            }
        }
    }
}
</style>
<style lang="less">
.handleLog {
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f8f8f8;
    }
    .el-table {
        color: #333;
    }
}

.requireMsg {
    color: #ff0000;
    padding-right: 4px;
}
.nochannel {
    margin-top: 0 !important;
    margin: 0 auto !important; /*水平居中*/
    position: absolute !important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .el-dialog__header {
        overflow: hidden;
        .cancelBtn {
            float: right;
            font-size: 24px;
            padding: 0 10px;
            cursor: pointer;
        }
        .cancelBtn:hover {
            color: #478aee;
        }
        .el-dialog__title {
            line-height: 60px;
            font-size: 24px;
        }
        .el-dialog__headerbtn {
            margin-top: -10px;
            transform: scale(1.5);
        }
    }
    .el-dialog--center .el-dialog__body {
        text-align: initial;
    }
    .inconContent {
        p {
            font-size: 16px;
            text-align: center;
        }
    }
    .el-dialog__footer {
        .el-button {
            width: 139px;
            font-size: 16px;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
                opacity: 0.8;
            }
        }
        .el-button--primary {
            color: #fff;
            background-color: #478aee;
            margin-left: 14px;
        }
        .el-button--default {
            color: #fff;
            background-color: #c2c2c2;
            border-color: #c2c2c2;
        }
    }
}
.watchfile {
    .el-dialog__body {
        padding-top: 40px !important;
    }
}

.el-dialog--center .el-dialog__body {
    text-align: center !important;
}
.handleLog {
    .el-table {
        margin: 24px 32px;
        width: 1220px;
    }
}

.infoLiremak {
    .el-textarea__inner {
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    }
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #478aee;
    border-color: #478aee;
}

.handleBtnBox {
    .el-button {
        height: 32px;
        padding: 8px 24px;
        border-radius: 8px;
        font-size: 12px;
    }
    .el-button--danger {
        background-color: #fb6041;
        border-color: #fb6041;
    }
    .el-button:last-child {
        background-color: #478aee;
        border-color: #478aee;
        &:hover {
            opacity: 0.8;
        }
    }
    .el-button--danger {
        &:hover {
            opacity: 0.8;
        }
    }
    .is-plain {
        background-color: #f2f3f3;
        border: 1px solid #478aee;
        color: #478aee;
        &:hover {
            color: #ffffff;
            border: 1px solid #478aee;
            background-color: #478aee;
            opacity: 0.8;
        }
    }
}
</style>
