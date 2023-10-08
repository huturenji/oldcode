import request from '@/utils/request';
class OssHandler {
    constructor(){
        this.bisSwitch = true;//是否开启该功能
        this.FILE_MAX_SIZE = 20;//单个文件大小限制，单位M
    }

    /**
     * 通过app上传文件
     */    
    appUploadImg(fileSize=20){
        let that = this;
        that.FILE_MAX_SIZE = fileSize;
        return new Promise(async (resolve,reject)=>{
            sinosdk.sino.chooseFile({}).then((res)=>{
                if (0==res.ret){
                    const eventFiles = res.responseData;
                    const length = eventFiles.length;//当前上传的文件个数
                    //文件类型判断
                    const regex = /(jpg|png|JPG|PNG|jpeg|JPEG)/g ;
                    for (let j = 0; j < length; j++) {
                        let type = (eventFiles[j].path.split(".") || []).pop()||'';
                        if (!regex.test(type) || type == '') {
                            that.msg('只支持上传图片类型文件！');
                            reject('只支持上传图片类型文件！');
                            return;
                        }
                    }
                    let fileArray = [];
                    for (let i = 0; i < length; i++) {
                        let uploadStatu = true;//上传状态，默认成功
                        let errorReason = null;//上传失败原因
                        let imgId = new Date().getTime();//图片唯一标识
                        //单个文件大小限制，如果超过限制
                        if (eventFiles[i].size > that.FILE_MAX_SIZE * 1024 * 1000) {
                            uploadStatu = false;
                            errorReason = `图片大小超过${that.FILE_MAX_SIZE}MB，上传失败`;
                            that.msg(`图片大小超过${that.FILE_MAX_SIZE}MB，上传失败`);
                            reject(`图片大小超过${that.FILE_MAX_SIZE}MB，上传失败`);
                            return;
                        }
                        let imgObj = {
                            id: imgId,
                            uploadStatu: uploadStatu,
                            errorReason: errorReason
                        }
                        let tempFile = eventFiles[i];
                        tempFile.businessType = 'postsale';
                        tempFile.imgObj = imgObj;
                        fileArray.push(tempFile);
                    }
            
                    if (fileArray.length>0){
                        uni.showLoading();
                        that.getUploadUrl(fileArray).then(data=>{
                            let fileInfoList = fileArray.map(function (item,index) { 
                                return {
                                    'path':item.path,
                                    'contentType':'multipart/form-data',
                                    'uploadUrl':data[index].uploadUrl,
                                    'downloadUrl':data[index].downloadUrl
                                }; 
                            }) 
                            sinosdk.sino.upload({fileInfoList:fileInfoList}).then(uploadRes=>{
                                if (0==uploadRes.ret && !!uploadRes.responseData && 0 < uploadRes.responseData.length){
                                    let tempList = uploadRes.responseData.map(item=>{
                                        let resultFile = fileInfoList.find(d => d && d.path==item.path);
                                        //去除域名赋值给path
                                        let tempArr = resultFile.downloadUrl.replaceAll('https://').replaceAll('http://').split('/');
                                        tempArr[0] = '';
                                        return {downloadUrl:resultFile.downloadUrl,path:tempArr.join('/')}
                                    })
                                    resolve(tempList);
                                } else {
                                    reject('网络异常，上传失败');
                                    console.log('网络异常，上传失败');
                                }
                            }).catch(e=>{
                                reject('上传失败');
                                console.log('上传失败：' + e);
                            }).finally(()=>{
                                uni.hideLoading()
                            })
                        }).catch((error) => {
                            uni.hideLoading();
                            reject('获取上传地址失败');
                            console.log('获取上传地址失败：' + error);
                        })
                    }
                } else {
                    reject('选取文件失败');
                }
            }).catch((err) => {
                reject('选取文件失败');
                console.log('选取文件失败：' + err);
            })
        })

    }

    /**
     * 获取上传地址，用于mpaas环境下调用app的上传方法
     * 第一部分 获取上传地址，
     * @param {*} file 需要fileType 标示图片img 还是 文件 file;name和uid
     */
    getUploadUrl(files){
        let that = this;
        return new Promise((resolve, reject) => {
            let findindex = files.findIndex((item) => {
                return !item.name || !item.businessType
            })
            if (findindex != -1) {
                return reject("file element should has name and businessType");
            }
            let data = {uploadUrlRequests:[]};
            files.forEach((item) => {
                data.uploadUrlRequests.push({
                    fileName: item.name,
                    businessType: item.businessType,//4种类型postsale、logo、agreement、businessData
                    urlExpireTime: item.urlExpireTime || 10,//url有效期，单位分钟
                    contentType: item.contentType || 'multipart/form-data',
                    contentMd5: item.contentMd5
                });
            });
            that.requestUploadUrl(data).then((response) => {
                if (
                    response.data &&
                    response.data.uploadUrlVOList &&
                    response.data.uploadUrlVOList.length > 0
                ) {
                    resolve(response.data.uploadUrlVOList);
                } else {
                    reject(response);
                }
            }).catch((err) => {
                reject(err);
            });

        });
    }

    /**
     * 获取上传地址的请求
     * @param {*} opt 请求入参
     */
    async requestUploadUrl(param) {
        return request({
            url: 'v3/oss/common/getUploadUrl',
            method: 'POST',
            header:{"Content-Type": "application/json"},
            data: param
        })
    }

    /**
     * showToast
     */      
    msg(title){
        uni.showToast({
            title:title,
            icon:'none'
        })
    }

    /**
     * 是否通过app上传文件
     */
    async useAppUpload(){
        let res = false;
        //目前只在bizmateChannel开放
        let isBizmateChannel = false;
        try {
            let bridgeType = await sinosdk.sino.getBridgeType();
            let navigatorType = sinosdk.sino.getNavigatorType();
            res = (bridgeType == sinosdk.sino.constant.BRIDGE_TYPE.MPAAS && navigatorType == sinosdk.sino.constant.NAVIGATOR_TYPE.ANDROID); 
            let channelId = await sinosdk.sino.getChannelId();
            let bizmateChannelIds = sinosdk.sino.getChannelMapper().bizmate.channelIds;
            isBizmateChannel = bizmateChannelIds.findIndex((item)=>{ return item == channelId })> -1 ;
        } catch (error) {
            console.log(error)
        }
        return this.bisSwitch && isBizmateChannel && res;

    }
}
export default new OssHandler();
