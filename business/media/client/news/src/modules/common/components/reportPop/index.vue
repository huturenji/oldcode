<template>
    <div class="reportPopWrap">
        <div class="reportContect">
            <div class="tips">请选择原因（可多选）</div>
        </div>
        <div class="reasonListWrap">
            <div class="listWrap">
                <template v-for="(item,index) in reasonList">
                    <div class="lineWrap" :key="index" :class="{active:arrhaveitem(item.text,choosedReport)}" @click="choosedReason(item.text)">{{item.text}}</div>
                </template>
                <div class="lineWrap" :class="{active:choosedOther}" @click="choosedOther=!choosedOther">其他</div>
                <div class="inputWrap" v-if="choosedOther">
                    <textarea class="textarea" maxlength="100" placeholder="请输入举报内容" type="text" v-model="otherReason" @blur="isOriginHei=true"></textarea>
                </div>
            </div>
        </div>
        <div class="actionWrap" v-show="isOriginHei || isPc">
            <div class="activeBut icon-btn" :class="{disable:choosedReport.length==0 && !(choosedOther && otherReason!='')}"  @click="butAction()">提交</div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
export default {
    mixins:[scrollLockMixin],
    components: {
    },
    props: {
        newsItem: {//消息类型NEWS、VIDEO、AD等
            type: Object,
            default: ()=>{}
        }, 
        showReportPopup: {//界面显示控制
            type: Boolean,
            default: false
        } 
    },
    data() {
        return {
            reasonList:[//举报原因列表
                {
                    text:'低俗色情'
                },
                {
                    text:'虚假广告'
                },
                {
                    text:'涉嫌侵权/抄袭'
                },
                {
                    text:'涉嫌违法犯罪/传播反动思想'
                }
            ],
            choosedReport:[],//选择的原因
            choosedOther:false,//是否选中其他原因
            otherReason:'',//其他原因
            isPc:false,//是否是pc
            isOriginHei: true, //是否显示底部按钮栏
            screenHeight: document.documentElement.clientHeight, //屏幕初始高度
            originHeight: document.documentElement.clientHeight, //屏幕高度
            actioning:false//提交中
        };
    },
    computed:{
    },
    created(){
    },
    mounted(){
        let that = this;
        if(extendUtils.isPC()){
            that.isPc = true;
        }
        //监听页面激活事件
        try {
            var hiddenProperty = 'hidden' in document ? 'hidden' :    
                'webkitHidden' in document ? 'webkitHidden' :    
                    'mozHidden' in document ? 'mozHidden' :    
                        null;
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            var onVisibilityChange = function(){
                if (!document[hiddenProperty]) {    
                    that.screenHeight = document.documentElement.clientHeight;
                }else{
                    that.screenHeight = document.documentElement.clientHeight;
                }
            }
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        } catch (error) {
        }
        window.onresize = function () {
            return (function () {
                that.screenHeight = document.documentElement.clientHeight;
            })()
        };
    },
    watch: {
        choosedOther(value){
            let that = this;
            if(!!value){
                that.otherReason = '';
            }
        },
        showReportPopup(val){
            let that = this;
            if(!!val){
                that.choosedOther = false;
                that.otherReason = '';
                that.choosedReport = [];

            }
        },
        screenHeight: function (newValue) {
            let that = this;
            if (that.originHeight > newValue + 150) { //150是为了兼容虚拟返回栏
                that.isOriginHei = false;
            } else {
                that.isOriginHei = true;
            }
        }
    },
    methods: {
        /**
         * 选择选项
         */	
        choosedReason(value){
            let that = this;
            if(that.arrhaveitem(value,that.choosedReport)){
                that.choosedReport.splice(that.indexOfArr(value, that.choosedReport), 1);
            }else{
                that.choosedReport.push(value);
            }
        },
        /**
        * 维数组是否包含元素
        */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
        * 元素在数组中的索引
        */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 举报
         */        
        butAction() {
            let that = this;
            if(that.actioning){
                return;
            }
            if(that.choosedReport.length==0 && that.otherReason==''){
                return;
            }
            if(!!that.choosedOther && that.otherReason==''){
                extendUtils.showToast('请输入举报内容')
                return;
            }
            let choosedReason = that.choosedReport;
            if(that.choosedOther && that.otherReason!=''){
                choosedReason.push(that.otherReason)
            }
            let param = {
                founderInfo: {
                    "companyId": newsHandler.companyId,
                    "companyName":newsHandler.companyName,
                    "userId":newsHandler.userId,
                    "userName":newsHandler.userName,
                    "channelId": newsHandler.channelId,
                    "channelName": newsHandler.channelName
                },
                articleId:this.newsItem.articleId ,
                reason:choosedReason
            }
            that.actioning = true;
            newsHandler.reportNews(param).then(() => {
                extendUtils.showToast('提交成功')
                setTimeout(() => {
                    that.$emit('reportDone','');
                    that.actioning = false;
                }, 1000);
            }).catch((err) => {
                that.actioning = false;
                console.log(err);
            });
        }
    }
};
</script>
<style lang="less">
    @import "index.less";
</style>