<template>
    <div class="box">
        <div class="checkboxList common_box">
            <div class="tips">
                请选择供应商：
            </div>
            <el-checkbox-group
                v-model="selectedSupplierList"
                @change="handleCheckedCitiesChange"
            >
                <el-checkbox
                    v-for="item in allSupplierList"
                    :key="item.value"
                    :label="item.value"
                    disabled
                >
                    {{ item.text }}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="sort_box common_box">
            <div class="tips">
                请选择排序规则：
            </div>
            <el-select
                v-model="sortType"
                clearable
                placeholder="请选择排序规则"
            >
                <el-option
                    v-for="item in sortOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="cate_box common_box">
            <div class="tips">
                请选择三级分类：
            </div>
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
            <span>*注：只能选择1个三级分类，多选也只会以第一个选的为准。</span>
        </div>
        <div class="search_box common_box">
            <div class="tips">
                请输入搜索内容：
            </div>
            <el-input
                class="search"
                type="text"
                clearable
                placeholder="请输入搜索内容"
                maxlength="-1"
                v-model="searchValue"
            >
            </el-input> 
        </div>
        <div class="search_btn common_box">
            <div>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchList()"
                >
                    搜索
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-download"
                    @click="exportProduct()"
                >
                    导出表格
                </el-button>
            </div>
            
            <div 
                class="pagingBox" 
                v-show="searchData && searchData.length>0"
            >
                <el-pagination
                    background
                    @size-change="pSizeChange"
                    @current-change="changePage"
                    :current-page="currentPage"
                    :page-sizes="pageSizeOpts"
                    :page-size="pageSize"
                    :page-count="pageCount"
                    layout="total, prev, pager, next, jumper,sizes"
                >
                </el-pagination>
            </div>
        </div>
        
        <div class="detailBox common_box">
            <div class="search_data">
                <el-table
                    :data="searchData"
                    height="600"
                    :highlight-current-row="true"
                >
                    <el-table-column
                        type="index"
                        width="100"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="skuName"
                        label="商品名称"
                        width="150"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="sku"
                        label="商品SKU"
                        width="170"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="image"
                        label="商品图片"
                        width="100"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <img :src="scope.row.image" />
                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="结算价"
                        width="100"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="jdPrice"
                        label="建议销售价"
                        width="100"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="category"
                        label="类目名称"
                        width="300"
                        align="center"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 二级页面——商品分类数据 -->
        <el-dialog
            title="选择分类"
            :visible.sync="shwClassPop"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            custom-class="adduserdialog"
            width="940px"
        >
            <div class="categoryDom">
                <div class="categoryContent">
                    <ul class="top">
                        <li>一级分类</li>
                        <li>二级分类</li>
                        <li>三级分类</li>
                        <li>品牌</li>
                        <li>已选择<strong class="fold_item_content_box_selecteNum">{{ selectedItem.length }}</strong>项</li>
                    </ul>
                    <div class="bottom">
                        <div class="left">
                            <!-- 级联 -->
                            <el-cascader-panel
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
                                class="fold_item_content_count_selected fold_item_content_box"
                                style="width:100%"
                            >
                                <div class="fold_item_content_box_bottom">
                                    <ul
                                        class="fold_item_content_box_bottom_list"
                                        style="height:260px;overflow-y: scroll;"
                                    >
                                        <li
                                            class="fold_item_content_box_bottom_item"
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
            searchData:[], //获取到的搜索结果表格数据
            pageSize: 10, //下载列表分页参数
            currentPage: 1,
            pageCount:0,
            pageSizeOpts: [5, 10, 20, 50, 100],
            allSupplierList:[], //获取到的所有供应商
            selectedSupplierList:['JD'], //选中的供应商类型
            searchValue:'', //搜索关键字
            sortType:'', //选择的排序规则
            sortOptions:[ //所有排序规则
                {value:'1',label:'按15日销量排序'},
                {value:'2',label:'按30日销量排序'},
                {value:'3',label:'按15天销售额排序'},
                {value:'4',label:'按30日销售额排序'}
            ],
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
            }
        };
    },
    
    components: {},
    props: {},
    watch:{
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
        this.getSpInfos()
    },
        
    
    methods: {
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
        //页码变化
        changePage(page) {
            var _this = this;
            _this.currentPage = page;
            _this.searchList();
        },
        //每页显示条数变化
        pSizeChange(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            _this.currentPage = 1;
            _this.searchList();
        },
        //查询供应商列表
        getSpInfos() {
            let _this = this;
            var json = {
                pageSize: 1000,
                pageNum: 1,
                searchKey:""
            };
            producthandler.listSupplier(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    if (!!result.result.supplierDetailResults) {
                        result.result.supplierDetailResults.forEach(function (item) {
                            _this.allSupplierList.push({
                                value: item.supplierType,
                                text: item.supplierShortName
                            });
                        });
                        _this.allSupplierList.reverse()
                    }
                }
            });
        },
        searchList() {
            let _this = this;
            let json = {
                catId:(this.categoryParam.category && this.categoryParam.category[0] && this.categoryParam.category[0].categoryId3)?this.categoryParam.category[0].categoryId3:'',
                keyword:this.searchValue,
                sortType:this.sortType,
                supplier:this.selectedSupplierList.join(''),
                pageIndex:this.currentPage,
                pageSize:this.pageSize
            }
            producthandler.getSearchProduct(json).then(function (result) {
                if (!!result && result.resultCode == 0) {
                    _this.searchData = result.result.searchProductVoList
                    _this.pageCount = result.result.pageCount;
                }
            });
        },
        // 导出生成链接
        exportProduct(){
            let that = this;
            that.$iLoading.show();
            that.downLoadData = [];
            let json = {
                catId:(this.categoryParam.category && this.categoryParam.category[0] && this.categoryParam.category[0].categoryId3)?this.categoryParam.category[0].categoryId3:'',
                keyword:this.searchValue,
                sortType:this.sortType,
                supplier:this.selectedSupplierList.join(''),
                pageIndex:this.currentPage,
                pageSize:this.pageSize
            }
            producthandler
                .exportProduct(json).then(res => {
                    that.$iLoading.hide();
                    if (res.resultCode==0){
                        if (res.result.downloadUrl) {
                            utils.downloadFile(res.result.downloadUrl,res.result.downloadUrl.substring(res.result.downloadUrl.indexOf('/doc')+5,res.result.downloadUrl.length) || 'vop运营平台导出商品');
                        }
                    } 
                }).catch(() => {     
                }).finally(()=>{
                    that.$iLoading.hide();
                });
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
    .box{
        .common_box {
            display: flex;
            margin-top: 20px;
            /deep/ .el-table__body-wrapper {
                overflow: auto !important;
            }
        }
        .search_box {
            .search {
                width: 400px;
                margin-right: 20px;
            }
        }
        .cate_box {
            >span {
                padding-left: 20px;
                line-height: 40px;
                color: rgb(240, 123, 40);
            }
        }
        .search_btn {
            max-width: 1100px;
            justify-content: space-between;
            .pagingBox {
                max-width: 1100px;
                display: flex;
                align-items: center;
                text-align: right;
                .el-pagination {
                    margin: 0;
                }
            }
        }
        .detailBox {
            margin-bottom: 20px;
            .search_data {
                img {
                    width: 100px;
                }
            }
        }
        .tips {
            display: flex;
            align-items: center;
        }
        .categoryDom{
            min-width: 760px;
            display: flex;
            .categoryContent{
                width: 100%;
                .top{
                    display: flex;
                    li{
                        width: 25%;
                        height: 45px;
                        padding-left: .05rem;
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
                        width: calc(~'80% + 1px');
                        /deep/ .el-cascader-menu__wrap {
                            height: 270px !important;
                        }

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
                        width: calc(~'20% + 1px');
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

                }
            }

        }
        
    }
    .updateHover {
        .el-button {
            margin-top: 10px !important;
            padding: 6px 10px;
            font-size: 10px !important;
        }
    }
    
</style>

