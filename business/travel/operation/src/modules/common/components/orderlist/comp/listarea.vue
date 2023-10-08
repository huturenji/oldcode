<template>
    <div class="orderListArea">
        <div v-if="isLoadData" class="loading-container">
            <span>{{loadingPrompt}}</span>
        </div>
        <div v-else class="content-result" refer>
            <div class="empty-message" v-if="!orderList || orderList.length==0">
                <i class="icon"></i>
                {{emptyPrompt}}
            </div>
            <!-- 自定义列表顶部栏的内容 -->
            <slot name="listTop" v-if="orderList && orderList.length>0"></slot>
            <!-- 这里其实是个动态组件的接口，根据typeCode区分用哪个产品的组件 -->
            <orderItem
                v-for="orderItem in orderList"
                :key="orderItem.orderNo"
                :orderItem="orderItem"
                :mailPreData="mailPreData"
                @refreshPage="refreshPage"
                @getSenderInfos="getSenderInfos"
            ></orderItem>
            <page :page="page" @turnPage="turnPage" v-if="orderList && orderList.length>0"></page>
        </div>
    </div>
</template>

<script>
const page = () => import("components/page/page.vue");
const orderItem = () => import("./listitem/listitem.vue");

export default {
    props: {
        menuIndex: [String, Number], //左边菜单栏的位置
        pageData: {
            type: Object,
            required: true,
            default: 1
        }, //分页的每页数据量
        isLoadData: {
            type: Boolean,
            required: true,
            default: true
        }, //是否显示加载框
        orderList: {
            //订单列表数据
            type: Array,
            required: true,
            default: []
        },
        emptyPrompt: {
            //空列表的提示语
            type: String,
            default: "未找到符合要求的订单"
        },
        loadingPrompt: {
            //加载框个的提示语
            type: String,
            default: "数据加载中..."
        },
        mailPreData: {
            //邮寄报销凭证必要的数据
            type: Object,
            default: {
                proviceCityCounty: {}, //省市区数据
                senderAddressList: [], //发件人数据
                expressCompanies: [] //快递公司数据
            }
        }
    },
    directives: {},
    components: {
        orderItem,
        page
    },
    data() {
        return {
            page: {
                currPage: 1,
                pageSize: this.pageData.pageDataSize || 20,
                pageCount: this.pageData.pageDataCount || 1
            }
        };
    },
    created() {},
    mounted() {},
    watch: {
        orderList: {
            handler(val, oldVla) {
                //根据订单列表 判断是否显示loading
                if (!!val && val.length > 0) {
                    // this.isLoadData = false;
                }
            },
            immediate: true,
            deep: true
        },
        pageData: {
            handler(val, oldVla) {
                //动态显示页码总数
                this.page.pageCount = val.pageDataCount || 1;
                this.page.currPage = val.pageDataIndex || 1;
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.page.currPage = parseInt(newPageNum);
            this.$emit("turnPage", JSON.parse(JSON.stringify(this.page)));
        },

        /**
         * 删除列表某一条Item后，刷新页面
         */
        refreshPage() {
            this.$emit("refreshPage", JSON.parse(JSON.stringify(this.page)));
        },

        /**
         * 查询寄件人地址信息列表
         */
        getSenderInfos() {
            this.$emit("getSenderInfos");
        }
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@line-height: 32px;
@font-color: #191919;
@placeholder-color: #b2b2b2;
.orderListArea {
    .flex-box;
    .flex-flow(column, nowrap);
    background: #fff;
    padding: 0px 30px;
    .content-result {
        flex-grow: 1;
        padding: 20px 0px;
        position: relative;
    }
    //无结果时
    .empty-message {
        .flex(auto);
        .flex-box;
        .flex-flow(column);
        .align-items(center);
        padding-top: 160px;
        padding-bottom: 160px;
        font-size: 14px;
        color: @placeholder-color;
        text-align: center;
        .icon {
            display: block;
            width: 81px;
            height: 92px;
            background: url(~assets//icon_empty.png)
                no-repeat 0 0 transparent;
            margin-bottom: 16px;
        }
    }
    .loading-container {
        text-align: center;
        height: 80vh;
        font-size: 20px;
        line-height: 30px;
        padding-bottom: 160px;
        span {
            margin-top: 34px;
            height: 30px;
            text-align: center;
            padding-left: 35px;
            color: #7f7f7f;
            display: inline-block;
            background: url(~assets//loading.gif) no-repeat left;
            background-size: contain;
        }
    }
}
</style>

