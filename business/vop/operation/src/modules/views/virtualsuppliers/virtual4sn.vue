<template>
    <div>
        <div class="headLine">
            虚拟苏宁供应商配置
        </div>
        <div class="envSetting">
            <!-- <span>环境配置</span>
            <select class="select" v-model="envValue">
                <option v-for="(item, i) in envList" :value="item.id" :key="i">
                    {{ item.status }}
                </option>
            </select> -->
            <span>选择业务</span>
            <select
                class="select"
                v-model="moduleValue"
            >
                <option
                    v-for="(item, i) in moduleList"
                    :value="item.id"
                    :key="i"
                >
                    {{ item.status }}
                </option>
            </select>
        </div>
        <div class="virtualTab">
            <span
                v-for="(item, i) in mouduleTabs"
                :key="i"
                :class="{ cursor: item.id == currentTab.id }"
                @click="switchTab(i)"
            >{{ item.name }}</span>
        </div>
        <div class="tabroot">
            <div v-if="currentTab.id == 'query'">
                <div
                    class="numRowLeft"
                    v-if="queryResults.length > 0"
                >
                    <div
                        class="listItem"
                        v-for="(item, i) in queryResults"
                        :key="i"
                    >
                        <div
                            v-for="(key, j) in Object.keys(item)"
                            :key="j"
                        >
                            {{ key + "：" + item[key] }}
                        </div>
                        <div>
                            <button
                                v-for="(btn, k) in currentTab.operations"
                                :key="k"
                                class="btn"
                                @click="btn.func(item)"
                            >
                                {{ btn.name }}
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="row"
                >
                    <div class="emptyDiv">
                        {{ emptyDesc }}
                    </div>
                </div>
            </div>
            <div v-else-if="currentTab.id == 'write'">
                <div class="rowDesc">
                    <span>参数说明：</span>
                    <pre>{{ writeTabDataDesc }} </pre>
                </div>
                <div
                    class="row"
                    v-for="(ele, index) in writeTabDataIn"
                    :key="index"
                >
                    <div class="left">
                        {{ ele.name }}：
                    </div>
                    <input
                        v-if="ele.type == 'input'"
                        type="text"
                        class="right"
                        :placeholder="ele.placeholder"
                        v-model="ele.value"
                    />
                </div>
                <div class="row">
                    <div
                        class="btn"
                        @click="currentTab && currentTab.tabOnUpdate()"
                    >
                        确认
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import virtualHandler from "bislibs/requestHandler/virtualhandler.js";
import extendUtils from "bislibs/utils";
export default {
    data() {
        return {
            moduleList: [
                {
                    id: 1,
                    status: "虚拟供应商通用配置",
                    tabs: [
                        {
                            id: "query",
                            name: "全部通用配置",
                            tabOnInit: this.queryConfigs,
                            operations: [
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置通用选项",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateConfig,
                            dataInit: {
                                name: "",
                                status: ""
                            },
                            dataDesc:
                                "name：配置name，status：配置状态\n模拟苏宁下单。（001：成功，002：失败）" +
                                "模拟苏宁确认订单。（001：成功，002：失败）模拟苏宁取消下单。（001：成功，002：失败）\n" +
                                "模拟苏宁分包裹。（001：不分包裹，不管几个商品都是一个包裹，002：分包裹，一个商品的话是一个包裹，\n" +
                                "大于2个商品，第一个商品一个包裹，其余商品一个包裹。003：单个商品买多个分两个包裹）\n" +
                                "模拟苏宁拒收。（001：不拒收，002：拒收）\n模拟苏宁查询配送信息。（001：成功，有包裹信息，002：成功，暂无包裹信息，003：失败）"
                        }
                    ]
                },
                {
                    id: 2,
                    status: "设置商品库存",
                    tabs: [
                        {
                            id: "query",
                            name: "全部库存配置",
                            tabOnInit: this.queryStocks,
                            operations: [
                                {
                                    name: "删除",
                                    func: this.delStocks
                                },
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置商品库存",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateStock,
                            dataInit: {
                                skuId: "",
                                cityId: "",
                                countyId: "",
                                remainNum: ""
                            },
                            dataDesc:
                                "skuId：商品编号，cityId：城市地址格式755（深圳），remainNum：库存数量，countyId：区县地址"
                        }
                    ]
                },
                {
                    id: 3,
                    status: "设置商品上下架",
                    tabs: [
                        {
                            id: "query",
                            name: "全部上下架配置",
                            tabOnInit: this.querySkuStates,
                            operations: [
                                {
                                    name: "删除",
                                    func: this.delSkuStates
                                },
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置商品上下架",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateSkuStates,
                            dataInit: {
                                skuId: "",
                                state: ""
                            },
                            dataDesc:
                                "skuId：商品id，state：上下架状态，1上架，0下架"
                        }
                    ]
                },
                {
                    id: 4,
                    status: "设置商品价格",
                    tabs: [
                        {
                            id: "query",
                            name: "全部价格配置",
                            tabOnInit: this.querySellPrice,
                            operations: [
                                {
                                    name: "删除",
                                    func: this.delPrice
                                },
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置商品价格",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateSkuPrice,
                            dataInit: {
                                skuId: "",
                                cityId: "",
                                price: ""
                            },
                            dataDesc:
                                "skuId：商品id，cityId：城市地址格式755（深圳），price：价格"
                        }
                    ]
                },
                {
                    id: 5,
                    status: "设置商品可售区域限制",
                    tabs: [
                        {
                            id: "query",
                            name: "全部限售配置",
                            tabOnInit: this.querySkuSellArea,
                            operations: [
                                {
                                    name: "删除",
                                    func: this.delSkuSellArea
                                },
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置商品限售",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateSkuSellArea,
                            dataInit: {
                                skuId: "",
                                provinceId: "",
                                cityId: "",
                                state: ""
                            },
                            dataDesc:
                                "skuId：商品id，provinceId：省id，cityId：城市地址格式755（深圳），state：1可售 2不可售"
                        }
                    ]
                },
                {
                    id: 6,
                    status: "设置商品不在商品池",
                    tabs: [
                        {
                            id: "query",
                            name: "全部不在商品池的配置",
                            tabOnInit: this.querySkuNotINPool,
                            operations: [
                                {
                                    name: "删除",
                                    func: this.delSkuNotINPool
                                },
                                {
                                    name: "设置",
                                    func: this.toWritePage
                                }
                            ]
                        },
                        {
                            id: "write",
                            name: "设置sku不在商品池",
                            tabOnInit: this.setWritePageForm,
                            tabOnUpdate: this.updateSkuNotINPool,
                            dataInit: {
                                skuId: "",
                                notInPool: ""
                            },
                            dataDesc:
                                "skuId：商品id，notInPool：1不在商品池"
                        }
                    ]
                }                
            ],
            moduleValue: 0,
            mouduleTabs: [
                { id: "query", name: "查询" },
                { id: "write", name: "增改" }
            ],
            currentTab: {},
            emptyDesc: "没有相关数据，请先执行设置操作",
            writeTabDataIn: [], //编辑模块的默认输入数据
            writeTabDataDesc: "", //编辑模块的输入数据说明
            envList: [
                {
                    id: 1,
                    status: "sn"
                }     
            ],
            envValue: 1, //环境配置
            queryResults: []
        };
    },
    mounted() {
        virtualHandler.setBaseUrlSN(1);
        this.moduleValue = 1;
    },
    watch: {
        envValue(newVal) {
            virtualHandler.setBaseUrlSN(newVal);
            let env = this.envList.find((ele) => {
                return ele.id == newVal;
            });
            //默认切换一次数据
            this.moduleChange(this.moduleValue);            
            extendUtils.showToast("请注意，已经切换至" + (env && env.status));
        },
        moduleValue(newVal) {
            this.moduleChange(newVal);
        }
    },
    methods: {
        //切换业务下拉框
        moduleChange(newVal) {
            this.mouduleTabs = this.moduleList.find((item) => {
                return item.id == newVal;
            }).tabs;
            this.switchTab(0);
        },        
        //虚拟供应商模块切换
        switchTab(index) {
            let that = this;
            that.currentTab = that.mouduleTabs[index];
            //执行切换tab之后的默认函数
            if (!!that.currentTab.tabOnInit) {
                that.currentTab.tabOnInit(that.currentTab.dataInit);
            }
            if (that.currentTab.id == "write" && that.currentTab.dataDesc) {
                that.writeTabDataDesc = that.currentTab.dataDesc;
            }
        },
        /**
         * 去编辑库存配置
         */
        toWritePage(item) {
            this.switchTab(1);
            this.setWritePageForm(item);
        },
        /**
         * 设置编辑页面 默认数据
         */
        setWritePageForm(item) {
            if (!item) {
                return;
            }
            this.writeTabDataIn = [];
            for (var key in item) {
                this.writeTabDataIn.push({
                    type: "input",
                    name: key,
                    value: item[key],
                    placeHodler: ""
                });
            }
        },
        //查询限售配置
        querySkuSellArea() {
            let that = this;
            virtualHandler
                .querysnSellArea({})
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },
        //查询不在商品池配置
        querySkuNotINPool() {
            let that = this;
            virtualHandler
                .querysnNotINPool({})
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },        
        //查询定价配置
        querySellPrice() {
            let that = this;
            virtualHandler
                .querysnSkuPrice({})
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },
        //查询上下架配置
        querySkuStates() {
            let that = this;
            let param = {};
            virtualHandler
                .querysnSkuState(param)
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },
        //查询通用配置
        queryConfigs() {
            let that = this;
            let param = {};
            virtualHandler
                .querysnConfig(param)
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },
        //查询商品库存
        queryStocks() {
            let that = this;
            let param = {};
            virtualHandler
                .querysnStock(param)
                .then((res) => {
                    if (!!res.success) {
                        that.queryResults = res.result;
                    }
                })
                .catch((e) => {
                    if (!!e && !!e.success) {
                        that.queryResults = e.result;
                    }
                });
        },
        //设置商品库存
        updateStock() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnSkuStock(param)
                .then((res) => {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    that.updateResultProcess(e);
                });
        },
        //更新定价配置
        updateSkuSellArea() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnSellArea(param)
                .then((res) => {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    that.updateResultProcess(e);
                });
        },
        //更新苏宁不在商品池配置
        updateSkuNotINPool() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnNotINPool(param)
                .then((res) => {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    that.updateResultProcess(e);
                });
        },        
        //设置商品上下架
        updateSkuStates() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnSkuState(param)
                .then((res) => {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    that.updateResultProcess(e);
                });
        },
        //设置商品价格
        updateSkuPrice() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnSkuPrice(param)
                .then((res) => {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    that.updateResultProcess(e);
                });
        },
        //虚拟供应商通用配置设置
        updateConfig() {
            let that = this;
            //动态参数赋值
            let param = {};
            that.writeTabDataIn.forEach((element) => {
                param[element.name] = element.value;
            });

            virtualHandler
                .updatesnConfig(param)
                .then(function (res) {
                    that.updateResultProcess(res);
                })
                .catch((e) => {
                    //TODO  虚拟供应商的所有接口返回code与之前的不一致，任平那边没办法改为与其他接口统一，会进入catch方法
                    that.updateResultProcess(e);
                });
        },
        //删除操作结果统一处理
        updateResultProcess(res) {
            if (res && res.success) {
                extendUtils.showToast("设置成功");
            } else {
                extendUtils.showToast((res && res.resultMessage) || "设置失败");
            }
        },
        //删除该条商品库存
        delStocks(data) {
            let that = this;
            let param = {
                id: data.id
            };
            virtualHandler
                .delsnStock(param)
                .then((res) => {
                    that.delResultProcess(res);
                })
                .catch((e) => {
                    that.delResultProcess(e);
                });
        },
        //删除商品价格信息
        delPrice(data) {
            let that = this;
            let param = {
                id: data.id
            };
            virtualHandler
                .delsnSkuPrice(param)
                .then((res) => {
                    that.delResultProcess(res);
                })
                .catch((e) => {
                    that.delResultProcess(e);
                });
        },
        delSkuSellArea(data) {
            let that = this;
            let param = {
                id: data.id
            };
            virtualHandler
                .delsnSellArea(param)
                .then((res) => {
                    that.delResultProcess(res);
                })
                .catch((e) => {
                    that.delResultProcess(e);
                });
        },
        delSkuNotINPool(data) {
            let that = this;
            let param = {
                skuId: data.skuId
            };
            virtualHandler
                .delsnNotINPool(param)
                .then((res) => {
                    that.delResultProcess(res);
                })
                .catch((e) => {
                    that.delResultProcess(e);
                });
        },        
        //删除上下架信息
        delSkuStates(data) {
            let that = this;
            let param = {
                skuId: data.skuId
            };
            virtualHandler
                .delsnSkuState(param)
                .then((res) => {
                    that.delResultProcess(res);
                })
                .catch((e) => {
                    that.delResultProcess(e);
                });
        },
        //删除操作结果统一处理
        delResultProcess(res) {
            let that = this;
            if (res && res.success) {
                extendUtils.showToast("删除成功");
                that.currentTab.tabOnInit();
            } else {
                extendUtils.showToast((res && res.resultMessage) || "删除失败");
            }
        }
    }
};
</script>

<style scoped lang="less">
.headLine {
    padding: 3px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;
}
.envSetting {
    background: white;
    padding: 10px;
    margin: 15px 0;
    .select {
        border: 1px solid #dcdee2;
        border-radius: 4px;
        width: auto;
        margin: 0 2px;
        padding: 4px 7px;
        // height: 0.6rem;
    }
}

.virtualTab {
    display: flex;
    justify-content: space-around;
    margin-top: 2px;
    background-color: #fff;
    // height: 1rem;
    // line-height: 1rem;
    border-bottom: 1px solid #86b9f5;
    cursor: pointer;

    .cursor {
        background-color: #f2f3f5;
    }

    span {
        padding: 0 1px;
        flex: 1;
        text-align: center;
    }

    span:hover {
        background-color: #f2f3f5;
    }
}
.tabroot {
    margin-top: 5px;
    .row {
        margin-bottom: 7px;
        .left {
            float: left;
            width: 25%;
            text-align: right;
            // height: 0.7rem;
            // line-height: 0.7rem;
            margin-right: 3px;
        }
        .right {
            width: 50%;
            // height: 0.7rem;
            // line-height: 0.7rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 0 2px;
        }
        .emptyDiv {
            font-weight: 600;
            text-align: center;
            margin: 15px;
            font-size: x-large;
        }
        .btn {
            width: 160px;
            height: 40px;
            line-height: 40px;
            background-color: #478aee;
            color: #fff;
            text-align: center;
            border-radius: 4px;
            margin: 15px auto;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #4a7ee4;
        }
    }
    .rowDesc {
        margin: 15px 5px;
        padding: 5px;
        border: 2px dashed;
    }
    .numRowLeft {
        background-color: #f2f3f5;
        height: 75vh;
        overflow-y: scroll;
        padding: 0 10px;
        .listItem {
            margin: 10px 0;
            border-bottom: 2px dashed;
        }
        .btn {
            background-color: #f00;
            color: #fff;
            margin: 3px;
            padding: 10px;
            cursor: pointer;
        }
        .left {
            text-align: center;
            font-size: 16px;
            padding: 2px 0;
        }
        .right {
            display: flex;
            justify-content: space-evenly;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ddf;
            div {
                flex: 20%;
                text-align: center;
            }
        }
    }
}
</style>