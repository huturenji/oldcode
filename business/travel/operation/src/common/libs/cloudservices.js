import apibase from './apibase.js';
import utils from "./utils.js"
/**
 * 云服务业务类
 * 封装前端项目用到的有关云服务的功能接口
 * 包括文件服务和ceph两种
 */
class cloudservices {
    constructor() {
        this.noUseBsl = true; //文件上传默认不需要走bsl安全链路，故此处的配置为true
        this.initData();
    }
    /**
     * 初始化一些数据
     */
    initData() {
        var that = this;
        //创建api对象
        that.apiClient = new apibase(true)
        that.apiClient.setErrorCodeData(that.getErrorCode());
        let whiteList = ['/presign/', '/file/']
        that.apiClient.setErrorCodeWhiteList(whiteList)
        //默认额URL地址，当从URLConfig取不到数据的时候，默认使用这个
        that.defaultUrl = window.origin + "/travel";
    }
    //上传接口的错误码
    getErrorCode() {
        return {
            "85105001": {
                text: "角色不存在",
                noticeType: utils.NoticeType.TOAST,
            },
        }
    }
    /**
     * 通过ceph系统上传文件，这是个批量接口。流程包含2部分，
     * 第一部分 获取上传地址，
     * 第二部分 向上传地址传数据。成功后，将下载地址返回出去。
     * @param {*} file 需要fileType 标示图片img 还是 文件 file;name和uid
     */
    upload2Ceph(files) {
        const that = this;
        return new Promise((resolve, reject) => {
            if (!that.checkArrayNoEmpty(files)) {
                return reject("files should be array and not empty");
            }
            let findindex = files.findIndex((item) => {
                return !item.name || !item.businessType
            })
            if (findindex != -1) {
                return reject("file element should has name and businessType");
            }
            let params = [];
            files.forEach((element) => {
                element.contentType = "multipart/form-data";
                //需要对PDF文件上传的contentType做特别处理，否则会导致无法预览的问题
                if (element.name && element.name.indexOf(".pdf") != -1) {
                    element.contentType = "application/pdf";
                }
                params.push({
                    fileName: element.name,
                    businessType: element.businessType,//4种类型postsale、logo、agreement、businessData
                    urlExpireTime: element.urlExpireTime || 10,//url有效期，单位分钟
                    contentType: element.contentType,//因为阿里云必须保证contentType和上传的入参一致，这里我们必填
                    contentMd5: element.contentMd5,
                });
            });
            //发送请求
            that.apiClient.apiCallHandler(that.defaultUrl + '/presign/v1/getUploadUrl', params, { noUseBsl: that.noUseBsl })
                .then((response) => {
                    if (
                        response.result &&
                        response.result.uploadUrlVOList &&
                        response.result.uploadUrlVOList.length > 0
                    ) {
                        //先把这个下载地址赋值
                        console.log(
                            JSON.stringify(response.result.uploadUrlVOList)
                        );
                        let fileUpTasks = response.result.uploadUrlVOList.map(
                            (item, index) => {
                                return that.getTask4CephUp(
                                    item.uploadUrl,
                                    item.downloadUrl,
                                    files[index]
                                );
                            }
                        );
                        Promise.all(fileUpTasks)
                            .then((resultAll) => {
                                console.log("Promise.then=");
                                resolve(resultAll);
                            })
                            .catch((error) => {
                                console.log("Promise.catch=");
                                reject(error);
                            });
                    } else {
                        reject("");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }
    /**
     * 新建一个上传任务，上传到ceph
     * @param {*} upLoadUrl 
     * @param {*} downLoadUrl 
     * @param {*} file 
     */
    getTask4CephUp(upLoadUrl, downLoadUrl, file) {
        const that = this
        return new Promise((resolve, reject) => {
            let contentType = file.contentType
            delete file["contentType"]
            delete file["urlExpireTime"]
            delete file["businessType"]

            that.apiClient.apiCallHandler(upLoadUrl, file, {
                method: "put",
                timeout: 200000,
                headers: { 'content-type': contentType },
                noUseBsl: that.noUseBsl
            }, true).then((response) => {
                console.log("getTask4CephUp=" + response)
                //只要流程走到then方法，说明返回的状态码是200，不需要其他返回值，默认成功继续流程
                let toResponse = {
                    downLoadUrl: downLoadUrl,
                    fileUid: file.uid,
                };
                resolve(toResponse);
            }).catch(err => {
                console.log("getTask4CephUp.err=" + err);
                reject(err);
            })
        });
    }
    /**
     * 删除ceph的文件，批量接口
     * @param {*} files 
     */
    delete2Ceph(files) {
        const that = this
        return new Promise((resolve, reject) => {
            if (!that.checkArrayNoEmpty(files)) {
                return reject("files should be array and not empty");
            }
            let findindex = files.findIndex((item) => {
                return !item.fileUrl || !item.businessType
            })
            if (findindex != -1) {
                return reject("file element should has fileUrl and businessType");
            }
            that.apiClient.apiCallHandler(this.defaultUrl + '/presign/v1/deleteObject', files, { noUseBsl: that.noUseBsl })
                .then((response) => {
                    console.log("delete2Ceph.then=" + response);
                    if (response && response.resultCode == 0) {
                        //0表示删除成功
                        resolve(0);
                    } else {
                        reject(response)
                    }
                })
                .catch((error) => {
                    console.log("delete2Ceph.catch=" + error);
                    reject(error);
                });
        });
    }
    /**
     * 上传附件 到文件服务器
     * @param {*} param FormData对象 {file:fileObj}
     */
    upload2FileService(param) {
        let that = this;
        let uploadServerPath = that.defaultUrl + "/file/v1/upload?c=static&p=/travelManagement/file&n=" + param.fileName
        return new Promise((reslove, reject) => {
            that.apiClient.apiCallHandler(uploadServerPath, param, { noUseBsl: that.noUseBsl })
                .then(response => {
                    if (response.resultCode == 0) {
                        reslove(response);
                    } else {
                        reject();
                    }
                }).catch(err => {
                    console.err(err);
                    reject();
                })
        })
    }
    /**
     * 校验是不是非空的数组
     * @param {*} arr 
     */
    checkArrayNoEmpty(arr) {
        return Array.isArray(arr) && arr && arr.length > 0
    }
};
export default new cloudservices();