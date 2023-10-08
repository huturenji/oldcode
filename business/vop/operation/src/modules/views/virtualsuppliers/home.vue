<template>
    <div>
        <div class="box">
            <div class="title">
                B+商城VOP工具箱
            </div>
            <div class="addAssistant">
                <template v-for="(item, index) in btnTookits">
                    <el-button
                        type="primary"
                        v-if="item.auth"
                        :key="index"
                        @click="executOperation(index)"
                    >
                        {{ item.name }}
                    </el-button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import utils from "bislibs/utils";

export default {
    data() {
        return {
            btnTookits: [
                { name: "京东虚拟供应商", operation: this.gotoSetPagejd, auth:  utils.hasAuth("JDVirtualsuppliers")},
                { name: "京东供应商资金明细", operation: this.gotoJDVPOrderInfo, auth:  utils.hasAuth("JDVPOrderInfo") },
                { name: "选品工具", operation: this.gotoSelectionTools, auth:  utils.hasAuth("selectionTools") }
                // { name: "url编码工具", operation: this.gotoUrlEncode, auth: 1 }
            ]
        };
    },
    created() {},
    methods: {
        executOperation(index) {
            if (this.btnTookits[index].auth){
                this.btnTookits[index].operation();
            } else {
                utils.showToast('没有权限');
            }
        },
        //查询当前用户环境
        gotoUserPage() {
            this.$router.push({
                path: "/assistant",
                query: {
                    // orderNo: vm.orderInfo.orderNo,
                }
            });
        },
        //添加用户进虚拟京东
        gotoSetPagejd() {
            this.$router.push({
                path: "/virtualsuppliers/jd",
                query: {
                    // orderNo: vm.orderInfo.orderNo,
                }
            });
        },
        //添加用户进虚拟苏宁
        gotoUserPagesn() {
            this.$router.push({
                path: "/virtualsuppliers/sn",
                query: {
                    // orderNo: vm.orderInfo.orderNo,
                }
            });
        },
        //添加用户进虚拟西域
        gotoUserPagesy() {
            this.$router.push({
                path: "/virtualsuppliers/xy",
                query: {
                    // orderNo: vm.orderInfo.orderNo,
                }
            });
        },
        //联盟链接生成器
        gotoUrlMasking() {
            this.$router.push({
                path: "/virtualsuppliers/masking",
                query: {
                    
                }
            });
        },
        //京东供应商资金明细
        gotoJDVPOrderInfo() {
            this.$router.push({
                path: "/virtualsuppliers/jdvporderinfo",
                query: {
                    
                }
            });
        },        
        //推送财务报表
        gotoPushNotice() {
            this.$router.push({
                path: "/pushsend",
                query: {
                    // orderNo: vm.orderInfo.orderNo,
                }
            });
        },
        //京东售价/优惠工具
        gotoSearchPriceTask() {
            this.$router.push({
                path: "/virtualsuppliers/searchPriceTask",
                query: {
                    
                }
            });
        },
        //选品工具
        gotoSelectionTools() {
            this.$router.push({
                path: "/tools/selectionTool",
                query: {
                    
                }
            });
        },
        //商云代理领券地址
        gotoReceivePQrcode() {
            this.$router.push({
                path: "/tools/receivePQrcode",
                query: {
                    
                }
            });
        },
        gotoUrlEncode() {
            this.$router.push({
                path: "/virtualsuppliers/urlEncode",
                query: {
                    
                }
            });
        }      
        
    }
};
</script>

<style scoped lang='less'>
.box {
    display: flex;
    margin: 0.3rem 0.1rem;
    width: 100%;
    height: 100%;
    flex-flow: column;

    .title {
        font-size: x-large;
        font-weight: 600;
    }
    .addAssistant {
        display: flex;
        // justify-content: center;
        text-align: center;
        margin-bottom: 0.1rem;
        input {
            border: solid 0.5px #666;
            margin: 0 0.1rem;
            width: 3rem;
            padding: 0 0.1rem;
            border-radius: 5px;
        }
        button {
            background-color: #f00;
            font-size: large;
            // line-height: 0.5rem;
            border-radius: 5px;
            color: #fff;
            margin: 10px;
            padding: 8px;
            &:hover {
                cursor: pointer;
            }
            &:active {
                background-color: #f44;
            }
        }
    }
}
</style>