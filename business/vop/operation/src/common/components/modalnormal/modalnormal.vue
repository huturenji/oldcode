<template>
    <Modal
        v-model="value"
        width="410"
        :mask-closable="false"
        class-name="modalMormal"
    >
        <div
            v-show="title"
            slot="header"
            class="headerStyle"
        >
            {{ title }}
        </div>
        <div
            v-if="type=='confirm'"
            class="contentStyle"
        >
            {{ content }}
        </div>
        <div
            v-else-if="type=='input'"
            class="contentStyleInput"
        >
            <div>拒绝原因：</div>
            <Input
                v-model.trim="inputTypeData"
                clearable
                type="textarea"
                maxlength="200"
                show-word-limit
                placeholder="请输入拒绝原因"
                style="width: 300px"
            />
        </div>
        <div
            slot="footer"
            class="footerStyle"
        >
            <Button
                class="btnStyle"
                type="primary"
                @click="yes"
            >
                {{ yesbtntxt }}
            </Button>
            <Button
                class="btnStyle"
                @click="no"
            >
                {{ nobtntxt }}
            </Button>
        </div>
    </Modal>
</template>

<script>
export default {
    props: {
        //title
        title: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            default: "",
            required: true
        },
        //显示和隐藏
        value: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "confirm"
        },
        yesbtntxt: {
            type: String,
            default: "确定"
        },
        nobtntxt: {
            type: String,
            default: "取消"
        }
    },
    watch: {
        value: {
            handler(val) {
                this.$emit("input", val);
            }
        }
    },
    computed: {},
    data() {
        return {
            typeMap: {
                confirm: {},
                input: {}
            },
            inputTypeData: ""
        };
    },
    created() {},
    mounted() {},
    methods: {
        no() {
            this.$emit("onCancel");
        },
        yes() {
            if (this.type == "input") {
                this.$emit("onOK", this.inputTypeData);
            } else {
                this.$emit("onOK");
            }
        }
    }
};
</script>

<style scoped lang="less">
.headerStyle {
    text-align: center;
    font-weight: 700;
}
.contentStyle {
    text-align: center;
    padding: 10px 0 0 0;
}
.contentStyleInput {
    justify-content: center;
    align-items: center;
    padding: 10px 0 0 0;
    display: flex;
}
.footerStyle {
    display: flex;
    justify-content: center;
    .btnStyle {
        width: 91px;
        height: 24px;
        margin: 0 15px;
    }
}
</style>
<style lang="less">
.modalMormal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
        top: 0;
    }
}
.ivu-modal-content {
    background-color: white;
}
.ivu-modal-footer {
    border-top: none;
}
</style>