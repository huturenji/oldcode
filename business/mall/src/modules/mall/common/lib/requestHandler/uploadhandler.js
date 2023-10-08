import base from './base'
import extendUtils from '../utils';
class uploadHandler extends base {
    constructor() {
        super();
        extendUtils.WhiteList.global.push('/presign/v1/getUploadUrl')
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
                params.push({
                    fileName: element.name,
                    businessType: element.businessType,//4种类型postsale、logo、agreement、businessData
                    urlExpireTime: element.urlExpireTime || 10,//url有效期，单位分钟
                    contentType: element.contentType || 'multipart/form-data',
                    contentMd5: element.contentMd5,
                });
            });
            let token = that.getUserToken();//获取用户token
            let header = that.defaultHeaders(token);
            //发送请求
            that.apiCallHandler('/presign/v1/getUploadUrl', params, header)
                .then((response) => {
                    if (
                        response.result &&
                        response.result.uploadUrlVOList &&
                        response.result.uploadUrlVOList.length > 0
                    ) {
                        let fileUpTasks = response.result.uploadUrlVOList.map(
                            (item, index) => {
                                return that.getTask4CephUp(
                                    item.uploadUrl,
                                    item.downloadUrl,
                                    files[index],
                                    item.fileName
                                );
                            }
                        );
                        Promise.all(fileUpTasks)
                            .then((resultAll) => {
                                resolve(resultAll);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    } else {
                        reject(response);//本接口已加入错误码白名单，出错时直接将原始的response对象交由业务侧处理
                    }
                })
                .catch((err) => {
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
    getTask4CephUp(upLoadUrl, downLoadUrl, file, fileName) {
        upLoadUrl = this.dealUrl(upLoadUrl); //将获取的upLoadUrl参数全部encode
        const that = this
        return new Promise((resolve, reject) => {
            let contentType = "";
            //需要对PDF文件上传的contentType做特别处理，否则会导致无法预览的问题
            if (file.name && file.name.indexOf(".pdf") != -1) {
                contentType = "application/pdf";
            }
            that.apiCallHandler(upLoadUrl, file, {
                method: "put", 
                headers: { 'content-type': contentType || 'multipart/form-data' },
                noUseBsl: true
            }).then((response) => {
                //只要流程走到then方法，说明返回的状态码是200，不需要其他返回值，默认成功继续流程
                let toResponse = {
                    downLoadUrl: downLoadUrl,
                    fileUid: file.uid,
                    fileName: fileName
                };
                resolve(toResponse);
            }).catch(err => {
                console.error(err)
                resolve();
            })
        });
    }

    /**
     * 将url的参数进行encode
     */
    dealUrl(url){
        let urlArr = url.split('?');
        let dealStr = urlArr[0];
        if(urlArr.length > 0){
            let searchStr = urlArr[1];
            let arr = searchStr.split('&');
            let newArr = arr.map(item => {
                let paramArr = item.split('=');
                if(paramArr.length > 0){
                    let value =  encodeURIComponent(decodeURIComponent(paramArr[1]));
                    return `${paramArr[0]}=${value}`
                }
            })
            dealStr = `${dealStr}?${newArr.join('&')}`
        }
        return dealStr;
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
            that.apiCallHandler(this.defaultUrl + '/presign/v1/deleteObject', files)
                .then((response) => {
                    if (response && response.resultCode == 0) {
                        //0表示删除成功
                        resolve(0);
                    } else {
                        reject(response)
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * 校验是不是非空的数组
     * @param {*} arr 
     */
    checkArrayNoEmpty(arr) {
        return Array.isArray(arr) && arr && arr.length > 0
    }

}

export default new uploadHandler();