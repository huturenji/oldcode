<template>
    <div class="crawl_data_box">
        <el-form
            ref="form"
            :rules="rules"
            :model="form"
            label-width="80px"
            label-position="left"
            :style="{paddingBottom:'20px'}"
        >
            <el-form-item label="爬取依据">
                <el-col :span="4">
                    <el-select
                        class="select_box"
                        v-model="sortType"
                        clearable
                        placeholder="请选择爬取依据"
                    >
                        <el-option
                            v-for="item in sortOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item
                v-if="sortType==2"
                label="sku"
            >
                <el-col
                    :span="8"
                    class="skuListBox"
                >
                    <el-input
                        class="skuList"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5}"
                        placeholder="请输入sku列表,例如：sku1,sku2"
                        maxlength="-1"
                        v-model="skuListValue"
                    >
                    </el-input>
                    <el-button
                        @click="resetSku"
                    >
                        清空sku列表
                    </el-button>
                    <el-button
                        @click="showCreateDialog"
                    >
                        创建动销库
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item
                label="任务调度类型"
                label-width="110px"
            >
                <el-col :span="4">
                    <el-select
                        class="select_box"
                        v-model="jobSortType"
                        clearable
                        placeholder="请选择任务调度类型"
                    >
                        <el-option
                            v-for="item in jobSortOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item
                label="期望启动时间"
                label-width="110px"
            >
                <el-col :span="4">
                    <el-date-picker
                        v-model="exportJobWaitTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择启动时间"
                        default-time="00:00:00"
                    >
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="间隔时间">
                <el-col
                    :span="6"
                    :style="{display:'flex'}"
                >
                    <el-input-number
                        v-model="exportJobIntervalDay"
                        :min="1"
                    ></el-input-number>
                    <span :style="{paddingLeft:'10px'}">天</span>
                </el-col>
            </el-form-item>
            <el-form-item
                label="任务重复次数"
                label-width="110px"
            >
                <el-col :span="4">
                    <el-input-number
                        v-model="maxTimes"
                        :min="1"
                    ></el-input-number>
                </el-col>
            </el-form-item>
            <el-form-item label="查询类型">
                <el-checkbox-group v-model="checkedJobQueryType">
                    <el-checkbox
                        v-for="item in allJobQueryType"
                        :label="item.value"
                        :key="item.value"
                    >
                        {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- <el-form-item
                v-if="sortType==1"
                label="联盟成本利率"
                label-width="120px"
            >
                <el-col :span="4">
                    <el-input
                        v-model="extUnionReferPriceCostMargin"
                        @input="preferenceRateInputNew(extUnionReferPriceCostMargin,'extUnionReferPriceCostMargin')"
                    >
                        <span slot="append">%</span>
                    </el-input>
                </el-col>
                <el-col
                    :span="12"
                    class="profitTips"
                >
                    <span>联盟成本利润率 = (联盟参考销售价 - vop结算价) / vop结算价</span>
                </el-col>
            </el-form-item>
            <el-form-item
                v-if="sortType==1"
                label="vop成本利润率"
                label-width="120px"
            >
                <el-col :span="4">
                    <el-input
                        v-model="suggestedPriceCostMargin"
                        @input="preferenceRateInputNew(suggestedPriceCostMargin,'suggestedPriceCostMargin')"
                    >
                        <span slot="append">%</span>
                    </el-input>
                </el-col>
                <el-col
                    :span="12"
                    class="profitTips"
                >
                    <span>vop成本利润率 = (vop建议销售价 - vop结算价) / vop结算价</span>
                </el-col>
            </el-form-item>
            <el-form-item
                v-if="sortType==1"
                label="优惠率"
                prop="preferenceRate"
            >
                <el-col :span="4">
                    <el-input
                        v-model="form.preferenceRate"
                        placeholder="0% - 100%"
                        @input="preferenceRateInput(form.preferenceRate,'preferenceRate')"
                    >
                        <span slot="append">%</span>
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item
                v-if="sortType==1"
                label="平台最低毛利率"
                prop="minGrossProfitRat"
                label-width="130px"
            >
                <el-col :span="4">
                    <el-input
                        v-model="form.minGrossProfitRat"
                        placeholder="0% - 100%"
                        @input="preferenceRateInput(form.minGrossProfitRat,'minGrossProfitRat')"
                    >
                        <span slot="append">%</span>
                    </el-input>
                </el-col>
            </el-form-item>

            <el-form-item
                label="选择分类"
                v-if="sortType==1"
            >
                <span
                    v-for="(item,index) in selectedItem"
                    :key="index"
                >
                    <el-tag
                        type="info"
                        style="margin-right:10px"
                    >{{ item.value }}</el-tag>
                </span>
                <el-button
                    type="primary"
                    @click="(shwClassPop = true)"
                >
                    选择
                </el-button>
            </el-form-item>

            <el-form-item
                v-if="sortType==1"
                label="商品名称"
                prop="skuName"
            >
                <el-col :span="8">
                    <el-input
                        placeholder="请输入您需要搜索的商品名称"
                        maxlength="30"
                        v-model="form.skuName"
                    ></el-input>
                </el-col>
            </el-form-item>
            
            <el-form-item
                label="价格筛选"
                v-if="sortType==1"
            >
                <el-col :span="1.5">
                    结算价区间：
                </el-col>
                <el-col :span="3.5">
                    <el-form-item prop="settlePrice.lower">
                        <el-input
                            placeholder="最低价"
                            v-model="form.settlePrice.lower"
                            @input="priceInput(form.settlePrice.lower,'settlePrice','lower')"
                            @blur="priceBlur(form.settlePrice.lower,'settlePrice','lower')"
                        >
                            <span slot="append">元</span>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="1"
                    style="text-align: center"
                >
                    —
                </el-col>
                <el-col :span="3.5">
                    <el-form-item prop="settlePrice.ceiling">
                        <el-input
                            placeholder="最高价"
                            v-model="form.settlePrice.ceiling"
                            @input="priceInput(form.settlePrice.ceiling,'settlePrice','ceiling')"
                            @blur="priceBlur(form.settlePrice.ceiling,'settlePrice','ceiling')"
                        >
                            <span slot="append">元</span>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item
                v-if="sortType==1"
                label="商品属性"
                prop="attribute"
            >
                <el-checkbox-group v-model="form.attribute">
                    <el-checkbox
                        label="动销商品"
                        @change="changeAttribute"
                    ></el-checkbox>
                    <el-checkbox label="京东物流"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item
                v-if="sortType==1"
                label="排序规则"
                prop="orderRule"
            >
                <el-radio-group v-model="form.orderRule">
                    <el-radio
                        label="按参考毛利率"
                    ></el-radio>
                    <el-radio
                        v-if="showCheck"
                        label="按动销销售数量"
                    ></el-radio>
                    <el-radio
                        v-if="showCheck"
                        label="按动销销售额"
                    ></el-radio>
                </el-radio-group>
            </el-form-item> -->
            <!-- 动销库列表 -->
            <div v-if="sortType=='1'">
                <el-table
                    :data="salesWarehouseList"
                    @current-change="handleCurrentChange"
                    style="width: 100%"
                    height="400"
                >
                    <el-table-column
                        label="请选择动销库"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <div
                                :class="{checked:scope.row.id==salesWarehouseId}"
                                class="selectBox"
                            ></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="动销库ID"
                        min-width="160"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="动销库名称"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="dataSize"
                        label="商品数量"
                        min-width="100"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="动销库描述"
                        min-width="190"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        min-width="160"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="更新时间"
                        min-width="160"
                    >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="50"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.stop="delSalesWarehouse(scope.row)"
                                type="text"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination1">
                    <el-pagination
                        destroy-on-close="true"
                        @size-change="salesWarehousePSizeChange"
                        @current-change="salesWarehouseChangePage"
                        :current-page="salesWarehousePagesVo.currentPage"
                        :page-sizes="salesWarehousePagesVo.pageSizeOpts"
                        :page-size="salesWarehousePagesVo.pageSize"
                        :page-count="salesWarehousePagesVo.pageCount"
                        :total="salesWarehousePagesVo.totalNum"
                        layout="total, prev, pager, next, jumper,sizes"
                    >
                    </el-pagination>
                </div>
            </div>
            

            <!-- 按钮 -->
            <el-row>
                <el-button
                    type="primary"
                    @click="allSubmit"
                >
                    创建任务
                </el-button>
                <el-button
                    type="primary"
                    @click="goExportJobInfoList()"
                >
                    查询任务
                </el-button>
            </el-row>
        </el-form>
        <!-- 爬取任务管理--任务列表 -->
        <el-dialog
            title="任务列表"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :visible.sync="showExportInfoList"
            width="1330px"
            custom-class="adduserdialog"
            center
        >
            <el-table
                :data="exportInfoList"
                style="width: 100%"
                height="400"
            >
                <el-table-column
                    fixed
                    prop="id"
                    label="编号"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="创建人"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="exportTypeName"
                    label="任务类型"
                    width="190"
                >
                </el-table-column>
                <el-table-column
                    prop="dataSize"
                    label="数据规模"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="exportStatusName"
                    label="创建结果"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="exportId"
                    label="采集任务ID"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="salesWarehouseName"
                    label="动销库名称"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="salesWarehouseId"
                    label="动销库ID"
                    min-width="160"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="50"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click.stop="delTaskInfo(scope.row)"
                            type="text"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-pagination
                    destroy-on-close="true"
                    @size-change="pSizeChange"
                    @current-change="changePage"
                    :current-page="pagesVo.currentPage"
                    :page-sizes="pagesVo.pageSizeOpts"
                    :page-size="pagesVo.pageSize"
                    :page-count="pagesVo.pageCount"
                    :total="pagesVo.totalNum"
                    layout="total, prev, pager, next, jumper,sizes"
                >
                </el-pagination>
            </span>
        </el-dialog>
        <!-- 选择分类弹窗 -->
        <el-dialog
            title="选择分类"
            :visible.sync="shwClassPop"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="940px"
        >
            <div class="categoryDom">
                <div class="categoryContent">
                    <ul class="top">
                        <li>一级分类</li>
                        <li>二级分类</li>
                        <li>三级分类</li>
                        <li>品牌</li>
                        <li style="flex:0 0 150px;">
                            已选择<strong class="fold_item_content_box_selecteNum">{{ selectedItem.length }}</strong>项
                        </li>
                    </ul>
                    <div class="bottom">
                        <div class="left">
                            <!-- 级联 -->
                            <el-cascader-panel
                                style="width:750px"
                                :props="props"
                                v-model="categorySelected"
                                ref="cascaderAddr"
                                @change="changeCasFun_1"
                            >
                                <template slot-scope="{ node, data }">
                                    <el-popover
                                        placement="top-start"
                                        title="更新分类"
                                        width="200"
                                        trigger="hover"
                                    >
                                        <div
                                            class="updateHover"
                                        >
                                            <div>
                                                <span>更新时间：</span>
                                                <span>{{ data.updateTime }}</span>
                                            </div>
                                            <div>更新状态：{{ data.categoryStatusName }}</div>
                                            <el-button
                                                icon="el-icon-refresh"
                                                type="primary"
                                                @click="updateCate(data.catId,node.level)"
                                            >
                                                点击更新
                                            </el-button>
                                        </div>
                                        <i
                                            v-if="node.level<4"
                                            class="el-icon-refresh"
                                            slot="reference"
                                        ></i>
                                    </el-popover>
                                    <span>{{ data.label }}</span>
                                    <span v-if="!node.isLeaf"> {{ data.name }} </span>
                                </template>
                            </el-cascader-panel>
                        </div>
                        <div class="right">
                            <!-- 右侧已选 -->
                            <div
                                style="width:100%"
                            >
                                <div>
                                    <ul
                                      
                                        style="height:260px;overflow-y: scroll;"
                                    >
                                        <li
                                            class="fold_item_selected_item"
                                            v-for="(item, index) in selectedItem"
                                            :key="index"
                                            :class="{ checkedStyle: item.checked }"
                                        >
                                            {{ item.value }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 创建动销库弹框 -->
        <el-dialog
            title="提示"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :visible.sync="showCreateDialogFlag"
            width="500px"
            center
        >
            <div class="create_dialog">
                <div class="top">
                    <div>
                        <span>动销库名称<span>*</span></span>
                        <el-input
                            type="text"
                            maxlength="-1"
                            v-model="createObj.name"
                        >
                        </el-input>
                    </div>
                    <div>
                        <span>动销库描述</span>
                        <el-input
                            type="text"
                            maxlength="-1"
                            v-model="createObj.description"
                        >
                        </el-input>
                    </div>
                </div>
                <div class="bottom">
                    <el-button
                        type="primary"
                        @click="createSalesWarehouse"
                    >
                        保存
                    </el-button>
                    <el-button
                        @click="closeCreateDialog"
                    >
                        取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            exportInfoList:[],//任务列表
            showExportInfoList:false,
            sortType:'1', //查询依据
            sortOptions:[ //查询依据
                {value:'1',label:'根据动销库爬取'},
                {value:'2',label:'根据SKU爬取'}
            ],
            skuListValue:'',
            skuListfilter:[],
            jobSortType:'NOW', //任务调度类型
            jobSortOptions:[ //任务调度类型
                {value:'NOW',label:'插队执行'},
                {value:'LIST',label:'排队执行'}
            ],
            maxTimes:1, //任务重复次数
            maxLimitTimes:400, //任务重复次数最大上限
            allJobQueryType:[ //所有查询类型
                {name:'爬取京东价格信息(到手价)',value:'PRICE'},
                {name:'爬取京东商品信息(评论数)',value:'COMMENT_NUM'}
            ],
            checkedJobQueryType:['PRICE'], //选中的查询类型
            extUnionReferPriceCostMargin:'',
            suggestedPriceCostMargin:'',
            exportJobIntervalDay:1,
            exportJobWaitTime:'',
            form: {//表单数据
                preferenceRate: '',//优惠率
                minGrossProfitRat: '',//平台最低毛利率               
                skuName: '',//商品名称
                settlePrice:{//结算价格
                    ceiling:'',
                    lower:''
                },
                attribute: [],//商品属性
                orderRule: ''//排序规则
            },
            showCheck:false,//动销商品排序规则开关
            pagesVo:{ //务列表分页参数
                pageSize: 10, 
                currentPage: 1,
                pageCount:0,
                pageSizeOpts: [5, 10, 20, 50, 100],
                totalNum:0
            },
            shwClassPop:false,//显示分类弹窗
            categotyFilter:[],//分类筛选
            categoryParam:{},// 分类参数集合
            categorySelected: [], //已选中分类信息
            selectedItem:[],//右侧展示一级分类信息
            categoryList1:[],//一级类目
            props:{// 级联设置参数
                value:"catId",
                label:"name",
                multiple:true,
                checkStrictly :true,
                leaf: "leaf",
                lazy: true,
                lazyLoad:this.lazyLoadFun
            },
            attributeEnum:[// 属性集合
                {name:"联盟商品",param:"extUnionState"},
                {name:"动销商品",param:"extPromotion"},
                {name:"京东物流",param:"jdDelivery"},
                {name:"包邮",param:"freeDelivery"}
            ],
            orderRuleEnum:[// 排序规则集合
                {name:"按动销销售数量",param:"orderByIsPromotionSalesDesc"},
                {name:"按动销销售额",param:"orderByIsPromotionPriceDesc"},
                {name:"按参考毛利率",param:"orderByIsVopPriceProfitsPercentDesc"}
                
            ],
            salesWarehouseId:'', //选中的动销库id
            salesWarehouseList:[], //动销库列表
            salesWarehousePagesVo:{ //动销库列表分页参数
                pageSize: 10, 
                currentPage: 1,
                pageCount:0,
                pageSizeOpts: [5, 10, 20, 50, 100],
                totalNum:0
            },
            createObj:{ //创建动销库条件
                name:'',
                description:''
            },
            showCreateDialogFlag:false //是否显示创建动销库弹框
        };
    },
    
    components: {},
    props: {},
    watch:{
        jobSortType(val) {
            this.maxLimitTimes = val == 'NOW'?400:40
        },
        // 分类路径
        categorySelected:{
            handler(){
                //遍历源数据构建入参
                this.categotyFilter = []
                let tempList = []
                // 构建右侧item
                // 1、获取所有分类路径的id1
                let tmp = this.categorySelected.map((item) => {
                    return item[0]
                })
                // 2、去除重复的id1
                let tempMap = new Map()
                tmp.forEach((item) => {
                    tempMap.set(item,'')
                })
                // 3、因为路径中只有id没有name,添加对应的name
                this.categoryList1.forEach((item)=>{
                    if (tempMap.has(item.catId)){
                        tempMap.set(item.catId,item.name)
                    }
                })
                // 4、构建右侧item 构建过滤条件
                tempMap.forEach((dataItem,key) => {
                    tempList.push({value:dataItem,key:key})
                    this.categotyFilter.push({type:'categoty',name:dataItem})
                })
                this.selectedItem = tempList
                // 构建参数
                this.categoryParam = {category:[]}
                this.categorySelected.forEach((item) => {
                    this.categoryParam.category.push({
                        categoryId1:item[0]==undefined?'':item[0],
                        categoryId2:item[1]==undefined?'':item[1],
                        categoryId3:item[2]==undefined?'':item[2],
                        brand:item[3]==undefined?'':item[3]
                    })
                })
            },
            deep:true
        } 
    },
    mounted(){
        this.getSalesWarehouseList()
    },
        
    
    methods: {
        //列表页码变化
        changePage(page) {
            this.pagesVo.currentPage = page;
            this.goExportJobInfoList();
        },
        //列表每页显示条数变化
        pSizeChange(pSize) {
            this.pagesVo.pageSize = pSize;
            this.pagesVo.currentPage = 1;
            this.goExportJobInfoList();
        },
        //列表页码变化
        salesWarehouseChangePage(page) {
            this.salesWarehousePagesVo.currentPage = page;
            this.getSalesWarehouseList();
        },
        //列表每页显示条数变化
        salesWarehousePSizeChange(pSize) {
            this.salesWarehousePagesVo.pageSize = pSize;
            this.salesWarehousePagesVo.currentPage = 1;
            this.getSalesWarehouseList();
        },
        // 爬取任务管理-查询任务状态
        goExportJobInfoList() {
            let param = {
                pageNum:this.pagesVo.currentPage,
                pageSize:this.pagesVo.pageSize
            }
            this.$iLoading.show();
            producthandler.getExportJobInfoList(param).then((res) => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0){
                    this.exportInfoList = res.result.pageVO.records
                    this.pagesVo.totalNum = res.result.pageVO.count

                    this.showExportInfoList = true
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 删除任务
        delTaskInfo(info) {
            if (!info.id) {
                return
            }
            let params = {
                exportInfoIds:[info.id]
            }
            producthandler.removeInfoList(params).then((res) => {
                if (!!res.result && !!res.result.ids && !!res.result.ids.length>0 && res.resultCode == 0){
                    utils.showToast('删除成功');
                    this.pagesVo.pageSize = 10;
                    this.pagesVo.currentPage = 1;
                    this.goExportJobInfoList();
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                
            });
            
        },
        resetSku() {
            this.skuListValue = '';
            this.skuListfilter = [];
        },
        // 所有类型的提交
        allSubmit() {
            if (this.sortType == 2) {
                this.searchLowestPBySku()
            } else {
                this.onSubmit()
            }
        },
        // 根据‘sku’创建任务
        searchLowestPBySku() {
            this.skuListValue.trim().split(',').forEach((item)=>{
                if (item!=''){
                    this.skuListfilter.push(item.trim());
                }
            })
            let params = {
                skuList:this.skuListfilter,
                jobSchedulingType:this.jobSortType,
                maxTimes:this.maxTimes,
                exportJobIntervalDay:this.exportJobIntervalDay
            }
            if (this.checkedJobQueryType) {
                params.jobQueryTypes = this.checkedJobQueryType
            }
            if (this.extUnionReferPriceCostMargin) {
                params.extUnionReferPriceCostMargin = parseFloat(this.extUnionReferPriceCostMargin)
            }
            if (this.suggestedPriceCostMargin) {
                params.suggestedPriceCostMargin = parseFloat(this.suggestedPriceCostMargin)
            }
            if (this.exportJobWaitTime) {
                params.exportJobWaitTime = this.exportJobWaitTime
            }
            if (this.skuListfilter.length == 0) {
                utils.showToast('sku列表不能为空');
                return
            }
            this.$iLoading.show();
            producthandler.getLowestPriceBySku(params).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    utils.showToast(`请求正在执行中，jobId:${res.result.exportFlag}`);
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 根据‘选品条件’创建任务
        // onSubmit() {
        //     let params = {
        //         activityType:'ZUI_DI_JIA'
        //     }
        //     params = Object.assign(params,this.categoryParam,this.form)
        //     for (let key in params){
        //         // 属性为空进行删除
        //         if (params[key] === null || params[key] === undefined || params[key] === '' || params[key].length === 0 || params[key] === [] || JSON.stringify(params[key]) === "{}"){
        //             delete params[key]
        //         } else if (key == 'settlePrice'){
        //             let count = 0
        //             for (const i in params[key]) {
        //                 // eslint-disable-next-line no-prototype-builtins
        //                 if (params[key].hasOwnProperty(i)) {
        //                     if (params[key][i] === null || params[key][i] === undefined || params[key][i] === '' || JSON.stringify(params[key][i]) === "{}") {
        //                         count++
        //                     }
        //                 }
        //             }
        //             count==2 && delete params[key]
        //         } else if (key == 'attribute'){
        //             params[key].forEach((item) => {
        //                 let list = this.attributeEnum.filter((item1) => {
        //                     return item1.name == item
        //                 })
        //                 list.length > 0 && (params[list[0].param] = 1)
        //             })
        //             delete params[key]
        //         } else if (key == 'orderRule'){
        //             let list = this.orderRuleEnum.filter((item)=>{
        //                 return item.name == params[key]
        //             })
        //             list.length>0 && (params[list[0].param] = true)
        //             delete params[key]
        //         }
        //     }
        //     let param = {}
        //     param = {
        //         searchPoolRequest:{},
        //         jobSchedulingType:this.jobSortType,
        //         maxTimes:this.maxTimes,
        //         exportJobIntervalDay:this.exportJobIntervalDay
        //     }
        //     if (this.checkedJobQueryType) {
        //         param.jobQueryTypes = this.checkedJobQueryType
        //     }
        //     if (this.extUnionReferPriceCostMargin) {
        //         param.extUnionReferPriceCostMargin = parseFloat(this.extUnionReferPriceCostMargin)
        //     }
        //     if (this.suggestedPriceCostMargin) {
        //         param.suggestedPriceCostMargin = parseFloat(this.suggestedPriceCostMargin)
        //     }
        //     if (this.exportJobWaitTime) {
        //         param.exportJobWaitTime = this.exportJobWaitTime
        //     }
        //     JSON.stringify(params) != "{}" && (param.searchPoolRequest = params)
        //     // 保存搜索参数
        //     this.$iLoading.show();
        //     producthandler.getLowestPrice(param).then((res) => {
        //         this.$iLoading.hide();
        //         if (!!res.result && res.resultCode == 0){
        //             utils.showToast(`请求正在执行中，jobId:${res.result.exportFlag}`);
                    
        //         } else {
        //             this.$message(res.resultMessage)
        //         }
        //     }).catch(() => {
        //         this.$iLoading.hide();
        //     });
        // },
        // 根据‘动销库’创建任务
        onSubmit() {
            let param = {}
            param = {
                jobSchedulingType:this.jobSortType,
                maxTimes:this.maxTimes,
                exportJobIntervalDay:this.exportJobIntervalDay
            }
            if (this.checkedJobQueryType) {
                param.jobQueryTypes = this.checkedJobQueryType
            }
            if (this.exportJobWaitTime) {
                param.exportJobWaitTime = this.exportJobWaitTime
            }
            if (this.salesWarehouseId) {
                param.salesWarehouseId = [this.salesWarehouseId]
            }
            // 保存搜索参数
            this.$iLoading.show();
            producthandler.exportSalesWarehouse(param).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    utils.showToast(`请求正在执行中，jobId:${res.result.exportFlag}`);
                    
                } else {
                    this.$message(res.resultMessage)
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 获取动销库列表
        getSalesWarehouseList() {
            let param = {
                pageNum:this.salesWarehousePagesVo.currentPage,
                pageSize:this.salesWarehousePagesVo.pageSize
            }
            producthandler.getSalesWarehouseList(param).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    this.salesWarehouseList = res.result.pageVO.records;
                    this.salesWarehousePagesVo.totalNum = res.result.pageVO.count
                    
                } else {
                    this.$message(res.resultMessage)
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 删除指定动销库
        delSalesWarehouse(info) {
            if (!info.id) {
                return
            }
            let params = {
                ids:[info.id]
            }
            producthandler.delSalesWarehouse(params).then((res) => {
                if (!!res.result && !!res.result.ids && !!res.result.ids.length>0 && res.resultCode == 0){
                    utils.showToast('删除成功');
                    this.salesWarehousePagesVo.pageSize = 10;
                    this.salesWarehousePagesVo.currentPage = 1;
                    this.getSalesWarehouseList();
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                
            });
            
        },
        // 创建动销库
        createSalesWarehouse() {
            this.skuListValue.trim().split(',').forEach((item)=>{
                if (item!=''){
                    this.skuListfilter.push(item.trim());
                }
            })
            let params = {
                skus:this.skuListfilter,
                name:this.createObj.name,
                description:this.createObj.description
            }
            producthandler.createSalesWarehouse(params).then((res) => {
                if (!!res.result && res.resultCode == 0){
                    utils.showToast('创建成功');
                    this.showCreateDialogFlag = false
                    this.salesWarehousePagesVo.pageSize = 10;
                    this.salesWarehousePagesVo.currentPage = 1;
                    this.getSalesWarehouseList();
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                
            });
        },
        // 显示创建动销库弹框
        showCreateDialog() {
            this.showCreateDialogFlag = true
        },
        // 关闭创建动销库弹框
        closeCreateDialog() {
            this.showCreateDialogFlag = false
        },
        // 单选动销库
        handleCurrentChange(val) {
            this.salesWarehouseId = val.id
        },
        updateCate(id,level) {
            let params = {
                categoryId:id,
                categoryLevel:level
            }
            producthandler.updateCategory(params).then((res) => {
                if (!!res.result && res.resultCode == 0){
                    utils.showToast(`开始更新类目`);
                } else {
                    utils.showToast(res.resultMessage);
                }
            }).catch(() => {
                
            });
        },
        // 优惠率校验\平台最毛利率校验规则
        preferenceRateInput(value,type){
            this.form[type] = value.replace(/[^\d.]/g, "").replace(/^0\d+|^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\d+)\.(\d\d).*$/, "$1.$2")
            this.form[type] = this.form[type] > 100 ? 100 : this.form[type]
        },
        preferenceRateInputNew(value,type) {
            let val = value.replace(/[^\d.]/g, "").replace(/^0\d+|^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\d+)\.(\d\d).*$/, "$1.$2")
            if (type == 'extUnionReferPriceCostMargin') {
                this.extUnionReferPriceCostMargin = val
            } else if (type == 'suggestedPriceCostMargin') {
                this.suggestedPriceCostMargin = val
            }
        },
        // 修改商品属性
        changeAttribute(val){
            this.showCheck = val ? true:false
            this.form.orderRule = this.form.orderRule == '按参考毛利率' ? this.form.orderRule : []
        },
        // 价格校验规则
        priceInput(value,type,param){
            this.form[type][param] = value.replace(/[^\d]/g, "").replace(/^0\d+|^\./g, "")
            this.form[type][param] = this.form[type][param] > 10000000 ? 10000000 : this.form[type][param]
        },
        // 价格校验取值区间规则
        priceBlur(value,type,param){
            if (param == 'lower' && this.form[type].ceiling!="" ){
                this.form[type].lower = parseInt(this.form[type].lower) > parseInt(this.form[type].ceiling)?this.form[type].ceiling:this.form[type].lower
            }
            if (param == 'ceiling' && this.form[type].lower!="" ){
                this.form[type].ceiling = parseInt(this.form[type].ceiling) < parseInt(this.form[type].lower)?this.form[type].lower:this.form[type].ceiling
            }
        },
        // 分类接口
        changeCasFun_1(){
            let nodeInfo = this.$refs.cascaderAddr.getCheckedNodes()
            nodeInfo && nodeInfo.forEach((item,index) => {
                if (item.path.length==4){
                    this.categorySelected[index][3] = item.label
                }
            })
        },
        // 分类加载
        lazyLoadFun(node, resolve){
            const { level } = node;
            const requestParam = {};
            if (level === 0){
                requestParam.cid = 0
                requestParam.level = level
            } else {
                requestParam.cid = node.value
                requestParam.level = level
            }
            if (level === 4){
                return
            }
            let result = []
            producthandler.getCategoryList(requestParam).then((res) => {
                if (level == 0){
                    this.categoryList1 = res.result.categoryResultList
                    result = res.result.categoryResultList
                    result = result.map((data) => {
                        return {catId:data.catId,name:data.name,leaf:false,categoryStatusName:data.categoryStatusName,updateTime:data.updateTime}
                    })
                } else if (level > 0 && level < 3){
                    result = res.result.categoryResultList
                    result = result.map((data) => {
                        return {catId:data.catId,name:data.name,leaf:false,categoryStatusName:data.categoryStatusName,updateTime:data.updateTime}
                    })
                } else if (level == 3 ){
                    result = res.result.brandList
                    result = result.map((brand,index) => {
                        return {catId:index,name:brand,leaf:false}
                    })
                }
                resolve(result)
            })
        }
    }
}
</script>

<style scoped lang="less">
/deep/.el-dialog__body {
    width: 100%;
    padding: 25px 25px 0;
}
/deep/.el-dialog{
    display: block;
}
/deep/ .el-dialog__footer {
    padding-right: 0;
    text-align: right;
}
/deep/.el-cascader-panel.is-bordered div:last-child {
    color: #666 !important;
    .el-cascader-menu__wrap{
            height: 260px;
        .el-cascader-node li{
            display: none !important;
        }
    }

}
/deep/.el-cascader-menu {
    width: calc(~'25% + 1px') !important;
    border-right:1px solid #909399;
    .el-cascader-menu__wrap{
        margin-right: 0px !important;
        margin-bottom: 0px !important;
        height: 260px !important;
    }
    .el-scrollbar__thumb{
        height: 0px !important;
    }
}
.updateHover {
    .el-button {
        margin-top: 10px !important;
        padding: 6px 10px;
        font-size: 10px !important;
    }
}
.crawl_data_box {
    padding: 20px;
    .skuListBox {
        display: flex;
        align-items: center;
        .el-button {
            margin-left: 10px;
            height: 30px;
            padding: 2px 10px;
        }

    }
    .profitTips {
        padding-left: 20px;
    }
    .categoryDom{
        display: flex;
        .categoryContent{
            width: 100%;
            .top{
                display: flex;
                justify-content: center;
                li{
                    flex:1;
                    height: 45px;
                    padding: 0 0.05rem;
                    line-height: 45px;
                    border: 1px solid #909399;
                    margin-top: -1px;
                    margin-left: -1px;
                }
            }
            .bottom{
                display: flex;
                width: 100%;
                .left{
                    border: 1px solid #909399;
                    margin-top: -1px;
                    margin-left: -1px;
                    .checkAll{
                        width: 100%;
                        display: flex;
                        margin-left: 25%;
                        height: 25px;
                        .checkBox{
                            width: 25%;
                            height: 25px;
                            line-height: 25px;
                            .el-checkbox{
                                margin-left: 0px !important;
                            }
                        }
                    }
                }
                .right{
                    flex:0 0 150px;
                    border: 1px solid #909399;
                    margin-top: -1px;
                    margin-left: -1px;
                    position: relative;
                    &::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: -35px;
                        width: 33px;
                        height: 100%;
                        background-color: #fff;
                    }

                }
                .fold_item_selected_item{
                    padding: 3px 10px;
                }

            }
        }

    }
}
.pagination1 {
    text-align: right;
    margin-top: 10px;
}
.create_dialog {
    .top {
        >div {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            >span {
                width: 100px;
                span {
                    color: #f30300;
                }
            }
            .el-input {
                width: 300px;
            }
        }
    }
    .bottom {
        padding: 0px 0 20px;
        text-align: center;
    }
}
.selectBox {
    position: relative;
    width:14px;
    height: 14px;
    border-radius: 50%;
    border:1px solid #DCDFE6;
    cursor: pointer;
    
    &.checked {
        border-color: #409EFF;
        background: #409EFF;
        &::before {
            display: block;
            content: '';
            width: 4px;
            height: 4px;
            border-radius: 100%;
            background-color: #FFF;
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
    
</style>

