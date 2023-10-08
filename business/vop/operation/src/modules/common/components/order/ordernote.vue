<template>
    <div class="order-note">
        <div class="title title-note">
            操作备注
        </div>
        <el-form 
            ref="note" 
            :model="validate" 
            label-width="77px" 
            :rules="ruleNoteValidate"
        >
            <el-form-item
                label="备注:"
                prop="note"
            >
                <el-input 
                    maxlength="200"
                    show-word-limit
                    v-model="validate.note" 
                    type="textarea" 
                    :rows="3" 
                    placeholder="请输入备注"
                />
            </el-form-item>
            <el-form-item class="note-btn-wrapper big-btn">
                <el-button
                    @click.native="confirm"
                    type="primary"
                >
                    确定
                </el-button>
                <el-button
                    @click.native="reset"
                    type="info"
                >
                    取消
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            note: "",
            validate: {
                note: ""
            },
            ruleNoteValidate: {
                note: [
                    {
                        required: true,
                        message: "操作备注不能为空",
                        trigger: "none"
                    }
                ]
            }
        };
    },
    methods: {
        confirm() {
            this.$refs["note"].validate(valid => {
                if (valid) {
                    this.$emit("on-confirm", {
                        value: this.validate.note
                    });
                } else {
                    return false;
                }
            });
        },
        reset() {
            this.$refs["note"].resetFields();
        }
    }
};
</script>
<style lang="less">
.order-note {
    padding: 16px 0;
    background-color: #fff;
    margin-bottom: 16px;
    border-radius: 8px;
    .title-note {
        border-bottom: 1px solid #eee;
        padding: 0 0 8px 32px;
    }
    .el-form-item {
        margin-top: 24px;
        padding: 0 32px;
    }
    .el-form-item__content {
        width: 50%;
    }
    .note-btn-wrapper {
        margin: 32px 0 16px 0;
    }
    .note-btn {
        padding: 12px 49px !important;
    }
}
</style>