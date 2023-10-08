<template>
    <div class="setlottery">
        <div class="operationbox">
            <div class="settingbox">
                <namedcomp>
                    <div slot="compName" class="copmnamebox">
                        <div class="title">
                            <span>活动名称</span> <span class="xing">*</span>
                        </div>
                    </div>
                    <div slot="component">
                        <el-input
                            v-model.trim="settingData.activityName"
                            clearable
                            maxlength="14"
                            placeholder="请输入活动名称"
                            style="width: 270px"
                            ref="focusId"
                        />
                        <div
                            class="errnametip"
                            v-if="
                                !!settingData.activityName &&
                                settingData.activityName.length > 60
                            "
                        >
                            活动名称不要超过六十个字符
                        </div>
                        <div
                            class="errnametip"
                            v-if="!!canNext && !settingData.activityName"
                        >
                            请输入活动名称
                        </div>
                    </div>
                </namedcomp>

                <!-- <namedcomp>
                    <div slot="compName" class="copmnamebox">
                        <div class="title">
                            <span>重复中奖</span> <span class="xing">*</span>
                        </div>
                    </div>
                    <div slot="component">
                        <el-radio-group v-model="settingData.repeatDraw">
                            <el-radio :label="2">允许</el-radio>
                            <el-radio :label="1">不允许</el-radio>
                        </el-radio-group>
                        <div
                            class="errnametip"
                            v-if="
                                !(
                                    settingData.repeatDraw == 1 ||
                                    settingData.repeatDraw == 2
                                )
                            "
                        >
                            请选择一个选项
                        </div>
                    </div>
                </namedcomp> -->

                <namedcomp>
                    <div slot="compName" class="copmnamebox">
                        <div class="title">
                            <span>活动规则</span>
                        </div>
                    </div>
                    <div slot="component">
                        <div class="wangedit">
                            <div
                                id="editorElemToolbar"
                                class="editorElemToolbar"
                            ></div>
                            <div
                                id="editorElemContent"
                                class="editorElemContent"
                            ></div>
                            <div class="maxlength">
                                {{ txtNumbers + '/' + txtMaxlength }}
                            </div>
                        </div>
                        <div
                            class="errnametip"
                            v-if="txtNumbers > txtMaxlength"
                        >
                            {{ ruleMoreLengthErrText }}
                        </div>
                    </div>
                </namedcomp>

                <namedcomp>
                    <div slot="compName" class="copmnamebox">
                        <div class="title">
                            <span>奖项设置</span> <span class="xing">*</span>
                        </div>
                    </div>
                    <div slot="component">
                        <div>
                            <div
                                v-for="(
                                    item, index
                                ) in settingData.prizeSetList"
                                :key="index"
                                class="oneprize"
                            >
                                <div class="line1">
                                    <span class="theName">{{
                                        '奖项' + numTranspor(index)
                                    }}</span>
                                    <el-button
                                        class="thedelbtn"
                                        round
                                        icon="el-icon-delete"
                                        @click="deleteOnlinePrize(index)"
                                    ></el-button>
                                </div>
                                <namedcomp
                                    compName="选择奖项"
                                    align="start"
                                    requiredAfter
                                    nocolon
                                    style="margin-bottom: 10px"
                                >
                                    <el-select
                                        slot="component"
                                        v-model="item.prizeGrade"
                                        value-key="value"
                                        @change="
                                            onPrizeGradeChange($event, item)
                                        "
                                        requiredAfter
                                        placeholder="请选择奖项"
                                    >
                                        <el-option
                                            v-for="item in prizeGrades"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item"
                                        >
                                        </el-option>
                                    </el-select>
                                </namedcomp>

                                <namedcomp
                                    compName="奖项名称"
                                    align="start"
                                    nocolon
                                    requiredAfter
                                    style="margin-bottom: 10px"
                                >
                                    <div slot="component">
                                        <el-input
                                            v-model.trim="item.gradeName"
                                            clearable
                                            maxlength="12"
                                            placeholder="请输入奖项名称"
                                            style="width: 270px"
                                        />
                                        <div
                                            class="errnametip"
                                            v-if="
                                                !!canNext &&
                                                !item.prizeGrade.value
                                            "
                                        >
                                            请选择奖项
                                        </div>
                                        <div
                                            class="errnametip"
                                            v-if="!!canNext && !item.gradeName"
                                        >
                                            请输入奖项名称
                                        </div>
                                    </div>
                                </namedcomp>

                                <namedcomp
                                    compName="选择奖品"
                                    align="start"
                                    nocolon
                                    requiredAfter
                                    style="margin-bottom: 10px"
                                >
                                    <div slot="component">
                                        <el-select
                                            clearable
                                            v-model="item.good"
                                            @change="onPrizeChange"
                                            value-key="goodId"
                                            placeholder="请选择1个奖品"
                                        >
                                            <el-option
                                                v-for="prize in allPrizeGood"
                                                :key="prize.goodId"
                                                :label="
                                                    prize.inputName ||
                                                    prize.name
                                                "
                                                :value="prize"
                                                :disabled="prize.disabled"
                                            >
                                            </el-option>
                                        </el-select>
                                        <div
                                            class="errnametip"
                                            v-if="!item.good"
                                        >
                                            请选择1个奖品
                                        </div>
                                    </div>
                                </namedcomp>

                                <namedcomp
                                    v-if="!!item.good"
                                    compName="奖项奖品"
                                    align="start"
                                    nocolon
                                    requiredAfter
                                    style="margin-bottom: 10px"
                                >
                                    <div slot="component">
                                        <div class="goodbox" v-if="!!item.good.offPrizeType">
                                            <div>
                                                名称：{{
                                                    item.good.inputName ||
                                                    item.good.name
                                                }}
                                            </div>
                                            <div class="imgline">
                                                <div>图片：</div>
                                                <el-image
                                                    class="imgbox"
                                                    :src="
                                                        item.good.img ||
                                                        item.good.selectedImg
                                                    "
                                                    lazy
                                                    fit="cover"
                                                ></el-image>
                                            </div>
                                            <div v-if="item.good.price">
                                                价格：￥{{ item.good.price }}
                                            </div>
                                            <div>数量：{{ item.good.num }}</div>
                                        </div>
                                        <div class="goodsBox" v-if="!item.good.offPrizeType">
                                            <gooditem :good="item.good" :showNum="item.good.num"/>
                                        </div>
                                    </div>
                                </namedcomp>
                            </div>
                            <el-button type="primary" @click="addNewPrize"
                                >添加奖项</el-button
                            >
                        </div>
                        <div
                            class="errnametip"
                            v-if="
                                !(
                                    settingData.prizeSetList &&
                                    settingData.prizeSetList.length
                                )
                            "
                        >
                            请添加一个奖项
                        </div>
                    </div>
                </namedcomp>
            </div>
        </div>
        <div class="privewbox">
            <!-- <preview
                class="compBox"
                :previewData="previewData"
                :count="settingData.numRafflesDay"
            ></preview> -->
        </div>
    </div>
</template>
<script>
import { utils } from 'opcl'
import {
    num2Chinese,
    getLifecycleItem,
    geSettingLotteryData,
    getAddPrizeData
} from 'bislibs/home/newlottery-lifecycle'
const gooditem = () => import("./goodItem2.vue");
const preview = () => import('biscomponents/home/priview/preview-lottery.vue')
import E from 'wangeditor'
export default {
    props: {
        //这里的点击 下一步 的结果集，因为本页面 UE 要求错误提示在页面显示，不需要toast
        canNext: {
            type: Object,
            default: null
        }
    },
    components: {
        preview,
        gooditem
    },
    data() {
        return {
            settingData: geSettingLotteryData().settingData,
            ruleMoreLengthErrText: '不能超过2000字',
            previewData: {
                goodsType: 1, //添加的商品是线上还是线下
                onlinePrizes: [],
                offlinePrizes: []
            }, //预览所需数据
            txtNumbers: 0, //实时统计的输入字数
            editortext: '', //输入的字符串，包含样式
            txtMaxlength: 5000,
            prizeGrades: [
                {
                    value: 1,
                    label: '一等奖'
                },
                {
                    value: 2,
                    label: '二等奖'
                },
                {
                    value: 3,
                    label: '三等奖'
                },
                {
                    value: 4,
                    label: '四等奖'
                },
                {
                    value: 5,
                    label: '五等奖'
                },
                {
                    value: 6,
                    label: '六等奖'
                },
                {
                    value: 7,
                    label: '七等奖'
                },
                {
                    value: 8,
                    label: '八等奖'
                },
                {
                    value: 9,
                    label: '九等奖'
                },
                {
                    value: 10,
                    label: '幸运奖'
                },
                {
                    value: 11,
                    label: '阳光普照奖'
                }
            ],
            allPrizeGood: [], //线上或线下的奖品总和
            firstLoad: false //是否已经执行了mounted，是否是首次执行
        }
    },
    watch: {
        txtNumbers: {
            handler(val) {
                if (val > this.txtMaxlength) {
                    this.editortext = this.editortext.substring(
                        0,
                        this.txtMaxlength
                    )

                    this.editorComp.txt.clear()
                    this.editorComp.txt.html(this.editortext)
                }
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
        //首次进来会执行一次
        this.firstLoad = true
        this.initWangEdtor()
        this.getGoodsData()
        // this.$refs.focusId && this.$refs.focusId.focus()
    },
    activated() {
        //防止与mounted重复执行
        if (!this.firstLoad) {
            this.getGoodsData()
            // this.$refs.focusId && this.$refs.focusId.focus()
        }
    },
    deactivated() {
        this.firstLoad = false
    },
    methods: {
        //奖项等级 选择
        onPrizeGradeChange(event, prize) {
            prize.gradeName = event.label
        },
        //奖项奖品 选择
        onPrizeChange(event) {
            this.allPrizeGood.forEach((element) => {
                let find = this.settingData.prizeSetList.find((item) => {
                    return item.good && item.good.goodId == element.goodId
                })

                //如果奖品已经被选择了，设置为不可选择
                element.disabled = !!find
            })
        },
        //根据奖品列表 重置 奖项的奖品列表数据
        initPrizeSets() {
            this.settingData.prizeSetList.forEach((element) => {
                let find = this.allPrizeGood.find((item) => {
                    return element.good && element.good.goodId == item.goodId
                })
                //如果奖品列表 没找到已选择的奖品，同步置空已选列表数据
                if (!find) {
                    element.good = undefined
                }else {
                    //如果找到了，替换一下
                    element.good = find
                }
            })
            this.onPrizeChange()
        },
        //新增一个奖项
        addNewPrize() {
            this.settingData.prizeSetList.splice(
                this.settingData.prizeSetList.length,
                0,
                {
                    //新增的时候，默认grade是没有选择的
                    prizeGrade: {},
                    gradeName: '',
                    good: null
                }
            )
            this.onPrizeChange()
        },
        //删除一个奖项
        deleteOnlinePrize(index) {
            this.settingData.prizeSetList.splice(index, 1)
            this.onPrizeChange()
        },
        //获取预览所需商品信息
        getGoodsData() {
            this.previewData.onlinePrizes = getAddPrizeData().onlinePrizes
            this.previewData.offlinePrizes = getAddPrizeData().offlinePrizes
            //现场开的奖品
            this.previewData.xckPrizes = this.settingData.prizeSetList

            //奖项设置 选择奖品
            this.allPrizeGood = JSON.parse(
                JSON.stringify(this.previewData.onlinePrizes)
            ).concat(JSON.parse(JSON.stringify(this.previewData.offlinePrizes)))

            this.initPrizeSets()
        },
        initWangEdtor() {
            this.editorComp = new E('#editorElemToolbar', '#editorElemContent')
            // debugger;
            // 关闭粘贴样式的过滤
            // this.editorComp.config.pasteFilterStyle = false;
            this.editorComp.config.placeholder = '请输入抽奖说明'

            this.editorComp.config.menus = [
                // 菜单配置
                'fontSize', // 字号
                'foreColor', // 文字颜色
                // "backColor", // 背景颜色
                // "head", // 标题
                'bold', // 粗体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'list', // 列表
                'justify' // 对齐方式
                // "fontName", // 字体
                // "link", // 插入链接
                // "quote", // 引用
                // "emoticon", // 表情
                // "image", // 插入图片
                // "table", // 表格
                // "code", // 插入代码
                // "undo", // 撤销
                // "redo" // 重复
            ]
            // 自定义配置颜色（字体颜色、背景色）
            this.editorComp.config.colors = [
                '#000000',
                '#1c487f',
                '#191919',
                '#23c7ad',

                '#25cb67',
                '#333333',
                '#3864A7',
                '#407cd6',

                '#4d80bf',
                '#46acc8',
                '#478aee',
                '#666666',

                '#7b5ba1',
                '#8baa4a',
                '#999999',
                '#a9a9a9',

                '#b2b2b2',
                '#B5d0f9',
                '#c2c2c2',
                '#c24f4a',

                '#cccccc',
                '#d7d7d7',
                '#e7e7e7',
                '#eeece0',

                '#ecf3fd',
                '#e5e5e5',
                '#f9963b',
                '#f2f3f5',

                '#f25e3d',
                '#f83939',
                '#f8a339',
                '#ff4e4e',

                '#ff8b03',
                '#ffebeb',
                '#ffffff'
            ]

            // 把这个html通过submit的方法传入父组件
            this.editorComp.config.onchange = (html) => {
                //监听txt的变化
                this.editortext = this.editorComp.txt.text()
                this.txtNumbers =
                    (this.editortext && this.editortext.length) || 0
                this.settingData.activityRule = html
                this.settingData.editortext = this.editortext
                // console.log(this.settingData.activityRule.length);
            }
            // 取消自动 focus
            this.editorComp.config.focus = false
            this.editorComp.create() // 创建富文本实例
            //赋初值
            this.editorComp.txt.html(this.settingData.activityRule)
        },
        numTranspor(numindex) {
            return num2Chinese(numindex)
        }
    }
}
</script>
<style lang="less" scoped>
.setlottery {
    display: flex;
    height: calc(~'100vh - 305px');
    overflow: auto;
    .operationbox {
        flex: 1;
        .settingbox {
            border: 1px solid #e2e2e2;
            padding: 10px;
            /deep/ .el-input__inner {
                padding-left: 5px;
                padding-right: 5px;
            }
            .errnametip {
                color: red;
                font-size: x-small;
            }
            .copmnamebox {
                width: 120px;
                padding-left: 16px;
                .title {
                    display: flex;
                    .xing {
                        color: red;
                    }
                }
                .tip {
                    color: gray;
                }
            }
            .wangedit {
                position: relative;
                .editorElemToolbar {
                    border: 1px solid #e2e2e2;
                    border-bottom: none;
                }
                .editorElemContent {
                    border: 1px solid #e2e2e2;
                    height: 150px;
                    width: 500px;
                    /deep/ ul,
                    ul li {
                        list-style-type: initial;
                    }
                }
                .maxlength {
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    z-index: 10000;
                    background: transparent;
                    color: black;
                }
            }
            .oneprize {
                border: 1px solid #e2e2e2;
                margin-bottom: 16px;
                width: 550px;
                .line1 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    background: #f7f8fa;
                    height: 44px;
                    margin-bottom: 10px;
                    .theName {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .thedelbtn {
                        border: none;
                        color: red;
                        background: transparent;
                    }
                }
                .goodbox {
                    border: 1px solid #e2e2e2;
                    width: 350px;
                    padding: 5px;
                    .imgline {
                        display: flex;
                    }
                    .imgbox {
                        width: 70px;
                        height: 70px;
                        margin: 5px;
                        border: 1px solid #e2e2e2;
                    }
                }
            }
        }
    }
    .privewbox {
        flex: 1;
        display: flex;
        justify-content: center;
    }
}
</style>