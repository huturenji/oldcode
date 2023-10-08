<template>
    <div class="agreementcomp">
        <div
            v-for="(item,index) in agreementArray"
            :key="item.id"
            class="agreement"
        >
            <div class="agreementindex">
                <div>{{ '协议' + (index + 1) }}</div>
                <div
                    v-if="index > 0"
                    class="delbtn"
                    @click="delItem(index)"
                >
                    删除
                </div>
            </div>
            <namedcomp compName="协议名称">
                <Input
                    slot="component"
                    v-model.trim="item.name"
                    clearable
                    maxlength="50"
                    placeholder="请输入协议名称"
                    style="width: 350px"
                />
            </namedcomp>
            <agreementsummary
                v-model="item.summary"
                :agreePos="index"
            />
            <namedcomp compName="摘要显示位置">
                <!-- <CheckboxGroup v-model="item.showPostion" slot="component">
                    <Checkbox
                        v-for="item1 in agreementShowPostion"
                        :key="item1.type"
                        :label="item1.type"
                    ></Checkbox>
                </CheckboxGroup>-->
                <div slot="component">
                    {{ agreementShowPostions[item.showPostion[0]] }}
                </div>
            </namedcomp>
            <namedcomp compName="上传协议书">
                <uploadfile
                    slot="component"
                    :uploadUrl="uploadUrl"
                    :id="index"
                    type="fileShort"
                    :defaultList="item.uploadDefault"
                    @onUploadChange="fileUpChange"
                ></uploadfile>
            </namedcomp>
            <namedcomp compName="备注">
                <Input
                    slot="component"
                    v-model.trim="item.mark"
                    clearable
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入备注"
                    style="width: 350px"
                />
            </namedcomp>
        </div>
        <div class="foot">
            <Button
                type="dashed"
                style="width: 600px;margin:10px"
                @click="addItem"
            >
                +添加协议
            </Button>
        </div>
    </div>
</template>

<script>
import namedcomp from "components/namedcomp/namedcomp";
import uploadfile from "components/uploadfile/uploadfile";
import agreementsummary from "./agreementsummaryht";
import * as projectconstant from "bislibs/projectconstant";
export default {
    props: {
        dataArray: {
            type: Array,
            default(){
                return []
            }
        }
    },
    components: {
        namedcomp,
        uploadfile,
        agreementsummary
    },
    data() {
        return {
            uploadUrl: projectconstant.uploadUrl,
            agreementShowPostions: {
                zixun: "资讯频道",
                mall: "商城VOP"
            },
            agreementShowPostion: [
                {
                    name: "资讯频道",
                    type: "zixun"
                },
                {
                    name: "商城VOP",
                    type: "mall"
                }
            ],
            agreementArray: []
        };
    },
    created() {},
    mounted() {},
    watch: {
        /**
         * 父组件传入的参数
         */
        dataArray: {
            handler(val) {
                // console.log("dataArray.watch" + JSON.stringify(val));
                if (val && val.length > 0) {
                    this.agreementArray = JSON.parse(JSON.stringify(val));
                } else {
                    this.agreementArray = [];
                }
            },
            deep: true,
            immediate: true
        },
        agreementArray: {
            handler(val) {
                if (val && val.length > 0) {
                    this.submit();
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        /**
         * 上传组件的输出，当有文件上传或者删除的时候会自动触发
         */
        fileUpChange(uploadFileList, index) {
            if (uploadFileList && uploadFileList.length > 0) {
                this.agreementArray[index].fileUrl = uploadFileList[0].url;
                this.agreementArray[index].fielName = uploadFileList[0].name;
            } else {
                this.agreementArray[index].fileUrl = "";
                this.agreementArray[index].fielName = "";
            }
        },
        getSummary() {
            //  this.agreementArray[index]
        },
        /**
         * 新增一条item
         */
        addItem() {
            this.agreementArray.push({
                id: "",
                name: "",
                summary: [""],
                showPostion: ["zixun"], //默认永远是资讯
                fielName: "",
                fileUrl: "",
                uploadDefault: [],
                mark: ""
            });
        },

        /**
         * 删除一条item
         */
        delItem(index) {
            if (index < 0 || index >= this.agreementArray.length) {
                
            } else {
                this.agreementArray.splice(index, 1);
            }
        },
        /**
         * 输出input，用于双向绑定的实现。这里不作任何校验，业务上的校验由页面来做
         */
        submit() {
            var copyValue = JSON.parse(JSON.stringify(this.agreementArray));
            // console.log("agreementArr=" + JSON.stringify(copyValue));
            this.$emit("onDataChange", copyValue); //v-model
        }
    }
};
</script>
<style scoped lang="less">
.agreementcomp {
    background: #fff;
    height: 100%;
    color: #333333;

    .agreement {
        border: 1px solid #e2e2e2;
        border-radius: 5px;
        background: white;
        margin: 10px 0;
        .agreementindex {
            border: 1px solid #e2e2e2;
            border-radius: 5px;
            background: #e2e2e2;
            color: black;
            padding: 5px;
            display: flex;
            justify-content: space-between;
            .delbtn {
                color: red;
                cursor: pointer;
            }
        }
    }
    .foot {
        display: flex;
        justify-content: center;
    }
}
</style>