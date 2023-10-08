<template>
    <div class="good-table">
        <el-table 
            stripe
            :header-cell-style="{background:'#f2f2f2'}" 
            :show-header="showHeader"
            :data="dataList"
        >
            <el-table-column 
                v-for="(header,index) in headers" 
                :key="index"
                :prop="header.key"
                :label="header.title"
                :width="header.width"
            >
                <template slot-scope="scope">
                    <div
                        v-if="scope.column.property == 'name'"
                        class="goods-info"
                    >
                        <img
                            class="goods-icon"
                            v-lazy="showGoodImage(scope.row.mainImage)"
                        />
                        <div class="title-info">
                            <p :title="scope.row.name">
                                {{ scope.row.name }}
                            </p>
                            <!-- <p :title="getSpecDetail(scope.row.specification)" class="single">{{getSpecDetail(scope.row.specification)}}</p> -->
                            <p
                                v-if="scope.row.type==1"
                                class="typeicon"
                            >
                                附件
                            </p>
                            <p
                                v-if="scope.row.type==2"
                                class="typeicon"
                            >
                                赠品
                            </p>
                            <p
                                v-if="scope.row.type==3"
                                class="typeicon"
                            >
                                延保
                            </p>                     
                        </div>
                    </div>
                    <div v-if="scope.column.property == 'sku'">
                        <span>{{ scope.row.sku }}</span>
                    </div>
                    <div v-if="scope.column.property == 'supplierSku'">
                        <span>{{ scope.row.supplierSku }}</span>
                    </div>
                    <div v-if="scope.column.property == 'supplierSettlePrice'">
                        <span>{{ goodAmount(scope.row.supplierSettlePrice) }}</span>
                    </div>
                    <div v-if="scope.column.property == 'settlePrice'">
                        <span>{{ goodAmount(scope.row.settlePrice) }}</span>
                    </div>
                    <div v-if="scope.column.property == 'num'">
                        <span>{{ scope.row.num }}件</span>
                    </div>
                </template>    
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import accounting from "accounting";
export default {
    props: {
        headers: {
            type: Array,
            default: () => []
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        dataList: {
            type: Array,
            default: () => []
        }
    },
    data:function(){
        return {
            imgBaseUrl: 'https://img13.360buyimg.com/n0/' //图片显示根路径
        }
    },
    computed: {
        goodAmount() {
            return function(amount) {
                return accounting.formatMoney(amount, "￥", 2, ",");
            };
        }
    },
    methods: {
        getSpecDetail(inputValue){
            let result = ""
            if (this.isJSON(inputValue)){
                let specArr = JSON.parse(inputValue).specDetail
                specArr && specArr.forEach(element => {
                    result+= element.saleName+ "："+ element.saleValue
                });
            }
            //这个specification有2种情况，1是需要JSON.parse一次的，1是需要JSON.parse2次的            
            else if (this.isJsonTwice(inputValue)){
                let specArr = JSON.parse(JSON.parse(inputValue)).specDetail
                specArr && specArr.forEach(element => {
                    result+= element.saleName+ "："+ element.saleValue
                });    
            } else {
                result = inputValue
            }
            return result
        },
        isJSON(str) {
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if (typeof obj == 'object' && obj ){
                        return true;
                    }
                    return false;
                    
                } catch (e) {
                    console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
        },
        isJsonTwice(str) {
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if (typeof obj == 'object' && obj ){
                        return true;
                    }                        
                    return this.isJSON(obj);
                    
                } catch (e) {
                    console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
            // console.log('It is not a string!')
        },
        //展示图片
        showGoodImage(imgUrl){
            if (!imgUrl){
                //默认图片展示
                return require("assets/icon_mall_liwu.png")
            } else if (imgUrl && imgUrl.toLowerCase().indexOf("http") == 0) {
                return imgUrl
            }
            //京东的图片，相对地址，拼接一下
            return this.imgBaseUrl + imgUrl
            
        }
    }
};
</script>
<style lang="less">
 
.good-table {
    .goods-info {
        display: flex;
        align-items: center;
        .goods-icon {
            width: 72px;
            height: 72px;
            margin: 10px;
        }
        .title-info {
            text-align: left;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
                width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
                -webkit-line-clamp: 2;
            }
            .single {
                -webkit-line-clamp: 1;
                color: #999;
                margin-top: 12px;
            }
            .typeicon{
                color: red;
                width: 33px;
                text-align: center;
                border: 1px solid red;
                border-radius: 4px;
                font-size: 12px;
                padding: 0 3px;
            }
        }
    }
    .el-table .cell {
        white-space: normal !important;
        word-break: break-all !important;
    }
}
</style>