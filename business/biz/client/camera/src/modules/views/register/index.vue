<template>
    <div class="registerWrap" :class="{zoomStyle:zoomStyle}">
        <div class="card_box">
            <headBreadcrumb
                :title="'首页'"
                :tips="title"
                :showbtn="false"
                :bistips="bisTitle"
                @goback="gotoBack"
                :bisType="bisType"
                @verifyFun="toggleBisType"
            ></headBreadcrumb>
            <div class="contcentWrap"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.7)">
                <div class="concent">
                    <div class="videoWrap ">
                        <div class="videoContent"  :class="{gradientWrapper:gradientWrapper,fadeAway:fadeAway}">
                            <div class="scanBaseImgWrap" id="scanBaseImgWrap">
                                <div v-if="scan_base_img" class='scanBaseImg' :style="{backgroundImage: 'url(' + scan_base_img + ')'}"></div>
                            </div>
                            <img class="scan" id="scanLight" v-if='scan_light_img' :src="scan_light_img" /> 
                            <div v-if="coveImgData" id="coveImg" :style="{backgroundImage: 'url(' + coveImgData + ')'}"></div>
                            <div class="optionsWrap" v-if="optionsWrapShow">
                                <div class="line">
                                    <div class="label">曝光：</div>
                                    <el-slider class="slider" v-model="options.exposure" :min="-13" :max="0" :step="1" @change="(val)=>{setCameraOption('exposure',[val])}"></el-slider>
                                    <span class="sliderRightText">{{options.exposure}}</span>
                                </div>
                                <div class="line">
                                    <div class="label">自动曝光</div>
                                    <el-slider class="slider" v-model="options.exposure_auto" :min="0" :max="1" :step="1" @change="(val)=>{setCameraOption('exposure_auto',[val])}"></el-slider>
                                    <span class="sliderRightText">{{options.exposure_auto}}</span>
                                </div>
                                <div class="line">
                                    <div class="label">白平衡</div>
                                    <el-slider class="slider" v-model="options.whitebalance" :min="2700" :max="6500" :step="100" @change="(val)=>{setCameraOption('whitebalance',[val])}"></el-slider>
                                    <span class="sliderRightText">{{options.whitebalance}}</span>
                                </div>
                                <div class="line">
                                    <div class="label">自动白平衡</div>
                                    <el-slider class="slider" v-model="options.whitebalance_auto" :min="0" :max="1" :step="1" @change="(val)=>{setCameraOption('whitebalance_auto',[val])}"></el-slider>
                                    <span class="sliderRightText">{{options.whitebalance_auto}}</span>
                                </div>
                                <div class="bottomBar">
                                    <div class="reset" @click="reset()">重置</div>
                                    <div class="getList" @click="closeOptionsContent()">确认</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="formArea">
                        <namedcomp :compName="`${sourceTypeName}号`">
                            <div slot="component">
                                <el-input class="formAreaInpurt" v-model.trim="tagName" clearable maxlength="50" @input="handleInput($event)" :disabled="haveCamera?false:true" :placeholder="`请输入${sourceTypeName}号（必填）`" />
                            </div>
                        </namedcomp>
                    </div>
                    <div class="bisBottomBar">
                        <div class="bisButton" :disabled="active?false:true" :class="{active:active}" @click="register()">注册</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="optionsBottomBar">
            <el-button type="info" icon="el-icon-setting" circle @click="openOptionContent()"></el-button>
        </div> -->
    </div>
</template>
<script>
import { Message } from 'element-ui';
import cameraHandler from 'utils/cameraHandler.js'
import utils from 'utils/commonHandler.js'
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
const namedcomp = () => import("biscomponents/namedcomp.vue");
export default {
    components: {
        headBreadcrumb,
        namedcomp
    },
    data() {
        return {
            bisType:'register',//业务类型，注册或核验
            title:'注册纸纹',//title
            bisTitle:'核验纸纹',//
            tagNum:'0000001',//标签编号
            tagName:'',//标签名称
            haveCamera: false,//是否拥有纸纹仪
            optionsWrapShow:false,//设置界面是否展示   
            bisRuning: false,//业务处理中
            takenPhotoing: false,//注册核验拍摄图片中
            coveImgData:require(`@/themes/default/img/img_Viewfinder.png`),//拍照图片
            scan_light_img:null,//扫描光线动画
            scan_base_img:null,//扫描动画图片
            PREVIEW_OPTIONS:[300,139,480,360],//预览窗口参数x,y,width,height
            timer:null,//识别图片二维码定时器对象
            interval:null,//动画定时器对象
            haveQrCode:null,//预览画面内是否有二维码
            appEnv:{},//app环境信息
            localAssetsPreStr:'../../../../',//引用本地资源前缀
            sourceTypeName:'凭证',//素材名称
            active:false,//注册按钮是否激活
            zoomStyle:window.devicePixelRatio>=1.5,
            gradientWrapper:false,
            fadeAway:false,
            scanIndex:0,//动画图片文件夹索引
            labelId:0,//标签id
        };
    },
    created() {
        !!this.timer && clearInterval(this.timer);
        this.sequence();
    },
    mounted() {
        //页面开始执行初始化
        this.getAppEnv();
        this.deviceInit();

    },
    beforeDestroy(){
        !!this.timer && clearInterval(this.timer);
        Message.closeAll();
        cameraHandler.close();//关闭纸纹仪
    },
    watch:{
        tagName(nVal,oVal){
            this.active = nVal&&nVal.trim()&&this.haveCamera;
            this.handleInput(nVal);
        }
    },
    methods: {
        //获取appenv
        getAppEnv(){
            if(!!sessionStorage.getItem('appEnv')){
                this.appEnv = JSON.parse(sessionStorage.getItem('appEnv'))
                this.localAssetsPreStr = this.appEnv.isPackaged?'../../../../':'../../';
            }
            if(this.appEnv.preview_model){
                this.PREVIEW_OPTIONS = [300,139,480,360];
            }else{
                this.PREVIEW_OPTIONS = [300,139,0,0];
            }

           
        },
        //页面初始化
        async deviceInit(){
            window.addEventListener('cameraInit',this.cameraInitHandler);

            let result = await cameraHandler.init({
                type:'register',
                cwnd:this.PREVIEW_OPTIONS,
                cameraOptions:this.appEnv.defaultCameraOptions
            });
            if(0!=result){//初始化失败  初始化失败后，会重新初始化，如果直接返回成功或者失败，重试成功则没有返回，故使用事件监听返回成功
                this.alert('未发现纸纹仪，请检查设备是否正常','warning');
            }
        },
        cameraInitHandler(e){
            e.target.removeEventListener('cameraInit',this.cameraInitHandler);//移除事件监听，避免监听多次
            if(e.detail.created&&e.detail.type=='register'){//初始化成功 需要加上type 否则事件会触发到核验那边
                this.bisInit();
            }
        },
         /**
         * 业务初始化
         */
         async bisInit(){
            this.haveCamera = true;
            //判断核验模式
            if(this.appEnv.use_perspective){
                cameraHandler.transmitInit();
            }else{
                //循环调用 二维码识别功能
                let qrcode = await cameraHandler.reflexInit();
                this.tagName = this.tagName || qrcode

                !!this.timer && clearInterval(this.timer);
                this.timer = setInterval(async()=>{
                    qrcode = await cameraHandler.reflexInit();
                    this.tagName = this.tagName || qrcode
                },5000)
                if(this.tagName){
                    Message.closeAll();
                }else{
                    Message({
                        message: `请把纸纹仪对准${this.sourceTypeName}`,
                        type: 'warning',
                        duration:3000
                    });
                }
            }
        },
        //弹框按钮回调
        async btnCallback(){
            this.closeAnimation();
            if(this.appEnv.preview_model){
                await cameraHandler.show();
            }
            this.bisRuning = false;
        },
        /**
         * 关闭动画
         */
        closeAnimation(){
            this.scan_light_img = null;
            // this.scan_base_img = null;
            this.gradientWrapper = false;
            this.fadeAway = false;
        },
      
        //注册核验业务方法
        async register(){
            //业务不可多次执行
            if(this.takenPhotoing || this.bisRuning){
                return;
            }
            try {
                let beforeType = this.haveCamera;
                this.takenPhotoing = true;
                !beforeType && await cameraHandler.init(this.PREVIEW_OPTIONS);
                if(this.haveCamera){
                    //标签名称校验
                    if (!this.tagName.trim().length) {
                        Message({message: `请输入${this.sourceTypeName}号`,type: 'warning'});
                        this.takenPhotoing = false;
                        return;
                    }
                    if(!this.active){
                        return;
                    }
                    this.bisRuning = true;
                    let gpRes = await cameraHandler.getPhoto('captured_image.jpg');
                    if(gpRes == 0){
                         if(this.appEnv.preview_model){
                            this.coveImgData = `${this.localAssetsPreStr}captured_image.jpg?t=${new Date().getTime()}`;
                        }else{
                            // this.coveImgData = require(`@/themes/default/img/register_default.png`);
                        }
                        let fileIsExsit = await ipcRenderer.sendSync('checkFileExist',this.tagName);//与上面的方法等价，后续都修改为sendSync写法

                        this.checkFileExistReply(fileIsExsit);
                    }else{
                        //提示注册失败
                        let bisInfo = {confirmButtonText:'确定',text: `<div  class='result warning'>注册失败，请确认纸纹仪是否连接正常</div>`,type:'warning',center:true,needRecord:false,textUsedHtml:true}
                        this.confirm(bisInfo.confirmButtonText,bisInfo.text,bisInfo.type,this.btnCallback,bisInfo.center,'',bisInfo.textUsedHtml);
                    }
                }
            } catch (error) {
                this.bisRuning = false;
                this.takenPhotoing = false;
                console.log(error);
            }
        },
        /**
         * 判断文件是否存在
         * @param {*} res 
         */
         async checkFileExistReply(res){
            if(res.code==0){
                this.takenPhotoing = false;
                this.confirm('确认覆盖',`<div class=coverText><span>凭证号已存在，是否覆盖</span></div>`,'warning',this.register_core,true,'',true,this.btnCallback,'取消',true);
            }else{
                this.register_core();
            }
        },
        /**
         * 执行node的注册事件
         */
        async register_core(){
            this.scanIndex = utils.getScanIndex(this.labelId);
            //coveImgData与registerImg 动画
            this.scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/register_fuzzy.png`)
            this.scan_light_img = require(`@/themes/default/img/scan/index.png`)
            this.gradientWrapper = true;
            setTimeout(async()=>{
                let res = await ipcRenderer.sendSync('register',this.tagName);
                this.registerReply(res);
            },0);
            
        },
        //注册&核验的回调,供eletron调用
        async registerReply(res){
            let scanElement = document.getElementById('scanBaseImgWrap');
            this.animationendListener = this.createAnimationendListener(res);//TODO 需要参考核验地方将流程统一
            scanElement.addEventListener('animationend',this.animationendListener);
        },
        /**
         * 创建监听器
         */
        createAnimationendListener(res){
            return (event)=>{
                this.scan_light_img = null;
                if(this.fadeAway){
                    this.takenPhotoing = false;
                    if(res.code == 0){
                        this.registerAddRecord(res);
                    }else if(res.code == -2){
                        this.msg(`注册失败,请填写${this.sourceTypeName}号`,'error')
                    }else{
                        this.msg('注册失败','error')
                    }
                    //移除监听
                    event.target.removeEventListener('animationend',this.animationendListener);//需要移除监听，否则会触发多次
                }else{
                    this.scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/register.png`)
                    this.fadeAway = true;
                    this.gradientWrapper = false;//扫描动画结束后，将样式去除，否则图片不显示
                }
            }
        },
        //打开设置面板
        openOptionContent(){
            if(!this.haveCamera){
                this.alert('未发现纸纹仪，请检查设备是否正常','warning')
                return
            }
            this.optionsWrapShow = true;
        },

        //关闭设置面板
        closeOptionsContent(){
            this.optionsWrapShow = false;
        },
        
        //提示信息
        alert(text,type='success',callbackFun,center=false,title='提示',dangerouslyUseHTMLString=false){
            this.$alert(text,title, {
                confirmButtonText: '确定',
                // customClass:'message_box_alert',
                type: type,
                center:center,
                dangerouslyUseHTMLString:dangerouslyUseHTMLString,
                callback: action => {
                    !!callbackFun && callbackFun()
                }
            });
        },
        msg(message,type='success',duration=1500){
            Message({
                message:message,
                type: type,
                duration:duration,
                onClose:this.btnCallback,
                customClass:'el_msg'
            });
        },
        //提示信息
        confirm(confirmButtonText,text,type='success',callbackFun,center=false,title='提示',dangerouslyUseHTMLString=false,leftCallbackFun,leftButtonText='取消',showCancelButton=false){

            this.$confirm(text, '', {
                confirmButtonText: confirmButtonText,
                showCancelButton: showCancelButton,
                cancelButtonText:leftButtonText,
                type: type,
                center:center,
                showClose:false,
                dangerouslyUseHTMLString:dangerouslyUseHTMLString,
                customClass:'el_confirm',
                cancelButtonClass:'el_cancel_btn',
                confirmButtonClass:'el_ok_btn',
                closeOnClickModal:false
            }).then(() => {
                !!callbackFun && callbackFun()
            }).catch(() => {
                !!leftCallbackFun && leftCallbackFun()  
            });
        },
        //新增注册数据
        async registerAddRecord(registerRes){
            let userInfo = null;
            if(!!sessionStorage.getItem('userInfo')){
                userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            }
            let result = await ipcRenderer.sendSync('register_add_record', {
                labelNo: this.tagNum,
                labelName: this.tagName,
                labelHash: registerRes.data.labelHash,
                registerUserId: userInfo.userId || 'HD7891',
                registerUserName: userInfo.userName || '超级管理员',
                registerImg:registerRes.data.registerImg || ''
            });
            if(result.code == 0){
                this.msg(`注册成功`,'success');
                this.sequence();
            }else{
                this.msg('注册失败','error')
            }
        },
        //获取标签num
        async sequence(){
            let result = await ipcRenderer.sendSync('register_sequence');
            if(result&&result.code == 0){
                this.tagNum = result.data.seq
            }
        },   
        //返回
        gotoBack() {
            this.$router.replace('/entry');
        }, 
        /**
         * 切换业务类型
         */
        toggleBisType(){
            this.$router.replace('/verify');
        },
         /**
         * 监听用户输入，通过输入显示图片
         */
         async handleInput(event){
            //查询数据库中是否存在该label
            if((!event.trim())|| !this.haveCamera){  //核验那边同样可以使用该逻辑
                this.coveImgData = require(`@/themes/default/img/img_Viewfinder.png`);
            }else{

                let result = await ipcRenderer.sendSync(
                    "register_search_record_precise",
                    {
                        labelName:event
                    }
                );
                if (result.code == "0" && result.data && result.data.pageList && result.data.pageList.length > 0) {//输入的数据存在，并且输入的数据是非数字，则使用原有id作为获取动画图片的值
                    this.labelId = result.data.pageList[0].labelId
                }else{
                    this.labelId = this.tagNum;
                }

                if(this.appEnv.preview_model){//预览模式
                    this.coveImgData = null;
                }else{
                    // this.coveImgData = require(`@/themes/default/img/register_default.png`);
                }
            }
        },
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
.gradientWrapper{
    display: inline-block;
    overflow: hidden;
}
.scanBaseImgWrap{
    position: absolute;
    overflow: hidden;
    width: 480px;
    height: 360px;
    z-index: 200;
}
.scanBaseImg {
    position: absolute;
    width: 480px;
    height: 360px;
    background-size: 100%;
    bottom: 0;
}

@keyframes  move-light  {
    0% {
        left: -45%;
    }
    100% {
       left: 100%;
    }
}
@keyframes show-base-img {
  to {
    width: 480px;
    right: 0px;
  }
}

@keyframes fade-away {
    0%{
        filter: blur(5px);
    }
    100%{
        filter: blur(0);
    }
}

.gradientWrapper #scanBaseImgWrap{
    width: 0 ;
    right: 480px;
    height: 360px;
    animation:show-base-img 2.1s linear forwards;
}

.fadeAway #scanBaseImgWrap{
    animation: fade-away 1s linear forwards;
}

.gradientWrapper #scanLight {
    animation: move-light 3s linear;
}

.contcentWrap{
    height: calc(100vh - 45px);
}
.registerWrap{
    height: 100%;
    background: white url('@/themes/default/img/background.png') no-repeat;
    background-size: cover;

}
.concent{
    margin-top: 32px;
    width: 480px;
    // margin: 0px auto;
    padding: 23px 0 0;
    margin-left: 300px;
}
.videoWrap{
    width: 480px;
    height: 360px;
}
.zoomStyle{
    .formArea{
        padding: 20px 30px;
    }
}
.formArea {
    padding: 40px 30px;
    .formAreaInpurt{
        width: 320px;
    }
    /deep/.namedcomp{
        color: #222;
        font-size: 16px;
        .compNameA{
            text-align: left;
            flex: 0 0 80px;
            font-weight: 500;
            margin-right: 20px;
        }
        .el-input__inner{
            font-size: 16px;
            color: #222;
            height: 32px;
            line-height: 32px;
            border: none;
            background: #fff;
            padding: 0 32px 0 8px;
            border-radius: 2px;
        }
        .el-input__icon{
            line-height: 32px;
        }
    }
    .errnametip{
        color: #f62f2f;
        padding-left: 10px;
    }
}
.no_padding{padding: 0;}

.videoContent {
    width: 480px;
    height: 360px;
    position: relative;
}
.noCamera,
#coveImg{
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
}
.noCamera{
    background: url('@/themes/default/img/img_Viewfinder.png') center no-repeat;
    background-size: 100%;
}
#coveImg{
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    .borderGreen{
        width: 200px;
        height: 200px;
        border: 1px solid #00ff00;
    }
}

.optionsBottomBar {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    justify-content:flex-end;
}
.optionsBottomBar>div {
    margin: 5px;
    width: 100px;
    text-align: center;
    font-size: 16px;
}

.bottomBar{
        position: absolute;
        left: 15px;
        bottom: 15px;
        right: 15px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        text-align: center;
        line-height: 32px;
        align-items: center;
        color: #fff;
    .reset{
        width: 68px;
        height: 32px;
        background: url('@/themes/default/img/btn_blue.png') no-repeat;
        background-size: cover;
        cursor: pointer;
        user-select: none;
        margin-right: 12px;
    }
    .getList{
        width: 68px;
        height: 32px;
        background: url('@/themes/default/img/btn_blue.png') no-repeat;
        background-size: cover;
        cursor: pointer;
        user-select: none;
    }
}
.bisBottomBar{
    display: flex;
    justify-content: center;
    .bisButton{
        width: 168px;
        height: 56px;
        line-height: 56px;
        background: url('@/themes/default/img/btn_bg_disable.png') center no-repeat;
        background-size: 100%;
        color: #fff;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        user-select: none;
    }
    .active{
        background: url('@/themes/default/img/btn_bg.png') center no-repeat;
    }
}
.optionsWrap {
    position: absolute;
    padding: 15px;
    left: 570px;
    width: 240px;
    top: 0;
    bottom: 0px;
    background: #fff;
    border: 1px solid #000;
}
.scan{
    position: absolute;
    z-index:200;
    width: 480px;
    height: 360px;
}
#scanLight{
    width: 250px;
}
.line {
    display: flex;
    align-items: center;
}
.label {
    width: 230px;
}
.slider{
    width: 300px;
}
.sliderRightText{
    padding-left: 10px;
}
.mybutton {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.button-primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
.el-icon-loading{
    font-size: 38px;
}


</style>
<style lang="less">
@import "~styles/element/confirm.less";
@import "~styles/element/msg.less";
</style>