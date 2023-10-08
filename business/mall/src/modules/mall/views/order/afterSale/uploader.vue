<template>
    <div class="after-sale-uploader">
		<div class="upload-list-item" v-for="(item, index) in uploadList" :key="index">
			<Icon 
                v-if="item.loaded"
                type="icon-minus-circle-fill" 
                size='.44'
                class="del" 
                @click="() => onRemoveClick(item, index)" 
            />
			<img 
                v-if="item.loaded"
                :src="item.pic" 
                alt="" 
            />
            <span v-if="!item.loaded">{{item.progress + '%'}}</span>
		</div>
		<div v-if="uploadList.length < 9" class="upload-btn" @click="onAddClick">
            <form :action="action" enctype="multipart/form-data" method="post">
                <input
                    v-show="false"
                    type="file"
                    ref="fileInputRef"
                    :multiple="multiple"
                    accept="image/jpg,image/jpeg,image/png,image/PNG"
                    @change="onChange"
                />
                <div class="wrap-img">
                    <Icon type='icon_mall_shangchuan' size='.44'/>
                    <span>最多九张</span>
                </div>
            </form>
		</div>
    </div>
</template>
<script>
import Icon from 'commonComp/base/Icon';
import defaultRequest from './request';
import config from 'common/lib/config.js';
import extendUtils from 'common/lib/utils';//工具类
import uploadhandler from 'common/lib/requestHandler/uploadhandler'
const {
    AFTER_SALE
} = config;

function fileToObject(file) {
    return {
        ...file,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        uid: file.uid,
        percent: 0,
        originFileObj: file
    };
}

export default {
	components: {
		Icon
	},
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        action: {
            type: String,
            default: ''
        },
        beforeUpload: Function,
        customRequest: Function
    },
    data(){
		return {
			uploadList: [],
			multiple: false
		}
    },
    methods: {
		onRemoveClick(item, index) {
            this.uploadList.splice(index, 1);
            this.$emit('remove', index);
		},
		onAddClick() {
			const el = this.$refs.fileInputRef;
			el && el.click();
        },
        onChange(e) {
            const files = e.target.files;
            if (files && files.length) {
                this.uploadfiles(files);
                this.$refs.fileInputRef.value = null;
            }
        },
        uploadfiles(files) {
            const fileList = Array.prototype.slice.call(files);
            fileList.forEach(file => {
                this.upload(file, fileList);
            });
        },
        upload(file, fileList) {
            if (!this.beforeUpload) {
                this.post(file);
                return;
            }
            const before = this.beforeUpload(file, fileList);
            if (before && before.then) {
                before.then(processFile => {
                    this.post(file);
                }).catch(e => {
                });
            } else if (before !== false) {
                this.post(file);
            }
        },
        post(file) {
            let fileObj = fileToObject(file);
            const { uid, size } = file;
            if(size > AFTER_SALE.UPLOAD_FILE_MAX_SIZE) {
                extendUtils.showToast('图片大小不能超过100M');
                return;
            }
            //文件类型判断
            const regex = /^image\s*/;
            for (let j = 0; j < length; j++) {
                if (!regex.test(file.type)) {
                    extendUtils.showToast('仅支持上传图片文件');
                    return;
                }
            }
            this.$emit('start', fileObj);
            this.$loading.show();
            let uploadItem = {
                loaded: false,
                progress: 0,
                pic: null
            };
            this.uploadList.push(uploadItem);
            file.businessType = 'postsale';
            uploadhandler.upload2Ceph([file]).then(data=>{
                let resultFile = data.find(d => d && d.fileName==file.name)
                if(!!resultFile){
                    uploadItem.loaded = true;
                    uploadItem.pic = resultFile.downLoadUrl;
                    this.$emit('success', resultFile);
                }else{
                    this.uploadList.pop();
                }
                this.$loading.hide();
            }).catch((e) => {
                this.$loading.hide();
                let errorCode = e.resultCode;
                extendUtils.showToast('网络异常，上传失败' + (errorCode ? `(${errorCode})` : ''));
                console.error(e);
            });
        },
        abort(file) {
        },
        getObjectURL(file) {
            let url = null;
            if (window.createObjectURL!== undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.webkitURL!== undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            } else if (window.URL!== undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            }
            return url;
        }
    }
}
</script>
<style scoped lang="less">
  	@import '~themes/default/styles/order/afterSale/uploader.less';
</style>