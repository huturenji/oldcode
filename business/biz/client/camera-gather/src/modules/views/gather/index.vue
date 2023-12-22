<template>
    <div class="gather">
        <div class="registerWrap">
            <div class="title">
                <span>纸纹注册</span>
            </div>
            <div class="tips">
                <span>请把二维码放置在取景框中间</span>
            </div>
            <div class="viewfinderWrap" >
                <!-- 使用v-if判断去除img默认的灰色边框 -->
                <img :src="registerImg" v-if="registerImg"/>
                <div class="viewfinder">
                </div>
                <div class="focus">
                </div>
            </div>
            <div>
                <div class="button"  @click="register()">注册</div>
            </div>
        </div>
        <div class="overlay" :class="{active:active}"  id="overlay" @click="close">
            <div class="modal">
                <!-- 注册中 -->
                <div v-if="registerStatus=='registering'" :class={registering:active}>
                    <div class="sampleImg">
                        <img class="scanLight"  :src="scan_light_img" /> 
                    </div>
                    <div class="mask"></div>
                    <div class="progress">
                        {{progress}}%
                    </div>
                    <div class="text">
                        注册中
                    </div>
                </div>
                <!-- -->
                <!-- 已经注册过 -->
                <div v-if="registerStatus=='registered'" class="registered">
                    <div class="sampleImg">
                        <div class="icon"></div>
                    </div>
                   
                    <div class="text">
                        <div class="bold">该纸纹标签已注册过，是否重新注册</div>
                        <div class="sample">重新注册会覆盖原指纹</div>
                    </div>
                    <div class="button">
                        <div class="no btn" @click="cancel">否</div>
                        <div class="yes btn" @click='ok'>是</div>
                    </div>
                </div>
                <!-- 注册成功 -->
                <div v-if="registerStatus=='registerSuccess'" class="registerSuccess">
                    <div class="sampleImg">
                    </div>
                    <div class="text">
                        <div class="bold">标签指纹注册成功</div>
                        <div class="sample">{{new Date().format('yyyy-MM-dd')}}</div>
                    </div>
                    <div class="button">
                        <div class="btn" @click="cancel">继续注册</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import request from 'utils/requestHandler.js'
const MAX_PROSES = 100;
export default {
    data(){
        return {
            registerImg:null,
            registerStatus:null,
            active:false,
            progress:0,
            interval:null,
            interval_preview:null,
            intervalTime:30,
            scan_light_img:null
        }
    },
    async beforeCreate(){
    },
    async created(){
        let time = SnUtils.getUserPara('interval');
        await this.getPreviewImg();
         //程序启动后直接获取预览图片
        // this.interval_preview = setInterval(async()=>{
        //     await this.getPreviewImg();
        // },time||150)
    },
    destroyed(){
        this.interval_preview&&clearInterval(this.interval_preview);
        this.interval&&clearInterval(this.interval);
    },
    methods:{
        async getPreviewImg(){
            let response = await request.post('/api/v1/batchcapture/getpreviewimg',{},{
                'Content-Type':'image/jpeg'
            })//获取预览图片
            this.registerImg  = URL.createObjectURL(response)
        },
        register(){
            this.active=true;
            this.registerStatus='registering';
            this.scan_light_img=require(`@/themes/default/img/gather/scan.png`);
            let sendPost = request.post('/api/v1/capture/get')//采集一张纸纹图 参见接口3.9
            this.interval = setInterval(async() => {
                if(this.progress<MAX_PROSES){
                    this.progress++
                }else{
                    this.interval&&clearInterval(this.interval);
                    //等待接口返回
                    let res = await sendPost;
                    this.scan_light_img = null;//取消动画图片
                    this.progress = 0;//取消动画进度
                    if(0==res.ErrCode){//采集成功
                        this.registerImg = `${res.Data.ImgUrl}?imgtype=thumbnail&t=${new Date().getTime()}`
                        this.registerStatus='registerSuccess';
                    }else{//采集失败
                        this.registerStatus='registered';
                    }
                }
            }, this.intervalTime);
        },
        close(){
            if(this.registerStatus!='registering'){
                return 
            }
            this.active=false;
        },
        cancel(){
            this.active=false;
        },
        ok(){
            this.registerStatus='registerSuccess';
            // this.active=false;
        }
    }
}
</script>

<style scoped lang="less">

@keyframes  move-light  {
    0% {
        left: -75%;
    }
    100% {
       left: 25%;
    }
}
.gather{
    width: 1280px;
    height: 720px;
    position: static;
    margin: auto;
    .registerWrap{
        width: 540px;
        margin:auto;
        text-align: center;
        .title{
            padding: 60px 0 0 0;
            span{
                font-size: 20px;
                color:#FFF;
            }
        }
        .tips{
            margin: 20px auto 0 auto;
            background-color: #222;
            width: 240px;
            height: 32px;
            border-radius: 16px;
            span{
                line-height: 32px;
                font-size: 16px;
                color:#FFF;
            }
        }
        .viewfinderWrap{
            margin: 40px 0 0 0;
            border-radius: 8.5px;
            width: 100%;
            height: 360px;
            background-size: 100%;
            img{
                display: block;
                position: absolute;
                width: 540px;
                height: 360px;
                padding: 6px;
            }
            .viewfinder{
                width: 540px;
                height: 360px;
                position: absolute;
                background: rgba(0,0,0,0.3);
                -webkit-mask: linear-gradient(to right,black 170px, rgba(0, 0, 0, 0) 170px, rgba(0, 0, 0, 0) 370px,black 370px),
                                  linear-gradient(to bottom,black 87px, rgba(0, 0, 0, 0) 87px, rgba(0, 0, 0, 0) 287px,black 287px);
                mask:linear-gradient(to right,black 170px, rgba(0, 0, 0, 0) 170px, rgba(0, 0, 0, 0) 370px,black 370px),
                                  linear-gradient(to bottom,black 87px, rgba(0, 0, 0, 0) 87px, rgba(0, 0, 0, 0) 287px,black 287px);
                border:6px solid rgba(0, 29, 113, 0.5);
                border-radius:8.5px
            }
            
            .focus{
                float:left;
                position: relative;
                top:87px;
                left: 170px;
                width: 200px;
                height: 200px;
                background:linear-gradient(to right,#fff,#fff) left top no-repeat,
                linear-gradient(to bottom,#fff,#fff) left top no-repeat,
                linear-gradient(to right,#fff,#fff) left bottom no-repeat,
                linear-gradient(to bottom,#fff,#fff) left bottom no-repeat,
                linear-gradient(to right,#fff,#fff) right top no-repeat,
                linear-gradient(to bottom,#fff,#fff) right top no-repeat,
                linear-gradient(to right,#fff,#fff) right bottom no-repeat,
                linear-gradient(to bottom,#fff,#fff) right bottom no-repeat;
                background-size: 3px 16px,16px 3px;
            }
        }
        .button{
            margin: 45px auto 0 auto;
            color: #1145FF;
            width: 152px;
            height: 40px;
            line-height: 40px;
            background-color: #FFF;
            border-radius: 4px;
            font-weight: bold;
            cursor:pointer;
        }
    }
    .overlay.active{
        display: flex;
    }
    .overlay{
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        justify-content: center;
        align-items: center;
        z-index: 999;
        .modal{
            display: flex;
            background: #FFF;
            .registering{
                width: 380px;
                height: 380px;
                text-align: center;
            
                .mask{
                    width: 380px;
                    height: 260px;
                    position: absolute;
                    background-color: #FFF;
                    margin-top: -260px;
                    -webkit-mask: linear-gradient(to right,black 90px, rgba(0, 0, 0, 0) 90px, rgba(0, 0, 0, 0) 290px,black 290px),
                                  linear-gradient(to bottom,black 60px, rgba(0, 0, 0, 0) 60px, rgba(0, 0, 0, 0) 260px);
                    mask:linear-gradient(to right,black 90px, rgba(0, 0, 0, 0) 90px, rgba(0, 0, 0, 0) 290px,black 290px),
                         linear-gradient(to bottom,black 60px, rgba(0, 0, 0, 0) 60px, rgba(0, 0, 0, 0) 260px);
                }
                .scanLight {
                    position: relative;
                    left: 30%;
                    animation: move-light 3s linear;
                }
                .sampleImg{
                    margin: 60px auto 0 auto;
                    background: url(@/themes/default/img/gather/paper_scan.png) no-repeat;
                    width: 200px;
                    height: 200px;
                }
                .progress{
                    margin: 24px auto 0 auto;
                    font-size: 28px;
                    color:#1145FF;
                }
                .text{
                    font-size: 16px;
                    width: 48px;
                    height: 28px;
                    line-height: 28px;
                    color:#010B10;
                    font-weight: bold;
                    margin: 10px auto 0 auto;
                }
            }
            .registered{
                width: 380px;
                height: 380px;
                text-align: center;
                .sampleImg{
                    display: flex;
                    width: 380px;
                    height: 154px;
                    background: url(@/themes/default/img/gather/paper_registered.png) no-repeat;
                }
                .icon{
                    width: 75px;
                    height: 75px;
                    margin: 120px auto 0 auto;
                    background: url(@/themes/default/img/gather/warning.png) no-repeat;
                }
                .text{
                    .bold{
                        font-size: 16px;
                        width: 256px;
                        height: 28px;
                        line-height: 28px;
                        color:#010B10;
                        font-weight: bold;
                        margin:59px auto 0 auto;
                    }
                    .sample{
                        font-size: 14px;
                        width: 256px;
                        height: 15px;
                        line-height: 15px;
                        color:#222;
                        margin:15px auto 0 auto;
                    }
                    

                }
                .button{
                    display: flex;
                    margin:34px auto 0 auto;
                    justify-content: center;
                    .btn{
                        width: 80px;
                        height: 40px;
                        background-color: #1145FF;
                        border-radius: 4px;
                        color: #FFF;
                        line-height: 40px;
                    }
                    .yes{
                        margin-left: 56px;
                    }
                }
            }
            .registerSuccess{
                width: 380px;
                height: 475px;
                text-align: center;
                .sampleImg{
                    margin: 24px auto 0 auto;
                    width: 280px;
                    height: 280px;
                    background: url(@/themes/default/img/gather/paper_success.png) no-repeat;
                }
                .text{
                    .bold{
                        font-size: 24px;
                        font-weight: bold;
                        width: 256px;
                        height: 28px;
                        line-height: 28px;
                        color:#222;
                        margin:15px auto 0 auto;
                    }
                    .sample{
                        font-size: 16px;
                        width: 90px;
                        height: 28px;
                        line-height: 28px;
                        color:#010B10;
                        margin:16px auto 0 auto;
                    }
                }
                .button{
                    display: flex;
                    margin:16px auto 0 auto;
                    justify-content: center;
                    .btn{
                        width: 80px;
                        height: 40px;
                        background-color: #1145FF;
                        border-radius: 4px;
                        color: #FFF;
                        line-height: 40px;
                    }
                }
            }

        }
    }
    .overlay.active{
        display: flex;
    }
}
</style>