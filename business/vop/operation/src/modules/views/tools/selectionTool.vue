<template>
    <!-- 活动页 -->
    <div
        v-if="showInit"
        class="promotionDom"
    >
        <block
            v-for="(item,index) in promotionData"
            :key="index"
        >
            <el-button
                @click="goPromotionSearch(item)"
                class="promotionTable"
            >
                {{ item.name }}
            </el-button>
        </block>
    </div>
    <!-- 落地页 -->
    <div
        v-else
        class="container"
    >
        <!-- tips -->
        <div
            class="tip_dom"
        >
            <span class="title">解释说明:</span>
            <ul
                v-for="(item,index) in tips"
                :key="index"
            >
                <li>
                    <span style="color:#F56C6C">{{ item.name }}</span>：{{ item.value }}
                </li>
            </ul>
        </div>
        <!-- 表单区域 -->
        <el-form
            ref="form"
            :rules="rules"
            :model="form"
            label-width="80px"
            label-position="left"
            :style="{paddingBottom:'20px'}"
        >
            <el-form-item
                v-if="currentPromotion.type!=4"
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
                v-if="currentPromotion.type==4"
                label="折让率"
                prop="disType"
            >
                <el-radio-group
                    v-model="form.disType"
                    @change="changeDiscount"
                >
                    <el-row>
                        <el-radio
                            label="1"
                            style="margin-bottom:20px"
                        >
                            <span>折让一:</span>
                            <span>满</span>
                            <el-input
                                :disabled="form.disType != 1"
                                v-model="disList[0].sum"
                                style="width:70px;"
                                maxlength="3"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            ></el-input>
                            <span>件</span>
                            <el-input
                                :disabled="form.disType != 1"
                                v-model="disList[0].discount"
                                style="width:70px;"
                                maxlength="2"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                @blur="discountBlur(disList[0].discount,'0','discount')"
                            ></el-input>
                            <span>折</span>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio label="2">
                            <span>折让二:</span>
                            <span>满</span>
                            <el-input
                                :disabled="form.disType != 2"
                                v-model="disList[1].sum"
                                style="width:70px;"
                                maxlength="3"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            ></el-input>
                            <span>件</span>
                            <el-input
                                :disabled="form.disType != 2"
                                v-model="disList[1].discount"
                                maxlength="2"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                @blur="discountBlur(disList[1].discount,'1','discount')"
                                style="width:70px;"
                            ></el-input>
                            <span>折</span>
                            <span>满</span>
                            <el-input
                                :disabled="form.disType != 2"
                                v-model="disList[2].sum"
                                style="width:70px;"
                                maxlength="3"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            ></el-input>
                            <span>件</span>
                            <el-input
                                :disabled="form.disType != 2"
                                v-model="disList[2].discount"
                                maxlength="2"
                                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                                @blur="discountBlur(disList[2].discount,'2','discount')"
                                style="width:70px;"
                            ></el-input>
                            <span>折</span>
                        </el-radio>
                    </el-row>
                </el-radio-group>
                <div style="color: rgba(0,0,0,.45)">
                    优惠折扣，满足优惠门槛后可以享受该优惠折扣，例如：输入90代表9折
                </div>
            </el-form-item>
            <el-form-item
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

            <el-form-item label="选择分类">
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
            
            <el-form-item label="价格筛选">
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
                label="商品属性"
                prop="attribute"
            >
                <el-checkbox-group v-model="form.attribute">
                    <el-checkbox
                        label="动销商品"
                        @change="changeAttribute"
                    ></el-checkbox>
                    <el-checkbox label="京东物流"></el-checkbox>
                    <el-checkbox
                        v-if="currentPromotion.type == 2"
                        label="京东自营"
                    ></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item
                label="排序规则"
                prop="orderRule"
            >
                <el-radio-group v-model="form.orderRule">
                    <el-radio
                        v-if="showCheck"
                        label="按动销销售数量"
                    ></el-radio>
                    <el-radio
                        v-if="showCheck"
                        label="按动销销售额"
                    ></el-radio>
                    <el-radio
                        v-if="currentPromotion.type != 4"
                        label="按参考毛利率"
                    ></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row>
                <el-button
                    type="primary"
                    @click="allSubmit"
                >
                    查询
                </el-button>
                <el-button
                    @click="resetForm"
                >
                    重置
                </el-button>
            </el-row>
        </el-form>
        <!-- 导出 -->
        <div class="exportDataDom">
            <div class="tips">
                已选中:{{ multipleSelection.length }}个
            </div>
            <el-button
                @click="exportSkuInfoBySkuList"
                type="primary"
            >
                导出选中商品
            </el-button>
            <el-button
                @click="goExportSkuInfo"
                type="primary"
            >
                全部导出
            </el-button>
            <el-button
                @click="goExportInfoList(true)"
                type="primary"
            >
                查看导出任务
            </el-button>
        </div>
        <!-- 选品工具 -- 查询列表 -->
        <div class="servicListDom">
            <el-table
                stripe
                fit
                id="cal-table"
                class="list-table"
                :data="selectionPoolList"
                :highlight-current-row="true"
                :header-cell-style="{ background: '#f2f2f2' }"
                max-height="500px"
                style="width: 100%;border: 1px solid #ebeef5;border-bottom: 0;"
                @selection-change="handleSelectionChange"
                :row-key="getRowKey"
                ref="multipleTable"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="true" 
                    :selectable="disCheck"
                >
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="SKU分类"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="brand"
                    label="品牌"
                    min-width="90"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="sku"
                    label="SKU ID"
                    min-width="90"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="skuName"
                    label="SKU名称"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="settlePrice"
                    label="结算价"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="suggestedPrice"
                    label="VOP建议零售价"
                    min-width="130"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="extUnionReferPrice"
                    label="联盟参考价"
                    min-width="90"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="rulePrice"
                    label="门市价"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="activitiesPrice"
                    :label="`${currentPromotion.name}销售价`"
                    min-width="120"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    v-if="currentPromotion.type!=4"
                    prop="preferenceRate"
                    label="优惠率(%)"
                    min-width="100"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="grossProfitRat"
                    label="优惠后毛利率(%)"
                    min-width="130"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    v-if="currentPromotion.type==4"
                    prop="fullDiscountPrice[0].fullPrice"
                    label="满M件X折后价格"
                    min-width="130"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="extExpressFee"
                    label="邮费"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="extProductArea"
                    label="产地"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="extIsSelf"
                    label="京东自营"
                    :formatter="formatBoolean"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                    prop="extIsFactoryShip"
                    label="厂直商品"
                    min-width="130"
                    :formatter="formatBoolean"
                    :show-overflow-tooltip="true"
                >
                </el-table-column>
            </el-table>
            <div class="pages">
                <el-pagination
                    background
                    v-show="count>0"
                    :current-page="currentPage"
                    @size-change="changePageSize"
                    @current-change="changePageNum"
                    prev-text="上一页"
                    next-text="下一页"
                    :page-sizes="[10,30,50,100]"
                    :page-size="pageSize"
                    layout=" prev, pager, next, jumper,sizes"
                    :total="count"
                >
                </el-pagination>
            </div>
        </div>
        <!-- 选品工具 -- 任务列表 -->
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
                    label="id"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="创建用户名称"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="exportStatusName"
                    label="导出状态"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="exportTypeName"
                    label="导出类型"
                    width="190"
                >
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="修改时间"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="dataSize"
                    label="数据规模"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    min-width="50"
                >
                    <template slot-scope="scope">
                        <el-button
                            :disabled="!scope.row.disable"
                            @click.stop="viewMoreInfo(scope.row)"
                            type="text"
                        >
                            下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-pagination
                    background
                    :current-page="listCurrentPage"
                    destroy-on-close="true"
                    @current-change="changeListPageSize"
                    @size-change="changeListPageNum"
                    :total="listTotal"
                    prev-text="上一页"
                    next-text="下一页"
                    :page-sizes="[10,30,50,100]"
                    :page-size="listpageSize"
                    layout=" prev, pager, next, jumper,sizes"
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
        
    </div>
</template>

<script>
import producthandler from "bislibs/requestHandler/producthandler";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            promotionData:[// 活动枚举数据
                {type:'1',value:'checkSale',name:'查询可售性'},
                {type:'1',value:'realTimeSearch',name:'实时搜索'},
                {type:'1',value:'jdAcquireModule',name:'京东数据采集管理'},
                {type:'1',value:'seckill',name:'秒杀'},
                {type:'1',value:'ecbuy',name:'一起买'},
                {type:'1',value:'dayday',name:'天天专场'},
                {type:'2',value:'emaoqing',name:'鹅毛情'},
                {type:'3',value:'festival',name:'节日专场'},
                {type:'4',value:'discount',name:'满减专场'}
            ],
            activityType:{
                'seckill':'MIAO_SHA',
                'ecbuy':'YI_QI_MAI',
                'dayday':'TIAN_TAIN_ZHUAN_CHANG',
                'emaoqing':'E_MAO_QIANG',
                'festival':'JIE_RI_ZHUAN_CHANG',
                'discount':'MAN_JIAN_ZHUAN_CHANG'
            },//活动枚举
            currentPromotion:'',//当前活动数据
            showInit:true,//是否显示选品工具初始页
            searchParam:{},//搜索条件
            multipleSelection:[],//选中导出的商品列表
            showCheck:false,//动销商品排序规则开关
            disList:[//折让率数据
                {discount:'',sum:''},
                {discount:'',sum:''},
                {discount:'',sum:''}
            ],
            form: {//表单数据
                preferenceRate: '',//优惠率
                minGrossProfitRat: '',//平台最低毛利率
                disType:'',//折让方式                
                skuName: '',//商品名称
                settlePrice:{//结算价格
                    ceiling:'',
                    lower:''
                },
                attribute: [],//商品属性
                orderRule: ''//排序规则
            },
            shwClassPop:false,//显示分类弹窗
            count:0,//总条数
            categotyFilter:[],//分类筛选
            categoryParam:{},// 分类参数集合
            categorySelected: [], //已选中分类信息
            selectedItem:[],//右侧展示一级分类信息
            categoryList1:[],//一级类目
            tips:[
                {name:"门市价（兆日销售价）",value:"定价规则计算的价格。在JD供应商结算价的基础上，由我们自己的定价规则，根据定价规则的溢出率、定价规则的优惠率、JD供应商的建议销售价、JD联盟的参考价综合计算的价格。"},
                {name:"活动销售",value:"例如秒杀销售价、一起买销售价，即参与活动时销售的价格。"},
                {name:"优惠率",value:"相对于门市价，活动销售时降价的频率。"},
                {name:"优惠率",value:"（门市价-活动销售价）/门市价*100%"},
                {name:"平台最低毛利率",value:"商品销售后，相对于JD供应商结算价，商品出售产生的利润率。"},
                {name:"平台最低毛利率",value:"（活动销售价-结算价）/结算价*100%"}
            ],
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
            pageNum:1,
            pageSize:30,
            currentPage:1,
            listpageSize:10,
            listPageNum:1,
            listPageSize:10,
            listTotal:0,
            listCurrentPage:1,
            selectionPoolList:[], // 选品结果列表
            exportInfoList:[],//任务列表
            showExportInfoList:false,
            radio: '0'
        };
    },
    components: {},
    watch:{
        $route(to){
            this.showInit = to.path == '/tools/selectionTool' ? true : false
            // 页面切换 充值数据
            this.resetForm()
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
        this.initPromotionType()
        
    },
    methods: {
        viewMoreInfo(info) {
            this.goExportFileListByInfoId(info)
            
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
        // 格式化布尔变量
        formatBoolean: function (row, column, cellValue) {
            var ret = ''
            if (cellValue) {
                ret = "是" //根据自己的需求设定
            } else {
                ret = "否"
            }
            return ret;
        },
        // 重构promotionType
        initPromotionType(){
            let path = this.$route.path.split('/').pop()
            this.showInit = path == 'selectionTool' ? true : false
            this.currentPromotion = this.promotionData.filter((item)=>{
                return item.value == path
            })[0]
        },
        // 路由跳转
        goPromotionSearch(data){
            this.$router.push({path: `/tools/selectionTool/${data.value}`});
            this.currentPromotion = data
        },
        // 优惠率校验\平台最毛利率校验规则
        preferenceRateInput(value,type){
            this.form[type] = value.replace(/[^\d.]/g, "").replace(/^0\d+|^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\d+)\.(\d\d).*$/, "$1.$2")
            this.form[type] = this.form[type] > 100 ? 100 : this.form[type]
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
        // 折扣
        discountBlur(value,index,param){
            if (value < 50){
                this.disList[index][param] = 50
            }
        },
        // 修改折扣
        changeDiscount(){
            if (this.form.disType != 1){
                this.disList[0].discount = ''
                this.disList[0].sum = ''
            } else {
                this.disList[1].discount = ''
                this.disList[1].sum = ''
                this.disList[2].discount = ''
                this.disList[2].sum = ''
            }
        },
        getRowKey(row) {
            return row.sku;
        },
        // 导出选中列表sku
        handleSelectionChange(val) {
            this.multipleSelection = val.map((item)=>{
                return item.sku
            });
        },
        // 所有类型的提交
        allSubmit(flag) {
            this.onSubmit(flag)
        },

        // 查询接口
        onSubmit(flag) {
            let params = {
                activityType:this.activityType[this.currentPromotion.value]
            }
            params = Object.assign(params,this.categoryParam,this.form)
            for (let key in params){
                // 属性为空进行删除
                if (params[key] === null || params[key] === undefined || params[key] === '' || params[key].length === 0 || params[key] === [] || JSON.stringify(params[key]) === "{}"){
                    delete params[key]
                } else if (key == 'settlePrice'){
                    let count = 0
                    for (const i in params[key]) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (params[key].hasOwnProperty(i)) {
                            if (params[key][i] === null || params[key][i] === undefined || params[key][i] === '' || JSON.stringify(params[key][i]) === "{}") {
                                count++
                            }
                        }
                    }
                    count==2 && delete params[key]
                } else if (key == 'attribute'){
                    params[key].forEach((item) => {
                        let list = this.attributeEnum.filter((item1) => {
                            return item1.name == item
                        })
                        list.length > 0 && (params[list[0].param] = 1)
                    })
                    delete params[key]
                } else if (key == 'orderRule'){
                    let list = this.orderRuleEnum.filter((item)=>{
                        return item.name == params[key]
                    })
                    list.length>0 && (params[list[0].param] = true)
                    delete params[key]
                } else if (key == 'disType'){
                    //这让方式
                    let list = this.disList.filter((item)=>{
                        return item.discount && item.sum
                    })
                    list.length>0 && (params["fullDiscountList"] = list)
                    delete params[key]
                }
            }
            let param = {
                pageVO:{}
            }
            this.currentPage = flag?1:this.currentPage
            param.pageVO.pageNum = this.currentPage
            param.pageVO.pageSize = this.pageSize
            JSON.stringify(params) != "{}" && (param.pageVO.params = params)
            // 保存搜索参数
            this.searchParam = params
            this.$iLoading.show();
            producthandler.getSelectionPool(param).then((res) => {
                this.$iLoading.hide();
                if (!!res.result && res.resultCode == 0){
                    this.selectionPoolList = res.result.pageVO.records
                    this.count = res.result.pageVO.count //总条数
                } else {
                    this.$message(res.resultMessage)
                }
                if (this.count<30){
                    this.$confirm('抱歉，搜索的相关内容较少建议您：<br>1.适当减少筛选条件<br>2.调整价格区间<br>3.尝试其他关键字<br>', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    })
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },

        // 重置表单数据
        resetForm() {
            this.initdata()
        },
        // 初始化数据
        initdata(){
            this.pageSize = 30;
            this.pageNum = 1
            this.currentPage = 1;
            this.selectionPoolList = []
            this.count = 0 //总条数
            this.multipleSelection = []
            this.showCheck = false
            this.categorySelected = []
            this.categoryParam = {}
            this.disList = [
                {discount:'',sum:''},
                {discount:'',sum:''},
                {discount:'',sum:''}
            ];
            this.skuListValue = '';
            this.skuListfilter = [];


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
        },

        changePageNum(value){
            this.currentPage = value;
            this.onSubmit();
        },
        changePageSize(value){
            this.pageSize = value;
            this.onSubmit();
        },
        changeListPageSize(value){
            this.listCurrentPage = value;
            this.goExportInfoList();
        },
        changeListPageNum(value){
            this.listPageSize = value;
            this.goExportInfoList();
        },

        // 导出商品信息
        goExportSkuInfo(){
            let param = this.searchParam
            this.$iLoading.show();
            producthandler.getExportSkuInfo(param).then((res) => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0){
                    utils.showToast(res.result);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 导出选中商品信息
        exportSkuInfoBySkuList(){
            let param = {
                searchPoolRequestVO:this.searchParam,
                skus:this.multipleSelection
            }
            this.$iLoading.show();
            producthandler.exportSkuInfoBySkuList(param).then((res) => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0){
                    utils.showToast(res.result);
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 选品工具-查看导出任务
        goExportInfoList(flag){
            this.listCurrentPage = flag?1:this.listCurrentPage
            let param = {
                pageNum:this.listCurrentPage,
                pageSize:this.listPageSize
            }
            this.$iLoading.show();
            producthandler.getExportInfoList(param).then((res) => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0){
                    this.exportInfoList = res.result.pageVO.records.map((item)=>{
                        return Object.assign(item,{disable:item.exportStatus == "EXPORT_SUCCESS"?true:false})
                    })
                    this.listTotal = res.result.pageVO.count

                    this.showExportInfoList = true
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        },
        // 点击下载文件
        goExportFileListByInfoId(value){
            let param = {exportInfoId:value.id}
            producthandler.getExportFileListByInfoId(param).then((res) => {
                if (!!res && res.resultCode == 0){
                    res.result.fileList.forEach((item) =>{
                        this.downloadFile(item.downloadUrl,item.fileName)
                    })
                } else {
                    utils.showToast(res.resultMessage);
                }
            })
        },
        // 下载文件
        downloadFile(url, fileName) {
            var x = new XMLHttpRequest();
            x.open("GET", url, true);
            x.responseType = "blob";
            x.onload = function () {
                var urls = window.URL.createObjectURL(x.response);
                var a = document.createElement("a");
                a.href = urls;
                a.download = fileName;
                a.click();
            };
            x.send();
        }
    }
};
</script>


<style scoped lang='less'>
.promotionDom{
    width: 100%;
    height: 100%;
    padding: .1rem;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    .promotionTable{
        width: 1.5rem;
        height: 0.6rem;
        margin: 20px;
        font-size: .2rem;
    }
    /deep/ .el-button {
        white-space: unset !important;
    }

}
.profitTips {
    padding-left: 20px;
}
.container {
    width: 100%;
    min-width: 30vw;
    height: 100%;
    padding: .1rem;
    position: relative;
    .tip_dom{
        position: absolute;
        right: 10px;
        top: 10px;
        max-width: 400px;
        padding: 10px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        overflow-y: scroll;
        z-index: 99;
        .title{
            display: block;
            font-weight: bold;
            margin-bottom: .05rem;
        }
        ul li{
            margin-bottom: .03rem;
            line-height: .1rem;
        }

    }
    .skuList{
        width: 400px;
        flex: 1;
    }
    .select_box {
        width: 200px;
    }
    .environment {
        display: flex;
        align-items: center;
        /deep/.el-form-item__content {
            margin: 0 !important;
        }
        .el-col {
            display: flex;
        }
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
    .attributeDom{
        display: flex;
        >div{
            border: 1px solid #909399;
            margin-top: -1px;
            margin-left: -1px;
        }
        .left{
            width: calc(~'10% + 1px');
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F7F8FD;
        }
        .right{
            width: calc(~'90% + 1px');
            display: flex;
            padding-left: .2rem;
            height: .2rem;
            line-height: .2rem;
        }
    }
    .priceRuleDom{
        display: flex;
        >div{
            border: 1px solid #909399;
            margin-top: -1px;
            margin-left: -1px;
        }
        .left{
            width: calc(~'10% + 1px');
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F7F8FD;
        }
        .right{
            width: calc(~'90% + 1px');
            display: flex;
            padding-left: .2rem;
            line-height: .2rem;
            .el-checkbox{
                width: 2rem;
            }
            .el-tooltip{
                margin-right: .1rem;
            }
            .el-input{
                max-width:100px;
                margin-right: .02rem;
            }
        }
    }
    .skuSearchDom{
        display: flex;
        >div{
            border: 1px solid #909399;
            margin-top: -1px;
            margin-left: -1px;
        }
        .left{
            width: calc(~'10% + 1px');
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F7F8FD;
        }
        .right{
            width: calc(~'90% + 1px');
            display: flex;
            padding-left: .2rem;
            height: .2rem;
            line-height: .2rem;
        }
    }
    .orderRuleDom{
        display: flex;
        >div{
            border: 1px solid #909399;
            margin-top: -1px;
            margin-left: -1px;
        }
        .left{
            width: calc(~'10% + 1px');
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F7F8FD;
        }
        .right{
            width: calc(~'90% + 1px');
            display: flex;
            align-items: center;
            padding-left: .2rem;
            height: .2rem;
            line-height: .2rem;
            /deep/ .el-radio-group .el-radio .el-radio__input{
                display: none !important;
            }
        }
    }
    .allFilterDom{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #909399;

        .left{
            width: calc(~'10% + 1px');
            text-align: center;
            margin: 30px 0px;
        }
        .center{
            width: calc(~'80% + 1px');
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: 25px 0;

            .el-tag{
                   margin-right: 5px;
                   margin-bottom: 5px;
               }
        }
        .right{
            display: flex;
            justify-content: center;
            align-items: center;

        }
    }
    .exportDataDom{
        display: flex;
        justify-content: flex-end;
        .tips{
            width: 160px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #F56C6C;
        }
        .el-button{
            margin:10px 0px 0 10px;
        }
    }
    .servicListDom{
        margin-top: 10px;
        .el-table .cell {
            white-space: normal !important;
            word-break: break-all !important;
        }
        .pages{
            margin-top: .1rem;
            text-align: right;
        }
    }

}

.product {
    .fold_item {
        .el-collapse-item__header {
            background-color: #f8f8f8;
            padding-left: 8px;
            font-size: 14px;
            font-weight: 550;
            height: 36px;
            line-height: 36px;
        }
    }
    .fold_item_range {
        .el-collapse-item__content {
            padding: 0;
        }
    }
    .fold {
        .el-checkbox-button .el-checkbox-button__inner {
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .el-checkbox-button.is-checked .el-checkbox-button__inner {
            background-color: #fff;
            color: #478aee;
            border-color: #478aee;
        }
    }
    .fold_item_content_box_search {
        .el-input__inner {
            width: 239px !important;
            height: 36px !important;
            border-radius: 8px 0 0 8px !important;
        }
        .el-input-group__append,
        .el-input-group__prepend {
            background-color: #478aee;
            color: #fff;
            border: 1px solid #478aee;
            border-radius: 0 8px 8px 0;
        }
    }
}
.productRange {
    .el-table th {
        height: 36px;
        padding: 0;
        font-size: 14px;
        color: #666666;
        background-color: #f2f2f2;
    }
    .el-table::before {
        height: 0;
    }
    .el-table td {
        height: 80px;
        color: #333;
    }
    .el-collapse-item__header {
        height: 37px;
        line-height: 36px;
        margin-top: -1px;
    }
    .el-collapse-item__arrow {
        display: none;
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: #478aee;
    }
    .el-radio__label {
        color: #666;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: #478aee;
        background: #478aee;
    }
    .el-radio__inner {
        width: 16px;
        height: 16px;
    }
    .el-checkbox__input {
        &.is-checked,
        &.is-indeterminate {
            .el-checkbox__inner {
                background-color: #478aee;
                border-color: #478aee;
                width: 16px;
                height: 16px;
            }
        }
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
        }
    }
    .el-cascader-node.in-active-path,
    .el-cascader-node.is-active,
    .el-cascader-node.is-selectable.in-checked-path {
        color: #478aee;
    }
    .el-cascader-node {
        padding: 0 30px 0 24px;
    }
    .el-cascader-node__label {
        padding: 0 16px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #478aee;
    }
    table tr td:first-child .cell,
    table tr th:first-child .cell {
        padding-left: 32px;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #f8f8f8;
    }
}
.el-tooltip__popper {
    max-width: 300px;
}
.product_range_item_left {
    .el-cascader-menu {
        color: #333;
        .el-cascader-menu__wrap {
            height: 450px !important;
        }
    }

    .el-cascader-menu {
        width: 33.3% !important;
    }
    .el-cascader-node.is-disabled {
        color: #303133 !important;
    }
}
.job_more_info {
    padding:10px;
    width: 400px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1000;
    transform: translate(-50%,-50%);
    background: #fff;
    color: #222;
    box-shadow: 0px 0px 10px 0px rgba(153, 153, 153);
}
</style>
<style lang="less" scoped>
@import "../../common/components/product/productRange/productRange.less";
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
/deep/.el-dialog{
    display: block;
}
.updateHover {
    .el-button {
        margin-top: 10px !important;
        padding: 6px 10px;
        font-size: 10px !important;
    }
}
.charts {
    margin-top: 30px;
}
.charts_desc {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    .module {
        position: relative;
        width: 45%;
        height: 200px;
        padding: 20px;
        box-shadow: 0px 0px 10px 0px rgba(153, 153, 153,.5);
        .refresh {
            position: absolute;
            right: 20px;
            top: 20px;
        }
        .num {
            margin-top: 40px;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
        }
    }
}
</style>
