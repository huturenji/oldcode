<template>
    <div class="channelMgrContentBox">
        <div v-if="addAuth">
            <!-- 基础信息开始 -->
            <div class="baseInfo">
                <div class="infoTitle">
                    基础信息
                </div>
                <div>
                    <div class="infoListBox">
                        <div class="infoLi channelLogoBox imgfa">
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道LOGO :
                            </div>
                            <div class="ipimgbox">
                                <img 
                                    v-if="defaultUrl"
                                    :src="defaultUrl" 
                                    class="defaultUrl"
                                    alt=""
                                >
                                <img 
                                    v-if="defaultUrl"
                                    @click="dellogo"
                                    :src="require('assets/u962.png')" 
                                    class="delicon"
                                    alt=""
                                >
                                <label
                                    v-else
                                    title="上传图片"
                                    for="chooseImg"
                                    class="chooseImgBtn"
                                >
                                    <input 
                                        type="file" 
                                        title="上传LOGO"
                                        id="chooseImg"
                                        @change="selectLOgo()"
                                    >
                                    <i class="el-icon-plus uploadIcon"></i>
                                </label>
                                 
                              
                            </div>
                           
                        </div>
                        <div 
                            class="infoLi imgfa" 
                            style="margin:28px 0 16px"
                        >
                            <div class="infoMsg">
                                <span class="requireMsg">*</span>渠道全称 :
                            </div>
                            <div>
                                <el-select 
                                    style="width:402px" 
                                    :disabled="edits"
                                    v-model.trim="channelBasicInfo.channelName"   
                                    placeholder="请选择渠道全称"
                                >
                                    <el-option
                                        v-for="item in cleanChannels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label"
                                    >
                                    </el-option>
                                </el-select>                                
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
                                    v-model.trim="channelBasicInfo.shortChannelName"
                                    placeholder="请输入渠道简称"
                                ></el-input>
                            </div>
                        </div>
                    </div>
                </div>
          
                
            </div>
            <!-- 基础信息结束 -->
            <!-- 支付方式开始 -->
            <div class="payTypeInfo">
                <div class="infoTitle">渠道支付方式<span 
                    v-show="crumbs == 'add'"
                    style="font-size: 14px;font-weight: 100;margin-left: 10px;color:#515a6e;"
                >(至少选择一种支付方式)</span></div>
                <div>
                    <div class="payTypeList">
                        <div 
                            v-for="(item,index) in payList" 
                            :key="index"
                            class="payTypeLi" 
                            :style="{'border':!!item.paymentMethodState?'1px solid #1890ff':'1px solid #ddd'}"
                            style="cursor: pointer;"
                            @click="selPayType(item.paymentMethodState,index,$event)"
                        >
                            <div class="iconBox">
                                <img 
                                    v-if="!item.icon"
                                    style="width:26px;" 
                                    :src="require('assets/u504.png')" 
                                    alt=""
                                >
                                <img 
                                    v-if="!!item.icon"
                                    class="iconImg" 
                                    :src="item.icon" 
                                    alt=""
                                >
                            </div>
                            <div class="iconMsg">
                                <div class="payName">
                                    {{ item.payTypeName }}
                                </div>
                          
                                <img 
                                    v-show="!!item.paymentMethodState"
                                    :src="require('assets/u1659.png')" 
                                    alt=""
                                >
                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <!-- 支付方式结束 -->
            <!-- 服务协议开始 -->
            <div class="serAgreementInfo">
                <div class="infoTitle">
                    服务协议（提示：当一个页面同时配置了多个协议时，只显示第一个配置协议的摘要）
                </div>
                <div class="infofather">
                    <div class="agreementList">
                        <div 
                            class="agreementLi" 
                            v-for="(item,index) in fileList" 
                            :key="index"
                        >
                            <div 
                                class="agreementName"
                                @click="expand(item,index,$event)" 
                            >
                                <div>
                                    <img 
                                        class="agreementNameIcon"
                                        :class="item.showDetail?'showDetailIcon':'hideDetailIcon'"
                                        :src="require('assets/u1874.png')"
                                        alt=""
                                    >
                                    <span class="showporsname">{{ agreementName(item.protocolName,index) }}</span>
                                </div>
                                <div>
                                    <span 
                                        @click="showFile(item.protocolFileUrl)"
                                        v-if="!item.showDetail && item.protocolFileUrl" 
                                        style="color:#478aee;"
                                    >预览</span>
                                    <span 
                                        @click="delAgreement(index)"
                                        class="delfileBtn"
                                        v-if="fileList.length>1"
                                        style="color:#FB6041;margin-left:24px;"
                                    >删除</span>
                                </div>
                            </div>
                            <div
                                class="infoListBox" 
                                :class="item.showDetail?'showDetail':'hideDetail'"
                            >
                                <div class="infoLi">
                                    <div class="infoMsg">
                                        <span class="requireMsg">*</span>协议名称 :
                                    </div>
                                    
                                    <el-input 
                                        clearable 
                                        style="width:402px"
                                        v-model.trim="item.protocolName"
                                        :maxlength="50"
                                        placeholder="请输入协议名称"
                                    ></el-input>
                                       
                                </div>
                                <agreementSummary
                                    v-model="item.protocolSummaryRes"
                                    :inputData="summaryInit"
                                    :agreePos="index"
                                ></agreementSummary>                                  
                                <div 
                                    v-if="item.protocolFileUrl"
                                    class="infoLi" 
                                    style="align-items:flex-start;margin:16px 0 0 0"
                                >
                                    <div 
                                        class="infoMsg" 
                                    ><span class="requireMsg">*</span> 协议书URL: </div>
                                    <div>
                                        <span 
                                            class="fileNameURL" 
                                        >{{ getFileUrl(item.protocolFileUrl) }}</span>
                                    </div>
                                </div>                                 
                                <div 
                                    class="infoLi" 
                                    style="align-items:flex-start;margin:16px 0"
                                >
                                    <div 
                                        class="infoMsg" 
                                        style="padding-top:6px"
                                    ><span class="requireMsg">*</span>上传协议书 : </div>
                                    <div>
                                        <div>
                                            <div 
                                                v-if="!item.protocolFileUrl" 
                                                class="uploadwrap"
                                            >
                                              
                                                <input 
                                                    ref="upfile"
                                                    type="file" 
                                                    class="selectFile fileInput"
                                                    @change="selectFile(index,$event)"
                                                >
                                                <div 
                                                    class="file-open fileInput"
                                                    :loading="isBtnLoading"
                                                >
                                                    <b></b>
                                                    <span>上传协议</span>
                                                </div>
                                                <span style="color:#666666;font-size:12px">支持pdf 格式,文件最大不超过20M</span>  
                                            </div>
                                            <div v-else>
                                                <div class="agreementFile">
                                                    <el-tooltip 
                                                        class="item" 
                                                        effect="dark" 
                                                        :content="item.fileName " 
                                                        placement="top"
                                                    >
                                                        <span 
                                                            class="fileName"
                                                            @click="showFile(item.protocolFileUrl)" 
                                                            style="display: flex; align-items: center;cursor: pointer;"
                                                        >
                                                            <img 
                                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADAUlEQVRoQ+1YTUgVURg95868Z0m+p+arCIsIgoygVbVqlQvNP1pUq4II3Br13qpNbUtJ3dQmIoqCBCF/s0VtCiK3EUVRiAZSoD61kjdv7hdv0Q/ynLk2PiZhZnvPd77vfOe7d2Yusc4frvP6EQkI28HIgciBgB2IRihgAwOH+zpw4qHEFyazRxT0RtHex64oy63YkRjrO0k3cGWGBJ4CLouol9dmnwq4H5DN/pzMkqp7NJ24QlL88cERngIauuaOiit9IDZBOEfo7yulFDBGYitEsgBfkHy32vKE7pJlq/Hh81UDprGeAo51zTS7LgZJTgjQAcv+sBKxknxcC25CyyHT5EVx5KICH4xmKttNeMwEgB9jymoaTCfeepE29y4eyP1w+knMmyRfjiGREmA7BBMxW50aupB85cdjJADgJ8uWNrFj036Eccfa4Lja8cMVW3fpHKbgNoCkopweyVTf9+MxE0DOAZiioKQbU8gYINsgUqmI1tFM9eDaCPBjKcH62gogp5RwSAOTJaj1DyVRC0gLRGrXVAANN3FQcS2d83sduMOiZXckoNDN3++ByAGz4YpGaHmfVjNCjb0LKeby5V69jrFMP7pYvuJJFpoDTdcX6vJOfgSUJc9hEaZEWRefpBN3iuFCE9B4dfaMpvRAUOkpgHQE8mwsXdVQ7HM7NAEiwqbObLsLHRPauZVEWFonapi8cTfDb/+VA2ZnjD8qNAf8SzNDRAKCHKNmPfZGRQ5EDgSco9KMkGbhimMyFlf1Qx3J9wFr9Axv7snucXJ6DMAuBWkL/EvZ0Jk9CO0OgKpGgC4b1r2SCbDhuk7+EoDjAOeh2Po4nRz3y+f5U996SypyM3P9IlIPMA/KNAWluja0QKZEpIzE53h1Vd3AOS4EElAIbu6e2ek4fA5BHMQWiPjep/olLbpeuIoUfCHwuswqO+v11fp3vFExBSfyM/P7oNzUPxVnGqStr3Z14o1J539RGgkwzR8GLhIQRtdXvQfCLtIrfzRCYbsTORA5ELADPwGBmChP2Qm8VQAAAABJRU5ErkJggg" 
                                                                alt=""
                                                            > 
                                                            <em>{{ item.fileName }}</em>
                                                        </span>
                                                    </el-tooltip>
                                                    <img 
                                                        @click="delAgreementFile(index)"
                                                        class="delAgreementFile"
                                                        :src="require('assets/del.png')"
                                                        alt=""
                                                    >
                                                    <img 
                                                        @click="showFile(item.protocolFileUrl)"
                                                        class="showFile"
                                                        :src="require('assets/u4909.png')"
                                                        alt=""
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                                <div class="infoLi">
                                    <div 
                                        class="infoMsg" 
                                    >协议显示位置:</div>
                                    <el-checkbox 
                                        v-model="pos.checked" 
                                        v-for="pos in item.posSourceList||[]" 
                                        :key="pos.name"
                                    >{{ pos.name }}</el-checkbox>
                                </div>
                                
                                <div 
                                    class="infoLi" 
                                    style="align-items:flex-start;margin-top:16px;"
                                >
                                    <div 
                                        class="infoMsg" 
                                        style="padding-top: 10px;"
                                    >备注:</div>
                                    <el-input
                                        type="textarea"
                                        :maxlength="200" 
                                        show-word-limit
                                        style="width: 430px;"
                                        :autosize="{ minRows: 3, maxRows: 3}"
                                        placeholder="请输入备注"
                                        v-model.trim="item.remark"
                                    >
                                    </el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
                <div 
                    v-show="fileList.length<10"
                    class="addAgreement" 
                    @click="addAgreement"
                >+添加协议</div>
             
                
            </div>
           
            <!-- 按钮list开始 -->
            <div class="btnList">
                <el-button 
                    @click="addChannel" 
                    type="primary"
                >保存</el-button>
                <el-button @click="$router.go(-1)">
                    取消
                </el-button>
            </div>
           
            <el-dialog
                :visible.sync="modal1"
                :close-on-click-modal="false" 
                :show-close="false"
                customClass="noAuth"
                :modal-append-to-body="false"
                width="560px"
                center
            >
                <div 
                    slot="title" 
                    class="header-title"
                >
                    <span class="confirmTitle">创建渠道</span>
                    <span 
                        class="cancelBtn" 
                        @click="cancel"
                    >×</span>
                </div>
                <div class="inconContent">
                    <p>创建后，系统内暂不支持删除操作</p>
                </div>
                <span 
                    slot="footer" 
                    class="dialog-footer"
                >

                    <el-button 
                        @click="cancel"
                    >取消</el-button>
                    <el-button 
                        :loading="loads"
                        type="primary"  
                        @click="confirm"
                    >确定</el-button>
                </span>
            </el-dialog>
        
            <el-dialog 
                width="30%"
                :visible.sync="showPreview"
                :fullscreen="true"
                customClass="watchfile"
                :footer-hide="true"
                :modal-append-to-body="false"
                :mask-closable="false"
            >
                <iframe 
                    :src="url"
                    style="width:100%;height:calc(100vh - 82px )"
                ></iframe>
            </el-dialog>
            <!-- 二次确认弹框结束 -->
            <div id="uploadButton"></div>
            <!-- </div> -->
           
        </div>
        <el-dialog
            :visible.sync="hasAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            :modal-append-to-body="false"
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
                        @click="confirm"
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
import channelhandler from 'bislibs/requestHandler/channelhandler';
import cloudservices from 'libs/cloudservices'
const agreementSummary = () => import("biscomponents/channel/agreementsummaryht.vue");

export default {
    components: {
        agreementSummary
    },       
    data() {
        return {
            loads: false,
            defaultUrl: "",

            isBtnLoading: false,
            origin: "",
            edits: false,
            crumbs: "",
            channelName: "",
            showPreview: false,
            url: "",
            modal1: false, //二次确认框显隐
            dataList: [],
            imgName: "", //logo图片名称
            imgSrc: "", //logo图片src
            imgFileId: "",

            userDefinedIcon: "",
            modalTitle: "添加图片",
            modalType: 1, //默认为1，上传icon二次确认，0为新增渠道二次确认
            userDefined: false,
            payList: [],
            file: null,
            loadingStatus: false,

            fileList: [
                {
                    protocolName: "", //协议名称
                    protocolFileUrl: "",
                    protocolSummaryRes: "", //获取信息摘要
                    remark: "",
                    fileName: "",
                    posSourceList:[{name:"京东企业购", checked:false, type:"jd"}, {name:"苏宁易购", checked:false, type:"sn"}, {name:"西域", checked:false, type:"xy"}], //协议显示位置数据源
                    showDetail: true
                }
            ],
            protocolInfos: [],
            btnIdIndex: 1, //mstpId
            status: 1,
            checkPaymentMethods: [], //已经选择的支付方式,
            channelBasicInfo: {},
            addAuth: utils.hasAuth('addChannel'),
            hasAuth: false,
            urls: location.origin,
            // urls: 'https://bplusdev.sinosun.com:18180/',
            summaryInit: "", //授权协议初始化入参，object格式    
            cleanChannels:[]//未使用的新建渠道

        };
    },
    beforeCreate() {},
    created() {
        if (this.addAuth) {
            //判断权限  true正常展示  false 弹框提示
            let _this = this;
            _this.crumbs = this.$route.query.crumbs;
            _this.getPayMode();
            _this.origin = location.origin;
            _this.getPrecutChannleList();
        } else {
            this.hasAuth = true;
        }
    },
    mounted: function() {},
    methods: {
        goBack: function() {
            //返回上一页
            this.$router.go(-1);
        },
        //展示协议书URL
        getFileUrl: function(val){
            let pathFile= "/mallvop/file/v1/content"
            return (val && val.substring(0, 4) == "http") ? val : this.urls+ pathFile+ val
        },
        selectFile(index, val) {
            //选择pdf文件方法  val兼容ie的event
            let _this = this;
            let files = val.target.files;
            let extensions = _this.fileExtensionCheck(files[0].name); //判断文件后缀
            if (files[0].size > 20 * 1024 * 1024) {
                //文件大小
                utils.showToast("文件过大");
                val.target.value = ""; //清空file值
                return false;
            }
            if (files[0].name.length > 54) {
                //限制长度   文件名超长导致服务端报错
                utils.showToast("文件名称不能超过50个字符");
                val.target.value = "";
                return false;
            }
            if (utils.isIllegalName(files[0].name)){
            //上传文件名字非法检索
                let text =`文件名不能含有"#"、"%"、"+"、"@"特殊字符，请重新上传`
                utils.showToast(text);
                val.target.value = "";
                return false;
            }
            if (extensions == "pdf") {
                // let formData = new FormData(); //fromdata处理文件对象
                // formData.append("file", files[0]);
                // // files[0].name为中文的时候  ie会报错encodeURI兼容ie
                // let url = {
                //     prefix: "/mallvop/file/v1",
                //     url:
                //         "/upload?c=static&p=%2Fadd%2Fchannel&n=" +
                //         encodeURI(files[0].name)
                // };
                // _this.isBtnLoading = true;
                // request(url, formData).then(res => {
                //     if (!!res && res.resultCode == 0) {
                //         utils.showToast("上传协议成功");
                //         _this.isBtnLoading = false;
                //         _this.fileList[index].fileName = files[0].name;
                //         _this.fileList[index].protocolFileUrl = res.result.path;
                //     } else {
                //         _this.isBtnLoading = false;
                //         utils.showToast("上传失败");
                //         val.target.value = "";
                //     }
                // });
                _this.isBtnLoading = true;
                files[0].businessType = 'agreement'
                cloudservices
                    .upload2Ceph([files[0]])
                    .then((allRes) => {
                        _this.isBtnLoading = false;
                        _this.fileList[index].fileName = files[0].name;
                        _this.fileList[index].protocolFileUrl = allRes[0].downLoadUrl;                       
                        utils.showToast("上传协议成功"); 
                    })
                    .catch((error) => {
                        _this.isBtnLoading = false;
                        console.log(error);
                        event.target.value = ""; 
                        utils.showToast("上传失败");
                    });                   
            } else {
                utils.showToast("请上传格式为pdf的文件");
                val.target.value = "";
            }
        },
        selectLOgo() {
            //上传图片
            let _this = this;
            let files = event.target.files;
            let extensions = _this.fileExtensionCheck(files[0].name);
            if (files[0].size > 1024 * 1024) {
                utils.showToast("请上传小于1MB的图片"); //img大小判断
                event.target.value = "";
                return false;
            } 
            if (utils.isIllegalName(files[0].name)){
            //上传文件名非法检索
                let text =`文件名不能含有"#"、"%"、"+"、"@"特殊字符，请重新上传`
                utils.showToast(text);
                event.target.value = "";
                return false;
            }               
            if (extensions == "IMG" || extensions == "PNG") {
                //支持的文件类型
                // let formData = new FormData();
                // formData.append("file", files[0]);
                // let url = {
                //     prefix: "/mallvop/file/v1",
                //     url:
                //         "/upload?c=static&p=%2Fadd%2Flogo&n=" +
                //         encodeURI(files[0].name)
                // };
                // request(url, formData).then(res => {
                //     if (!!res && res.resultCode == 0) {
                //         this.defaultUrl =
                //             (location.origin
                //                 ? location.origin
                //                 : location.protocol + "//" + location.host) +
                //             "/mallvop/file/v1/content" +
                //             res.result.path;
                //         this.channelBasicInfo.logo = res.result.path;
                //     } else {
                //         event.target.value = "";
                //         utils.showToast("LOGO上传失败,请重新上传");
                //     }
                // });
                files[0].businessType = 'logo'
                cloudservices
                    .upload2Ceph([files[0]])
                    .then((allRes) => {
                        this.channelBasicInfo.logo = this.defaultUrl = allRes[0].downLoadUrl;
                    })
                    .catch((error) => {
                        console.log(error);
                        event.target.value = ""; 
                        utils.showToast("LOGO上传失败,请重新上传");
                    });                     
            } else {
                utils.showToast("请上传格式为jpg,jpeg,png的文件");
                event.target.value = "";
            }
        },
        dellogo() {
            //删除logo实践
            this.defaultUrl = "";
            this.channelBasicInfo.logo = this.defaultUrl;
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
                        //初始化支付方法  页面默认为不选
                        return (item.paymentMethodState = false);
                    });

                    this.payList = arr;
                    // 编辑的时候回显;
                    if (that.edits) {
                        that.payList.forEach(item => {
                            that.channelBasicInfo.paymentMethods.forEach(
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
            if (event.target.className == "changeIconBtn") {
                return false;
            }
            this.payList[index].paymentMethodState = !state;
            // 深拷贝  避免数据变化对视图影响

            this.checkPaymentMethods = JSON.parse(
                JSON.stringify(this.payList)
            ).filter(item => {
                return item.paymentMethodState == 1;
            });

            this.checkPaymentMethods.forEach(item => {
                delete item.paymentMethodState;
            });
        },

        //展开收缩协议详情
        expand: function(item, index, event) {
            //动态的切换class
            if (event.target.className == "delfileBtn") {
                return false;
            }
            // 使用set避免数据变化视图不更新
            this.$set(this.fileList[index], "showDetail", !item.showDetail);
        },
        // 协议展开收起
        agreementName: function(agreementName, index) {
            var agrName = "";
            if (!!agreementName) {
                agrName = agreementName;
            } else {
                var num = Number(index) + 1;
                agrName = "协议" + num;
            }
            return agrName;
        },
        //删除协议
        delAgreement: function(index) {
            this.fileList.splice(index, 1);
        },
        //删除协议书
        delAgreementFile: function(index) {
            this.fileList[index].fileName = "";
            this.fileList[index].fileId = "";
            this.fileList[index].fileUrl = "";
            this.fileList[index].protocolFileUrl = "";
        },
        //预览协议书
        showFile: function(val) {
            let orgin = location.origin //兼容ie10   1 ie10无origin属性  2不支持模板字符串
                ? location.origin
                : location.protocol + "//" + location.host;
            //file服务还是BOS，BOS都是第三方绝对地址；file服务是同域名的相对或绝对地址    
            let pathFile= "/mallvop/file/v1/content"
            if (val.substring(0, 4) != "http" || val.indexOf(orgin + pathFile) != -1){
                this.url = val.substring(0, 4) == "http"
                    ? (utils.PdfBaseurl + val)
                    : (utils.PdfBaseurl + orgin + pathFile + val);
            } else {
                this.url = this.getEncodeNameUlr(val);
            }

            this.showPreview = true;
        },
        /**
         * 针对特殊字符，名字必须URLEncode
         */
        getEncodeNameUlr:function(url) {
            let fileName = encodeURIComponent(
                url.substr((url.lastIndexOf("/") || 0) + 1)
            );
            console.log("fileName=" + fileName);
            return url.substr(0, url.lastIndexOf("/") + 1) + fileName;   
        },          
        //添加协议
        addAgreement: function() {
            this.fileList.push({
                protocolName: "", //协议名称
                protocolFileUrl: "",
                remark: "",
                fileName: "",
                posSourceList:[{name:"京东企业购", checked:false, type:"jd"}, {name:"苏宁易购", checked:false, type:"sn"}, {name:"西域", checked:false, type:"xy"}], ///协议显示位置数据源          
                showDetail: true
            });
        },
        // 新增渠道接入信息
        confirm: function() {
            let json = {
                userId: channelhandler.userInfo.userId,
                companyId: 0,
                userName: channelhandler.userInfo.mgrName,
                logo: this.channelBasicInfo.logo,
                channelName: this.channelBasicInfo.channelName,
                shortChannelName: this.channelBasicInfo.shortChannelName,
                paymentMethods: this.checkPaymentMethods,
                protocolInfos: this.protocolInfos
            };
            this.loads = true;
            channelhandler.add(json).then(res => {
                if (!!res && res.resultCode == 0) {
                    utils.showToast("创建渠道成功");
                    this.loads = false;
                    this.modal1 = false;
                    this.goBack();
                } else {
                    this.loads = false;
                }
            }).catch(()=>{
                this.loads = false;
            });
        },

        cancel() {
            this.modal1 = false;
        },
        addChannel: function() {
            if (!this.channelBasicInfo.logo) {
                utils.showToast("请上传渠道LOGO");
                return false;
            }
            if (!this.channelBasicInfo.channelName) {
                utils.showToast("渠道全称不能为空");
                return false;
            }
            if (!this.channelBasicInfo.shortChannelName) {
                utils.showToast("渠道简称不能为空");
                return false;
            }
            if (this.checkPaymentMethods.length < 1) {
                utils.showToast("至少选择一种支付方式");
                return false;
            }

            this.protocolInfos = JSON.parse(JSON.stringify(this.fileList));
            // 弹框之前先校验
            let havename = this.protocolInfos.every(item => {
                return item.protocolName;
            });
            if (!havename) {
                utils.showToast("协议名称不能为空");
                return false;
            }

            let haveSummary = this.protocolInfos.every(item => {
                return item.protocolSummaryRes && item.protocolSummaryRes.vaildResult;
            });
            if (!haveSummary) {
                utils.showToast("获取信息摘要不能为空");
                return false;
            } 
            //将组件输出的协议对象映射成协议内容
            this.protocolInfos.forEach(item => {
                item.summary = item.protocolSummaryRes.modelData.summaryList[0];
                delete item["protocolSummaryRes"]
            });                
            

            let propos = this.protocolInfos.every(item => {
                return item.protocolFileUrl;
            });
            if (!propos) {
                utils.showToast("请上传协议书");
                return false;
            }
            //将协议显示位置处理一下，这个不是必填项
            this.protocolInfos.forEach(item => {
                item.showPositionList = [];
                item.posSourceList.forEach(pos=>{
                    if (pos.checked){
                        item.showPositionList.push(pos.type)
                    }
                })
                delete item["posSourceList"]
            });                 

            this.protocolInfos.forEach(item => {
                delete item.showDetail;
            });
            this.modalTitle = "确定创建该渠道服务吗？";
            this.modalType = 0;
            this.modal1 = true;
        },

        //文件类型判断
        fileExtensionCheck: function(fileName) {
            var extension = "";
            var arr = fileName.split(".");
            var houzui = arr[arr.length - 1];

            if ("pdf".compare(houzui) || "PDF".compare(houzui)) {
                //判断pdf
                extension = "pdf";
            }
            if (
                //判断img
                "jpg".compare(houzui) ||
                "JPG".compare(houzui) ||
                "jpeg".compare(houzui) ||
                "JPEG".compare(houzui)
            ) {
                extension = "IMG";
            }
            if ("png".compare(houzui) || "PNG".compare(houzui)) {
                extension = "PNG";
            }
            return extension;
        },
        getPrecutChannleList() {
            const that = this;
            //发送请求 TODO
            that.$iLoading.show();
            channelhandler
                .getOptionalChannel({})
                .then((response) => {
                    if (
                        response &&
                        response.result 
                    ) {
                        that.cleanChannels = [];
                        let temp = response.result;
                        temp.forEach((element) => {
                            that.cleanChannels.push({
                                value: element.channelId,
                                label: element.channelName
                            });
                        });
                    }
                    that.$iLoading.hide();
                })
                .catch(() => {
                    that.cleanChannels = [{value:1001, label:"上海银行"}];
                    that.$iLoading.hide();
                });
        }        
    }
};
</script>
<style lang="less" scoped>
.channelMgrContentBox {
    font-size: 14px;
    min-height: 100%;
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
                border-radius: 5px;
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
    .serAgreementInfo {
        border-radius: 8px;
        background-color: #fff;
        padding-bottom: 1px;
        .agreementList {
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

            .agreementFile {
                padding: 5px 15px;
                position: relative;
                background: rgba(248, 248, 248, 1);
                color: #478aee;
                border-radius: 5px;
                vertical-align: middle;
                position: relative;
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
            margin: 24px 32px 32px;
            font-size: 14px;
            font-weight: 400;
            color: #478aee;
            &:hover {
                opacity: 0.8;
            }
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
        box-sizing: border-box;
        .infoLi {
            display: flex;
            align-items: center;
            .infoMsg {
                text-align: right;
                width: 115px;
                margin-right: 8px;
            }
        }
        .channelLogoBox {
            .logoBox {
                position: relative;
                .logoImg {
                    height: 60px;
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
        }
    }
    .delicon {
        position: absolute;
        width: 18px;
        height: 18px;
        right: -10px;
        top: -10px;
        cursor: pointer;
    }
    .defaultUrl {
        border-radius: 6px;
    }
    // }
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

        .agreementNameIcon {
            width: 16px;
            height: 16px;
            margin-right: 5px;
            transform: rotate(180deg);
        }
        span {
            color: #666666;
        }
    }

    .btnList {
        padding: 24px;
        text-align: center;
    }
    .requireMsg {
        color: #ff0000;
        padding-right: 4px;
    }
    .showporsname {
        font-weight: bold;
    }
}
.fileNameURL {
    display: inline-block;
    max-width: 1000px;
    word-wrap: break-word;
    text-overflow: ellipsis;
    // white-space: nowrap;
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
// .fileInput {
//     &:nth-of-type(1) {
//         &:hover {
//             + .fileInput {
//                 background-color: #478aee;
//                 color: #fff;
//                 opacity: 0.8;
//             }
//         }
//     }
// }

.ipimgbox {
    position: relative;
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
    position: relative;
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
        top: 7px;
    }
    span {
        margin-left: 14px;
    }
}
.imgfa {
    height: 40px;
    &:nth-child(1) {
        height: 50px;
    }
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
</style>
<style lang="less">
.requireMsg {
    color: #ff0000;
    padding-right: 4px;
}

.el-dialog--center .el-dialog__body {
    text-align: center;
}
.noAuth {
    margin-top: 0 !important;
    margin: 0 auto !important; /*水平居中*/
    position: absolute !important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-button {
        color: #fff;
        &:hover {
            color: #fff;
            opacity: 0.8;
        }
        &:first-child {
            background-color: #c2c2c2;
            border-color: #c2c2c2;
            margin-left: 24px;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
            }
        }
        &:last-child {
            background-color: #478aee;
        }
    }
}
.watchfile {
    .el-dialog__body {
        padding-top: 40px !important;
    }
}
.infoLi {
    .el-textarea__inner {
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    }
}
.btnList {
    .el-button {
        margin-right: 14px;
        border-radius: 8px;
        width: 144px;
        height: 48px;
        border-radius: 8px;
        color: #fff;
        &:hover {
            color: #fff;
            opacity: 0.8;
            background-color: #478aee;
            border: 1px solid #478aee;
        }
    }
    .el-button--primary {
        background-color: #478aee;
        border: 1px solid #478aee;
    }
    .el-button--default {
        background-color: #c2c2c2;
        border: 1px solid #c2c2c2;
        &:hover {
            background-color: #478aee;
            border: 1px solid #478aee;
            opacity: 0.8;
        }
    }
}
.el-select-dropdown__list{
    max-width: 402px;
    .el-select-dropdown__item.selected{
        padding-right: 36px;
    }    
}

</style>
