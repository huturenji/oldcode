/** 商云发放代理的领券页面 二维码地址生成 小工具 */
<template>
    <div class="qrcodemaker">
        <div class="decbox">
            {{ tip1 }}
        </div>

        <div>
            <div class="line">
                <span> 页面访问路径：</span>

                <el-input
                    placeholder="请输入页面访问路径"
                    v-model="inputData.path"
                    clearable
                    :style="{ width: '450px' }"
                >
                </el-input>
            </div>

            <div class="line">
                <span> 渠道ID：</span>

                <el-input
                    placeholder="请输入渠道ID"
                    v-model="inputData.channel"
                    clearable
                    :style="{ width: '450px' }"
                >
                </el-input>
            </div>

            <div class="line">
                <span>场景值：</span>
                <el-input
                    placeholder="请输入场景值"
                    v-model="inputData.sence"
                    clearable
                    :style="{ width: '450px' }"
                >
                </el-input>
            </div>
        </div>

        <div :style="{ textAlign: 'center' }">
            <el-button
                type="primary"
                @click="popQrCode"
            >
                生成二维码
            </el-button>
        </div>

        <el-dialog
            :title="qrcodeDetail[qRcodeType].title"
            :visible.sync="showQrCode"
            :modal-append-to-body="false"
            :destroy-on-close="true"
            width="30%"
            center
        >
            <div class="qrcodeWarp">
                <div>{{ qrcodeDetail[qRcodeType].des }}</div>
                <div
                    id="qrcode"
                    ref="qrcode"
                    class="qrcodeBox"
                ></div>
                <div v-if="qrcodeDetail[qRcodeType].showBtn">
                    <el-button
                        type="default"
                        @click="downloadQrcode"
                    ><i class="el-icon-download"></i>下载二维码</el-button>
                    <div>领券链接：{{ qrcodeLink }}</div>
                    <el-button
                        type="primary"
                        @click="copyStr(qrcodeLink)"
                    >复制链接</el-button>
                </div>
                <div>{{ qrcodeDetail[qRcodeType].tips }}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import QRCode from "qrcodejs2";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            tip1: "商云发放代理的领券页面的二维码生成小工具。请根据实际情况输入下面的参数。",
            inputData: {
                path:"",
                channel: "",
                method: "1", //获取方式 1 是 扫二维码，目前没有其他方式
                activity:"101",//第3个参数，活动id， 活动id从101开始
                sence: ""
            },
            showQrCode: false, //是否显示弹框
            qrcodeLink: "",
            qRcodeType: 1,
            qrcodeDetail: {
                1: {
                    title: "领券页面二维码",
                    des: "扫一扫即可打开商云领券页面",
                    showBtn: true,
                    tips: "不同银行需要使用对应的客户端扫码"
                }
            }
        };
    },

    components: {},
    props: {},

    mounted() {},
    methods: {
    /**
     * 校验、生成领券链接
     */
        checkAndNewLink() {
            if (!this.inputData.path) {
                utils.showToast("请输入页面访问路径");
                return false;
            }
            if (!this.inputData.channel) {
                utils.showToast("请输入渠道ID");
                return false;
            }
            if (!this.inputData.sence) {
                utils.showToast("请输入场景值");
                return false;
            }

            //将所有的地址拼接起来
            this.qrcodeLink =
        this.inputData.path +
        "?trackId=" +
        //对地址参数进行编码
        encodeURIComponent(
            this.inputData.channel +
            ":" +
            this.inputData.method +
            ":" +
            this.inputData.activity +
            ":" +
            this.inputData.sence
        );

            this.qrcodeDetail[this.qRcodeType].title =
        "渠道" + this.inputData.channel + "领券页面的二维码";

            return true;
        },
        /**
     * 弹出二维码框
     */
        popQrCode() {
            if (!this.checkAndNewLink()) {
                return;
            }
            this.showQrCode = true;
            this.$nextTick(() => {
                //等待弹窗渲染再生成二维码，不然会报错
                this.newqrcode();
            });
        },
        //生成二维码
        newqrcode() {
            let that = this;
            // let qrcodeNode = that.$refs.qrcode;
            // qrcodeNode = 
            new QRCode("qrcode", {
                width: 200,
                height: 200,
                text: that.qrcodeLink
            });
        },
        //下载二维码
        downloadQrcode() {
            let qrcodeNode = this.$refs.qrcode;
            let a = document.createElement("a");
            a.href = qrcodeNode.childNodes[1].src;
            a.download = this.qrcodeDetail[this.qRcodeType].title;
            a.click();
        },

        /**
     * 复制字符串
     */
        copyStr(str) {
            var save = function (e) {
                e.clipboardData.setData("text/plain", str); //下面会说到clipboardData对象
                e.preventDefault(); //阻止默认行为
            };
            document.addEventListener("copy", save);
            document.execCommand("copy"); //使文档处于可编辑状态，否则无效
            utils.showToast("复制成功");
            document.removeEventListener("copy", save);
        }
    }
};
</script>

<style scoped lang="less">
.qrcodemaker {
  .line {
    display: flex;
    align-items: center;
    margin: 15px;
    span {
      flex: 0 0 120px;
      text-align: right;
    }
  }
  .decbox {
    margin-top: 15px;
    border: 1px solid #e2e2e2;
    padding: 10px;
    color: red;
  }

  .qrcodeWarp {
    width: 100%;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: #e4e4e4 solid 1px;
    padding-top: 15px;
    div {
      width: 100%;
      text-align: center;
      margin-bottom: 15px;
    }
    .qrcodeBox {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qrcodetitle {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>

