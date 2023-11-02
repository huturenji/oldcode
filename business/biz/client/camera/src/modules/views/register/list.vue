<template>
    <div class="listPageWrap" :class="{zoomStyle:zoomStyle}">
        <headBreadcrumb
            :title="'首页'"
            :tips="'注册列表'"
            :showbtn="false"
            @goback="gotoBack"
        ></headBreadcrumb>
        <div 
            class="contcentWrap"
            v-loading="loading"
            :element-loading-text="'加载中'"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.7)">
            <div class="filterWrap">
                <div class="left">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item class="formItem timePicker" label="注册时间">
                            <el-date-picker
                                class="datePicker"
                                v-model="userInput.dateRange"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="formItem" :label="`${sourceTypeName}号`">
                            <el-input v-model="userInput.labelName" maxlength="30" :placeholder="`请输入${sourceTypeName}号`"></el-input>
                        </el-form-item>
                        <el-form-item class="formItem" label="注册人员">
                            <el-input v-model="userInput.registerUserName" maxlength="15" placeholder="请输入注册人员"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="right">
                    <div class="reset" @click="reset()">重置</div>
                    <div class="getList" @click="getList()">查询</div>
                </div>
            </div>
            <div class="tableWrap" >
                <el-table
                    :header-cell-style="{ background: '#F7F8FA',color:'#1D2129',height:'40px' }"
                    :data="listData"
                    :size="'medium'"
                >
                    <el-table-column
                        align="center" 
                        prop="labelNo" 
                        :label="`编号`" 
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="labelName"
                        :label="`${sourceTypeName}号`"
                        :formatter="labelNameFmt"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="registerUserName"
                        label="注册人员"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="registerTime"
                        label="注册时间"
                        :formatter="dateFmt"
                    ></el-table-column>
                    <!-- <el-table-column
                        align="center"
                        prop="name"
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button @click="openDetail(scope.row)" type="text" >查看详情</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <el-pagination
                    class="page"
                    background
                    @size-change="getList(true)"
                    @current-change="getList()"
                    :current-page.sync="pageObj.currPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size.sync="pageObj.pageSize"
                    layout=" total,prev, pager, next, jumper, sizes"
                    :total="pageObj.totalRecord"
                ></el-pagination>
            </div>
        </div>
        <el-dialog
            title=""
            :visible.sync="registerDetailShow"
            width="700px"
            :append-to-body="true"
            center>
            <div class="textLine">
                <div class="label_id">编号：{{registerDetail.labelNo}}</div>
                <div class="label_no">{{sourceTypeName}}号：{{registerDetail.labelName}}</div>
                <div class="label_name">注册人员：{{registerDetail.registerUserName}}</div>
                <div class="label_time">注册时间：{{registerDetail.registerTime}}</div>
            </div>
            <div class="textLine" v-if="registerDetail.registerImg">
                <!-- <div class="label">注册图片：</div> -->
                <div class="lineContent imgWrap" v-if="registerDetail.registerImg">
                    <el-image :fit="'contain'" style="    height: 360px;min-width: 480px;" :src="registerDetail.registerImg" :preview-src-list="previewImglist"></el-image>
                </div>
                <div class="lineContent" v-else>未发现注册图片</div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="registerDetailShow = false">关 闭</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
const headBreadcrumb = () => import("biscomponents/activity/head-breadcrumb.vue");
export default {
    components: {
        headBreadcrumb
    },
    data() {
        return {
            loading:false,
            userInput: {//查询条件
                labelName: "", //标签名称
                registerUserName: '', //注册人员
                dateRange:[]//时间范围
            },
            listData: [],//页面列表数据
            pageObj: {//列表分页数据
                pageSize: 10,
                currPage: 1,
                totalRecord: 0,
                totalPages: 1
            },
            pickerOptions: {//日历快捷选项
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            timer:null,//定时器对象
            registerDetail:{},//注册详情
            previewImglist:[],//注册图预览
            registerDetailShow:false,//注册详情是否展示
            appEnv:{},//app环境信息
            localAssetsPreStr:'../../../../',//引用本地资源前缀
            sourceTypeName:'凭证',//素材名称
            zoomStyle:window.devicePixelRatio>=1.5,
        };
    },
    filters: {

    },
    watch: {},
    created() {
    },
    mounted() {
        this.getAppEnv();
        this.getList();
    },
    methods: {
        //返回
        gotoBack() {
            this.$router.replace('/entry');
        },
        //获取appenv
        getAppEnv(){
            if(!!sessionStorage.getItem('appEnv')){
                this.appEnv = JSON.parse(sessionStorage.getItem('appEnv'))
                this.localAssetsPreStr = this.appEnv.isPackaged?'../../../../':'../../';
                this.sourceTypeName = this.appEnv.use_perspective?'凭证':'凭证';//2023年9月25日目前固定为凭证
            }
        },
        //重置
        reset(){
            this.userInput = {
                labelName: "", 
                registerUserName: '', 
                dateRange:[]
            }
        },
        /**
         * 校验参数并且发送请求
         * initCurrPage 是否初始化页数
         */
        getList(initPageNumber=false) {
            let that = this;
            this.loading = true;
            let reqData = {
                labelName:this.userInput.labelName,
                registerUserName:this.userInput.registerUserName,
                pageSize:this.pageObj.pageSize,
                pageNumber:!!initPageNumber?1:this.pageObj.currPage
            }
            !!this.userInput.dateRange[0] && (reqData.startTime = this.userInput.dateRange[0].format('yyyy-MM-dd')+' 00:00:00');
            !!this.userInput.dateRange[1] && (reqData.endTime = this.userInput.dateRange[1].format('yyyy-MM-dd')+' 23:59:59');
            console.log(reqData)
            that.search(reqData);
            !!this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$message('数据获取超时');
                this.loading = false;
            }, 3000);
        },
        /**
         * 查询数据
         */
        async search(data = {}) {
            const that = this;
            let result = await ipcRenderer.sendSync(
                "register_search_record",
                data
            );
            //保证用户交互完整性完整显示loading
            setTimeout(() => {
                if (result.code == "0" && result.data && result.data.pageList) {
                    that.listData = result.data.pageList;
                    that.pageObj = {
                        pageSize: result.data.pageSize,
                        currPage: result.data.curPage,
                        totalRecord: result.data.totalRecords,
                        totalPages: result.data.totalPage
                    };
                }
                console.log('register_search_record: ',result)
                this.loading = false;
                clearTimeout(this.timer)
            }, 500);
        },
        /**
         * 格式化日期
         */
        dateFmt(row, column, cellValue) {
            let res = cellValue;
            try {
                if(!!cellValue){
                    let startDate = new Date(cellValue);
                    res = startDate.format("yyyy/MM/dd HH:mm:ss");
                }
            } catch (error) {
                console.log('dateFmt: ',error);
            }
            return res;
        },
        /**
         * 标签名称格式化
         */
        labelNameFmt(row, column, cellValue){
            return cellValue ? cellValue : this.sourceTypeName;
        },
        /**
         * 查看详情
         */
        openDetail(rawData){
            let tempData = JSON.parse(JSON.stringify(rawData));
            if(tempData.registerImg.indexOf('http')==-1){//非在线url处理添加前缀
                tempData.registerImg = this.localAssetsPreStr+rawData.registerImg +"?t="+new Date().getTime();
            }
            this.registerDetail = tempData;
            this.previewImglist = [tempData.registerImg];
            this.registerDetailShow = true;
        }
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
.listPageWrap{
    height: 100%;
    background: white url('@/themes/default/img/background.png') no-repeat;
    background-size: cover;
    .contcentWrap{
        height: calc(100vh - 45px);
    }
}
.zoomStyle{
    .tableWrap{
        /deep/.el-table{
            height: 411px;
            overflow: auto;
        }
    }
}
.tableWrap{
    padding: 0 40px;
    /deep/.el-table{
        background: white url('@/themes/default/img/bg_list.png') no-repeat;
        background-size: cover;
        tr,th{
            background: transparent !important;
        }
        th.el-table__cell{
            padding: 9px 0 9px 0;
        }
        td.el-table__cell, th.el-table__cell.is-leaf{
            border-bottom: none;
        }

        &::before{
            display: none;
        }
        .el-button{
            padding: 0 10px;
        }
        height: 471px;

    }
    /deep/.page{
        display: flex;
        justify-content: center;
        margin-top: 30px;
        &.el-pagination.is-background .el-pager li{
            background: url('@/themes/default/img/page_nor.png') no-repeat;
            background-size: cover;
            color: #222;
        }
        &.el-pagination.is-background .el-pager li:not(.disabled).active{
            background: url('@/themes/default/img/page_sel.png') no-repeat;
            background-size: cover;
            color: #fff;
        }
        .el-pagination__total,.el-pagination__jump,.el-input__inner{
            color: #222;
        }
    }
}
.filterWrap{
    padding: 19px 40px;
    display: flex;
    margin-bottom: 11px;
    /deep/.left{
        flex: 1;
        .formItem{
            .el-form-item__label{
                color: #222;
                font-size: 14px;
                padding-right: 10px;
            }
            .el-input__inner{
                font-size: 14px;
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
        .el-form--inline .el-form-item{
            margin-right: 40px;
        }
        .el-form--inline .el-form-item__content{
            width: 140px;
        }
        .el-form--inline .timePicker .el-form-item__content{
            width: 246px;
        }
    }
    .right{
            font-size: 14px;
            text-align: center;
            line-height: 32px;
            display: flex;
            align-items: center;
        .reset{
            width: 68px;
            height: 32px;
            color: #222;
            background: white url('@/themes/default/img/btn_white.png') no-repeat;
            background-size: cover;
            cursor: pointer;
            user-select: none;
            margin-right: 12px;
        }
        .getList{
            width: 68px;
            height: 32px;
            color: #fff;
            background: white url('@/themes/default/img/btn_blue.png') no-repeat;
            background-size: cover;
            cursor: pointer;
            user-select: none;
        }
    }
}
.datePicker{
    width: 250px;
}
.topArea {
    padding: 20px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #dcdee2;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .formArea {
        display: flex;
        flex-wrap: wrap;
    }
}
.popover {
    display: flex;
    justify-content: space-between;
    .popoverL {
        max-width: 350px;
        margin-right: 15px;
        margin-bottom: 10px;
    }
    .popoverR {
        text-align: left;
    }
}
.state {
    position: relative;
}
.state::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    left: -12px;
    top: 7px;
}
.state1::before {
    background: #ff9a2e;
}
.state2::before {
    background: #23c343;
}
.state3::before {
    background: #e5e6e8;
}
.textLine{
    display: flex;
    align-items: center;
    color: #222;
    font-weight: bold;
    .label_id{
        width: 130px;
    }
    .label_no{
        width: 170px;
    }
    .label_name{
        width:140px;
    }
    .label_time{
        width:202px;
    }
    .lineContent{
        flex: 1;
    }
}
.imgWrap{
    margin-top: 32px;
    justify-content: center;
    display: flex;
}
/deep/.imgWrap .el-image__inner{
    width: initial;
}


/deep/.el-dialog--center{
    height:500px;
    border-radius: 15px;
    background: white url('@/themes/default/img/bg_tanchuang_list.png') no-repeat;
    background-size:100% 100%;
    .el-dialog__headerbtn{
        top: 5px;
        right: 5px;
        .el-dialog__close{
            font-size: 32px;
            font-weight: 900;
            color: black;
        }
    }
    .el-dialog__body{
        padding: 20px 29px;
    }
}
</style>


