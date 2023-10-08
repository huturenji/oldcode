<template>
    <div class="auth-tip">
        <el-dialog
            class="auth-dialog"
            :visible.sync="showAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            :modal-append-to-body="false"
            width="560px"
            center
        >
            <div
                slot="title"
                class="header-title"
            >
                <span class="confirmTitle">{{ tips.title }}</span>
                <span
                    class="cancelBtn"
                    @click="confirm"
                >×</span>
            </div>
            <div class="inconContent">
                <p>{{ tips.content }}</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="confirm"
                >我知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        tips: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            showAuth: this.show
        };
    },
    methods: {
        confirm() {
            this.$emit("confirm");
        }
    }
};
</script>
<style lang="less">
.auth-dialog {
    .el-dialog {
        border-radius: 8px;
        .el-dialog__header {
            overflow: hidden;
            padding: 0;
            border-bottom: 1px solid #efefef;
            .header-title {
                position: relative;
                .confirmTitle {
                    font-size: 16px;
                    color: #333;
                    font-weight: bold;
                    line-height: 56px;
                }
                .cancelBtn {
                    position: absolute;
                    right: 15px;
                    top: 6px;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                }
                .cancelBtn:hover {
                    color: #409eff;
                }
            }
        }
        .el-dialog__body {
            padding: 32px 25px;
            color: #333;
            .inconContent {
                p {
                    font-size: 16px;
                    text-align: center;
                }
            }
        }
        .el-dialog__footer {
            padding: 0 20px 48px;
            .el-button {
                font-size: 16px;
                width: 144px;
                height: 48px;
                border-radius: 8px;
            }
        }
    }
}
</style>