<!--
 * @Author: chengmingrui
 * @Date: 2020-04-16 18:45:46
 * @LastEditTime: 2020-04-20 13:59:22
 * @Description: 定价备注
 -->
<template>
    <li class="otherNote">
        <span class="otherNote_left">
            <em class="otherNote_left_dec">备注</em>
            <i class="otherNote_left_require"></i>
            <em class="otherNote_left_dec">：</em>
        </span>
        <div class="otherNote_right">
            <el-input
                type="textarea"
                maxlength="200"
                placeholder="请输入备注"
                show-word-limit
                resize="none"
                v-model="priceRemark"
                class="otherNote_right_note"
                :autosize="{ minRows: 2, maxRows: 6 }"
                @change="updataNote"
                clearable
            />
        </div>
    </li>
</template>

<script>
export default {
    props: {
        remark: {
            type: String,
            default: ""
        }
    },
    data: function() {
        return {
            priceRemark: "" // 备注名称
        };
    },
    watch: {
        remark() {
            this.priceRemark = this.$props.remark;
            return this.$props.remark;
        }
    },
    methods: {
        updataNote(newData) {
            this.$emit("updataNoteInfo", newData);
        }
    }
};
</script>

<style lang='less'>
@import "./otherNote.less";
</style>