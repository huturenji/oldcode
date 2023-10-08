<template>
    <div class="noAuth">
        <el-dialog
            :visible.sync="isShowModal"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :show-close="false"
            width="485px"
            custom-class="noAuth_modal"
            center
        >
            <div
                slot="title"
                class="noAuth_modal_title"
            >
                <span
                    class="cancelBtn"
                    @click="confirm"
                >×</span>
            </div>
            <div class="inconContent">
                暂无使用权限，如有需要请联系管理员开通
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
        isShowModal: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            isNoAuth:true
        };
    },
    methods: {
        confirm() {
            // this.isNoAuth = false
            location.replace(
                location.origin +
                    "/mallvop/static/operation/index.html"
            );
        }
    },
    watch: {
        isShowModal() {
            // this.isNoAuth =this.$props.isShowModal
            return this.$props.isShowModal;
        }
    }
};
</script>

<style lang="less">
.noAuth {
    .el-dialog {
        &__header {
            padding: 0;
        }
        .inconContent {
            font-size: 16px;
            text-align: center;
        }
        &__footer {
            .el-button {
                width: 139px;
                font-size: 16px;
            }
        }
    }
    &_modal {
        margin-top: 0 !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        position: absolute !important;
        &_title {
            line-height: 30px;
            font-size: 24px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .cancelBtn {
                float: right;
                font-size: 24px;
                padding: 0 10px;
                cursor: pointer;
                &:hover {
                    color: #409eff;
                }
            }
        }
    }
    .v-modal {
        background-color: #fff;
        opacity: 1;
    }
}
</style>