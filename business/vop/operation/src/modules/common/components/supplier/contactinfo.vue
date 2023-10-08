<template>
    <div class="infosComp">
        <div
            v-for="(info,index) in value"
            :key="info"
            class="infoItem"
        >
            <div class="space">
                {{ "联系人" + (index + 1) + ":" }}
            </div>
            <Input
                v-model.trim="info.role"
                clearable
                maxlength="10"
                placeholder="请输入职务"
                :style="{width: '130px',marginRight:'5px'}"
            />
            <Input
                v-model.trim="info.name"
                clearable
                maxlength="10"
                placeholder="请输入名字"
                :style="{width: '130px',marginRight:'5px'}"
            />
            <Input
                v-model.trim="info.phone"
                clearable
                maxlength="30"
                @input="judegeInputIsNum(info.phone)"
                placeholder="请输入手机号"
                :style="{width: '130px',marginRight:'5px'}"
            />
            <Input
                v-model.trim="info.email"
                clearable
                maxlength="50"
                type="email"
                placeholder="请输入邮箱"
                :style="{width: '130px',marginRight:'5px'}"
            />
            <Input
                v-model.trim="info.telephone"
                clearable
                maxlength="20"
                type="tel"
                placeholder="请输入电话"
                :style="{width: '130px',marginRight:'5px'}"
            />
            <div
                class="delbtn"
                @click="delInfo(index)"
            >
                -删除
            </div>
        </div>
        <Button
            v-if="value && value.length < maxlength"
            type="dashed"
            :style="{color:'#478aee',width:'800px',margin:'10px 70px'}"
            @click="addInfo"
        >+添加</Button>
    </div>
</template>

<script>
import utilshandler from "bislibs/utils";
export default {
    props: {
        value: {
            type: Array,
            default(){
                return []
            }
        }
    },
    data() {
        return {
            maxlength: 5 //最多联系人个数
        };
    },
    watch: {
        value: {
            handler(val) {
                // console.log("value=" + JSON.stringify(val));
                this.$emit("input", val);
            },
            deep: true
        }
    },
    created() {},
    mounted() {},
    methods: {
        delInfo(index) {
            if (this.value && this.value[index]) {
                this.value.splice(index, 1);
            }
        },
        addInfo() {
            if (this.value && this.value.length >= 5) {
                utilshandler.showToast("最多可以添加5个");
                return;
            }
            var emptyInfo = {
                role: "",
                name: "",
                phone: "",
                email: "",
                telephone: ""
            };
            this.value.push(emptyInfo);
        },
        /**
         * 手机号码只能输入数字
         */ 
        judegeInputIsNum(str) {
            if (str && !utilshandler.isNaturalNumber(str)) {
                utilshandler.showToast("手机号请输入数字");
            }
        }
    }
};
</script>

<style scoped lang="less">
.infosComp {
    .infoItem {
        margin: 5px 0;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        .space {
            margin: 0 5px;
            width: 60px;
        }
        .delbtn {
            color: red;
            cursor: pointer;
        }
    }
}
</style>