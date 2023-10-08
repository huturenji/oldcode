<template>
    <div class="editSPContentBox">
        <div v-if="showContent">
            <div class="editSPContent">
                <div
                    class="handleBtnBox"
                    v-if="crumbs == 'detail'"
                >
                    <div class="handleBtn">
                        <div v-if="auth.stateAuth">
                            <Button
                                size="small"
                                v-if="supplierState == 2"
                                type="primary"
                                plain
                                @click="changeStatus(1)"
                                class="statusBtn"
                            >启用</Button>
                            <Button
                                v-else
                                size="small"
                                type="danger"
                                @click="changeStatus(2)"
                                class="statusBtn"
                            >停用</Button>
                        </div>
                        <Button
                            v-if="auth.editAuth"
                            size="small"
                            type="primary"
                            @click="editSp"
                        >编辑</Button>
                    </div>
                </div>
                <!-- 基础信息开始 -->
                <div class="baseInfo">
                    <div class="infoTitle">
                        基础信息
                    </div>
                    <div
                        class="addStatus"
                        v-if="crumbs == 'add'"
                    >
                        <div class="infoListBox">
                            <div class="infoLi spLogoBox">
                                <div class="spLogo infoMsg">
                                    <span class="requireMsg">*</span>供应商LOGO:
                                </div>
                                <div style="display: flex; align-items: center">
                                    <label
                                        v-if="!spLOGO"
                                        title="上传图片"
                                        for="chooseImg"
                                        class="chooseImgBtn"
                                    >
                                        <input
                                            id="chooseImg"
                                            type="file"
                                            title="上传LOGO"
                                            @change="selLogo"
                                        />
                                        <i class="el-icon-plus uploadIcon"></i>
                                    </label>
                                    <div
                                        class="logoBox"
                                        v-else
                                    >
                                        <img
                                            :src="require('assets/u962.png')"
                                            alt=""
                                            class="delBtn"
                                            @click="delLogo"
                                        />
                                        <img
                                            :src="spLOGO | srcFilter"
                                            @error="defaultLogoSrc()"
                                            alt=""
                                            class="logoImg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="infoLi">
                                <div class="spName infoMsg">
                                    <span class="requireMsg">*</span>供应商全称:
                                </div>
                                <div>
                                    <Input
                                        size="small"
                                        clearable
                                        v-model="spDetail.supplierName"
                                        :maxlength="100"
                                        placeholder="请输入供应商全称"
                                        @blur="
                                            spDetailStrTrim(spDetail.supplierName, 'supplierName')
                                        "
                                        style="width: 400px"
                                    />
                                </div>
                            </div>
                            <div class="infoLi">
                                <div class="spNameAbb infoMsg">
                                    <span class="requireMsg">*</span>供应商简称:
                                </div>
                                <div>
                                    <Input
                                        size="small"
                                        v-model="spDetail.supplierShortName"
                                        clearable
                                        @blur="
                                            spDetailStrTrim(
                                                spDetail.supplierShortName,
                                                'supplierShortName'
                                            )
                                        "
                                        :maxlength="20"
                                        placeholder="请输入供应商简称"
                                        style="width: 400px"
                                    />
                                </div>
                            </div>
                            <div
                                class="infoLi"
                                v-if="!!spDetail.supplierId"
                            >
                                <div class="spNameAbb infoMsg">
                                    供应商ID:
                                </div>
                                <div>
                                    <Input
                                        size="small"
                                        disabled
                                        v-model="spDetail.supplierId"
                                        style="width: 400px"
                                    />
                                </div>
                            </div>
                            <div class="infoLi">
                                <div class="spArea infoMsg">
                                    所在地区:
                                </div>
                                <div>
                                    <Input
                                        size="small"
                                        v-model="spDetail.supplierLocation"
                                        clearable
                                        @blur="spDetailStrTrim(spDetail.supplierLocation, 'supplierLocation')"
                                        placeholder="请输入供应商所在地"
                                        :maxlength="10"
                                        style="width: 400px"
                                    />
                                </div>
                            </div>
                            <div
                                class="infoLi"
                                style="align-items: flex-start"
                            >
                                <div class="spAreaDetail infoMsg">
                                    详细地址:
                                </div>
                                <div>
                                    <Input
                                        :maxlength="200"
                                        resize="none"
                                        show-word-limit
                                        type="textarea"
                                        placeholder="请输入详细地址"
                                        v-model="spDetail.supplierAddress"
                                        @blur="spDetailStrTrim(spDetail.supplierAddress, 'supplierAddress')"
                                        style="width: 400px"
                                        :rows="3"
                                        :autosize="{ maxRows: 3, minRows: 3 }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="detailStatus"
                        v-else
                    >
                        <div class="infoListBox">
                            <div class="infoLi">
                                <div class="spNameAbb infoMsg detailInfo">
                                    状态 :
                                </div>
                                <div>
                                    <span 
                                        v-show="supplierState=='2'" 
                                        style="color:#EE6747"
                                    >已停用</span>
                                    <span 
                                        style="color:#23B45D;" 
                                        v-show="supplierState=='1'"
                                    >已启用</span>
                                </div>
                            </div>
                            <div class="infoLi">
                                <div class="spLogo infoMsg detailInfo">
                                    供应商LOGO:
                                </div>
                                <div>
                                    <img
                                        v-if="spDetail.supplierLogo"
                                        :src="spDetail.supplierLogo | srcFilter"
                                        @error="defaultLogoSrc()"
                                        alt=""
                                        class="logoImg"
                                    />
                                </div>
                            </div>
                            <div class="infoLi">
                                <div class="spName infoMsg detailInfo">
                                    供应商全称:
                                </div>
                                <div>{{ spDetail.supplierName }}</div>
                            </div>
                            <div class="infoLi">
                                <div class="spNameAbb infoMsg detailInfo">
                                    供应商简称:
                                </div>
                                <div>{{ spDetail.supplierShortName }}</div>
                            </div>
                            <div class="infoLi">
                                <div class="spNameAbb infoMsg detailInfo">
                                    供应商ID:
                                </div>
                                <div>{{ spDetail.supplierId }}</div>
                            </div>
                            <div class="infoLi">
                                <div class="spArea infoMsg detailInfo">
                                    所在地区:
                                </div>
                                <div>{{ spDetail.supplierLocation }}</div>
                            </div>
                            <div
                                class="infoLi"
                                style="align-items: flex-start"
                            >
                                <div class="spAreaDetail infoMsg detailInfo">
                                    详细地址:
                                </div>
                                <div
                                    style="
                    flex: 1;
                    word-break: break-all;
                    word-wrap: break-word;
                    padding-right: 43px;
                  "
                                >
                                    {{ spDetail.supplierAddress }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 基础信息结束 -->
                <!-- 操作日志开始 -->
                <div
                    class="handleLog"
                    v-if="crumbs == 'detail'"
                >
                    <div class="infoTitle">
                        操作日志
                    </div>
                    <div
                        class="logList"
                        style="padding: 0 24px 32px; margin-bottom: 16px"
                    >
                        <!-- max-height="516" -->
                        <el-table
                            :stripe="true"
                            :header-cell-style="{
                                background: '#f2f2f2',
                                height: '36px',
                                padding: '0',
                            }"
                            :data="systemLogs"
                            :row-class-name="tableRowClassName"
                        >
                            <el-table-column
                                prop="handleTime"
                                label="时间"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.createTime ||"-" }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="handlePer"
                                label="操作人"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.userName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="handleContent"
                                label="内容"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.content }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 操作日志结束 -->
                </div>
                <!-- 操作日志结束 -->
                <div
                    class="btnList"
                    v-if="crumbs == 'add' && auth.createAuth"
                >
                    <Button
                        :loading="saveLoading"
                        @mouseover.native="checkOption()"
                        type="primary"
                        @click="submit"
                    >保存</Button>
                    <Button
                        type="info"
                        @click="cancelFun"
                    >
                        取消
                    </Button>
                </div>
            </div>
        </div>

        <!-- 二次确认弹框开始 -->
        <el-dialog
            :visible.sync="modal1"
            :close-on-click-modal="false"
            :show-close="false"
            width="560px"
            :modal-append-to-body="false"
            center
        >
            <div
                slot="title"
                class="header-title"
            >
                <span class="confirmTitle">{{ modelTitle }}</span>
                <span
                    class="cancelBtn"
                    @click="modal1 = false"
                >×</span>
            </div>
            <div class="inconContent">
                <p>{{ modelContentMsg }}</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <Button
                    type="info"
                    @click="modal1 = false"
                >取消</Button>
                <Button
                    type="primary"
                    @click="confirm"
                    :loading="confirmLoading"
                >确定</Button>
            </span>
        </el-dialog>
        <!-- 二次确认弹框结束 -->
        <!-- 权限二次确认弹框开始 -->
        <div class="roleConfirm">
            <el-dialog
                :visible.sync="modalFlg"
                :close-on-click-modal="false"
                :show-close="false"
                width="560px"
                :modal-append-to-body="false"
                center
            >
                <div
                    slot="title"
                    class="header-title"
                >
                    <span class="confirmTitle">权限确认</span>
                    <span
                        class="cancelBtn"
                        @click="modalFlg = false"
                    >×</span>
                </div>
                <div class="inconContent">
                    <p>暂无使用权限，如有需要请联系管理员开通</p>
                </div>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <Button
                        type="primary"
                        @click="modalFlg = false"
                    >我知道了</Button>
                </span>
            </el-dialog>
        </div>
    <!-- 权限二次确认弹框结束 -->
    </div>
</template>


<script>
import {
    Input,
    // Select,
    // Option,
    // TimePicker,
    Button,
    Table,
    TableColumn,
    Dialog
} from "element-ui";
import utils from "bislibs/utils";
import cloudservices from "libs/cloudservices";
import supplierhandler from "bislibs/requestHandler/supplierhandler";

export default {
    components: {
        Input,
        // elSelect: Select,
        // elOption: Option,
        // elTimePicker: TimePicker,
        Button,
        elTable: Table,
        elTableColumn: TableColumn,
        elDialog: Dialog
    },
    data() {
        return {
            defImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAAEbUlEQVR4Ae2baVPjMAyGXSj3Vc7//+/4xH0U2gK7j2fEeIpjJUZe6I40k00bxYrz+JVsl9nR5eXlR3DrJLDW6XFHJOCAFCE4IAekEFDcriAHpBBQ3K4gB6QQUNyuIAekEFDcriAHpBBQ3K4gB6QQUNyuIAekEFDcriAHpBBQ3K4gB6QQUNxjxd/bPRqNwsHBQdje3g5raz8jzPf39/Dy8hIeHh7Cx4fN3yLMAAFnd3e3N9AWNzIw0of7+3uTR5gNNcr5LWbZFzNAP5VWuUGx7IsZoFxH/4drzQG9vb2FxWKxsqzMivQyAWYUCqXAQfYU8o2NjeVbf/X3ZgpiqgXOeDwOm5ubAWCW0++/otoEEDDm83lYX18Pk8kkHB4ehq2trQiJ66tkzVKsJYTZbBZeX18DZwaDgxTmQK0MhpU1AURHqTWo5fb2Nnacl5HrtZ1nlfz4+PhZ11i9E5M0BhIpzTOfnp5qH/GlXRNAPIWCnCvSvNRQY9twd3cXtxG039nZiVuanFJQFiA5LLYbzQAxstQfpnk6yijXGMq4vr6O6iB9qGelWEDj2NvbiwOEcr9jTYp02iEKdemF0ntzn0lRUoc91snJyZdYDMDz83MciLQ9z+R+2ZulviGf64Z1yBO+cS/LAhTA3grl5Ozm5iYCBMjZ2dmXW2iHCkm5GmuuoJpO0QZlUGxR4NHRUWcYWYjKOXcj7YlTY78WEHUH29/fDzWFPYVBe+LUWPMUm06nnzMKUz81oTSaFHTqDgqi0DNjWRhxSFnSbYg1A0RHeNF0FuEzBRXJ536zAQ41hamaUc9N40Nebvle4jFgPKevKpukGPXg6uoqwkE1zCbn5+dx6hWFsOBLjeukFRBlQyvn9L7vfJZ4feHwLHNAjD4vSoqgEuCwfiGtWDyyNqKDAEJhgEFtAGUVLGud2Lm/KWZppOxQM00x0kd27CzUALJsQGNKBg5Tr8w+nIFzfHz8eW25be47sWjLuYWZRWVbASDUQY0pFVde5vT0NEJCcRj1ATiYpECfgkobYvSpV33ixQ4k/5gBAo5sL1CCZkDg5aQWpdOwAOrz0wip23e1LPGGFGkzQKiCFy5N4TloKRjxE4ND1CXXc2cAMzhAysVK20g8GYDU1/V5eNXqiETKDIXTESpeJmVICablkgGH+ziXjDg1KWYGaMiolF5EfBR5YqIQUqLLUA6pXUoz2ksqd8Xpum4GqOsBtddRIy/NcoHfgrqMtLq4uCimF+2JU2NmgEqjXNMx2rBMoOCzHKj9UzLtanfy9MEMULqlILCVsbBkBUyNkR/O+sRmbcT9Wm3SYo2s/ksmKcEs1mLBhjrTn1xZbHLk1j7MVCiGw0LVZoBkJABUs6SX9qUzsxC1RF6cIs6zOPBxiK8UZ4jPbB0kD5Wtg3xveQYGwGoLcJ++mdWgPg9bxXsckDJqDsgBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFPcfSUwNXipoDvYAAAAASUVORK5CYII=",
            showContent: true,
            userParam: {},
            auth: {
                editAuth: true,
                stateAuth: true,
                lookListAuth: true,
                createAuth: true,
                editPrice: true
            },
            crumbs: "add",
            spLOGO: "",
            logoSrcFlg: false,
            titleCrumbs: "新建供应商",
            modelTitle: "确定启用该渠道中业务？",
            modelContentMsg: "启用后，B+平台提供该服务",
            modal1: false, //二次确认框显隐
            modalFlg: false, //权限二次确认
            confirmLoading: false,
            handleStatus: true,
            saveLoading: false,
            UserID: "",
            imgName: "", //logo图片名称
            supplierState: 2,
            spDetail: {
                supplierId: 0,
                supplierLogo: "",
                supplierName: "",
                supplierShortName: "",
                supplierLocation: "",
                supplierAddress: "",
                supplierState: "",
                supplierType: ""
            },
            systemLogs: []
        };
    },
    beforeCreate() {},
    created() {
    // MSTP初始化
        var _this = this;
        _this.crumbs = this.$route.query.spName;
        _this.judgeAuth();
        // console.log(_this.crumbs)
        if (_this.crumbs == "add") {
            _this.titleCrumbs = "新建供应商";
        } else {
            _this.titleCrumbs = "供应商详情";
            _this.spDetail.supplierId = this.$route.query.supplierId;
            if (_this.auth.lookListAuth) {
                _this.querySpDetail();
            }
        }
    },
    mounted: function () {},
    methods: {
    /**
     * 权限判断
     */
        judgeAuth() {
            var _this = this;
            // var userCoInfStr = CommonCrypt.decrypt(
            //     utils.getCookie("userCoInf"),
            //     "SWPTCMuserCoInfo"
            // );
            // var serCoInfJsonStr = decodeURI(decodeURI(userCoInfStr));
            // _this.userParam = JSON.parse(serCoInfJsonStr);
            if (utils.hasAuth("seeSupplier")) {
                _this.auth.lookListAuth = true;
            }
            if (utils.hasAuth("updateSupplier")) {
                _this.auth.editAuth = true;
            }
            if (utils.hasAuth("editSupplierPrice")) {
                _this.auth.editPrice = true;
            }
            if (utils.hasAuth("setSupplierState")) {
                _this.auth.stateAuth = true;
            }
            if (utils.hasAuth("addSupplier")) {
                _this.auth.createAuth = true;
            }
            if (
                (!_this.auth.lookListAuth && _this.crumbs == "detail") ||
        (_this.crumbs == "add" && !_this.auth.createAuth)
            ) {
                _this.modalFlg = true;
                _this.showContent = false;
            }
        },
        /**
     * 上传logo
     */
        selLogo(event) {
            var _this = this;
            var files = event.target.files;
            var extensions = _this.fileExtensionCheck(files[0].name);
            if (files[0].size > 1024 * 1024) {
                utils.showToast("请上传小于1MB的图片");
                event.target.value = "";
                return false;
            }
            if (utils.isIllegalName(files[0].name)){
                //上传文件名非法检索
                let text =`文件名不能含有"#"、"%"、"+"、"@"特殊字符，请重新上传`
                utils.showToast(text);
                return false;
            }    
            if (extensions == "IMG" || extensions == "PNG") {
                // var formData = new FormData();
                // formData.append("file", files[0]);
                // var fileName = encodeURI(files[0].name);
                // var url = {
                //     prefix: "/mallvop/file/v1",
                //     url: `/upload?c=static&p=%2Fadd%2Flogo&n=${fileName}`
                // };
                // request(url, formData).then(res => {
                //     if (!!res && res.resultCode == 0) {
                //         _this.spLOGO = res.result.path;
                //     }
                // });
                files[0].businessType = "logo";
                cloudservices
                    .upload2Ceph([files[0]])
                    .then((allRes) => {
                        _this.spLOGO = allRes[0].downLoadUrl;
                    })
                    .catch((error) => {
                        console.log(error);
                        event.target.value = "";
                        utils.showToast("上传失败");
                    });
            } else {
                utils.showToast("请上传格式为jpg,jpeg,png的文件");
                event.target.value = "";
            }
        },
        delLogo() {
            this.spLOGO = "";
        },
        /**
     * logo格式校验
     */
        fileExtensionCheck(fileName) {
            var extension = "";
            var arr = fileName.split(".");
            var houzui = arr[arr.length - 1];

            if ("pdf".compare(houzui) || "PDF".compare(houzui)) {
                extension = "pdf";
            }
            if (
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
        /**
     * 查询供应商详情
     */
        querySpDetail() {
            var _this = this;
            var json = {
                supplierId: _this.spDetail.supplierId
            };
            _this.$iLoading.show();
            supplierhandler
                .getSupplier(json)
                .then((res) => {
                    _this.$iLoading.hide();
                    if (res.resultCode === 0) {
                        var spDetail = res.result;
                        _this.supplierState = spDetail.supplierState;
                        _this.systemLogs = spDetail.supplierOperationLogResultList;
                        _this.spLOGO = spDetail.supplierLogo;
                        _this.spDetail = spDetail;
                        console.log( _this.spDetail)
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch(function () {
                    _this.$iLoading.hide();
                });
        },
        /**
     * 银行账号格式化
     */
        verification(value) {
            var account = value;
            if (!account) {
                return false;
            }
            if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                /* 对照格式 */
                if (
                    account.match(
                        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}"
                    ) == null
                ) {
                    var accountNumeric = "",
                        accountChar = "",
                        i;
                    for (i = 0; i < account.length; i++) {
                        accountChar = account.substr(i, 1);
                        if (!isNaN(accountChar) && accountChar != " ") {
                            accountNumeric = accountNumeric + accountChar;
                        }
                    }
                    account = "";
                    for (i = 0; i < accountNumeric.length; i++) {
                        if (i % 4 == 0 && i > 0) {
                            account = account + " ";
                        }
                        account = account + accountNumeric.substr(i, 1);
                    }
                }
            } else {
                account =
          " " +
          account.substring(1, 5) +
          " " +
          account.substring(6, 10) +
          " " +
          account.substring(14, 18) +
          "-" +
          account.substring(18, 25);
            }
            this.spDetail.bankAccount = account;
        },
        /**
     * 返回
     */
        goBack: function () {
            var _this = this;
            if (!!_this.spDetail.supplierId && _this.crumbs == "add") {
                _this.crumbs = "detail";
                _this.querySpDetail();
            } else {
                _this.$router.go(-1);
            }
        },
        /**
     * 启用停用
     */
        changeStatus: function (status) {
            var _this = this;
            _this.spDetail.supplierState = status;
            // _this.handleStatus = status;
            _this.modal1 = true;
            if (status == 1) {
                _this.modelTitle = "确定启用该供应商？";
                _this.modelContentMsg = "启用后，B+平台将提供该供应商服务";
            } else {
                _this.modelTitle = "确定停用该供应商？";
                _this.modelContentMsg = "停用后，B+平台将停止提供该供应商服务";
            }
        },
        /**
     * 过滤输入框左右两侧空格
     */
        spDetailStrTrim: function (val, key) {
            this.spDetail[key] = val.trim();
        },
    
        /**
     * 二次确认
     */
        confirm: function () {
            var _this = this;
            // _this.modal1 = false;
            _this.confirmLoading = true;
            var json = {
                supplierId: _this.spDetail.supplierId,
                supplierState: _this.spDetail.supplierState,
                userId: supplierhandler.userInfo.userId,
                userName: supplierhandler.userInfo.mgrName,
                supplierType: _this.spDetail.supplierType
            };
            supplierhandler
                .setState(json)
                .then((res) => {
                    _this.modal1 = false;
                    _this.confirmLoading = false;
                    if (res.resultCode === 0) {
                        utils.showToast("操作成功");
                        _this.querySpDetail();
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch(function () {
                    _this.modal1 = false;
                    _this.confirmLoading = false;
                });
        },
        /**
     * 编辑SP
     */
        editSp: function () {
            var _this = this;
            _this.crumbs = "add";
        },
        /**
     * 服务时间格式化兼容IE
     */
        getSerDate: function (setTime) {
            var serDate = "";
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            var day = new Date().getDate();
            if (!!setTime) {
                serDate = `${year}/${month}/${day} ${setTime}`;
            }
            return serDate;
        },
    
        submit: function () {
            var _this = this;
            var json = _this.checkConditions();
            // json.bankAccount = json.bankAccount.replace(/\s*/g, "");
            if (!!json) {
                _this.saveLoading = true;
                supplierhandler
                    .updateSupplier(json)
                    .then(function (res) {
                        _this.saveLoading = false;
                        if (res.resultCode === 0) {
                            utils.showToast("操作成功");
                            setTimeout(function () {
                                _this.goBack();
                            }, 2000);
                        } else {
                            utils.showToast(res.resultMessage);
                        }
                    })
                    .catch(function () {
                        _this.saveLoading = false;
                    });
            }
        },
        cancelFun: function () {
            this.goBack();
        },
        /**
     * 滑过按钮时，使Input失焦，直接click与on-blur执行顺序可能会有冲突
     */
        checkOption: function () {
            $("input,textarea").blur();
        },
        /**
     * 判断条件并返回
     */
        checkConditions: function () {
            var _this = this,
                json = {};
            if (!_this.spLOGO) {
                utils.showToast("请上传供应商LOGO");
                return false;
            }
            if (!_this.spDetail.supplierName) {
                utils.showToast("请输入供应商全称");
                return false;
            }
            if (!_this.spDetail.supplierShortName) {
                utils.showToast("请输入供应商简称");
                return false;
            }
            json = _this.spDetail;
            json.userId = supplierhandler.userInfo.userId;
            json.userName = supplierhandler.userInfo.mgrName;
            json.supplierLogo = _this.spLOGO;
            return json;
        },
        goSpMgr: function () {
            this.$router.push({
                name: "spMgr"
            });
        },
        /**
     * 验证手机号码,正确格式返回true,错误格式返回false
     */
        checkPhone: function (phone) {
            if (!/^1[3456789]\d{9}$/.test(phone)) {
                return false;
            } 
            return true;
      
        },
        /**
     * 验证邮箱
     */
        checkEmail: function (email) {
            // eslint-disable-next-line prefer-regex-literals
            var reg = new RegExp(
                "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
            );
            if (!reg.test(email)) {
                return false;
            } 
            return true;
      
        },
        /**
     * 将银行账格式化，每4位中间加空格
     */
        bankAccountStyle: function (value) {
            var account = "";
            for (var i = 0; i < value.length; i++) {
                if (i % 4 == 0 && i > 0) {
                    account = account + " ";
                }
                account = account + value.substr(i, 1);
            }
            return account;
        },
        /**
     * 斑马纹对应的class名
     */
        // eslint-disable-next-line no-unused-vars
        tableRowClassName: function ({ row, rowIndex }) {
            if (rowIndex % 2 == 1) {
                return "trBg";
            }
        },
        /**
     * 图片加载失败显示默认图片
     */
        defaultLogoSrc: function (event) {
            var img = event.srcElement;
            img.src = this.defImg;
            img.onerror = null; //防止闪图
        }
    },
    filters: {
    /**
     * logo图片地址过滤，兼容绝对路径
     */
        srcFilter(url) {
            if (!!url && url.substring(0, 4) != "http") {
                url =
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + window.location.port : "") +
          "/mallvop/file/v1/content" +
          url;
            }
            return url;
        },
        /**
     * 联系人类型
     */
        contactType: function (value) {
            var contact = "";
            if (value == 1) {
                contact = "商务";
            } else if (value == 2) {
                contact = "客服";
            } else if (value == 3) {
                contact = "IT";
            } else if (value == 4) {
                contact = "财务";
            } else if (value == 5) {
                contact = "其他";
            }
            return contact;
        },
        /**
     * 联系人序号
     */
        contactNum: function (value) {
            var numb = Number(value) + 1;
            return "联系人" + numb;
        },
        /**
     * 联系方式类型
     */
        paymentType: function (value) {
            var payment = "";
            if (value == 1) {
                payment = "单结";
            } else if (value == 2) {
                payment = "预付";
            } else if (value == 3) {
                payment = "账期";
            }
            return payment;
        },
        /**
     * 定价规则类型
     */
        ruleType: function (value) {
            var rule = "";
            if (value == 1) {
                rule = "销售价格";
            } else if (value == 2) {
                rule = "最高限价";
            } else if (value == 3) {
                rule = "最低限价";
            }
            return rule;
        },
        /**
     * 价格类型
     */
        priceType: function (value) {
            var price = "";
            if (value == 1) {
                price = "结算价";
            } else if (value == 2) {
                price = "供应商销售价";
            }
            return price;
        }
    },
    watch: {}
};
</script>
<style lang="less" scoped>
.editSPContentBox {
  font-size: 14px;
  background-color: #f2f2f2;
  .editSPHeader {
    .headerTop {
      box-sizing: border-box;
      height: 61px;
      padding: 24px 0 16px 24px;
      width: 1280px;
      margin: auto;
      span {
        font-size: 16px;
      }
      .homePageCrumb,
      .spMgrCrumb {
        color: #999;
        cursor: pointer;
      }
      .spMgrCrumb:hover {
        color: #409eff;
      }
      .homePageCrumb:hover {
        color: #409eff;
      }
    }
  }
  .editSPContent {
    box-sizing: border-box;
    width: 1280px;
    margin: auto;
    .handleBtnBox {
      padding: 0 56px 16px 0;
      .handleBtn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-button {
          width: 80px;
          padding: 0;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          border-radius: 6px;
        }
        .statusBtn {
          margin: 0 13px;
        }
      }
    }
    .baseInfo,
    .contactsInfo,
    .serInfo,
    .priceRuleInfo,
    .clearingInfo,
    .handleLog {
      background-color: #fff;
      border-radius: 8px;
    }
    .baseInfo {
      .spLogoBox {
        .chooseImgBtn {
          display: block;
          width: 72px;
          height: 72px;
          text-align: center;
          line-height: 72px;
          background-color: #f6f6f6;
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
        .logoBox {
          position: relative;
          .delBtn {
            position: absolute;
            width: 20px;
            height: 20px;
            right: -10px;
            top: -10px;
            cursor: pointer;
          }
        }
      }
      .logoImg {
        width: 72px;
        height: 72px;
        border-radius: 5px;
      }
    }
    .priceRuleInfo {
      .percentInput {
        position: relative;
        .percentSymbol {
          position: absolute;
          right: 13px;
          top: 2px;
          color: #333;
        }
        .divisionSymbol {
          position: absolute;
          right: 40px;
          top: -5px;
          transform: scale(0.5, 2.5);
          color: #c5c8ce;
        }
      }
      .infoMsg {
        margin-right: 0 !important;
      }
      .mathSym {
        margin: 0 5px;
        color: #333;
      }
    }
    .infoTitle {
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #eee;
      margin-bottom: 24px;
      padding-left: 32px;
      line-height: 43px;
    }
    .infoListBox {
      margin-bottom: 16px;
      padding-bottom: 16px;
      .infoLi {
        display: flex;
        padding-bottom: 16px;
        align-items: center;
        .infoMsg {
          text-align: right;
          width: 100px;
          margin: 0 8px 0 56px;
        }
      }
      .contactList {
        .contactLi {
          width: 950px;
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
      .addContact {
        width: 920px;
        text-align: center;
        line-height: 38px;
        border: 1px dashed #ddd;
        border-radius: 5px;
        cursor: pointer;
        color: #478aee;
      }
    }
    .detailStatus {
      .infoMsg {
        margin: 0 16px 0 56px !important;
      }
    }
  }
  .requireMsg {
    color: #ff0000;
    padding-right: 4px;
  }
  .btnList {
    display: flex;
    justify-content: center;
    padding: 8px 0 40px;
    .el-button {
      width: 144px;
      height: 48px;
      padding: 0;
      line-height: 48px;
      margin: 0 12px;
      font-size: 16px;
      border-radius: 8px;
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
}
.sprSymbol {
  margin: 0 6px;
  white-space: nowrap;
}
.detailInfo {
  color: #999 !important;
}
</style>
<style lang="less">
.percentInput {
  .el-input__inner {
    padding-left: 5px;
  }
}
.excessInput {
  .el-input__inner {
    padding-left: 5px;
  }
}
input {
  font-size: 14px !important;
}
.editSPContentBox {
  .el-input__inner {
    height: 40px !important;
    // padding-left: 8px;
    padding-right: 8px !important;
  }  
  .el-textarea__inner {
    padding: 5px 8px;
  }
  .el-table__body-wrapper {
    max-height: 470px;
    overflow-y: auto;
  }
  .el-table__header {
    width: 100% !important;
  }
  .el-table__body {
    width: 100% !important;
  }
}
</style>
