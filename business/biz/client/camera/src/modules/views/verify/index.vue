<template>
    <div class="verifyWrap" :class="{zoomStyle:zoomStyle}">
        <canvas id="myCanvas" width="1020" height="360" style="position:absolute;top:139px;left:29px;z-index: 500;"></canvas>
        <div class="card_box">
            <headBreadcrumb
                :title="'首页'"
                :tips="title"
                :showbtn="false"
                :bistips="bisTitle"
                :bisType="bisType"
                @goback="gotoBack"
                @registerFun="toggleBisType"
            ></headBreadcrumb>
            <div class="contcentWrap"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.7)">
                <div class="textDiv">
                    <span class="register_span vspan">注册凭证</span>
                    <span class="verify_span vspan">待测凭证</span>
                </div>
                <div class="concent">
                    <div class="registerWrap" :class="{gradientWrapper:gradientWrapper,fadeAway:fadeAway}">
                        <div class="scanBaseImgWrap" id="scanBaseImgWrap">
                            <div v-if="register_scan_base_img" class='scanBaseImg' :style="{backgroundImage: 'url(' + register_scan_base_img + ')'}"></div>
                        </div>
                        <img class="scan" id="scanLight" v-if='scanLight' :src="scanLight" /> 
                        <span v-if="!registerImgData" class="registerTips">输入凭证号后，将显示注册图</span>
                        <div v-else class="registerImg" :style="{backgroundImage: 'url(' + registerImgData + ')'}"></div>
                    </div>
                    <p class="vertical-line"></p>
                    <div class="videoWrap">
                        <div class="videoContent" :class="{gradientWrapper:gradientWrapper,fadeAway:fadeAway}">
                            <div class="scanBaseImgWrap" id="scanBaseImgWrap">
                                <div v-if="verify_scan_base_img" class='scanBaseImg' :style="{backgroundImage: 'url(' + verify_scan_base_img + ')'}"></div>
                            </div>
                            <img class="scan cameraScan" id="scanLight" v-if='scanLight' :src="scanLight" /> 
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
                                <el-input class="formAreaInpurt" v-model.trim="tagName" clearable maxlength="50" :disabled="inputDisabled" @input="handleInput($event)" :placeholder="`请输入${sourceTypeName}号（必填）`" />
                            </div>
                        </namedcomp>
                    </div>
                    <div class="bisBottomBar">
                        <div class="bisButton" :class="{active:active}"  @click="verify()">{{verifyBtn}}</div>
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
import nativeHandler from 'utils/nativeHandler.js'
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
const namedcomp = () => import("biscomponents/namedcomp.vue");
export default {
    components: {
        headBreadcrumb,
        namedcomp
    },
    data() {
        return {
            bisType:'verify',//业务类型，注册或核验
            title:'注册纸纹',//title
            bisTitle:'核验纸纹',//
            tagNum:'0000001',//标签编号
            tagName:'',//标签名称
            PREVIEW_OPTIONS:[570,139,480,360],//预览窗口参数x,y,width,height
            haveCamera: false,//是否拥有纸纹仪
            inputDisabled:true,//输入框是否允许输入
            optionsWrapShow:false,//设置界面是否展示   
            bisRuning: false,//TODO业务处理中  需要清理状态控制，只要有1到2个就足够了
            coveImgData:require(`@/themes/default/img/img_Viewfinder.png`),//拍照图片
            register_scan_base_img:null,
            verify_scan_base_img:null,
            scanLight:null,
            fadeAway:false,
            registerImgData:null,//注册图
            timer:null,//定时器对象
            haveQrCode:null,//预览画面内是否有二维码
            appEnv:{},//app环境信息
            localAssetsPreStr:'../../../../',//引用本地资源前缀
            detailUrl:null,//核验详情url
            sourceTypeName:'凭证',//素材名称
            verifyBtn:'核验',
            interval:null,
            interval_animate:null, //连线动画使用requestanimationframe帧率不够，修改为定时器
            interval_result:null,//核验结果动画
            active:false,
            scanPromise:null,
            scanIndex:0,//动画图片文件夹索引
            zoomStyle:window.devicePixelRatio>=1.5,
            verifyPromise:null,//调用native核验程序
            animationPoint:[],//核验比对点
            labelId:0,//标签id
        };
    },
    created() {
        !!this.timer && clearInterval(this.timer);
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
                this.PREVIEW_OPTIONS = [570,139,480,360];
            }else{
                this.PREVIEW_OPTIONS = [570,139,0,0];
            }
        },
        //页面初始化
        async deviceInit(){
            window.addEventListener('cameraInit',this.cameraInitHandler);
            let result = await cameraHandler.init({
                type:'verify',
                cwnd:this.PREVIEW_OPTIONS,
                cameraOptions:this.appEnv.defaultCameraOptions
            });
            if(0!=result){//初始化失败  初始化失败后，会重新初始化，如果直接返回成功或者失败，重试成功则没有返回，故使用事件监听返回成功
                this.alert('未发现纸纹仪，请检查设备是否正常','warning');
            }
        },
        cameraInitHandler(e){
            e.target.removeEventListener('cameraInit',this.cameraInitHandler);//移除事件监听，避免监听多次
            if(e.detail.created&&e.detail.type=='verify'){//初始化成功 需要加上type 否则事件会触发到核验那边
                this.bisInit();
            }
        },
        /**
         * 业务初始化
         */
        async bisInit(){
            this.haveCamera = true;
            this.inputDisabled = false;
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
            this.closeAnimation();//关闭清除动画
            if(this.appEnv.preview_model){
                await cameraHandler.show();
            }
            setTimeout(() => {
                this.bisRuning = false;
                this.verifyBtn = "核验";
                this.inputDisabled = false;
            }, 100);
        },
        //注册核验业务方法
        async verify(){
            //业务不可多次执行
            if(cameraHandler.takenPhotoing || this.bisRuning){
                return;
            }
            try {
                cameraHandler.takenPhotoing = true;
                !this.haveCamera && await await cameraHandler.init(this.PREVIEW_OPTIONS);
                if(this.haveCamera){
                    //标签名称校验
                    if (!this.tagName.trim().length) {
                        Message({message: `请输入${this.sourceTypeName}号`,type: 'warning'});
                        cameraHandler.takenPhotoing = false;
                        return;
                    }
                    if(!this.active){//没有找到注册图
                        Message({message: `您输入的${this.sourceTypeName}号未注册，请输入正确的${this.sourceTypeName}号`,type: 'warning'});
                        cameraHandler.takenPhotoing = false;
                        return
                    }
                    this.bisRuning = true;
                    let gpRes = await cameraHandler.getPhoto('captured_image.jpg');
                    if(gpRes == 0){
                        if(this.appEnv.preview_model){
                            this.coveImgData = `${this.localAssetsPreStr}captured_image.jpg?t=${new Date().getTime()}`;
                        }else{
                            this.coveImgData = require(`@/themes/default/img/scan/${this.scanIndex}/verify.png`);
                        }
                        //按钮名称变动 动画开始闪动
                        this.verifyBtn = "核验中..."
                        this.inputDisabled = true;
                        //coveImgData与registerImg 动画
                        this.verify_scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/verify_scan.png`)
                        this.register_scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/register_fuzzy.png`)
                        this.scanLight = require(`@/themes/default/img/scan/index.png`)
                        this.gradientWrapper = true;
                        this.verifyPromise = nativeHandler.communication('verify',this.tagName);
                        this.verifyReply();
                    }else{
                        //提示核验失败，确认纸纹仪是否连接正常
                        let bisInfo = {confirmButtonText:'确定',text: `<div  class='result warning'>核验失败，请确认纸纹仪是否连接正常</div>`,type:'warning',center:true,needRecord:false,textUsedHtml:true}
                        this.confirm(bisInfo.confirmButtonText,bisInfo.text,bisInfo.type,this.btnCallback,bisInfo.center,'',bisInfo.textUsedHtml);
                    }
                }
            } catch (error) {
                this.bisRuning = false;
                this.verifyBtn = "核验";
                this.inputDisabled = false;
                cameraHandler.takenPhotoing = false;
                console.log(error);
            }
        },
         /**
         * 核验回调
         * @param {*} res 
         */
        //注册&核验的回调,供eletron调用
        async verifyReply(){
            let scanElement = document.getElementById('scanBaseImgWrap');
            scanElement.addEventListener('animationend',this.animationendListener);
        },
        /**
         * 监听事件
         */
        animationendListener(event){
            this.scanLight = null;
            Promise.resolve(this.verifyPromise).then(res=>{
                if(this.fadeAway){//显隐动画执行结束后 就执行连线动画
                    //移除监听
                    event.target.removeEventListener('animationend',this.animationendListener);//需要移除监听，否则会触发多次
                    this.runAnimate(this.animationPoint,this.verifyComfirm,{res});
                }else{//扫描动画结束
                    this.register_scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/register.png`)
                    this.fadeAway = true;
                    cameraHandler.takenPhotoing = false;
                    if(res.code==0&&res.data.result==0){
                        //给核验相符结果图赋值
                        this.verify_scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/success.png`)
                        //执行纸纹相符的连线动画
                        //获取纸纹相符的点
                        this.animationPoint = this.generateRandomPoints(100,50,470,5,350,true);
                    }else{
                        //给核验不相符结果图赋值
                        this.verify_scan_base_img = require(`@/themes/default/img/scan/${this.scanIndex}/fail.png`)
                        //执行纸纹不相符的连线动画
                        //获取其他情况的点
                        this.animationPoint = this.generateRandomPoints(5,50,470,50,350,false);
                    }
                    this.gradientWrapper = false;
                }
            });
        },

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        // 生成随机坐标点的函数
        generateRandomPoints(numPoints, minX, maxX, minY, maxY,straight=false) {
            const that = this;
            const points = [];
            
            for (let i = 0; i < numPoints; i++) {
                const x = that.getRandomInt(minX, maxX);
                const y = that.getRandomInt(minY, maxY);
                points.push({ x, y });
                if(straight){
                    points.push({x:x+510,y});//纸纹相符
                }else{
                    points.push({x:x+510,y:(y+x)%360});//其他情况
                }
            }
            return points;
        },
        /**
         * 执行连线动画
         * @param {function} callback 回调函数
         */
        runAnimate(points,callback,params){
            const that = this;
            const canvas = document.getElementById('myCanvas');
            const ctx = canvas.getContext('2d');
            // 初始化动画参数
            let frame = 0;
            const animationSpeed = 1000 / 1000; // 每帧

            // 动画函数
            function animate() {
                // 清除画布
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 连接点
                ctx.strokeStyle = '#4DFF00';
                ctx.beginPath();
                for (let i = 0; i < frame; i=i+2) {
                    if (i < points.length - 1) {
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[i + 1].x, points[i + 1].y);
                    }
                }
                ctx.stroke();

                // 绘制点
                ctx.fillStyle = '#4DFF00';
                for (const point of points) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 增加帧数以实现动画效果
                frame++;
                // 循环播放动画
                if (frame < points.length) {
                    // 延迟指定的时间后再次调用自身以实现动画效果
                    // that.timeout = setTimeout(function() {
                        // requestAnimationFrame(animate);  //帧率太慢 修改为使用定时器
                    // }, animationSpeed);
                }else{
                    that.interval_animate&&clearInterval(that.interval_animate)
                    setTimeout(() => {//避免 回调函数太快执行 看不到比对效果 用延时500ms处理
                        callback&&callback(params.res);
                    }, 500);
                    
                }

            
            }
            that.interval_animate = setInterval(()=>{
                animate();
            },1);
           
        },
        /**
         * 关闭左右扫描动画
         */
         closeScan(){
            this.interval&&clearInterval(this.interval);
        },
        /**
         * 关闭连线动画
         */
        closeAnimation(){
            this.gradientWrapper = false;
            this.fadeAway = false;
            this.scanLight = null;
            this.register_scan_base_img = null;
            this.verify_scan_base_img = null;
            this.interval_result&&clearInterval(this.interval_result);
            this.interval_animate&&clearInterval(this.interval_animate);
            const canvas = document.getElementById('myCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
       
        /**
         * 弹出核验结果
         */
        async verifyComfirm(res){
            let verifyReplyMap = {
                '0':{
                    '0':{confirmButtonText:'继续核验',text:'纸纹相符',type:'success',center:true,needRecord:true,textUsedHtml:true},
                    '1':{confirmButtonText:'重新核验',text:'纸纹不符',type:'error',center:true,needRecord:true,textUsedHtml:true},
                },
                '2':{confirmButtonText:'重新核验',text:'系统未找到相应纸纹',type:'warning',center:true,needRecord:false,textUsedHtml:true},
                '-1':{confirmButtonText:'重新核验',text:`核验失败，${this.sourceTypeName}解码失败`,type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "1":{confirmButtonText:'重新核验',text:"特征提取输入错误",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "12":{confirmButtonText:'重新核验',text:"图片中图像占比太小，请确认图片是否放置在正确问题",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "33":{confirmButtonText:'重新核验',text:"录入图像输入错误(signImage.data为NULL或signImage.dataLength为0）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "34":{confirmButtonText:'重新核验',text:"核验图像输入错误(checkImage.data为NULL或checkImage.dataLength为0）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "35":{confirmButtonText:'重新核验',text:"录入图像输入错误(signImage宽高输入有误）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "36":{confirmButtonText:'重新核验',text:"核验图像输入错误(checkImage宽高输入有误）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "37":{confirmButtonText:'重新核验',text:"特征匹配入参错误(录入或核验的特征数据为NULL）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "38":{confirmButtonText:'重新核验',text:"特征提取入参错误(图像类型错误）",type:'warning',center:true,needRecord:false,textUsedHtml:true},
                "39":{confirmButtonText:'重新核验',text:"特征提取入参错误(图像数据宽高输入错误）",type:'warning',center:true,needRecord:false,textUsedHtml:true}
            }

           

            //动画结束后 执行弹框
            let bisInfo = res.code==0?verifyReplyMap[res.code][res.data.result]:(verifyReplyMap[res.code]||null);

            if(!!bisInfo){
                if(bisInfo.needRecord){
                    let registerRecord = await this.getRegisterRecord(res.data.labelHash);
                    !!registerRecord && (bisInfo.text = `<div  class='result ${bisInfo.type}'>${bisInfo.text}</div><div class='detail'><span style='margin-right:40px'>${this.sourceTypeName}号：${registerRecord.labelName}</span><span>核验人员：${registerRecord.registerUserName}</span></div>`);
                }
                //新增警告提示样式
                if('warning'==bisInfo.type){
                    bisInfo.text = `<div  class='result warning'>${bisInfo.text}</div>`
                }
            }else{
                bisInfo = {confirmButtonText:'重新核验',text: `<div  class='result warning'>系统未找到相应纸纹</div>`,type:'warning',center:true,needRecord:false,textUsedHtml:true}
            }
            if(bisInfo.type=='error'){
                this.confirm(bisInfo.confirmButtonText,bisInfo.text,bisInfo.type,this.btnCallback,bisInfo.center,'',bisInfo.textUsedHtml,this.btnCallback,'确定',true);
            }else{
                this.confirm(bisInfo.confirmButtonText,bisInfo.text,bisInfo.type,this.btnCallback,bisInfo.center,'',bisInfo.textUsedHtml);
            }
        },
        /**
         * 校验参数并且发送请求
         * initCurrPage 是否初始化页数
         */
         async getRegisterRecord(labelHash) {
            return new Promise(async(reslove,reject)=>{
                try {
                    let reqData = {
                        labelHash:labelHash,
                        pageSize:10,
                        pageNumber:1
                    }
                    let result = await ipcRenderer.sendSync(
                        "register_search_record",
                        reqData
                    );
                    if (result.code == "0" && result.data && result.data.pageList && result.data.pageList.length > 0) {
                        reslove(result.data.pageList[0]);
                    }
                } catch (error) {
                    reject();
                }
            })
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

        //还原参数设置
        reset() {
            for (const key in this.defaultOptions) {
                if (Object.hasOwnProperty.call(this.defaultOptions, key)) {
                    const element = this.defaultOptions[key];
                    if(element != this.options[key]){
                        this.options[key] = element;
                        this.setCameraOption(key,[element]);
                    }
                }
            }
        },
       
        //提示信息
        alert(text,type='success',callbackFun,center=false,title='提示',dangerouslyUseHTMLString=false){
            this.$alert(text,title, {
                confirmButtonText: '确定',
                type: type,
                center:center,
                dangerouslyUseHTMLString:dangerouslyUseHTMLString,
                callback: action => {
                    !!callbackFun && callbackFun()
                }
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
         //返回
         gotoBack() {
            this.$router.replace('/entry');
        },
        /**
         * 切换业务类型
         */
        toggleBisType(){
            this.$router.replace('/register');
        },
        /**
         * 监听用户输入，通过输入显示图片
         */
        async handleInput(event){
            //查询数据库中是否存在该label
            if((!event.trim()) || !this.haveCamera){
                this.registerImgData = null;
                this.coveImgData = require(`@/themes/default/img/img_Viewfinder.png`);
                return;
            }
           
            let result = await ipcRenderer.sendSync(
                "register_search_record_precise",
                {
                    labelName:event
                }
            );
            if (result.code == "0" && result.data && result.data.pageList && result.data.pageList.length > 0) {
                this.labelId = result.data.pageList[0].labelId;
                if(this.appEnv.preview_model){//预览模式
                    let registerImg = result.data.pageList[0].registerImg;
                    if(registerImg.indexOf('http')==-1){//非在线url处理添加前缀
                        registerImg = this.localAssetsPreStr+registerImg;
                    }
                    this.registerImgData = `${registerImg}?t=${new Date().getTime()}`;
                }else{
                    this.scanIndex = utils.getScanIndex(this.labelId);
                    this.registerImgData = require(`@/themes/default/img/scan/${this.scanIndex}/register.png`);//左边注册图
                    this.coveImgData = require(`@/themes/default/img/scan/${this.scanIndex}/verify.png`);//右边核验图
                }
                this.active = true;
            }else{
                this.active = false;
                this.registerImgData = null;
                this.coveImgData = require(`@/themes/default/img/img_Viewfinder.png`);
            }
        },
        
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@keyframes move-light {
    0% {
        left: -45%;
    }
    100% {
       left: 100%;
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

@keyframes show-base-img {
  to {
    width: 480px;
    right: 0px;
  }
}


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

.gradientWrapper #scanLight {
    animation: move-light 3s linear;
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


.contcentWrap{
    height: calc(100vh - 45px);
}

.verifyWrap{
    height: 100%;
    background: white url('@/themes/default/img/background.png') no-repeat;
    background-size: cover;
}
.concent{
    padding: 23px 0 0;
}
.registerWrap{
    position: absolute;
    display: flex;
    width: 480px;
    height: 360px;
    float: left;
    margin-left: 30px;
    background: url('@/themes/default/img/bg_register.png') center no-repeat;
    background-size: 100%;
}

.registerImg{
    background-size:100% 100%;
    width: 480px;
    height: 360px;
}
.registerTips{
    font-size: 16px;
    color: #999;
    font-weight: 600;
    justify-content: center;
    align-items: center;
    margin: auto;
}
.textDiv{
    height: 32px;
    margin-left: 30px;
    .vspan{
        font-size: 16px;
        color: #222;
        font-weight: 600;
    
        margin-top: 20px;
        display: inline-block;
    }
    .register_span{
        margin-left: 208px;
    }
    .verify_span{
        margin-left: 468px;
    }
}

   
/*垂直竖线*/
.vertical-line {
    margin-left: 530px;
    width: 10px;
    height: 360px;
    float: left;
    border-right: dashed #499CFE 2px;
}
.videoWrap{
    width: 480px;
    height: 360px;
    margin-left: 570px;
}
.zoomStyle{
    .formArea{
        padding: 20px 30px;
    }
}
.formArea {
    padding: 40px 30px;
    margin-left: 300px;
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
    z-index:100;
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
.scan{
    position: absolute;
    z-index:200;
    width: 480px;
    height: 360px;
}
#scanLight{
    width: 250px;
}
.cameraScan{
    top: 0px;
    left: 0px;
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
