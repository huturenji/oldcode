<template>
    <div>
        <div
            v-bind:class="[
                (type == 'img' ? 'demo-upload-list' : 'demo-upload-list2') , layout === '2' && 'layout2'
            ]"
            
        >
            <div v-for="item in uploadList"
            :key="item.uid">
                <template v-if="item.status === 'finished'">
                    <div v-if="type === 'img'" class="imgItem">
                        <img :src="item.url"/>
                        <div
                            v-if="!!uploadUrl"
                            class="badge"
                            @click="handleRemove(item, 2)"
                        >
                            —
                        </div>
                    </div>
                    <div v-else class="fileItem">
                        <Tooltip
                            :content="item.name"
                            max-width="200"
                            placement="top"
                        >
                            <div
                                :style="{ color: '#478aee', width: '100%' }"
                                @click="handleView(item)"
                            >
                                {{ item.name.substr(0, 20) }}
                            </div>
                        </Tooltip>
                        <div
                            v-if="!!uploadUrl"
                            class="badge"
                            @click="handleRemove(item, 2)"
                        >
                            —
                        </div>
                    </div>
                </template>
                <template v-else>
                    <!-- <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress> -->
                </template>
            </div>
        </div>
        <Upload
            v-show="ifShowUploadComp"
            ref="uploadComp"
            :headers="cHeader"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="currentType.formatList"
            :max-size="currentType.fileMaxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :action="actionUrl"
            :style="{display: 'inline-block', width:layout === '2'?' 100px':'600px'}"
        >
            <div v-if="type === 'file'">
                <Button
                    type="dashed"
                    :style="{ color: '#478aee', width: '600px' }"
                    >+添加附件</Button
                >
                <div :style="{ color: '#cccfd4'}">
                    {{ currentType.uploadMsg }}
                </div>
            </div>
            <div
                v-else-if="type === 'fileShort'"
                :style="{ display: 'flex', alignItems: 'flex-end' }"
            >
                <Button :style="{ color: '#478aee', width: '150px' }">
                    <!-- <img
                        :src="require('assets//upload.png')"
                        :style="{ height: '18px', marginRight: '5px' }"
                    /> -->
                    点击上传
                </Button>
                <div :style="{ color: '#cccfd4', marginLeft: '10px' }">
                    {{ currentType.uploadMsg }}
                </div>
            </div>
            <div
                v-else
                style="text-align: center; display: flex; alignitems: flex-end"
            >
                <div
                    style="
                        border: 1px dashed #e2e2e2;
                        width: 60px;
                        height: 60px;
                        paddingtop: 10px;
                    "
                >
                    <Icon type="ios-add" size="25"></Icon>
                    <div :style="{ color: '#cccfd4' }">上传</div>
                </div>
                <div :style="{ color: '#cccfd4', marginLeft: '10px' , display:layout=='2'?'none':'block'}">
                    {{ currentType.uploadMsg }}
                </div>
            </div>
        </Upload>
        <Modal title="查看附件" fullscreen footer-hide v-model="visible">
            <img
                v-if="visible && type === 'img'"
                :src="file4View && file4View.url4View"
                style="width: 100%"
            />
            <iframe
                v-else-if="visible && (type === 'file' || type === 'fileShort')"
                :src="file4View && file4View.url4View"
                style="width: 100%; height: calc(100vh - 82px)"
            ></iframe>
        </Modal>
    </div>
</template>
<script>
import utilshandler from "libs/utils";
import cloudservices from "libs/cloudservices.js";

const docBaseUrl = "https://docs.google.com/gview?url=";
// const docBaseUrl = "https://view.officeapps.live.com/op/view.aspx?src=";
const pdfBaseUrl =
    window.origin +
    "/travel/static/operation/thirdparty/pdfjs/web/viewer.html?file=";
const mediaFileUpUrl =
    window.origin + "/travel" + "/file/v1/upload?c=static&p=/travel/file&n=";
const mediaFileViewUrl = window.origin + "/travel" + "/file/v1/content/static/p";
export default {
    //上传组件Upload我们不支持multiple，也就是一次上传多个。不支持拖拽type="drag"。
    //设置属性 show-upload-list 为 false，可以不显示默认的上传列表。
    //设置属性 default-file-list 设置默认已上传的列表。
    //uploadUrl如果为空，并且defaultList不为空。那这个组件仅仅是一个展示使用的组件。不能删除，不能上传。
    props: {
        uploadUrl: {
            type: String,
            default: "",
        },
        //type主要因为业务需要，做了区分，核心区别在于上传组件的定制样式，
        //目前支持3种，参见typeMap。file和fileShort的区别是，file用于 供应商的附件上传，fileShort用于渠道协议的上传。
        type: {
            type: String,
            default: "img",
        },
        //id是一个识别码，主要用于一个页面上有多个upload组件的时候，区分不同的组件身份。这个id会在$emit("onUploadChange",
        //方法中作为参数返回。这样调用者就可以自有管理多个upload组件
        id: {
            type: String,
            default: "",
        },
        //已经上传的附件{name:"",url:"https://img14.360buyimg.com/n2/jfs/t1/105920/17/18611/145457/5e954220Ec8244684/13af308fde0b1f48.jpg"}
        defaultList: {
            type: Array,
            default: [],
        },
        //是否只能上传一次，默认情况下，只能上传一次就隐藏上传按钮了。但是组件也支持上传多次附件。
        uploadOnce: {
            type: Boolean,
            default: true,
        },
        //布局格式，默认1，竖版。2是横版
        layout:{
            type: String,
            default: "1",
        },
    },
    computed: {},
    data() {
        return {
            actionUrl: "",
            ifShowUploadComp: true, //是否显示上传组件
            file4View: null,
            visible: false,
            uploadList: [],
            typeMap: {
                img: {
                    formatList: ["jpg", "jpeg", "png"], //文件必须是 确认的 格式的图片。
                    fileMaxSize: 2048, //文件上传最大值限制，单位K
                    fileMaxNum: 5, //文件上传数量最大限制
                    fileMaxNumMsg: "最多只能上传5个文件",
                    fileMaxSizeMsg: "上传文件不能超过2M",
                    fileformatMsg: "文件格式不正确",
                    uploadMsg: "支持jpeg，png格式，不大于2M，建议像素256*256",
                },
                file: {
                    formatList: ["pdf", "doc", "docx"], //文件必须是 确认的 格式的图片。
                    fileMaxSize: 20480, //文件上传最大值限制，单位K
                    fileMaxNum: 5, //文件上传数量最大限制
                    fileMaxNumMsg: "最多只能上传5个文件",
                    fileMaxSizeMsg: "上传文件不能超过20M",
                    fileformatMsg: "文件格式不正确",
                    uploadMsg: "支持pdf，doc，docx格式，文件最大不超过20M",
                },
                fileShort: {
                    formatList: ["pdf", "doc", "docx"], //文件必须是 确认的 格式的图片。
                    fileMaxSize: 20480, //文件上传最大值限制，单位K
                    fileMaxNum: 5, //文件上传数量最大限制
                    fileMaxNumMsg: "最多只能上传5个文件",
                    fileMaxSizeMsg: "上传文件不能超过20M",
                    fileformatMsg: "文件格式不正确",
                    uploadMsg: "支持pdf，doc，docx格式，文件最大不超过20M",
                },
            },
            currentType: {},
            cloudSupplier: 2, //云服务提供商，1是file服务，2是ceph
        };
    },
    computed: {
        cHeader() {
             return {};
        },
    },
    watch: {
        defaultList(val) {
            //defaultList动态赋值之后，需要在nextTick回调获取最新的数据。
            this.updateFileList();
        },
        uploadList: {
            handler(val, oldvalue) {
                console.log("uploadList=" + JSON.stringify(val));
                if (val.length == 0) {
                    this.ifShowUploadComp = this.getIfShowUploadComp();
                    this.$emit("onUploadChange", [], this.id);
                    this.$iLoading.hide();
                    return;
                }
                //只上传1个文件的时候，及时刷新ifShowUploadComp
                if (val.length == 1 && this.uploadOnce) {
                    this.ifShowUploadComp = this.getIfShowUploadComp();
                }
                //默认上传中的都是最后一个，
                let cur = val[val.length - 1];
                //如果正常上传中
                if (cur.status != "finished") {
                    // console.log("iLoading.show");
                    this.$iLoading.show();
                    return;
                } else {
                    this.$iLoading.hide();
                }

                let outUpList = JSON.parse(JSON.stringify(val));
                for (let i = 0; i < outUpList.length; i++) {
                    if (
                        !(
                            outUpList[i].status === "finished" &&
                            !outUpList[i].showProgress
                        )
                    ) {
                        outUpList.splice(i, 1);
                        i--;
                    }
                }
                if (
                    outUpList &&
                    outUpList.length > 0 &&
                    outUpList.length == val.length
                ) {
                    this.ifShowUploadComp = this.getIfShowUploadComp();
                    this.$emit("onUploadChange", outUpList, this.id);
                    //否则不是上传中，并且可能要输出数据了,先回调，在执行关闭方法，防止用户操作过快，导致数据刷新不及时。
                    const that = this;
                    setTimeout(() => {
                        if (cur && cur.status === "finished") {
                            console.log("iLoading.hide");
                            that.$iLoading.hide();
                        }
                    }, 500);
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.currentType = this.typeMap[this.type];
        this.updateFileList();
    },
    methods: {
        updateFileList() {
            this.$nextTick(() => {
                this.uploadList = this.$refs.uploadComp.fileList;
            });
        },
        handleView(viewItem) {
            this.file4View = viewItem;
            let urlLowCase = this.file4View.url.toLowerCase(); //转换成小写 再做判断
            //图片需要预览。单独处理
            if (
                urlLowCase.indexOf(".jpg") != -1 ||
                urlLowCase.indexOf(".jpeg") != -1 ||
                urlLowCase.indexOf(".png") != -1
            ) {
                if (
                    this.cloudSupplier == 1 ||
                    this.file4View.url.indexOf(window.origin) != -1
                ) {
                    this.file4View.url4View = this.getEncodeNameUlr(
                        this.file4View.url
                    );
                } else if (this.cloudSupplier == 2) {
                    //直接使用ifram来显示
                    this.file4View.url4View = this.getEncodeNameUlr(
                        this.file4View.url,
                        2
                    );
                } else {
                    //直接使用ifram来显示
                    this.file4View.url4View = this.getEncodeNameUlr(
                        this.file4View.url,
                        2
                    );
                }
                this.visible = true;
                return;
            }
            //pdf需要预览。单独处理
            if (
                this.file4View.type == "application/pdf" ||
                urlLowCase.indexOf(".pdf") != -1
            ) {
                if (
                    this.cloudSupplier == 1 ||
                    this.file4View.url.indexOf(window.origin) != -1
                ) {
                    //使用本地的公共JS服务展示pdf，但必须是不能跨域
                    this.file4View.url4View =
                        pdfBaseUrl + this.getEncodeNameUlr(this.file4View.url);
                } else if (this.cloudSupplier == 2) {
                    //直接使用ifram来显示，
                    //默认情况 返回的URL是拼接的文件名字，可能有特殊字符#等，需要encode一次,后续调整了URL可能不需要了
                    this.file4View.url4View = this.getEncodeNameUlr(
                        this.file4View.url,
                        2
                    );
                } else {
                    //直接使用ifram来显示
                    this.file4View.url4View = this.getEncodeNameUlr(
                        this.file4View.url,
                        2
                    );
                }
                this.visible = true;
                return;
            }

            //不需要预览的，除了PDF和img，都击下载再去查看。
            let fileName =
                this.file4View.url.substr(
                    (this.file4View.url.lastIndexOf("/") || 0) + 1
                ) || "下载文档";
            utilshandler.downloadFile(
                this.getEncodeNameUlr(this.file4View.url, 2),
                fileName
            );
        },
        handleRemove(file, type = 1) {
            if (this.cloudSupplier == 2 && type == 2) {
                //ceph的手动删除，需要在线删除;
                let params = [
                    {
                        fileUrl: file.name,
                        businessType: file.businessType,
                    },
                ];
                //陈总说不建议弄删除接口
                // cloudservices.delete2Ceph(params);
            }
            let fileList = this.$refs.uploadComp.fileList;
            let index = fileList.findIndex((item) => {
                return item.uid === file.uid;
            });
            if (index > -1) {
                fileList.splice(index, 1);
            }
        },
        handleSuccess(res, file) {
            //file的url到底是什么，这个根具体的上传接口有关系，可能需要手动拼接。
            console.log("handleSuccess.res=" + JSON.stringify(res));
            if (this.cloudSupplier == 1) {
                file.url =
                    mediaFileViewUrl +
                    (res.result && res.result.key ? res.result.key : "");
                //名字只要是我们上传的，我们decode
                if (file.url) {
                    file.name = decodeURIComponent(
                        file.url
                            .substr((file.url.lastIndexOf("/") || 0) + 1)
                            .replace(/%/g, "%25")
                    );
                }
                return;
            }
            if (this.cloudSupplier == 2) {
                file.url = file.downloadUrl || "";
                if (file.url) {
                    file.name = file.url
                        .substr((file.url.lastIndexOf("/") || 0) + 1)
                        .replace(/%/g, "%25");
                }
                return;
            }
        },
        // handleFormatError(file) {
        //     utilshandler.showToast(this.currentType.fileformatMsg);
        // },
        // handleMaxSize(file) {
        //     utilshandler.showToast(this.currentType.fileMaxSizeMsg);
        // },
        handleBeforeUpload(file) {
            console.log("handleBeforeUpload");
            const that = this;
            //上传之前，校验一下文件格式。
            let check = this.uploadList.length < this.currentType.fileMaxNum;
            if (!check) {
                utilshandler.showToast(this.currentType.fileMaxNumMsg);
                return false; //阻断自动上传
            }
            check = this.fileFormatCheck(file.name);
            if (!check) {
                utilshandler.showToast(this.currentType.fileformatMsg);
                return false; //阻断自动上传
            }
            check = this.fileMaxSizeCheck(file);
            if (!check) {
                utilshandler.showToast(this.currentType.fileMaxSizeMsg);
                return false; //阻断自动上传
            }
            console.log("check=" + check);
            if (that.cloudSupplier == 1) {
                // 防止特殊字符，我们需要encode
                this.actionUrl = mediaFileUpUrl + encodeURIComponent(file.name);
                return that.autoUpload();
            }
            if (that.cloudSupplier == 2) {
                that.manualUpload(file);
                //手动上传，返回false
                return false;
            }
        },
        /**
         * 手动上传，需要自由实现上传和组件数据更新
         */
        manualUpload(file) {
            const that = this;
            file.businessType = that.type == "img" ? "logo" : "agreement";
            file.uid = new Date().getTime();
            cloudservices
                .upload2Ceph([file])
                .then((allRes) => {
                    //自己管理组件的数据刷新
                    that.$refs.uploadComp.fileList.forEach((element) => {
                        let findRes = allRes.find((res) => {
                            return element.uid == res.fileUid;
                        });
                        if (findRes) {
                            element.downloadUrl = findRes.downLoadUrl;
                            that.handleSuccess(findRes, element);
                        }
                        element.showProgress = false;
                        element.status = "finished";
                    });
                })
                .catch((error) => {
                    console.log("handleRemove=");
                    //自己管理组件的数据刷新
                    that.handleRemove(file);
                });
            //自己管理组件的数据刷新
            let fileObj = {
                name: file.name,
                size: file.size,
                type: file.type,
                showProgress: true,
                status: "loading",
                uid: file.uid,
                businessType: file.businessType,
            };
            that.$refs.uploadComp.fileList.push(fileObj);
        },
        /**
         * 自动上传，组件默认方案
         */
        autoUpload() {
            //动态改变上传参数,通过返回一个promis对象解决
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            console.log(" return promise=");
            return promise; //通过返回一个promis对象解决
        },
        getIfShowUploadComp() {
            //uploadUrl如果为空,不显示上传组件。仅仅作为一个UI展示组件。
            // console.log("upload.switch="+this.uploadOnce);
            if (!this.uploadUrl) {
                return false;
            } else if (
                !this.uploadOnce &&
                this.uploadList.length < this.currentType.fileMaxNum
            ) {
                return true;
            } else if (
                !this.uploadOnce &&
                this.uploadList.length >= this.currentType.fileMaxNum
            ) {
                return false;
            } else if (this.uploadOnce && this.uploadList.length == 0) {
                return true;
            } else if (this.uploadOnce && this.uploadList.length > 0) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * 针对特殊字符，名字必须URLEncode
         */
        getEncodeNameUlr(url, type = 1) {
            //经过分析，PDFJS的URL 如果有特殊字符，必须两次encode才可以，否则会导致解析错误。
            if (type == 1) {
                let fileName = encodeURIComponent(
                    encodeURIComponent(
                        url.substr((url.lastIndexOf("/") || 0) + 1)
                    )
                );
                console.log("fileName=" + fileName);
                return url.substr(0, url.lastIndexOf("/") + 1) + fileName;
            } else if (type == 2) {
                let fileName = encodeURIComponent(
                    url.substr((url.lastIndexOf("/") || 0) + 1)
                );
                console.log("fileName=" + fileName);
                return url.substr(0, url.lastIndexOf("/") + 1) + fileName;
            } else {
                return url;
            }
        },
        //文件类型判断
        fileFormatCheck: function (fileName) {
            var extension = "";
            var arr = fileName.split(".");
            var houzui = arr[arr.length - 1];

            return (
                this.currentType.formatList.indexOf(houzui.toLowerCase()) != -1
            );
        },
        //文件大小判断
        fileMaxSizeCheck: function (file) {
            if(this.layout === '2' && this.type === 'img'){
                return file.size <= 1024 * 1024;
            }else{
                return file.size <= this.currentType.fileMaxSize * 1024;
            }
        },
    },
};
</script>
<style scoped lang="less">
.demo-upload-list {
    text-align: center;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 4px;
}
.demo-upload-list2 {
    overflow: visible;
    width: 300px;
    background: #fff;
    height: 30px;
    position: relative;
    margin-right: 4px;
    margin-bottom: 5px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.layout2{
    display: flex;
    flex-wrap: wrap;
}
.fileItem {
    position: relative;
    cursor: pointer;
    .badge {
        position: absolute;
        color: white;
        background: red;
        font-size: 12px;
        width: 15px;
        height: 15px;
        border: 1px solid red;
        border-radius: 50%;
        text-align: center;
        top: 0px;
        right: 0px;
        line-height: 15px;
        cursor: pointer;
    }
}
.imgItem {
    position: relative;
    width: 90px;
    img {
        width: 60px;
        height: 60px;
        margin: 15px;
        cursor: pointer;
    }
    .badge {
        position: absolute;
        color: white;
        background: red;
        font-size: 12px;
        width: 15px;
        height: 15px;
        border: 1px solid red;
        border-radius: 50%;
        text-align: center;
        top: 0px;
        right: 5px;
        line-height: 15px;
        cursor: pointer;
    }
}
</style>
