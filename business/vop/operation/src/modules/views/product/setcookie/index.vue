<template>
    <div class="setcookie">
        <el-alert
            style="marginBottom:20px"
            title="注意"
            type="warning"
            :closable="false"
            description="cookie有效期为24小时, 失效后京东联盟会搜索不到商品,请及时更新该cookie"
        >
        </el-alert> 
        <div style="marginBottom:20px">
            <span>{{ fileObj.showName }}</span>
            <el-button
                type="primary"
                icon="el-icon-download"
                @click="downFile"
            >
                点我下载
            </el-button>
        </div>
        <el-row style="marginBottom:20px">
            <el-col :span="20">
                <el-input
                    placeholder="请输入公司邮箱"
                    v-model="email"
                >
                    <template slot="append">
                        @sinosun.com.cn
                    </template>
                </el-input>
            </el-col>
            <el-col
                :span="24"
                class="email"
            >
                设置cookie过期发送邮箱地址,邮箱地址必须是公司邮箱
            </el-col>
        </el-row>
        <el-row
            type="flex"
            align="bottom"
        >
            <el-col :span="20">
                <el-input 
                    clearable
                    type="textarea"
                    :rows="20" 
                    v-model="cookie" 
                    @keyup.enter.native="addcookie" 
                    placeholder="请输入cookie"  
                >
                </el-input>
            </el-col>
            <el-col
                :span="3"
                :push="1"
            >
                <el-button
                    @click="addcookie"
                    icon="el-icon-plus"
                    type="primary"
                >
                    添加cookie
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <span class="network-time">上一次设置cookie成功时间:{{ networkTime }}</span>
            </el-col>
            <el-col :span="24">
                <span>本地上一次操作时间:{{ time.time1 }}</span>
            </el-col>
            <el-col :span="24">
                <span>本地当前操作时间:{{ time.time2 }}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            cookie:'',
            time:{
                time1:'',
                time2:''
            },
            networkTime:'',
            fileObj:{
                showName:'《京东联盟cookie获取方法》',
                address:'./thirdparty/resource/howtogetJDcookie.docx',
                howtogetJDcookie:'京东联盟cookie获取方法.docx'
            },
            email:''
        };
    },
    created() {
        
    },
    mounted() {
        this.getCookie();
        let timecookie = JSON.parse(localStorage.getItem("timecookie"));
        this.formatTime(timecookie);
    },

    activated() {
       
    },
   
    methods: {
        /**
         * 下载模板文件
         */
        downFile(fileUrl, fileName) {
            const that = this;
            that.$iLoading.show();

            utils.downloadFile(that.fileObj.address || fileUrl, that.fileObj.howtogetJDcookie || fileName);
            setTimeout(() => {
                that.$iLoading.hide();
            }, 1000);
        },       
               
        // 添加cookie
        addcookie() {
            let _this = this;
            if (!this.email){
                utils.showToast("请添加email");
            }
            if (!this.cookie){
                utils.showToast("请添加cookie");
            }

            let setcookie = window.btoa(this.cookie);
            _this.$iLoading.show();
            producthandler.addCookie({
                cookie:setcookie,
                email:`${this.email}@sinosun.com.cn`
            }).then(res => {
                _this.$iLoading.hide();
                if (res.resultCode == 0) {
                    let time = new Date().getTime();
                    let timecookie = JSON.parse(localStorage.getItem("timecookie"));
                    if (timecookie){
                        timecookie.time1 = timecookie.time2
                        timecookie.time2 = time
                    } else {
                        timecookie = {
                            time1:'',
                            time2:time
                        }
                    }
                    this.cookie = ''
                    utils.showToast("添加成功");
                    localStorage.setItem("timecookie",JSON.stringify(timecookie) );
                    _this.formatTime(timecookie);
                    _this.getCookie()
                }
                
            }).catch(() => {
                _this.$iLoading.hide();
            });
        },

        getCookie(){
            producthandler.getCookie().then(res => {
                if (res.resultCode == 0) {
                    this.networkTime = res.result.lastUpdateTime?res.result.lastUpdateTime:''
                    // 15为 '@sinosun.com.cn' 的长度
                    this.email = res.result.email?res.result.email.substr(0,res.result.email.length-15):''
                }
            });
        },

        formatTime(timecookie){
            if (timecookie){
                this.time.time1 = timecookie.time1? this.$moment(timecookie.time1).format("YYYY-MM-DD HH:mm:ss"):''
                this.time.time2 = timecookie.time2? this.$moment(timecookie.time2).format("YYYY-MM-DD HH:mm:ss"):''
            }
        }
    
    }
};
</script>
<style scoped lang="less">
.setcookie {
    padding-top: 20px;
    .network-time{
        font-size: 28px;
        color: red;
    }
    .email{
        color: #478aee;
        margin-top: 2px;
    }
}
</style>
<style  lang="less">


</style>
