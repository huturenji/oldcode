<template>
    <div class="order-box">
        <div class="box-header">
            <label class="title">{{ title }}</label>
            <div class="smaller-btn">
                <el-button 
                    v-if="btnTitle&&type != 'parent'"
                    @click.native="showPreview=true" 
                    :type="(!invoiceState || invoiceState=='UN_INVOICED' || invoiceUrl.length == 0)?'':'primary'" 
                    :disabled="(!invoiceState || invoiceState=='UN_INVOICED' || invoiceUrl.length == 0)?true:false"
                >
                    {{ btnTitle }}
                </el-button>
            </div>
        </div>
        <div class="box-content">
            <slot></slot>
        </div>
        <el-dialog
            class="invoice-dialog" 
            :visible.sync="showPreview"
            fullscreen
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <iframe 
                v-for="(turl,index) in invoiceUrl" 
                :key="index" 
                :src="turl" 
                width="100%" 
                height="100%"
            ></iframe>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        btnTitle: {
            type: String,
            default: ""
        },
        invoiceUrl: {
            type: Array,
            default: () => []
        },
        invoiceState: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            showPreview: false,
            url: ""
        };
    }
};
</script>
<style lang="less">
.order-box {
    min-height: 100px;
    background-color: #fff;
    padding: 16px 0 32px 0;
    margin-bottom: 16px;
    border-radius: 8px;
    .box-header {
        padding: 0 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .box-content {
        margin-top: 8px;
        border-top: 1px solid #eee;
    }
    .invoice-dialog {
        overflow: unset;
        .el-dialog__body {
            padding: 0;
            width: 100%;
            height: 100%;
        }
        .el-dialog__header {
            padding: 0;
        }
        .el-dialog {
            transform: none;
            top: unset;
            left: unset;
        }
        .el-dialog.is-fullscreen {
            overflow-x: hidden;
            overflow-y: scroll;
        }
    }
}
</style>