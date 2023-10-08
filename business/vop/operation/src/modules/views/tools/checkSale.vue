<template>
    <div class="box">
        <div class="box1">
            查询条件
        </div>
        <div class="checkboxList">
            <div class="tips">
                （1） 请选择想要导出表格的列：
            </div>
            <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
            >
                全选
            </el-checkbox>
            <div style="margin: 0 50px 0 0;"></div>
            <el-checkbox-group
                v-model="checkList"
                @change="handleCheckedCitiesChange"
            >
                <el-checkbox
                    v-for="item in checkListLoop"
                    :label="item"
                    :key="item"
                >
                    {{ item }}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="selectCity">
            <div class="tips">
                （2） 请选择想要查询的城市：
            </div>
            <el-cascader
                class="selectCon"
                ref="addressList"
                v-model="locationsData"
                :props="props"
                placeholder="默认北京，深圳，武汉，西安四个城市"
                @change="locationsChange"
                clearable
            ></el-cascader>
        </div>
        <div class="box1">
            查询方式
        </div>
        <div class="importExcelBox">
            <div class="tips1">
                （1）导入表格：
            </div>
            <div class="importExcel">
                <label for="excel_file">
                    导入表格
                </label>
                <input
                    type="file"
                    id="excel_file"
                    @change="importFile"
                    multiple
                    v-show="false"
                />
            </div>
            <div class="fileNameBox">
                <div class="fileName">
                    {{ fileSheet && fileSheet.name || '暂未选择上传文件' }}
                </div><div
                    class="cancel"
                    v-if="fileSheet.name"
                    @click="cancelFile"
                ></div>
            </div>
            <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchSkuList('file')"
            >
                搜索
            </el-button>
        </div>
        <div class="goods">
            <div class="tips1">
                （2） 手动输入：
            </div>
            <el-input
                class="skuList"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                placeholder="请输入商品sku列表"
                maxlength="-1"
                v-model="skuListValue"
            >
            </el-input>
            <div class="search">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchSkuList('sku')"
                >
                    搜索
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    @click="reset1"
                >
                    清空
                </el-button>
            </div>
        </div>
        <div class="box1">
            查询结果
        </div>
        <div class="detailBox">
            <div class="detailBoxTitle">（1） 导入表格查询结果：<button
                @click="queryDownLoadUrlList()"
                class="downBtn"
            >
                导出表格
            </button>
            </div>
            <div>
                <el-table
                    class="downUrlTable"
                    :data="downLoadData"
                    :highlight-current-row="true"
                >
                    <el-table-column
                        type="index"
                        width="100"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="搜索时间"
                        width="240"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        label="操作人"
                        width="100"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="fileName"
                        label="操作文件"
                        width="300"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="downloadUrl"
                        label="操作"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <a
                                :href="scope.row.downloadUrl"
                                class="downLoadUrl"
                                v-if="scope.row.state=='1'"
                            >点击下载</a>
                            <span
                                v-else
                                @click="banDownTips"
                            >点击下载</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div 
                    class="pagingBox" 
                    v-show="downLoadData.length>0"
                >
                    <el-pagination
                        background
                        @size-change="pSizeChange"
                        @current-change="changePage"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpts"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper,sizes"
                        :total="totalNum"
                    >
                    </el-pagination>
                </div>
            </div>
            <div class="detailBoxTitle1">
                <div>（2） 手动输入查询结果：</div>
            </div>
            <table
                width="100%"
                height="20"
                cellpadding="10"
                cellspacing="0"
                id="table"
                class="detailTable"
            >
                <tr>
                    <th>商品sku</th><th>是否可售</th><th>京东销售价</th><th>结算价</th><th>最小起购量</th><th>运费</th>
                </tr>
                <tr
                    v-for="(item,index) in extendData"
                    :key="index"
                    align="center"
                    :class="item.sale=='可售'?'canPurchase':'notPurchase'"
                >
                    <td>{{ item.sku }}</td>
                    <td>{{ item.sale }}</td>
                    <td>{{ item.jdPrice }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.lowestBuy }}</td>
                    <td>{{ item.freight && JSON.stringify(item.freight).slice(1,JSON.stringify(item.freight).length-1).replace(/"/g,'') }}</td>
                </tr>
            </table>
            <div 
                class="pagingBox" 
                v-show="extendData.length>0"
            >
                <el-pagination
                    background
                    @current-change="detailChangePage"
                    :current-page="detailCurrentPage"
                    :page-size="detailPageSize"
                    layout="total, prev, pager, next"
                    :total="detailTotalNum"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import virtualHandler from "bislibs/requestHandler/virtualhandler.js";
import extendUtils from "bislibs/utils";
import systemhandler from "bislibs/requestHandler/systemhandler";
const checkOptions = ['价格','运费','最小起购量'];

export default {
    data() {
        return {
            skuListValue:'',
            provinceValue: [      
            ],
            mapSkuList:[], //输出的筛选后可售的sku列表
            // mapSkuListCon:'', //输出的筛选后可售的sku列表
            skuListfilter:[], //如果输入的带换行符进行处理的中转列表
            // priceData:[], //'获取京东销售价和结算价'接口的返回数据
            // filterindex:0, //查找sku对应的索引
            extendData:[], //显示的detail数据（做假分页）
            realExtendData:[], //真实detaila数据
            checkAll: true, //是否全选
            checkList: ['价格','运费','最小起购量'], //选中的框
            checkListLoop:checkOptions, //全部可选的值
            isIndeterminate: false, //（不选，全选）中间状态，只影响样式
            fileSheet:{
                type:XLSX
            },
            downLoadData:[], //导出表格列表
            userinfo:null, //当前登录用户信息
            pageSize: 10, //下载列表分页参数
            currentPage: 1,
            totalNum: 0,
            pageSizeOpts: [5, 10, 20, 50, 100],

            detailPageSize:10, //手动输入查询列表分页参数
            detailCurrentPage:1,
            detailTotalNum:0,
            inputFormats: [".xls", ".xlsx"],
            fileData:[],
            props: { 
                multiple: true ,
                lazy: true,
                async lazyLoad(node, resolve){
                    const { level } = node;
                    // eslint-disable-next-line no-unused-vars
                    const that = this;
                    if (level == 0) {
                        const data = await virtualHandler.getProvince().then(async (res) => {
                            return res.result.regionVoList;
                        })
                        let newarr = []
                        data.forEach((item)=>{
                            newarr.push(item)
                        })
                        let newaar = []
                        data.forEach((item)=>{
                            newaar.push(item.name)
                        })
                        let List = newarr
                        let List1 = newaar
                        let ListArr = List.map((item, i) => ({
                            item,
                            label: List1[i]
                        }))
                        let nodes = ListArr.map(item => {
                            return {
                                value: item.item.regionCode,
                                label: item.label,
                                leaf: false
                            }
                        })
                        resolve(nodes)

                    } else if (level == 1) {
                        const data = await virtualHandler.getCity({provinceCode:node.value}).then(async (res) => {
                            return res.result.regionVoList;
                        })
                        let newarr = []
                        data.forEach((item)=>{
                            newarr.push(item)
                        })
                        let newaar = []
                        data.forEach((item)=>{
                            newaar.push(item.name)
                        })
                        let List = newarr
                        let List1 = newaar
                        let ListArr = List.map((item, i) => ({
                            item,
                            label: List1[i]
                        }))
                        let nodes = ListArr.map(item => {
                            return {
                                value: item.item.regionCode,
                                label: item.label,
                                leaf: false
                            }
                        })
                        resolve(nodes)
                    } else if (level == 2) {
                        const data = await virtualHandler.getDistrict({cityCode:node.value}).then(async (res) => {
                            return res.result.regionVoList;
                        })
                        let newarr = []
                        data.forEach((item)=>{
                            newarr.push(item)
                        })
                        let newaar = []
                        data.forEach((item)=>{
                            newaar.push(item.name)
                        })
                        let List = newarr
                        let List1 = newaar
                        let ListArr = List.map((item, i) => ({
                            item,
                            label: List1[i]
                        }))
                        let nodes = ListArr.map(item => {
                            return {
                                value: item.item.regionCode,
                                label: item.label,
                                leaf: false
                            }
                        })
                        resolve(nodes)

                    } else if (level == 3) {
                        const data = await virtualHandler.getTown({districtCode:node.value}).then(async (res) => {
                            return res.result.regionVoList;
                        })
                        let newarr = []
                        data.forEach((item)=>{
                            newarr.push(item)
                        })
                        let newaar = []
                        data.forEach((item)=>{
                            newaar.push(item.name)
                        })
                        let List = newarr
                        let List1 = newaar
                        let ListArr = List.map((item, i) => ({
                            item,
                            label: List1[i]
                        }))
                        let nodes;
                        if (ListArr.length!=0){
                            nodes = ListArr.map(item => {
                                return {
                                    value: ListArr?item.item.regionCode : '0',
                                    label: ListArr?item.label : '',
                                    leaf: true
                                }
                            })
                        } else {
                            nodes = [{value:'0',label:'无',leaf:true}]
                        }  
                        resolve(nodes)
                    }
                }
            },
            locationsData: [],
            defaultProvinceCode:[
                {
                    province: "1",
                    city: "2800",
                    county: "55838",
                    town: "0",
                    cityName: "北京"
                },
                {
                    province: "19",
                    city: "1607",
                    county: "3639",
                    town: "59643",
                    cityName: "深圳"
                },
                {
                    province: "17",
                    city: "1381",
                    county: "50713",
                    town: "62970",
                    cityName: "武汉"
                },
                {
                    province: "27",
                    city: "2376",
                    county: "4343",
                    town: "53951",
                    cityName: "西安"
                }
            ]
        };
    },
    
    components: {},
    props: {},   
    mounted(){
        this.getHeaderInfo();
    },
        
    
    methods: {
        // 复选框
        handleCheckAllChange(val) {
            this.checkList = val ? checkOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkListLoop.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkListLoop.length;
        },
        // 获取当前登录人信息
        getHeaderInfo(){
            this.userinfo = {
                username:(systemhandler.userInfo && systemhandler.userInfo.mgrName) || "",
                userID:(systemhandler.userInfo && systemhandler.userInfo.userId) ||""
            }                
        },
        // 点击下载置灰时点击提示
        banDownTips(){
            extendUtils.showToast("稍等片刻，马上就好");
        },
        // 时间处理
        formdateTime(time){
            return this.$moment(time).format("YYYY-MM-DD HH:mm:ss");
        },

        //‘导出表格下载’页码变化
        changePage(page) {
            var _this = this;
            _this.currentPage = page;
            _this.getDownloadUrl();
        },
        //‘导出表格下载’每页显示条数变化
        pSizeChange(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            _this.currentPage = 1;
            _this.getDownloadUrl();
        },
        // 查询下载列表
        queryDownLoadUrlList() {
            this.currentPage = 1;
            this.loads = true;
            this.getDownloadUrl();
        },
        // 清空导入表格文件
        cancelFile(){
            this.fileSheet = {};
        },
        locationsChange(value) {
            this.locationsData = value;
        },
        // 手动输入查询详情假分页
        detailChangePage(page){
            var _this = this;
            _this.detailCurrentPage = page;
            _this.extendData = _this.realExtendData.slice((page-1)*_this.detailPageSize,page*_this.detailPageSize);
        },
        /**
             * 导出表格
             */
        // downloadExlSheelt (checkList) {
        //     var workbook = XLSX.utils.book_new();
        //     var ws1 = XLSX.utils.table_to_sheet(document.getElementById('table'),{raw:true});
        //     XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1");
        //     XLSX.writeFile(workbook, '导出表格.xlsx'); //导出Excel
        // },

        // 点击搜索事件
        searchSkuList(type){
            this.mapSkuList=[];
            this.skuListfilter=[];
            this.skuListValue.trim().split(',').forEach((item)=>{
                if (item!=''){
                    this.skuListfilter.push(item.trim());
                }
            })
            if (type=='file' && this.fileData.length==0) {
                extendUtils.showToast('导入文件不能为空');
            } else if (type=='sku' && this.skuListfilter.length==0) {
                extendUtils.showToast('sku列表不能为空');
            } else {
                this.getListByFile(this.checkList,type);
            }
            
              
        },
        // 点击清空事件
        reset1(){
            this.skuListValue='';
            this.skuListfilter=[];
        },
        // 获取查询结果
        getListByFile(checkList,type) {
            let that = this;
            let searchApi = type=='sku'?'querySkuListDetail':type=='file'?'queryFileDetail':''
            that.$iLoading.show();
            let arr = [];
            that.locationsData && that.locationsData.forEach((item,index)=>{
                let cityName;
                if (that.$refs.addressList.getCheckedNodes(true)[index].value=='0'){
                    cityName = that.$refs.addressList.getCheckedNodes(true)[index].parent.parent.parent.label;
                } else {
                    cityName = that.$refs.addressList.getCheckedNodes(true)[index].parent.parent.label;
                }
                arr.push({'province':item[0],'city':item[1],'county':item[2],'town':item[3],'cityName':cityName})
            })

            let param = {}
            if ((type=='file' && this.fileData.length==0) || (type=='sku' && that.skuListfilter.length==0)) { 
                return 
            } 
            param.addressVoList = that.locationsData.length!=0?arr:that.defaultProvinceCode;
            param.price = checkList.includes('价格');
            param.freight = checkList.includes('运费');
            param.lowestBuy = checkList.includes('最小起购量');
            if (type=='file') {
                param.operator = this.userinfo && this.userinfo.username;
                param.skuList = this.fileData;
                param.fileName = this.fileSheet.name
            } else if (type == 'sku') {
                param.skuList = that.skuListfilter;
            }
            
            virtualHandler[searchApi](param).then(async (res) => {
                that.$iLoading.hide();
                if (res.resultCode==0) {
                    that.realExtendData = res.result.marketabilityVoList;
                    that.extendData = that.realExtendData.slice(0,10);
                    that.detailTotalNum = res.result.marketabilityVoList.length;
                }
                extendUtils.showToast(res.resultMessage);
            }).catch(() => {
                    
            }).finally(()=>{
                that.$iLoading.hide();
            });
                
        },
        // 导入表格
        importFile(obj){
            if (!obj || !obj.target.files) {
                return;
            }
            const that = this;
            var wb; //读取完成的数据
            var f = obj.target.files[0];
            this.fileSheet = f;
            //格式校验
            if (
                f.name &&
                f.name.split(".").length > 1 &&
                that.inputFormats.indexOf("." + f.name.split(".")[1]) == -1
            ) {
                extendUtils.showToast("仅支持Excel格式");
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                wb = XLSX.read(data, {
                    type: "binary"
                });
                let strs = JSON.stringify(
                    XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                );
                let tempData = JSON.parse(strs.replaceAll("\\\\", "")); //去掉转义符号\);
                tempData.forEach(item=>{
                    for (let key in item) {
                        if (key == '京东SKU') {
                            that.fileData.push(item[key])
                        }
                    }
                })
                // console.log("上传完成读取");
                // console.log(JSON.stringify(that.fileData));
            };
            reader.readAsBinaryString(f);
            //默认清空value，否则多次上传一个没反应
            obj.target.value = "";
            extendUtils.showToast("导入成功")
        },
        // 导出生成链接
        getDownloadUrl(){
            let that = this;
            that.$iLoading.show();
            that.downLoadData = [];
            virtualHandler
                .getDownloadUrl({
                    pageNum:that.currentPage,
                    pageSize:that.pageSize
                })
                .then(async (res) => {
                    that.$iLoading.hide();
                    if (res.resultCode==0){
                        let data = res.result.marketabilityLogVoList;
                        data.forEach((item)=>{
                            item.createTime = that.formdateTime(item.createTime);
                        })
                        that.downLoadData = data || [];
                        that.totalNum = res.result.total; //总条数
                        // that.downLoadData = res.data.operateLogList.filter(item=>item.state=="1");
                    } 
                    extendUtils.showToast(res.resultMessage);  
                })
                .catch(() => {     
                }).finally(()=>{
                    that.$iLoading.hide();
                });
        }
    }
}
</script>

<style scoped lang="less">
    .box{
        .goods{
            display: flex;
            padding: 20px 0px;
            align-items: center;
            .left{
                width: 160px;
                font-weight: bold;
            }
            textarea{
                flex: 1;
                border: 1px solid #000;
                padding: 5px;
            }
        }
        .search{
            display: flex;
            margin-left: 10px;
            // width: 190px;
            text-align: center;
        }
        .provinceCode{
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            .provinceBox{
                flex:1;
                border: 1px solid #000;
                margin-top: 10px;
                overflow-y: auto;
                padding: 5px;
                textarea{
                    width: 100%;
                }
            }
        }
        .copy{
            margin-left: 10px;
            button{
                width: 75px;
                background:#409EFF;
                color: #fff;
                margin-bottom: 10px;
                border-radius: 15px;
            }
        }
        .tips{
            font-weight: bold;
            width: 210px;
        }
        .tips1{
            font-weight: bold;
        }
        .detailBox{
            margin-top: 15px;
            .detailBoxTitle{
                font-weight: bold;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
            }
            .smallTips{
                margin: 10px 0 10px 10px;
                color:coral;
            }
        }
    }
    .detailBoxTitle1{
        margin-top: 20px;
        font-weight: bold;
    }
    button{
        border: none;
    }
    .checkboxList{
        width: 100%;
        height: auto;
        display: flex;
        padding-top: 20px;
        .tips{
            font-weight: bold;
        }
    }
    .importExcelBox{
        display: flex;
        align-items: center;
        margin-top: 20px;
        height: 40px;
    }
    .importExcel,.downBtn{
        display: block;
        width: 100px;
        height: 100%;
        line-height: 40px;
        color: #fff;
        border-radius: 4px;
        background: #f38405;
        text-align: center;
    }
    .fileNameBox{
        display: flex;
        justify-content: center;
        align-items: center;
        width:240px;
        height: 100%;
        margin: 0 10px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
    }
    .fileName{
        width:80%;
        height: 100%;
        line-height: 40px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #606266;
        word-break: break-all;
    }
    .cancel{
        width: 16px;
        height: 16px;
        background: url("../~assets/icon_cancelled.png");
        background-size: 100% 100%;
    }
    .downLoadUrl{
        color: #409EFF;
        text-decoration: underline;
    }
    .downLoadTime{
        padding-left: 20px;
    }
    .pageSizeTips{
        font-weight: bold;
    }
    .PageSizeNum{
        border: 1px solid #000;
        width: 15%;
    }
    .pagingBox {
        max-width: 1100px;
        padding-top: 24px;
        text-align: right;
    }
    .selectCity{
        display: flex;
        margin: 20px 0;
        align-items: center;
    }
    .selectCon{
        width: 300px;
    }
    .box1{
        font-size: 22px;
        font-weight: bold;
    }
    .detailTable{
        max-width: 1100px;
        margin-top: 10px;
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        tr{
            height: 30px;
        }
        th{
            color: rgb(144, 147, 153);
        }
        td{
            color: rgb(96, 98, 102);
        }
    }
    .skuList{
        max-width: 800px;
        flex: 1;
    }
    .canPurchase{
        background: #f0f9eb;
    }
    .notPurchase{
        background: oldlace;
    }
    .downUrlTable{
        max-width: 1100px;
    }
</style>

