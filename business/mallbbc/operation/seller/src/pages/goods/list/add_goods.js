import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
// eslint-disable-next-line no-unused-vars
import { Form, Input, Spin, InputNumber, Switch, Checkbox, Table,Tabs,Button,Modal } from 'antd';
import {
    failTip,
    sucTip,
    getSldEmptyH,
    calcDescartes,
    sldComLanguage,
    list_com_page_more,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    commonSetting,
    isEqualArray,
    sldCommonTitleByBg,
    getStorage,
    isEmpty,
    setSession,
    getSession,
    removeSession
} from '@/utils/utils';
import { saveData,useData } from './save'
import _uniqBy from 'lodash/uniqBy';

import global from '@/global.less';
import { apiUrl, uploadLimit } from '@/utils/sldconfig';
import SldReactQuill from '@/components/SldReactQuill';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import SldTableSingleRow from '@/components/SldTableSingleRow';

import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SelGoodsCat from './components/sel_goods_cat';
import Tax from './components/tax';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;
const storeId = getStorage('storeId');
let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ product, global, common }) => ({
    product, global, common
}))
@Form.create()
export default class AddGoods extends Component {
  
  common_express = {
      type: 'inputnum',
      label: `${sldComLanguage('设置固定运费(元)')}`,
      name: 'freightFee',
      placeholder: `${sldComLanguage('请输入运费金额')}`,
      initialValue: '',
      required: true,
      max: 999999,
      min: 0,
      precision: 2,
      rules: [{
          required: true,
          message: `${sldComLanguage('请输入运费金额')}`
      }]
  };//设置统一运费

special_express = {
    type: 'select',
    label: `${sldComLanguage('运费模板')}`,
    name: 'freightId',
    placeholder: `${sldComLanguage('请选择运费模板')}`,
    extra: `${sldComLanguage('商品运费计算模板，如果没有该类型模板，请先去维护运费模板')}`,
    width: 400,
    sel_data: [],
    sele_key: 'freightTemplateId',
    sele_name: 'templateName',
    diy: true,
    required: true,
    rules: [{
        required: true,
        message: `${sldComLanguage('请选择运费模版')}`
    }]
};//运费模板

img_item = {
    type: 'upload_img_upload',
    label: `${sldComLanguage('图片')}`,
    name: 'image',
    extra: `${sldComLanguage('建议尺寸800px*800px的方形图片,最大限制')}${uploadLimit}${sldComLanguage('M,在保证图片质量的情况下图片越小加载效果越好,最多可上传9张')}`,
    fileList: [],
    upload_name: 'file',
    upload_url: `${apiUrl }v3/oss/common/upload?source=goods`,
    initialValue: '',
    img_succ_info: {},
    required: true,
    item_height: 140
};//图片数据

service_list = [];

//商品标签分列表
store_cat_list = [];

//店铺分类列表
sel_cat_data = [];

//选择的店铺分类数组
store_attr_group = [];

//店铺属性分组
store_attr_group_attr_list = [];

//店铺属性分组下的属性列表
search_attr_list = [];

//搜索属性列表
constructor(props) {
    super(props);
    sthis = this;
    const {
        form: { getFieldDecorator }
    } = props;
    this.state = {
        disable_spec:false, // 编辑状态下禁用规格维度的增改删
        show_radio_flag: false,//是否显示radio类型的数据
        is_set_img_spec: false,//是否设置图片规格
        top_nav_step: 1,//顶部导航当前步骤
        step: 1,//发布商品步骤
        modalVisible: false,//选择分类modal框
        submiting: false,//选择分类modal框,确定按钮的loading框架
        express_show: false,//是否展示物流
        commonTop: 60,//nav切换时到顶部的距离
        loading: false,
        pageLoading: false,//页面loading
        show_table_modal_add: false,//是否显示input后缀搜索modal上的新增按钮，默认不显示
        modalSldAddVisible: false,//是否显示input后缀add的modal框，默认不显示
        tablesldSAddTitle: `${sldComLanguage('添加')}`,//input后缀add的modal框的标题   添加
        search_add_modal_width: 500,//input后缀add的modal框的宽度
        search_modal_width: 600,//默认搜索，modal宽度
        tableTitle: '',//弹框选择的标题
        cur_type: '',//show_list表示表格搜索，add表示添加数据
        cur_operate_type: '',//当前操作对象
        modalTableVisible: false,//选择商品类型弹框
        cur_data: [],//分类当前选中的数据
        sele_goods_cat_data: [],//选择的商品分类信息
        goods_fileList: [],//商品列表
        description: '',//富文本内容
        spuDetail: '',//spu富文本内容
        goodsCategoryId: '',//商品分类id
        goods_cat: [[], [], []],//平台商品分类数据
        filteredInfo: null,
        sortedInfo: null,
        modal_width: 800,//图片预览宽度
        show_preview_modal: false,//预览图片modal框是否展示
        preview_img: '',//预览图片
        preview_alt_con: '',//预览图片内容
        price: 0.000,//spu的售价
        bprice: 0.000,//spu的进价
        cost: 0.000,//spu的成本价
        query: props.location.query,
        screentW: '1000',
        screentH: '1000',
        selectedRows: [],
        selectedRowKeys: [],//selectedRows的key
        columns_spec: [
            {
                title: ' ',
                dataIndex: 'key',
                align: 'center',
                width: 30,
                render: (text, record, index) => index + 1
            },
            // {
            //     title: '市场价',
            //     dataIndex: 'marketPrice',
            //     align: 'center',
            //     width: 100,
            //     render: (text, record) => (
            //         <FormItem
            //             style={{ width: '100%' }}
            //         >
            //             {getFieldDecorator(`marketPrice${record.key}`, {
            //                 initialValue: text
            //             })(
            //                 <InputNumber
            //                     min={0.01}
            //                     max={9999999}
            //                     precision={2}
            //                     style={{ width: '100%' }}
            //                     onChange={e => this.handleFieldChange(e, 'marketPrice', record.key)}
            //                 />,
            //             )}
            //         </FormItem>
            //     )
            // },
            {
                title: '价格',
                dataIndex: 'productPrice',
                align: 'center',
                width: 100,
                filterDropdown: <span />,
                filterIcon: <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productPrice${record.key}`, {
                            initialValue: text, rules: [{
                                required: true,
                                message: `${sldComLanguage('该项必填')}`
                            }]
                        })(
                            <InputNumber
                                min={0.01}
                                max={9999999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'productPrice', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: '结算价',
                dataIndex: 'settlementPrice',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`settlementPrice${record.key}`, {
                            initialValue: text
                        })(
                            <InputNumber
                                min={0.01}
                                max={9999999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'settlementPrice', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('库存')}`,
                dataIndex: 'productStock',
                align: 'center',
                width: 100,
                filterDropdown: <span />,
                filterIcon: <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productStock${record.key}`, {
                            initialValue: text, rules: [{
                                required: true,
                                message: `${sldComLanguage('该项必填')}`
                            }]
                        })(
                            <InputNumber
                                min={0}
                                max={99999999}
                                precision={0}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'productStock', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('重量(KG)')}`,
                dataIndex: 'weight',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`weight${record.key}`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'weight', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('长(CM)')}`,
                dataIndex: 'length',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`length${record.key}`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'length', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('宽(CM)')}`,
                dataIndex: 'width',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`width${record.key}`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'width', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('高(CM)')}`,
                dataIndex: 'height',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`height${record.key}`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'height', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('预警值')}`,
                dataIndex: 'productStockWarning',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productStockWarning${record.key}`, {
                            initialValue: text
                        })(
                            <InputNumber
                                min={0}
                                max={300}
                                precision={0}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e, 'productStockWarning', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('sku')}`,
                dataIndex: 'productId',
                align: 'center',
                width: 150,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productId`, {
                            initialValue: `${text}`, rules: [{
                                maxLength: 50,
                                message: `${sldComLanguage('最多50个字符')}`
                            }]
                        })(
                            <Input
                                maxLength={250}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e.target.value, 'productId', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            // {
            //     title: `${sldComLanguage('供应商sku')}`,
            //     dataIndex: 'productCode',
            //     align: 'center',
            //     width: 150,
            //     render: (text, record) => (
            //         <FormItem
            //             style={{ width: '100%' }}
            //         >
            //             {getFieldDecorator(`productCode${record.key}`, {
            //                 initialValue: text, rules: [{
            //                     maxLength: 50,
            //                     message: `${sldComLanguage('最多50个字符')}`
            //                 }]
            //             })(
            //                 <Input
            //                     maxLength={250}
            //                     style={{ width: '100%' }}
            //                     onChange={e => this.handleFieldChange(e.target.value, 'productCode', record.key)}
            //                 />,
            //             )}
            //         </FormItem>
            //     )
            // },
            {
                title: `${sldComLanguage('条形码')}`,
                dataIndex: 'barCode',
                align: 'center',
                width: 150,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`barCode${record.key}`, {
                            initialValue: text, rules: [{
                                maxLength: 30,
                                message: `${sldComLanguage('最多30个字符')}`
                            }]
                        })(
                            <Input
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e.target.value, 'barCode', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            }, {
                title: `${sldComLanguage('启用')}`,
                dataIndex: 'state',
                align: 'center',
                width: 60,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`state${record.key}`, {
                            valuePropName: 'checked',
                            initialValue: text == 1 ? true : false
                        })(
                            <Switch
                                style={{ width: '100%' }}
                                // disabled={record.isDefault == 1 ? true : false}
                                onChange={e => this.handleFieldChange(e ? 1 : 2, 'state', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            } 
            // {
            //     title: `${sldComLanguage('默认选中')}`,
            //     dataIndex: 'isDefault',
            //     align: 'center',
            //     width: 60,
            //     render: (text, record) => <FormItem
            //         style={{ width: '100%' }}
            //     >
            //         {getFieldDecorator(`isDefault${record.key}`, {
            //             valuePropName: 'checked',
            //             initialValue: text == 1 ? true : false
            //         })(
            //             <Checkbox
            //                 onChange={e => this.handleFieldChangeDefault(e.target.checked ? 1 : 0, 'isDefault', record.key)}
            //             />,
            //         )}
            //     </FormItem>
            // }
        ],//商品规格表头
        columns_spu: [
            {
                title: ' ',
                dataIndex: 'key',
                align: 'center',
                width: 30,
                render: (text, record, index) => index + 1
            },
            // {
            //     title: `${sldComLanguage('市场价')}`,
            //     dataIndex: 'marketPrice',
            //     align: 'center',
            //     width: 100,
            //     render: (text, record) => (
            //         <FormItem
            //             style={{ width: '100%' }}
            //         >
            //             {getFieldDecorator(`marketPrice`, {
            //                 initialValue: text
            //             })(
            //                 <InputNumber
            //                     min={0.01}
            //                     max={9999999}
            //                     precision={2}
            //                     style={{ width: '100%' }}
            //                     onChange={e => this.handleFieldChangeSpu(e, 'marketPrice', record.key)}
            //                 />,
            //             )}
            //         </FormItem>
            //     )
            // },
            {
                title: '价格',
                dataIndex: 'productPrice',
                align: 'center',
                width: 100,
                filterDropdown: <span />,
                filterIcon: <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productPrice`, {
                            initialValue: text, rules: [{
                                required: true,
                                message: `${sldComLanguage('该项必填')}`
                            }]
                        })(
                            <InputNumber
                                min={0.01}
                                max={9999999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'productPrice', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('结算价格')}`,
                dataIndex: 'settlementPrice',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`settlementPrice`, {
                            initialValue: text
                        })(
                            <InputNumber
                                min={0.01}
                                max={9999999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'settlementPrice', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('库存')}`,
                dataIndex: 'goodsStock',
                align: 'center',
                width: 100,
                filterDropdown: <span />,
                filterIcon: <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`goodsStock`, {
                            initialValue: text, rules: [{
                                required: true,
                                message: `${sldComLanguage('该项必填')}`
                            }]
                        })(
                            <InputNumber
                                min={0}
                                max={99999999}
                                precision={0}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'goodsStock', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('重量(KG)')}`,
                dataIndex: 'weight',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`weight`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'weight', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('长(CM)')}`,
                dataIndex: 'length',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`length`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'length', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('宽(CM)')}`,
                dataIndex: 'width',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`width`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'width', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('高(CM)')}`,
                dataIndex: 'height',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`height`, {
                            initialValue: text ? text : 1
                        })(
                            <InputNumber
                                min={0.01}
                                max={999}
                                precision={2}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'height', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('预警值')}`,
                dataIndex: 'stockWarning',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`stockWarning`, {
                            initialValue: text
                        })(
                            <InputNumber
                                min={0}
                                max={300}
                                precision={0}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e, 'stockWarning', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            {
                title: `${sldComLanguage('sku')}`,
                dataIndex: 'productId',
                align: 'center',
                width: 150,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`productId`, {
                            initialValue: `${text}`, rules: [{
                                maxLength: 50,
                                message: `${sldComLanguage('最多50个字符')}`
                            }]
                        })(
                            <Input
                                maxLength={250}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChange(e.target.value, 'productId', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            },
            // {
            //     title: `${sldComLanguage('供应商sku')}`,
            //     dataIndex: 'productCode',
            //     align: 'center',
            //     width: 150,
            //     render: (text, record) => (
            //         <FormItem
            //             style={{ width: '100%' }}
            //         >
            //             {getFieldDecorator(`productCode`, {
            //                 initialValue: text, rules: [{
            //                     maxLength: 50,
            //                     message: `${sldComLanguage('最多50个字符')}`
            //                 }]
            //             })(
            //                 <Input
            //                     maxLength={250}
            //                     style={{ width: '100%' }}
            //                     onChange={e => this.handleFieldChangeSpu(e.target.value, 'productCode', record.key)}
            //                 />,
            //             )}
            //         </FormItem>
            //     )
            // },
            {
                title: `${sldComLanguage('条形码')}`,
                dataIndex: 'barCode',
                align: 'center',
                width: 150,
                render: (text, record) => (
                    <FormItem
                        style={{ width: '100%' }}
                    >
                        {getFieldDecorator(`barCode`, {
                            initialValue: text, rules: [{
                                maxLength: 30,
                                message: `${sldComLanguage('最多30个字符')}`
                            }]
                        })(
                            <Input
                                maxLength={250}
                                style={{ width: '100%' }}
                                onChange={e => this.handleFieldChangeSpu(e.target.value, 'barCode', record.key)}
                            />,
                        )}
                    </FormItem>
                )
            }],//spu商品价格信息表头
        goods_video_data: [{
            type: 'upload_video',
            label: `${sldComLanguage('商品视频')}`,
            name: 'video',
            extra: `${sldComLanguage('最大限制')}${uploadLimit}${sldComLanguage('M,支持mp4格式,推荐时长不低于6s,不超过90s')}`,
            fileList: [],
            upload_name: 'file',
            upload_url: `${apiUrl }v3/oss/common/upload?source=video`,
            initialValue: '',
            img_succ_info: {},
            item_height: 140,
            uploadPreview: this.uploadImgPre,
            delVideo: this.delVideo,
            uploadChange: (info) => this.uploadVideo(info, 'video')
        }],
        goods_img_data: [],
        spu_img_data: [], //spu图片信息
        spec_set_data: [{
            type: 'goods_spec_sele_b2c',
            label: `${sldComLanguage('规格选择')}`,
            name: 'goods_spec_sele',
            sel_data: [],//供选择的数据
            show_data: [],//供显示的数据
            disable: props.location.query.id != undefined ? true : false,
            addSpec: this.addSpec,
            addSpecValue: this.addSpecValue,
            handleSetOpenFlag: (data) => this.handleSetOpenFlag(data),
            handleSpecChange: (data) => this.handleSpecChange(data),
            handleSpecFocus: (data) => this.handleSpecFocus(data),
            setImgSpec: (e, specId) => this.setImgSpec(e, specId),
            is_add_spec: false,//是否正在添加规格项handleSpecChange
            handleSpecSele: this.handleSpecSele,
            handleDelAddSpec: this.handleDelAddSpec,//删除添加的规格项名称
            handleEditAddSpec: this.handleEditAddSpec,//修改添加的规格项名称
            uploadPreview: this.uploadImgPre,
            uploadChange: this.uploadImgSpec,
            upload_name: 'file',
            upload_url: `${apiUrl }v3/oss/common/upload?source=goods`
        }],//规格数据
        spec_data_table: {
            list: [],
            pagination: { current: 1, pageSize: 2, total: 0 }
        },
        spu_data_table: {
            list: [{
                marketPrice: '',
                productPrice: '',
                goodsStock: '',
                weight: 1,
                length: 1,
                width: 1,
                height: 1,
                stockWarning: '',
                productCode: '',
                productId: '',
                barCode: ''
            }],
            pagination: { current: 1, pageSize: 2, total: 0 }
        },//spu价格信息数据
        goods_base_data: [{
            type: 'show_text_btn',
            label: `${sldComLanguage('商品分类')}`,
            name: 'goods_cat',
            initialValue: '',
            required: true,
            btn: {
                text: `${sldComLanguage('选择商品分类')}`,
                callback: this.sele_goods_cat
            }
        }, {
            type: 'input',
            label: `${sldComLanguage('商品名称')}`,
            name: 'spuName',
            extra: `${sldComLanguage('最多输入100个字')}`,
            placeholder: `${sldComLanguage('请输入商品名称')}`,
            initialValue: '',
            required: true,
            maxLength: 100,
            rules: [{
                required: true,
                whitespace: true,
                message: `${sldComLanguage('请输入商品名称')}`
            }]
        }, 
        // {
        //     type: 'input',
        //     label: `${sldComLanguage('商品广告语')}`,
        //     name: 'spuBrief',
        //     placeholder: `${sldComLanguage('请输入商品广告语')}`,
        //     extra: `${sldComLanguage('最多输入100个字')}`,
        //     initialValue: '',
        //     maxLength: 100
        // }, 
        {
            type: 'select',
            label: `${sldComLanguage('品牌')}`,
            name: 'brandId',
            placeholder: `${sldComLanguage('请选择品牌')}`,
            sel_data: [],
            sele_key: 'brandId',
            sele_name: 'brandName',
            diy: true
        }],//基本信息
        express_data: [{
            type: 'radio_select',
            label: `${sldComLanguage('快递运费')}`,
            name: 'express_method',
            placeholder: ``,
            data: [{
                key: 'common',
                value: `${sldComLanguage('设置固定运费')}`
            }, {
                key: 'special',
                value: `${sldComLanguage('设置运费模板')}`
            }],
            initialValue: 'common',
            callback: this.isCheck
        }
        ],//物流信息
        invoice_data: [{
            type: 'radio',
            label: `${sldComLanguage('是否开增票')}`,
            name: 'vatInvoice',
            placeholder: ``,
            sel_data: [
                { name: `${sldComLanguage('否')}`, key: 0 },
                { name: `${sldComLanguage('是')}`, key: 1 }
            ],
            initialValue: 0
        }
        ],//发票信息
        other_data: [{
            type: 'tree_select_more',
            label: `${sldComLanguage('店铺分类')}`,
            name: 'innerLabelIds',
            placeholder: `${sldComLanguage('请选择店铺分类')}`,
            sel_data: [],
            required: false,
            onChange: this.handleStoreCat
        }, {
            type: 'multiple_select',
            label: `${sldComLanguage('商品标签')}`,
            name: 'serviceLabelIds',
            placeholder: `${sldComLanguage('请选择商品标签')}`,
            sel_data: [],
            sele_key: 'labelId',
            sele_name: 'labelName',
            diy: true,
            required: false
        }, {
            type: 'inputnum',
            label: `${sldComLanguage('虚拟销量')}`,
            name: 'virtualSales',
            placeholder: ``,
            extra: `${sldComLanguage('0~999999999之间的整数，默认为0')}`,
            initialValue: 0,
            max: 999999999
        }, {
            type: 'radio',
            label: `${sldComLanguage('发布状态')}`,
            name: 'sellNow',
            placeholder: '',
            width: 250,
            sel_data: [
                { name: `${sldComLanguage('立即售卖')}`, key: true },
                { name: `${sldComLanguage('暂不售卖，放入仓库中')}`, key: false }
            ],
            initialValue: true
        }
        // {
        //     type: 'radio',
        //     label: `${sldComLanguage('商品推荐')}`,
        //     name: 'storeIsRecommend',
        //     placeholder: '',
        //     width: 250,
        //     sel_data: [
        //         { name: `${sldComLanguage('是')}`, key: 1 },
        //         { name: `${sldComLanguage('否')}`, key: 0 }
        //     ],
        //     initialValue: 1
        // }
        ],//其他信息
        top_bottom_tpl_data: [{
            type: 'select',
            label: `${sldComLanguage('顶部关联版式')}`,
            name: 'relatedTemplateIdTop',
            placeholder: `${sldComLanguage('请选择顶部关联版式')}`,
            sel_data: [],
            sele_key: 'templateId',
            sele_name: 'templateName',
            diy: true
        }, {
            type: 'select',
            label: `${sldComLanguage('底部关联版式')}`,
            initialValue: 0,
            name: 'relatedTemplateIdBottom',
            placeholder: `${sldComLanguage('请选择底部关联版式')}`,
            sel_data: [],
            sele_key: 'templateId',
            sele_name: 'templateName',
            diy: true
        }],//顶部和底部关联版式
        search_attr_data: [],//检索属性列信息
        store_attr_data: [{
            type: 'multiple_select',
            label: `${sldComLanguage('属性分组')}`,
            name: 'groupId',
            placeholder: `${sldComLanguage('请选择属性分组')}`,
            sel_data: [],
            sele_key: 'groupId',
            sele_name: 'groupName',
            diy: true,
            onChange: this.handleAttrGroup
        }],//店铺自定义属性信息
        store_info: {},
        tab_spec_list:[
            {
                name:'默认',
                key:'-1000',
                skuName:'',
                description:'',
                taxCode:'',
                taxRate:''
            }
        ],
        activeKey:'-1000',
        editCopySkuList:[] // 用以编辑时 多次切换规格值后 ，在切回和原来相同规格时返显sku数据 是返回数据的备份
    };
}

componentDidMount() {
    const { query } = this.state;
    // 发布暂存 1 新增暂存 
    let keepGoodsStatus = getSession('keepGoodsStatus')
   
    let { express_data } = this.state;
    if (query.id == undefined) {
        // 新增设置发布暂存
        setSession('keepGoodsStatus','1')
        express_data.splice(1, 0, { ...this.common_express });
        this.setState({ show_radio_flag: true });
    } else {
        this.setState({ top_nav_step: 3, step: 2,disable_spec:true });
    }
    this.setState({ express_data });
    this.get_store_info();
    this.initSpuGoodsImaData();
    this.getSystemCat();//获取可发布商品的平台分类
    this.getStoreCat();//获取店铺分类
    this.getStoreAttrGroup();//获取店铺属性组
    this.getRelatedTpl();//获取关联版式
    // this.get_spec_list();//获取规格列表
    this.get_goods_label_list();//获取商品标签列表
    this.get_transport_lists();//获取运费模板列表
    this.resize();
    window.addEventListener('resize', this.resize);
    this.props.dispatch({
        type: 'global/getLayoutCollapsed'
    });
    if(keepGoodsStatus && query.id == undefined){
        this.use();
    }
}

componentWillUnmount() {
    this.save()
    window.removeEventListener('resize', this.resize);
}

getRowByKey(key, newData) {
    const { spec_data_table } = this.state;
    return (newData || spec_data_table.list).filter(item => item.key === key)[0];
}

getRowByKeySpu(key, newData) {
    const { spu_data_table } = this.state;
    return (newData || spu_data_table.list).filter(item => item.key === key)[0];
}

  handleChange = (pagination, filters, sorter) => {
      this.setState({
          filteredInfo: filters,
          sortedInfo: sorter
      });
  };

  //店铺分类选择事件
  handleStoreCat = (value, label, extra) => {
      this.sel_cat_data = [];
      if (value.length) {
          extra.allCheckedNodes.forEach(item => {
              if (item.children != undefined) {
                  item.children.forEach(child => {
                      this.sel_cat_data.push({
                          innerLabelId: child.node.props.innerLabelId,
                          innerLabelName: child.node.props.innerLabelName
                      });
                  });
              } else {
                  this.sel_cat_data.push({
                      innerLabelId: item.node.props.innerLabelId,
                      innerLabelName: item.node.props.innerLabelName
                  });
              }
          });
      }
  };

  //店铺属性分组选择事件
  handleAttrGroup = async (val, attaData = [],isEdit=false) => {
      //根据属性分组id获取属性列表
      const { dispatch } = this.props;
      let { store_attr_data } = this.state;
      if(isEmpty(val)){
          store_attr_data = store_attr_data.filter(item => item.name == 'groupId');
          this.setState({ store_attr_data });
          return false
      }
      let dis_type = 'product/get_attribute_lists_can_use';
      let payload = { pageSize: list_com_page_more, groupIds: val,pageIndex:1,isShow:1 };
      await dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  store_attr_data = store_attr_data.filter(item => item.name == 'groupId');
                  if (res.data.list.length > 0) {
                      this.store_attr_group_attr_list = res.data.list;
                      res.data.list.forEach((item) => {
                          let select_group = this.store_attr_group.filter((ele)=>ele.groupId==item.groupId)[0]
                          let sel_data = item.parameterValues;
                          let tar_data = [];
                          sel_data.forEach(item_attr_val => {
                              tar_data.push({
                                  key: item_attr_val,
                                  name: item_attr_val
                              });
                          });
                          store_attr_data.push({
                              type: 'select',
                              label: `(${select_group?.groupName})${item.parameterName}`,
                              name: `store_attr_${item.parameterId}`,
                              placeholder: `${sldComLanguage('请选择')}${item.parameterName}`,
                              sel_data: tar_data,
                              initialValue: ''
                          });
                      });
                      if (Array.isArray(attaData) && attaData.length>0 && isEdit) {
                          //编辑
                          for (let i = 0; i < store_attr_data.length; i++) {
                              if (store_attr_data[i].name == 'groupId') {
                                  store_attr_data[i].initialValue = val;
                                  break;
                              }
                          }
                          if (attaData.length > 0) {
                              attaData.forEach(item => {
                                  let tmp_data = store_attr_data.filter(attr_item => attr_item.name == (`store_attr_${ item.parameterId}`));
                                  tmp_data[0].initialValue = item.parameterValue;
                              });
                          }
                      }

                  }
              }
              this.setState({ store_attr_data });
          }
      });
  };


  //快递运费切换处理物流信息的数据
  isCheck = (e) => {
      let { express_data } = this.state;
      express_data = express_data.filter(item => (item.name != 'freightFee' && item.name != 'freightId'));
      if (e.target.value == 'common') {
          express_data.splice(1, 0, { ...this.common_express });
      } else {
          express_data.splice(1, 0, { ...this.special_express });
      }
      this.setState({ express_data });
  };
  

  //点击添加规格项事件
  addSpec = (flag) => {
      let { spec_set_data } = this.state;
      if (spec_set_data[0].show_data.length >= commonSetting.specLimit) {
          failTip(`${sldComLanguage('最多设置')}${commonSetting.specLimit}${sldComLanguage('组规格项')}`);
          return false;
      }
      let tmp_data = spec_set_data.filter(item => item.name == 'goods_spec_sele')[0];
      tmp_data.is_add_spec = flag;
      this.setState({ spec_set_data });
  };

  //点击添加规格值事件
  addSpecValue = (flag, specId) => {
      let { spec_set_data } = this.state;

      //show_data 里面的数据需要更新
      let tmp_data_show_data = spec_set_data[0].show_data.filter(item => item.specId == specId);
      if (tmp_data_show_data[0].showValList.length >= commonSetting.specValLimit) {
          failTip(`${sldComLanguage('每个规格项最多设置')}${commonSetting.specValLimit}${sldComLanguage('个规格值')}`);
          return false;
      }
      tmp_data_show_data[0].is_add_spec_val = flag;

      //sel_data 里面的数据需要更新
      let tmp_data = spec_set_data[0].sel_data.filter(item => item.specId == specId);
      tmp_data[0].is_add_spec_val = flag;


      this.setState({ spec_set_data });
  };

  //删除规格项名称：该数据的选中属性设为false，它下面的规格值的选中属性也设为false
  handleDelAddSpec = (data) => {
      let { spec_set_data } = this.state;
      let tmp_data = spec_set_data[0];
      if (data.type == 'spec') {
      //删除规格项
      //sel_data的处理
          let tmp_del_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
          tmp_del_data.sele_flag = false;
          if (tmp_del_data.specValueInfoList.length != undefined && tmp_del_data.specValueInfoList.length > 0) {
              tmp_del_data.specValueInfoList.forEach(item => {
                  item.sele_flag = false;
              });
          }
          //图片规格的话，需要处理图片数据
          if (tmp_del_data.is_img_spec) {
              this.initSpuGoodsImaData();
          }

          //show_data里直接移除该条规格项
          tmp_data.show_data = tmp_data.show_data.filter(item => item.specId != data.specId);

      } else {
      //删除规格值（将该规格值的sele_flag置为false即可）
      //sel_data的处理
          let tmp_del_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
          let tmp_del_data_spec_val = tmp_del_data.specValueInfoList.filter(item => item.specValueId == data.specValueId)[0];
          //当前操作的规格值数据——对象
          tmp_del_data_spec_val.sele_flag = false;

          //show_data的处理
          let tmp_del_data_show_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
          tmp_del_data_show_data.specValueInfoList = JSON.parse(JSON.stringify(tmp_del_data.specValueInfoList));

          //showValList里面的规格值直接删掉
          tmp_del_data_show_data.showValList = tmp_del_data_show_data.showValList.filter(item => item.specValueId != data.specValueId);

          //图片规格需要删除图片数据
          if (tmp_del_data_show_data.is_img_spec) {
              this.operateSpecImg('del', { specValueId: data.specValueId });
          }

      }
      this.setState({
          spec_set_data
      }, () => {
          sthis.getCalcDEscartes(spec_set_data[0].show_data);
      });
  };

  //设置图片规格 is_img_spec该规格项是否是图片规格，true为是
  setImgSpec = (e, specId) => {
      let { spec_set_data, is_set_img_spec, goods_img_data } = this.state;
      let tmp_data = spec_set_data[0];
      for(let i = 0; i < tmp_data.show_data.length; i++) {
          if (tmp_data.show_data[i].specId == specId) {
              //设置当前规格项是否是图片规格
              tmp_data.show_data[i].is_img_spec = e.target.checked;
              tmp_data.sel_data[i].is_img_spec = e.target.checked;
              is_set_img_spec = e.target.checked;
              if (e.target.checked == true) {
                  //设置图片规格
                  goods_img_data = [];
                  if (tmp_data.show_data[i].showValList.length > 0) {
                      for(let j = 0; j < tmp_data.show_data[i].showValList.length; j++) {
                          let item = tmp_data.show_data[i].showValList[j];
                          goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
                          let cur_data = goods_img_data[goods_img_data.length - 1];
                          cur_data.label = item.specValueName;
                          cur_data.name = `image${ item.specValueId}`;
                          cur_data.specId = item.specId;
                          cur_data.specValueId = item.specValueId;
                          cur_data.specValueName = item.specValueName;
                          cur_data.extra_param = item;
                          cur_data.fileList = [];
                          cur_data.uploadPreview = function(info) {
                              sthis.uploadImgPre(info);
                          };
                          cur_data.uploadChange = function(info, extra) {
                              sthis.uploadImg(info, `image${ extra.specValueId}`);
                          };
                      }
                  }
                  this.setState({ goods_img_data });
              } else {
                  //取消图片规格的设置,将规格图片变为图片数据
                  this.initSpuGoodsImaData();
              }
          } else {
              //不论当前规格是否是图片规格，非当前规格都是不选中的
              tmp_data.show_data[i].is_img_spec = false;
          }
      }
      this.setState({
          spec_set_data,
          is_set_img_spec
      });
  };

  //图片规格数据
  operateSpecImg = (type, data) => {
      let { goods_img_data } = this.state;
      if (type == 'add') {
      //添加规格图片
          goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
          let cur_data = goods_img_data[goods_img_data.length - 1];
          cur_data.label = data.specValueName;
          cur_data.name = `image${ data.specValueId}`;
          cur_data.specId = data.specId;
          cur_data.specValueId = data.specValueId;
          cur_data.specValueName = data.specValueName;
          cur_data.extra_param = data;
          cur_data.fileList = [];
          cur_data.uploadPreview = function(info) {
              sthis.uploadImgPre(info);
          };
          cur_data.uploadChange = function(info, extra) {
              sthis.uploadImg(info, `image${ extra.specValueId}`);
          };
      } else if (type == 'edit') {
      //编辑规格图片
          let cur_data = goods_img_data.filter(item => item.specValueId == data.specValueId)[0];
          cur_data.label = data.specValueName;
          cur_data.name = `image${ data.specValueId}`;
          cur_data.specId = data.specId;
          cur_data.specValueId = data.specValueId;
          cur_data.specValueName = data.specValueName;
          cur_data.extra_param = data;
      } else if (type == 'del') {
      //删除规格图片
          goods_img_data = goods_img_data.filter(item => item.specValueId != data.specValueId);
          if (goods_img_data.length == 0) {
              //图片规格下面没有规格值的话，商品图片应该是spu的图片信息
              this.initSpuGoodsImaData();
              return false;
          }
      }
      this.setState({
          goods_img_data
      });

  };

  //初始化spu的图片信息
  initSpuGoodsImaData = () => {
      let { goods_img_data } = this.state;
      goods_img_data = [JSON.parse(JSON.stringify(this.img_item))];
      let cur_data = goods_img_data[goods_img_data.length - 1];
      cur_data.label = '图片';
      cur_data.name = 'image';
      cur_data.specId = '';
      cur_data.specValueId = '';
      cur_data.specValueName = '';
      cur_data.extra_param = {};
      cur_data.fileList = [];
      cur_data.uploadPreview = function(info) {
          sthis.uploadImgPre(info);
      };
      cur_data.uploadChange = function(info) {
          sthis.uploadImg(info, 'image');
      };

      let spu_img_data = [JSON.parse(JSON.stringify(this.img_item))];
      let spu_cur_data = spu_img_data[0];
      spu_cur_data.label = '图片';
      spu_cur_data.name = 'imagespu';
      spu_cur_data.specId = '';
      spu_cur_data.specValueId = '';
      spu_cur_data.specValueName = '';
      spu_cur_data.extra_param = {};
      spu_cur_data.fileList = [];
      spu_cur_data.uploadPreview = function(info) {
          sthis.uploadImgPre(info);
      };
      spu_cur_data.uploadChange = function(info) {
          sthis.uploadSpuImg(info, 'imagespu');
      };
      this.setState({
          goods_img_data,
          spu_img_data
      });
  };

  // 初始化tab信息
  initTabSpecListInfo = (editJson=null)=>{
      let { tab_spec_list,spuDetail,top_bottom_tpl_data,spu_img_data } = this.state;
      let goods_img_data = []
      tab_spec_list.forEach((ele,index)=>{
          // 编辑
          if(editJson){
              // sku名称和详情的处理
              ele.skuName = editJson[index].skuName
              ele.description = editJson[index].detail
              ele.taxCode = editJson[index].taxCode
              ele.taxRate = editJson[index].taxRate
              // 图片处理
              goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
              let cur_data = goods_img_data[goods_img_data.length - 1];
              cur_data.label = '图片';
              cur_data.name = `image${ ele.key}`;
              cur_data.specId = '';
              cur_data.specValueId = '';
              cur_data.specValueName = '';
              cur_data.extra_param = ele;
              cur_data.fileList = [];
              editJson[index].imageList.forEach(item => {
                  let img_info = {};
                  img_info.uid = item.image;
                  img_info.thumbUrl = item.imageUrl;//图片的url地址
                  img_info.status = 'done';
                  img_info.response = {};
                  img_info.response.state = 200;
                  img_info.response.data = {
                      path: item.image,
                      url: item.imageUrl//图片的url地址
                  };
                  cur_data.fileList.push(img_info);
              });
              cur_data.uploadPreview = function(info) {
                  sthis.uploadImgPre(info);
              };
              cur_data.uploadChange = function(info, extra) {
                  sthis.uploadImg(info, `image${ extra.key}`);
              };
              // 关联版式
              let [top,bottom] = JSON.parse(JSON.stringify(top_bottom_tpl_data))
              top.name = `relatedTemplateIdTop${ele.key}`
              top.initialValue = editJson[index].relatedTemplateIdTop == 0 ? -1 : editJson[index].relatedTemplateIdTop;
              bottom.name = `relatedTemplateIdBottom${ele.key}`
              bottom.initialValue = editJson[index].relatedTemplateIdBottom == 0 ? -1 : editJson[index].relatedTemplateIdBottom;
              ele.top_bottom_tpl_data = [top,bottom]

          }else{
              // sku名称和详情的处理
              ele.skuName = `${this.props.form.getFieldValue('spuName')}${ele.name}`
              ele.description = spuDetail
              ele.taxCode = ''
              ele.taxRate = ''
              // 图片处理
              goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
              let cur_data = goods_img_data[goods_img_data.length - 1];
              cur_data.label = '图片';
              cur_data.name = `image${ ele.key}`;
              cur_data.specId = '';
              cur_data.specValueId = '';
              cur_data.specValueName = '';
              cur_data.extra_param = ele;
              cur_data.fileList = spu_img_data[0]?spu_img_data[0].fileList:[];
              cur_data.uploadPreview = function(info) {
                  sthis.uploadImgPre(info);
              };
              cur_data.uploadChange = function(info, extra) {
                  sthis.uploadImg(info, `image${ extra.key}`);
              };
              // 关联版式
              let [top,bottom] = JSON.parse(JSON.stringify(top_bottom_tpl_data))
              top.name = `relatedTemplateIdTop${ele.key}`
              top.initialValue = this.props.form.getFieldValue('relatedTemplateIdTop')== 0 ? -1:this.props.form.getFieldValue('relatedTemplateIdTop')
              bottom.name = `relatedTemplateIdBottom${ele.key}`
              bottom.initialValue = this.props.form.getFieldValue('relatedTemplateIdBottom')== 0 ? -1:this.props.form.getFieldValue('relatedTemplateIdBottom')
              ele.top_bottom_tpl_data = [top,bottom]
          }
      })
      console.log(3333,tab_spec_list)
      this.setState({
          tab_spec_list,
          goods_img_data
      });

  }

  //规格项聚焦事件
  handleSpecFocus = (data) => {
      let { spec_set_data } = this.state;
      if (data.type == 'spec') {
          let tmp_data = spec_set_data[0];
          let tmp_del_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
          tmp_del_data.is_editing = true;

      } else {
      }
      this.setState({
          spec_set_data
      });
  };

  //设置规格选择框的open属性
  handleSetOpenFlag = (data) => {
      let { spec_set_data } = this.state;
      let tmp_data = spec_set_data[0];
      let tmp_spec_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
      if (data.type == 'spec') {
          tmp_spec_data.open_flag = data.flag;
      } else {
          let tmp_spec_val_data = tmp_spec_data.specValueInfoList.filter(item => item.specValueId == data.specValueId)[0];
          let tmp_show_spec_val_data = tmp_spec_data.showValList.filter(item => item.specValueId == data.specValueId)[0];
          tmp_spec_val_data.open_flag = data.flag;
          tmp_show_spec_val_data.open_flag = data.flag;
      }
      this.setState({
          spec_set_data
      });
  };

  //添加/修改规格项或者规格值事件 operate：edit(修改) add(添加)
  handleSpecChange = (data) => {
      const { dispatch } = this.props;
      let { spec_set_data } = this.state;
      if (data.sel.length == 0) {//针对选择同一个数据
          return false;
      }
      let cur_val = data.sel;
      if (data.type == 'spec') {
          if (cur_val.length > 20) {
              failTip(`${sldComLanguage('最多输入20个字')}`);
              return false;
          }
          //添加规格项
          let tmp_data = spec_set_data[0];
          let sel_data = tmp_data.sel_data.filter(item => item.specName == cur_val);
          if (sel_data.length != undefined && sel_data.length > 0) {//选择已有规格
              let is_show_data = tmp_data.show_data.filter(item => item.specName == cur_val);
              if (is_show_data.length != undefined && is_show_data.length > 0) {
                  failTip('该规格项已经存在了～');
                  return false;
              }
              sel_data[0].sele_flag = true;
              tmp_data.is_add_spec = false;
              tmp_data.is_editing = false;
              if (data.operate == 'add') {
                  //添加规格
                  tmp_data.show_data.push({
                      ...JSON.parse(JSON.stringify({ ...sel_data[0], is_add_spec_val: true })),
                      showValList: []
                  });//将选中的数据添加到显示数据中,showValList为用户的显示,添加规格项之后自动显示一个规格值输入框
              } else {
                  let pre_sele_spec_data_sel_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//sel_data里面之前选择的规格数据
                  // 选择标识改为false，下面的规格值都要变为false
                  pre_sele_spec_data_sel_data.sele_flag = false;

                  let pre_sele_spec_data_show_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//show_data里面之前选择的规格数据
                  if (pre_sele_spec_data_show_data.specValueInfoList.length != undefined && pre_sele_spec_data_show_data.specValueInfoList.length > 0) {
                      pre_sele_spec_data_show_data.specValueInfoList.forEach(item => {
                          item.sele_flag = false;
                      });
                  }

                  //show_data里面之前选择的规格位置，更新数据就可以了
                  // for (let i in tmp_data.show_data) {change by wbb
                  for(let i = 0; i < tmp_data.show_data.length; i++) {
                      if (tmp_data.show_data[i].specId == data.specId) {
                          tmp_data.show_data[i] = { ...JSON.parse(JSON.stringify(sel_data[0])), showValList: [] };
                          break;
                      }
                  }

              }
              this.setState({
                  spec_set_data
              }, () => {
                  sthis.getCalcDEscartes(spec_set_data[0].show_data);
              });
          } else {//编辑输入新规格
              dispatch({
                  type: 'product/add_goods_spec',
                  payload: { specName: cur_val, state: 1, sort: 1 },
                  callback: (res) => {
                      if (res.state == 200) {
                          tmp_data.is_add_spec = false;
                          tmp_data.is_editing = false;
                          let add_data_info = {
                              specId: res.data.specId,
                              specName: cur_val,
                              sele_flag: true,
                              specValueInfoList: [],
                              showValList: [],//选中的规格值，用于展示
                              open_flag: false
                          };
                          tmp_data.sel_data.push(add_data_info);
                          if (data.operate == 'add') {
                              tmp_data.show_data.push(JSON.parse(JSON.stringify({ ...add_data_info, is_add_spec_val: true })));//将选中的数据添加到显示数据中
                          } else {
                              //show_data里面之前选择的规格位置，更新数据就可以了
                              // for (let i in tmp_data.show_data) {change by wbb
                              for(let i = 0; i < tmp_data.show_data.length; i++) {
                                  if (tmp_data.show_data[i].specId == data.specId) {
                                      tmp_data.show_data[i] = JSON.parse(JSON.stringify(add_data_info));
                                      break;
                                  }
                              }
                          }
                          this.setState({
                              spec_set_data
                          }, () => {
                              sthis.getCalcDEscartes(spec_set_data[0].show_data);
                          });
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      } else {
          if (cur_val.length > 20) {
              failTip(`${sldComLanguage('最多输入20个字')}`);
              return false;
          }
          //添加规格值，若规格值存在，直接将选中标识置为1，否则请求接口添加
          let tmp_show_data = spec_set_data[0].show_data.filter(item => item.specId == data.specId);//当前操作的规格项的数据（show_data）——数组
          let tmp_sel_data = spec_set_data[0].sel_data.filter(item => item.specId == data.specId);//当前操作的规格项的数据（show_data）——数组
          let sel_spec_val_show_data = tmp_show_data[0].specValueInfoList.filter(item => item.specValueName == cur_val);//当前操作的规格值数组——数组

          if (sel_spec_val_show_data.length != undefined && sel_spec_val_show_data.length > 0) {//从已有值中选择

              tmp_show_data[0].is_add_spec_val = false;//选择完毕的话将正在添加规格值的标识置为false
              //show_data里面该规格项下的规格值valueList的标识改为选中
              sel_spec_val_show_data[0].sele_flag = true;
              let is_show_spec_val_data = tmp_show_data[0].showValList.filter(item => item.specValueName == cur_val);
              if (is_show_spec_val_data.length != undefined && is_show_spec_val_data.length > 0) {
                  failTip('该规格值已经存在了～');
                  return false;
              }
              if (data.operate == 'add') {
                  tmp_show_data[0].showValList.push(JSON.parse(JSON.stringify(sel_spec_val_show_data[0])));//showValList里面增加该规格值
              } else {
                  //修改规格值
                  let pre_sele_specval_show_data = tmp_show_data[0].specValueInfoList.filter(item => item.specValueId == data.specValueId)[0];//show_data里面之前选择的规格值数据
                  // 选择标识改为false
                  pre_sele_specval_show_data.sele_flag = false;

                  //showValList里面之前选择的规格值的位置，更新数据就可以了
                  // for (let i in tmp_show_data[0].showValList) {change by wbb
                  for(let i = 0; i < tmp_show_data[0].showValList.length; i++) {
                      if (tmp_show_data[0].showValList[i].specValueId == data.specValueId) {
                          tmp_show_data[0].showValList[i] = JSON.parse(JSON.stringify(sel_spec_val_show_data[0]));
                          break;
                      }
                  }
              }

              //图片规格需要更新图片数据
              if (tmp_show_data[0].is_img_spec) {
                  let img_base_data = {};
                  img_base_data.specId = sel_spec_val_show_data[0].specId;
                  img_base_data.specValueId = sel_spec_val_show_data[0].specValueId;
                  img_base_data.specValueName = sel_spec_val_show_data[0].specValueName;
                  this.operateSpecImg(data.operate, img_base_data);
              }

              tmp_sel_data[0].specValueInfoList = JSON.parse(JSON.stringify(tmp_show_data[0].specValueInfoList));
              this.setState({
                  spec_set_data
              }, () => {
                  sthis.getCalcDEscartes(spec_set_data[0].show_data);
              });
          } else {
              if (tmp_show_data[0].storeId == 0) {
                  failTip(`${sldComLanguage('平台预设的规格不可以自行添加')}`);
                  return false;
              }
              dispatch({
                  type: 'product/add_goods_spec_val',
                  payload: { specId: data.specId, specValueName: cur_val },
                  callback: (res) => {
                      if (res.state == 200) {
                          tmp_show_data[0].is_add_spec_val = false;
                          let add_data_info = {
                              specId: data.specId,
                              specValueName: cur_val,
                              sele_flag: true,
                              specValueId: res.data.specValueId
                          };
                          tmp_show_data[0].specValueInfoList.push(add_data_info);
                          if (data.operate == 'add') {
                              tmp_show_data[0].showValList.push(JSON.parse(JSON.stringify(add_data_info)));//将选中的数据添加到显示数据中
                              tmp_sel_data[0].specValueInfoList.push(JSON.parse(JSON.stringify(add_data_info)));//将选中的数据添加到可供选择的数据中
                          } else {
                              //showValList里面之前选择的规格值位置，更新数据就可以了
                              // for (let i in tmp_show_data[0].showValList) {change by wbb
                              for(let i = 0; i < tmp_show_data[0].showValList.length; i++) {
                                  if (tmp_show_data[0].showValList[i].specValueId == data.specValueId) {
                                      tmp_show_data[0].showValList[i] = JSON.parse(JSON.stringify(add_data_info));
                                      break;
                                  }
                              }
                          }
                          //图片规格需要更新图片数据
                          if (tmp_show_data[0].is_img_spec) {
                              let img_base_data = {};
                              img_base_data.specId = add_data_info.specId;
                              img_base_data.specValueId = add_data_info.specValueId;
                              img_base_data.specValueName = add_data_info.specValueName;
                              this.operateSpecImg(data.operate, img_base_data);
                          }
                          this.setState({
                              spec_set_data
                          }, () => {
                              sthis.getCalcDEscartes(spec_set_data[0].show_data);
                          });
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      }
  };

  //获取规格信息
  get_spec_list = () => {
      const { dispatch } = this.props;
      let { spec_set_data, query, loading,store_info } = this.state;
      if(store_info.goodsSource!=1){
          dispatch({
              type: 'product/get_goods_spec_list',
              payload: { pageSize: list_com_page_more },
              callback: (res) => {
                  for (let i = 0; i < spec_set_data.length; i++) {
                      if (spec_set_data[i].name == 'goods_spec_sele') {
                          if (res.state == 200) {
                              spec_set_data[i].sel_data = res.data.specInfoList;
                          } else {
                              spec_set_data[i].sel_data = [];
                          }
                      }
                  }
                  if (query.id != undefined && query.id > 0) {
                      loading = true;
                  }
                  this.setState({ spec_set_data, loading }, () => {
                      if (query.id != undefined) {
                          sthis.get_goods_detail(query.id);
                      }
                  });
              }
          });
      }else{
          if (query.id != undefined && query.id > 0) {
              loading = true;
          }
          spec_set_data[0].sel_data = [];
          this.setState({ spec_set_data, loading }, () => {
              if (query.id != undefined && query.id > 0) {
                  sthis.get_goods_detail(query.id);
              }
          });
      }
  };

  //获取商品标签列表
  get_goods_label_list = () => {
      const { dispatch } = this.props;
      let { other_data } = this.state;
      let dis_type = 'product/get_goods_label_lists';
      let payload = { pageSize: list_com_page_more,pageIndex:1 };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  this.service_list = res.data.list;
                  let tmp_data = other_data.filter(item => item.name == 'serviceLabelIds')[0];
                  tmp_data.sel_data = res.data.list;
              }
              this.setState({ other_data });
          }
      });
  };

  //获取店铺自定义属性
  getStoreAttrGroup = () => {
      const { dispatch } = this.props;
      let { store_attr_data } = this.state;
      let dis_type = 'product/get_attribute_group_lists_can_use';
      let payload = { pageSize: list_com_page_more,pageIndex:1,isShow:1 };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  let tmp_data = store_attr_data.filter(item => item.name == 'groupId')[0];
                  tmp_data.sel_data = res.data.list;
                  this.store_attr_group = res.data.list;
              }
              this.setState({ store_attr_data });
          }
      });
  };

  //获取关联版式
  getRelatedTpl = () => {
      const { dispatch } = this.props;
      let { top_bottom_tpl_data } = this.state;
      let dis_type = 'product/get_related_template_lists';
      let payload = { pageSize: list_com_page_more };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  top_bottom_tpl_data.forEach(item => {
                      if (item.name == 'relatedTemplateIdTop') {
                          item.sel_data = res.data.list.length > 0 ? res.data.list.filter(item_tpl => item_tpl.templatePosition == 1) : [];
                          item.sel_data.unshift({ templateId: -1, templateName: `${sldComLanguage('--请选择--')}` });
                      } else if (item.name == 'relatedTemplateIdBottom') {
                          item.sel_data = res.data.list.length > 0 ? res.data.list.filter(item_tpl => item_tpl.templatePosition == 2) : [];
                          item.sel_data.unshift({ templateId: -1, templateName: `${sldComLanguage('--请选择--')}` });
                      }
                  });
              }
              this.setState({ top_bottom_tpl_data: JSON.parse(JSON.stringify(top_bottom_tpl_data)) });
          }
      });
  };

  //获取店铺分类
  getStoreCat = () => {
      const { dispatch } = this.props;
      let { other_data } = this.state;
      let dis_type = 'product/get_store_category_list';
      let payload = { pageSize: list_com_page_more };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  let tmp_data = other_data.filter(item => item.name == 'innerLabelIds')[0];
                  for(let i = 0; i < res.data.length; i++) {
                      res.data[i].key = res.data[i].innerLabelId;
                      res.data[i].value = res.data[i].innerLabelId;
                      res.data[i].title = res.data[i].innerLabelName;
                      if (res.data[i].children != null && res.data[i].children.length > 0) {
                          res.data[i].children.forEach(item => {
                              item.key = item.innerLabelId;
                              item.value = item.innerLabelId;
                              item.title = item.innerLabelName;
                          });
                      }
                  }
                  this.store_cat_list = res.data;
                  tmp_data.data = res.data;
                  this.setState({ other_data });
              }
          }
      });
  };

  //获取运费模板列表
  get_transport_lists = () => {
      const { dispatch } = this.props;
      let dis_type = 'common/get_transport_lists';
      let payload = { pageSize: list_com_page_more };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200) {
                  this.special_express.sel_data = res.data.list;
              }
          }
      });
  };

  //列表展示对话框隐藏_弹框专属
  sldHandleTableCancle = () => {
      this.setState({ modalTableVisible: false });
  };

  //获取商品详情
  get_goods_detail = async (id) => {
      const { dispatch } = this.props;
      let { goods_base_data, spuDetail, sele_goods_cat_data, goods_img_data, spec_data_table, spu_data_table, other_data, express_data, spec_set_data, top_bottom_tpl_data, invoice_data, goods_video_data,store_info } = this.state;
      goods_img_data = [];
      let spu_img_data = []
      dispatch({
          type: 'product/get_goods_detail',
          payload: { spu: id },
          callback: async (res) => {
              if (res.state == 200) {
                  let result = res.data;
                  await this.get_brand_attr_detail(result.categoryId3, res.data.attributeList != null && res.data.attributeList.length > 0 ? res.data.attributeList : []);
                  //三级分类ID数组
                  let tmp_goods_cat = result.categoryNamePath.split('->');
                  sele_goods_cat_data[0] = {};
                  sele_goods_cat_data[0].categoryId = result.categoryId1;
                  sele_goods_cat_data[0].categoryName = tmp_goods_cat[0];
                  sele_goods_cat_data[1] = {};
                  sele_goods_cat_data[1].categoryId = result.categoryId2;
                  sele_goods_cat_data[1].categoryName = tmp_goods_cat[1];
                  sele_goods_cat_data[2] = {};
                  sele_goods_cat_data[2].categoryId = result.categoryId3;
                  sele_goods_cat_data[2].categoryName = tmp_goods_cat[2];

                  //初始化商品的goods_base_data信息
                  for (let i = 0; i < goods_base_data.length; i++) {
                      if(goods_base_data[i].name == 'brandId' && result.brandId){
                          if(!goods_base_data[i].sel_data.some(el=>el.brandId==result.brandId)){
                              goods_base_data[i].sel_data.unshift({brandId:result.brandId,brandName:result.brandName})
                          }
                      }
                      if (goods_base_data[i].name == 'goods_cat') {
                          goods_base_data[i].initialValue = `${tmp_goods_cat[0] }>${ tmp_goods_cat[1] }>${ tmp_goods_cat[2]}`;//三级分类展示字符串
                      } else {
                          goods_base_data[i].initialValue = result[goods_base_data[i].name];
                      }
                  }

                  /*商品规格-start*/
                  if (result.specInfoList != null && result.specInfoList.length != undefined && result.specInfoList.length > 0) {
                      if(store_info.goodsSource==1){
                          const obj = []
                          result.specInfoList.forEach((item)=>{
                              obj.push({...item,specValueInfoList:item.specValueInfoList})
                          })
                          spec_set_data[0].sel_data = obj;
                      }
                      result.specInfoList.forEach((item, index) => {
                          let tmp_spec_set_data = spec_set_data[0].sel_data.filter(items => items.specId == item.specId);
                          if (tmp_spec_set_data != undefined && tmp_spec_set_data.length != undefined && tmp_spec_set_data.length > 0) {

                              tmp_spec_set_data[0].sele_flag = true;
                              tmp_spec_set_data[0].is_img_spec = item.isMain == 1 ? true : false;

                              //规格值的处理
                              let sele_spec_val_data = [];
                              result.specInfoList[index].specValueInfoList.forEach((item_spec_val) => {
                                  let tmp_spec_val_data = tmp_spec_set_data[0].specValueInfoList.filter(item1 => item1.specValueId == item_spec_val.specValueId);
                                  if (tmp_spec_val_data != undefined && tmp_spec_val_data.length != undefined && tmp_spec_val_data.length > 0) {
                                      tmp_spec_val_data[0].sele_flag = true;
                                      sele_spec_val_data.push({ ...tmp_spec_val_data[0] });
                                  }

                                  //商品图片处理
                                  if (item.isMainSpec == 1) {
                                      //该规格项是图片规格
                                      goods_img_data.push(JSON.parse(JSON.stringify(sthis.img_item)));
                                      let cur_data = goods_img_data[goods_img_data.length - 1];
                                      cur_data.label = item_spec_val.specValueName;
                                      cur_data.name = `image${ item_spec_val.specValueId}`;
                                      cur_data.specId = item.specId;
                                      cur_data.specValueId = item_spec_val.specValueId;
                                      cur_data.specValueName = item_spec_val.specValueName;
                                      cur_data.extra_param = { specValueId: item_spec_val.specValueId };
                                      cur_data.fileList = [];
                                      //组装图片
                                      item_spec_val.imageList.forEach(item_spec_val_img => {
                                          let img_info = {};
                                          img_info.uid = item_spec_val_img.image;
                                          img_info.thumbUrl = item_spec_val_img.imageUrl;//图片的url地址
                                          img_info.status = 'done';
                                          img_info.response = {};
                                          img_info.response.state = 200;
                                          img_info.response.data = {
                                              path: item_spec_val_img.image,
                                              url: item_spec_val_img.imageUrl//图片的url地址
                                          };
                                          cur_data.fileList.push(img_info);
                                      });

                                      cur_data.uploadPreview = function(info) {
                                          sthis.uploadImgPre(info);
                                      };
                                      cur_data.uploadChange = function(info, extra) {
                                          sthis.uploadImg(info, `image${ extra.specValueId}`);
                                      };
                                  }
                              });

                              //规格项的处理
                              spec_set_data[0].show_data.push({
                                  ...JSON.parse(JSON.stringify(tmp_spec_set_data[0])),
                                  showValList: sele_spec_val_data,
                                  is_img_spec: item.isMainSpec == 1 ? true : false
                              });
                          }

                      });

                      //sku list的处理
                      let skuList = [];
                      let key = 0;
                      result.skuList.forEach((itemP) => {
                          key += 1;
                          let tmpItem = {};
                          tmpItem.barCode = itemP.barCode;
                          tmpItem.productPrice = itemP.salePrice;
                          tmpItem.settlementPrice = itemP.settlementPrice;
                          tmpItem.productStock = itemP.skuStock;
                          tmpItem.height = itemP.height;
                          //   tmpItem.isDefault = itemP.isDefault;
                          tmpItem.length = itemP.length;
                          tmpItem.key = key;
                          tmpItem.marketPrice = '';
                          tmpItem.productCode = '';
                          tmpItem.productId = itemP.sku;
                          tmpItem.state = itemP.state;
                          tmpItem.productStockWarning = itemP.skuStockWarning;
                          tmpItem.weight = itemP.weight;
                          tmpItem.width = itemP.width;
                          tmpItem.specValIdArray = [];
                          // tmpItem.specValIdArray = itemP.specAttrId.split(',');
                          //   tmpItem.specValIdArray = itemP.specValueIds.split(',');
                          //   tmpItem.spec_info = [];
                          //组装spec_info数据
                          //   tmpItem.specValIdArray.forEach((itemSpecVal) => {
                          //       let curItem = {};
                          //       curItem.sele_flag = true;
                          //       for (let specI = 0; specI < result.specInfoList.length; specI++) {
                          //           let tar_specValItem = result.specInfoList[specI].specValueInfoList.filter(item => item.specValueId == itemSpecVal);
                          //           if (tar_specValItem.length > 0) {
                          //               curItem.specId = result.specInfoList[specI].specId;
                          //               curItem.specName = result.specInfoList[specI].specName;
                          //               curItem.specValueName = tar_specValItem[0].specValueName;
                          //               curItem.specValueId = tar_specValItem[0].specValueId;
                          //               curItem.specImage = tar_specValItem[0].imageList;
                          //               break;
                          //           }
                          //       }
                          //       tmpItem.spec_info.push({ ...curItem });
                          //   });
                          itemP.specInfoList.forEach((itemSpec)=>{
                              itemSpec.sele_flag = true;
                              tmpItem.specValIdArray.push(itemSpec.specValueId)
                          })
                          tmpItem.spec_info = itemP.specInfoList
                          skuList.push({ ...tmpItem });
                      });
                      spec_data_table.list = skuList;
                      console.log(111,spec_data_table)
                  } else {
                      //初始化spu_data_table数据
                      let tmp_spu_data = spu_data_table.list[0];
                      let tar_data = result.skuList[0];
                      tmp_spu_data.marketPrice = tar_data.marketPrice;
                      tmp_spu_data.productPrice = tar_data.salePrice;
                      tmp_spu_data.settlementPrice = tar_data.settlementPrice;
                      tmp_spu_data.goodsStock = tar_data.skuStock;
                      tmp_spu_data.weight = tar_data.weight;
                      tmp_spu_data.length = tar_data.length;
                      tmp_spu_data.width = tar_data.width;
                      tmp_spu_data.height = tar_data.height;
                      tmp_spu_data.stockWarning = tar_data.skuStockWarning;
                      tmp_spu_data.productCode = tar_data.productCode;
                      tmp_spu_data.productId = tar_data.sku;
                      tmp_spu_data.barCode = tar_data.barCode;
                  }

                  if (result.spuImageList && result.spuImageList.length != 0) {
                      //spu商品图片的处理
                      spu_img_data = [JSON.parse(JSON.stringify(sthis.img_item))];
                      let cur_data = spu_img_data[0];
                      cur_data.label = `${sldComLanguage('图片')}`;
                      cur_data.name = 'imagespu';
                      cur_data.specId = '';
                      cur_data.specValueId = '';
                      cur_data.specValueName = '';
                      cur_data.extra_param = {};
                      cur_data.fileList = [];
                      //初始化图片数据
                      result.spuImageList.forEach(item => {
                          let img_info = {};
                          img_info.uid = item.image;
                          img_info.thumbUrl = item.imageUrl;//图片的url地址
                          img_info.status = 'done';
                          img_info.response = {};
                          img_info.response.state = 200;
                          img_info.response.data = {
                              path: item.image,
                              url: item.imageUrl//图片的url地址
                          };
                          cur_data.fileList.push(img_info);
                      });
                      cur_data.uploadPreview = function(info) {
                          sthis.uploadImgPre(info);
                      };
                      cur_data.uploadChange = function(info) {
                          sthis.uploadSpuImg(info, 'imagespu');
                      };
                  }else{
                      //spu商品图片的处理
                      spu_img_data = [JSON.parse(JSON.stringify(sthis.img_item))];
                      let cur_data = spu_img_data[0];
                      cur_data.label = `${sldComLanguage('图片')}`;
                      cur_data.name = 'imagespu';
                      cur_data.specId = '';
                      cur_data.specValueId = '';
                      cur_data.specValueName = '';
                      cur_data.extra_param = {};
                      cur_data.fileList = [];
                      cur_data.uploadPreview = function(info) {
                          sthis.uploadImgPre(info);
                      };
                      cur_data.uploadChange = function(info) {
                          sthis.uploadSpuImg(info, 'imagespu');
                      };
                  }

                  /* 商品视频 start */
                  if(result.spuVideo){
                      let video_info = {};
                      video_info.uid = result.goodsVideo;
                      video_info.thumbUrl = result.goodsVideoUrl;//商品视频的url地址
                      video_info.status = 'done';
                      video_info.response = {};
                      video_info.response.state = 200;
                      video_info.response.data = {
                          path: result.goodsVideo,
                          url: result.goodsVideoUrl//商品视频的url地址
                      };
                      goods_video_data[0].fileList = [video_info];
                  }
                  /* 商品视频 end */

                  /* 发票信息 start */
                  invoice_data.forEach(item => {
                      item.initialValue = res.data[item.name];
                  });
                  /* 发票信息 end */

                  /* 物流数据start */
                  for(let express_index = 0; express_index < express_data.length; express_index++) {
                      if (express_data[express_index].name == 'express_method') {
                          if (result.freightId > 0) {
                              express_data.splice(express_index + 1, 0, { ...this.special_express, initialValue: result.freightId });
                              express_data[express_index].initialValue = 'special';
                          } else {
                              express_data.splice(express_index + 1, 0, { ...this.common_express, initialValue: result.freightFee });
                              express_data[express_index].initialValue = 'common';
                          }
                      }
                  }
                  /* 物流数据end */

                  /* 其他信息数据start */
                  for(let other_index = 0; other_index < other_data.length; other_index++) {
                      if (other_data[other_index].name == 'innerLabelIds') {
                          //店铺分类初始化
                          let tar_store_cat_id = [];
                          if (res.data.storeInnerLabelList.length > 0) {
                              res.data.storeInnerLabelList.forEach(item => {
                                  tar_store_cat_id.push(item.innerLabelId);
                                  this.sel_cat_data.push({
                                      innerLabelId: item.innerLabelId,
                                      innerLabelName: item.innerLabelName
                                  });
                              });
                          }
                          other_data[other_index].initialValue = tar_store_cat_id;//店铺分类

                      } else if (other_data[other_index].name == 'serviceLabelIds') {
                          let tar_service_label_id = [];
                          let all_service_label_id = [];
                          this.service_list.forEach(item => {
                              all_service_label_id.push(item.labelId);
                          });
                          if (res.data.spuLabelList.length > 0) {
                              res.data.spuLabelList.forEach(item => {
                                  if (all_service_label_id.indexOf(item.spuLabelId) > -1) {
                                      tar_service_label_id.push(item.spuLabelId);
                                  }
                              });
                          }
                          other_data[other_index].initialValue = tar_service_label_id;//商品标签
                      } else if (other_data[other_index].name == 'sellNow') {
                          //11-放入仓库无需审核 21-放入仓库待审核, 12-放入仓库审核通过, 5-放入仓库商品下架 , 3-上架无需审核, 20-上架待审核
                          other_data[other_index].initialValue = (result.state==5||result.state==11||result.state==12||result.state==21)?false:true;
                      } else {
                          other_data[other_index].initialValue = result[other_data[other_index].name];
                      }
                  }
                  /* 其他信息数据end */

                  spuDetail = res.data.spuDetail;//spu商品详情

                  //店铺属性处理-start
                  if (res.data.parameterGroups != null && res.data.parameterGroups!= undefined && res.data.parameterGroups.length>0) {
                      let groupIds = []
                      let parameterList = []
                      res.data.parameterGroups.forEach((item)=>{
                          groupIds.push(item.groupId);
                          parameterList = parameterList.concat(item.parameterList)
                      })
                      this.handleAttrGroup(groupIds, parameterList,true);
                  }
                  //店铺属性处理-end

                  //店铺关联版式spu -start
                  top_bottom_tpl_data.forEach(item => {
                      let nameMap = {
                          'relatedTemplateIdTop':'spuRelatedTemplateIdTop',
                          'relatedTemplateIdBottom':'spuRelatedTemplateIdBottom'
                      }
                      let key = nameMap[item.name]
                      item.initialValue = res.data[key] == 0 ? -1 : res.data[key];
                  });
                  //店铺关联版式-end
                  this.setState({
                      loading: false,
                      express_show: true,//展示物流数据
                      sele_goods_cat_data,//分类id数组
                      goods_base_data,//商品的基本信息
                      spuDetail,//spu商品详情
                      goods_img_data,//图片信息
                      goods_video_data,//商品视频
                      spec_set_data,//规格数据
                      spu_data_table,//spu商品数据
                      express_data,//物流信息数据
                      other_data,//其他信息数据
                      spec_data_table,//展示的数据
                      top_bottom_tpl_data,//顶部底部关联版式
                      show_radio_flag: true,
                      invoice_data,
                      spu_img_data, //sku图片
                      editCopySkuList:JSON.parse(JSON.stringify(spec_data_table.list))
                  }, () => {
                      //根据选择的结果计算规格数据
                      sthis.getCalcDEscartes(spec_set_data[0].show_data,res.data.skuList);
                  });
              }else{
                  failTip(res.msg);
              }
          }
      });
  };


  //处理规格选择事件
  handleSpecSele = (checked, val) => {
      let { spec_set_data } = this.state;
      let spec_data = spec_set_data[0].sel_data;
      let sel_spec = spec_data.filter(item => item.id == val.specId)[0];
      sel_spec.sele_id_array = sel_spec.sele_id_array || [];
      for(let i = 0; i < sel_spec.attrList.length; i++) {
          if (sel_spec.attrList[i].id == val.id) {
              sel_spec.attrList[i].sele_flag = checked;
              if (checked) {
                  sel_spec.sele_id_array.push(val.id);
              } else {
                  sel_spec.sele_id_array = sel_spec.sele_id_array.filter(item => item != val.id);
              }
          }
      }
      //根据选择的结果计算规格数据
      this.getCalcDEscartes(spec_data);
      this.setState({ spec_set_data });
  };

  //根据选择的结果计算规格数据，spec_data为规格项数组,spec_set_data[0].show_data
  getCalcDEscartes = (show_data,editJson=null) => {
      //组装笛卡尔积需要的二维数组，由规格值id组成
      let sel_spec_value_array = [];//二维数组，里面的数组为规格项下的规格值数组，是对象数组
      // for (let i in show_data) {change by wbb
      for(let i = 0; i < show_data.length; i++) {
          if (show_data[i].showValList.length != undefined && show_data[i].showValList.length > 0) {
              //   sel_spec_value_array.push(show_data[i].showValList);  重要更新
              show_data[i].showValList.forEach((item)=>{
                  item.specName = show_data[i].specName
                  item.specId = show_data[i].specId
              }) 
              sel_spec_value_array.push(show_data[i].showValList);
          }
      }
      if (sel_spec_value_array.length == 0) {
      //当把规格项数据全部删除之后，需要重置数据
          let { spec_data_table, columns_spec } = this.state;
          spec_data_table.list = [];
          columns_spec = columns_spec.filter(item => item.dataIndex.indexOf('spec_info') == -1);
          this.setState({ spec_data_table, columns_spec });
          // 初始化默认sku信息
          this.setState({
              tab_spec_list:[
                  {
                      name:'默认',
                      key:'-1000',
                      skuName:'',
                      description:'',
                      taxCode:'',
                      taxRate:''
                  }
              ],
              activeKey:'-1000'
          },()=>{
              this.initTabSpecListInfo(editJson)
          })
          return false;
      }
      let spec_all_data = calcDescartes(sel_spec_value_array);//所有组合的规格
      this.getAllSpecTableData(spec_all_data,editJson);//组装规格表格数据

  };

  //组装规格表格数据
  getAllSpecTableData = (spec_all_data,editJson=null) => {
      //获取最新的表头数据
      let sele_spec_num = 0;//选中规格的数量
      let { spec_set_data, columns_spec, spec_data_table,spu_img_data,spuDetail,top_bottom_tpl_data,editCopySkuList } = this.state;
      let sle_data_new = spec_set_data[0].show_data.filter(item => item.showValList.length > 0);
      console.log(111,spec_all_data)
      console.log(222,sle_data_new)
      columns_spec = columns_spec.filter(item => item.dataIndex.indexOf('spec_info') == -1);
      for(let i = 0; i < sle_data_new.length; i++) {
          sele_spec_num++;
          //更新表头
          for(let s = 0; s < columns_spec.length; s++) {
              if (columns_spec[s].dataIndex == 'productPrice') {
                  columns_spec.splice(s, 0, {
                      title: sle_data_new[i].specName,
                      dataIndex: `spec_info[${ i }]`,
                      align: 'center',
                      width: 70,
                      render: (text) => <span>{text.specValueName}</span>
                  });
                  break;
              }
          }
      }
      //组装的本次的全部数据
      let temp_spec_table = [];
      let tab_spec_list = [];
      for (let skuI = 0; skuI < spec_all_data.length; skuI++) {
          let temp_item_info = {};
          //表格数据
          let tmp_specValIdArray = [];
          if (sele_spec_num == 1) {
              tmp_specValIdArray.push(spec_all_data[skuI].specValueId);
          } else if (spec_all_data[skuI].length > 0) {
              spec_all_data[skuI].forEach(item => {
                  tmp_specValIdArray.push(item.specValueId);
              });
          }
          temp_item_info.specValIdArray = tmp_specValIdArray;//规格值id数组，用于和之前的sku list比较

          temp_item_info.spec_info = (sele_spec_num == 1 ? [spec_all_data[skuI]] : spec_all_data[skuI]);//规格信息
          temp_item_info.key = skuI + 1;
          temp_item_info.state = 1;//是否启用 1-启用 2-不启用
          //   temp_item_info.isDefault = skuI == 0 ? 1 : 0;//是否默认货品：0-否；1-是，只有一个默认，如果未设置默认，则默认第一个货品
          temp_item_info.marketPrice = '';//市场价
          temp_item_info.productPrice = '';//销售价
          temp_item_info.productStock = '';//商品库存
          temp_item_info.productStockWarning = '';//库存预警值
          temp_item_info.weight = 1;//重量kg
          temp_item_info.length = 1;//长度cm
          temp_item_info.width = 1;//宽度cm
          temp_item_info.height = 1;//高度cm
          temp_item_info.productCode = '';//供应商sku
          temp_item_info.productId = '';//商品sku
          temp_item_info.barCode = '';//条形码

          temp_spec_table.push(temp_item_info);


          //组装规格项
          let tab_spec_nameArr = []
          let tab_spec_keyArr = []
          if (sele_spec_num == 1) {
              tab_spec_nameArr.push(spec_all_data[skuI].specValueName)
              tab_spec_keyArr.push(spec_all_data[skuI].specValueId)
          } else if (spec_all_data[skuI].length > 0) {
              spec_all_data[skuI].forEach(item => {
                  tab_spec_nameArr.push(item.specValueName)
                  tab_spec_keyArr.push(item.specValueId)
              });
          }
          tab_spec_list.push({
              name:tab_spec_nameArr.join(','),
              key:tab_spec_keyArr.join(',')
          })
      }
      console.log('tab_spec_list',tab_spec_list)
      
      // 图片处理
      let goods_img_data = [];
      let activeKey = tab_spec_list[0].key
      tab_spec_list.forEach((ele,index)=>{
          // 编辑
          if(editJson){
              // sku名称和详情的处理
              //  兼容删除sku的代码，手动补充 start
              let defaultSku = {
                  skuName:'',
                  detail:'',
                  imageList:[],
                  relatedTemplateIdTop:0,
                  relatedTemplateIdBottom:0
              }
              editJson[index] = editJson[index] || defaultSku
              //  兼容删除sku的代码，手动补充 end
              ele.skuName = editJson[index].skuName
              ele.description = editJson[index].detail
              ele.taxCode = editJson[index].taxCode
              ele.taxRate = editJson[index].taxRate
              // 图片处理
              goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
              let cur_data = goods_img_data[goods_img_data.length - 1];
              cur_data.label = '图片';
              cur_data.name = `image${ ele.key}`;
              cur_data.specId = '';
              cur_data.specValueId = '';
              cur_data.specValueName = '';
              cur_data.extra_param = ele;
              cur_data.fileList = [];
              editJson[index].imageList.forEach(item => {
                  let img_info = {};
                  img_info.uid = item.image;
                  img_info.thumbUrl = item.imageUrl;//图片的url地址
                  img_info.status = 'done';
                  img_info.response = {};
                  img_info.response.state = 200;
                  img_info.response.data = {
                      path: item.image,
                      url: item.imageUrl//图片的url地址
                  };
                  cur_data.fileList.push(img_info);
              });
              cur_data.uploadPreview = function(info) {
                  sthis.uploadImgPre(info);
              };
              cur_data.uploadChange = function(info, extra) {
                  sthis.uploadImg(info, `image${ extra.key}`);
              };

              // 关联版式
              let [top,bottom] = JSON.parse(JSON.stringify(top_bottom_tpl_data))
              top.name = `relatedTemplateIdTop${index}`
              top.initialValue = editJson[index].relatedTemplateIdTop == 0 ? -1 : editJson[index].relatedTemplateIdTop;
              bottom.name = `relatedTemplateIdBottom${index}`
              bottom.initialValue = editJson[index].relatedTemplateIdBottom == 0 ? -1 : editJson[index].relatedTemplateIdBottom;
              ele.top_bottom_tpl_data = [top,bottom]
          }else{
              // sku名称和详情的处理
              ele.skuName = `${this.props.form.getFieldValue('spuName')}${ele.name}`
              ele.description = spuDetail
              ele.taxCode = ''
              ele.taxRate = ''
              // 图片处理
              goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
              let cur_data = goods_img_data[goods_img_data.length - 1];
              cur_data.label = '图片';
              cur_data.name = `image${ ele.key}`;
              cur_data.specId = '';
              cur_data.specValueId = '';
              cur_data.specValueName = '';
              cur_data.extra_param = ele;
              cur_data.fileList = spu_img_data[0]?spu_img_data[0].fileList:[];
              cur_data.uploadPreview = function(info) {
                  sthis.uploadImgPre(info);
              };
              cur_data.uploadChange = function(info, extra) {
                  sthis.uploadImg(info, `image${ extra.key}`);
              };

              // 关联版式
              let [top,bottom] = JSON.parse(JSON.stringify(top_bottom_tpl_data))
              top.name = `relatedTemplateIdTop${index}`
              top.initialValue = this.props.form.getFieldValue('relatedTemplateIdTop')== 0 ? -1:this.props.form.getFieldValue('relatedTemplateIdTop')
              bottom.name = `relatedTemplateIdBottom${index}`
              bottom.initialValue = this.props.form.getFieldValue('relatedTemplateIdBottom')== 0 ? -1:this.props.form.getFieldValue('relatedTemplateIdBottom')
              ele.top_bottom_tpl_data = [top,bottom]
          }
         
      })
       
      let end_data = [];
      // end_data = temp_spec_table;
      let preData = JSON.parse(JSON.stringify(spec_data_table));
      // 编辑状态下 多次操作规格后 ，如果返回的规格相同，要将其值（价格 sku等）赋给对应的规格
      // 策略是 前一次操作如果有 用前一次 ，没有的话将detail返回值赋上
      if(editCopySkuList.length>0){
          let arr = []
          editCopySkuList.forEach((item)=>{
              let ele = preData.list.find((el)=>{
                  if(isEqualArray(item.specValIdArray, el.specValIdArray)){
                      return true
                  }
                  return false
              })
              if(ele){
                  // todo
              }else{
                  arr.push(item)
              }
          })
          preData.list = [...preData.list,...arr]
      }
      //如果是初次加载，则直接赋值
      if (preData.list.length == 0) {
          end_data = JSON.parse(JSON.stringify(temp_spec_table));
      } else {
          end_data = this.combineSpecListData(temp_spec_table, preData.list);
      }
      spec_data_table.list = JSON.parse(JSON.stringify(end_data));
      this.setState({
          spec_data_table,
          columns_spec,
          tab_spec_list,
          goods_img_data,
          activeKey
      });

  };


  /*
  *
  * 根据所有选中的规格值组装的数据，更新数据的值
  * curData 当前组装完的sku的list
  * preData 前一次组装完的sku的list
  * */
  combineSpecListData = (curData, preData) => {
      for (let i = 0; i < curData.length; i++) {
          for (let j = 0; j < preData.length; j++) {
              if (isEqualArray(curData[i].specValIdArray, preData[j].specValIdArray)) {
                  //把之前的数据给到当前数据上
                  let tmp_data = {
                      ...preData[j],
                      specValIdArray: JSON.parse(JSON.stringify(curData[i].specValIdArray)),
                      spec_info: JSON.parse(JSON.stringify(curData[i].spec_info)),
                      key: curData[i].key
                  };
                  //同步spec_info的数据
                  // tmp_data.spec_info.map((item,index)=>{
                  //   let curSpecInfoData = preData[j].spec_info.filter(items=>items.specValueId == item.specValueId)[0];
                  //   // tmp_data.spec_info[index].specImage = curSpecInfoData.specImage;
                  // })
                  curData[i] = JSON.parse(JSON.stringify(tmp_data));
                  break;
              }
          }
      }
      return curData;
  };
 

  //重新选择商品分类
  sele_goods_cat = () => {
      this.get_sld_cats_List(0, 0);
      this.setState({ step: 1, sele_goods_cat_data: [], top_nav_step: 1 });
  };

  //获取商户可以使用的所有分类列表 goods:商品分类
  getSystemCat = () => {
      const { dispatch } = this.props;
      let { goods_cat } = this.state;
      let dis_type = 'product/get_system_seller_cate_list';
      dispatch({
          type: dis_type,
          callback: (res) => {
              if (res.state == 200) {
                  goods_cat[0] = res.data.list;
                  goods_cat[1] = [];
                  goods_cat[2] = [];
                  this.setState({ goods_cat, cur_data: res.data.list, all_goods_cate: JSON.parse(JSON.stringify(res.data.list)) });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取商户可以使用的所有分类列表 goods:商品分类
  get_sld_cats_List = (id, grade = 0) => {
      let { goods_cat } = this.state;
      if (grade < 2) {
          goods_cat[1] = [];
          goods_cat[2] = [];
      }
      if (grade > 0) {
          let curSelCate = goods_cat[grade - 1].filter(item => item.categoryId == id)[0];
          goods_cat[grade] = curSelCate.children;
      }
      if (grade < 3 && goods_cat[grade].length == 0) {
          failTip(`${sldComLanguage('只有三级分类才可发布商品')}`);
      }
      this.setState({ goods_cat, cur_data: goods_cat[grade] });
  };

  //获取商品分类
  sldHandleGoodsCat = (info, index) => {
      let { cur_data, sele_goods_cat_data, top_nav_step } = this.state;
      if (index == 3) {
      //选择的是最后一级的话需要获取分类相关的类型信息
          this.get_brand_attr_detail(info.categoryId);
          cur_data = info;
      } else {
          sele_goods_cat_data = sele_goods_cat_data.filter((item, indexs) => indexs < index);
          this.get_sld_cats_List(info.categoryId, index);
      }
      sele_goods_cat_data[index - 1] = info;
      this.setState({ sele_goods_cat_data, cur_data, top_nav_step });

  };

  //根据类型id获取类型详情：绑定的属性、品牌 ,editData为编辑的数据
  get_brand_attr_detail = async (categoryId, editData = []) => {
      const { dispatch } = this.props;
      let { search_attr_data, goods_base_data } = this.state;
      await dispatch({
          type: 'product/get_brand_attr_detail',
          payload: { categoryId: categoryId, pageSize: list_com_page_more },
          callback: (res) => {
              if (res.state == 200) {
                  //品牌信息
                  let tmp_data = goods_base_data.filter(item => item.name == 'brandId')[0];
                  tmp_data.initialValue = '';
                  tmp_data.sel_data = res.data.goodsBrandList;

                  //平台检索属性
                  this.search_attr_list = res.data.goodsAttributeList;
                  if (res.data.goodsAttributeList.length > 0) {
                      res.data.goodsAttributeList.forEach((item) => {
                          let sel_data = item.attributeValueList;
                          let tar_data = [];
                          sel_data.forEach(item_attr_val => {
                              tar_data.push({
                                  key: item_attr_val.attributeValueId,
                                  name: item_attr_val.attributeValue
                              });
                          });
                          let initialValue = '';
                          if (editData.length > 0) {
                              // eslint-disable-next-line no-shadow
                              let tar_data = editData.filter(edit_item => edit_item.attributeId == item.attributeId);
                              if (tar_data != undefined && tar_data.length != undefined && tar_data.length > 0) {
                                  initialValue = tar_data[0].attributeValueId;
                              }
                          }
                          search_attr_data.push({
                              type: 'select',
                              label: item.attributeName,
                              name: `search_attr_${item.attributeId}`,
                              placeholder: `${sldComLanguage('请选择')}${item.attributeName}`,
                              sel_data: tar_data,
                              initialValue: initialValue
                          });
                      });
                  }
              }
              this.setState({ goods_base_data, search_attr_data });
          }
      });
  };


  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
      this.setState({
          preview_img: img,
          preview_alt_con: text,
          show_preview_modal: flag
      });
  };

  //预览图片
  uploadImgPre = (img) => {
      this.viewImg(true, img.url || img.thumbUrl);
  };

  //上传图片
  uploadImg = (info, filedName) => {
      let { goods_img_data } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          for(let i = 0; i < goods_img_data.length; i++) { 
              if (goods_img_data[i].name == filedName) {
                  goods_img_data[i].fileList = info.fileList;
                  break;
              }
          }
          this.setState({ goods_img_data });
      }
  };

  //上传图片spu 后续合并
  uploadSpuImg = (info, filedName) => {
      let { spu_img_data } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          for(let i = 0; i < spu_img_data.length; i++) { 
              if (spu_img_data[i].name == filedName) {
                  spu_img_data[i].fileList = info.fileList;
                  break;
              }
          }
          this.setState({ spu_img_data });
      }
  };

  //上传视频
  uploadVideo = (info, filedName) => {
      let { goods_video_data } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          for(let i = 0; i < goods_video_data.length; i++) { 
              if (goods_video_data[i].name == filedName) {
                  goods_video_data[i].fileList = info.fileList;
                  break;
              }
          }
          this.setState({ goods_video_data });
      }
  };

  //删除视频
  delVideo = () => {
      let { goods_video_data } = this.state;
      goods_video_data[0].fileList = [];
      this.setState({ goods_video_data });
  };

  //规格上传图片处理(给每个规格值上添加图片)
  uploadImgSpec = ({ fileList }, val) => {
      let { spec_set_data } = this.state;
      let spec_data = spec_set_data[0].sel_data;
      let sel_spec = spec_data.filter(item => item.id == val.specId)[0];
      for(let i = 0; i < sel_spec.attrList.length; i++) { 
          if (sel_spec.attrList[i].id == val.id) {
              sel_spec.attrList[i].fileList = fileList;
          }
      }
      this.setState({ spec_set_data });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query, sele_goods_cat_data, spec_data_table, goods_img_data, goods_video_data, spec_set_data,tab_spec_list,spu_img_data,spuDetail } = this.state;
      if (!this.props.form.getFieldValue('spuName') || (this.props.form.getFieldValue('express_method') == 'common' && isEmpty(this.props.form.getFieldValue('freightFee')) ) || (this.props.form.getFieldValue('express_method') == 'special' && !this.props.form.getFieldValue('freightId'))) {
          this.setState({
              top_nav_step: 2
          });
      }
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let params = {};
              //如果是多规格商品的话，需要直选默认选中一个
              //   if (spec_data_table.list.length > 0) {
              //       let selectedNum = 0;
              //       for(let skuI = 0; skuI < spec_data_table.list.length; skuI++) { 
              //           if (spec_data_table.list[skuI].isDefault) {
              //               selectedNum += 1;
              //               break;
              //           }
              //       }
              //       if (selectedNum == 0) {
              //           failTip('多规格商品需要设置默认选中数据');
              //           return false;
              //       }
              //   }
              if (goods_video_data[0].fileList.length > 0) {
                  params.goodsVideo = goods_video_data[0].fileList[0].response.data.path;//视频
              }
              params.categoryId3 = sele_goods_cat_data[2].categoryId;//3级分类ID
              params.brandId = values.brandId;//品牌ID
              params.spuName = values.spuName;
              //   params.spuBrief = values.spuBrief;//商品广告语
              params.sellNow = values.sellNow;//发布类型，false-放入仓库（待售）；true-立即售卖（在售）
              //   params.storeIsRecommend = values.storeIsRecommend;//商品推荐，0-不推荐；1-推荐（店铺内是否推荐）
              params.vatInvoice = values.vatInvoice;//是否可以开具增值税发票0-不可以；1-可以
              params.spuRelatedTemplateIdTop = values.relatedTemplateIdTop > 0 ? values.relatedTemplateIdTop : null;//顶部关联版式
              params.spuRelatedTemplateIdBottom = values.relatedTemplateIdBottom > 0 ? values.relatedTemplateIdBottom : null;//底部关联版式
              params.virtualSales = values.virtualSales;//虚拟销量

              params.spuVideo = '';
              // 处理图片
              let spuImageList = [];
              if(spu_img_data[0]){
                  for(let s = 0; s < spu_img_data[0].fileList.length; s++) {
                      let item = spu_img_data[0].fileList[s].response;
                      if (item.state == 200) {
                          spuImageList.push({
                              image: item.data.path,
                              imageType: 2   
                          });
                      }
                  }
              }
              params.spuImageList = spuImageList
              //富文本
              params.spuDetail = spuDetail

              params.skuList = [];

              //运费模板
              if (values.express_method == 'common') {
                  params.freightFee = values.freightFee;//统一运费
              } else {
                  params.freightId = values.freightId;//运费模板
              }

              //店铺分类的处理
              params.storeInnerLabelList = _uniqBy(this.sel_cat_data,'innerLabelId');

              //绑定的商品标签
              params.spuLabelList = [];
              if (values.serviceLabelIds != undefined && values.serviceLabelIds.length > 0) {
                  values.serviceLabelIds.forEach(item => {
                      for (let i = 0; i < this.service_list.length; i++) {
                          if (item == this.service_list[i].labelId) {
                              params.spuLabelList.push({
                                  spuLabelId: item,
                                  spuLabelName: this.service_list[i].labelName
                              });
                              break;
                          }
                      }
                  });
              }

              //属性信息
              params.attributeList = [];//平台检索属性
              params.parameterGroups = [];//店铺自定义属性

              //平台检索属性
              if (this.search_attr_list.length > 0) {
                  this.search_attr_list.forEach((item) => {
                      if (values[`search_attr_${ item.attributeId}`] != undefined && values[`search_attr_${ item.attributeId}`]) {
                          //根据属性值id获取属性值
                          let cur_attr_val = item.attributeValueList.filter(attr_val => attr_val.attributeValueId == values[`search_attr_${ item.attributeId}`])[0].attributeValue;
                          params.attributeList.push({
                              attributeId: item.attributeId,
                              attributeName: item.attributeName,
                              attributeValue: cur_attr_val,
                              attributeValueId: values[`search_attr_${ item.attributeId}`]
                          });
                      }
                  });
              }

              //店铺自定义属性
              if (values.groupId != undefined && values.groupId && this.store_attr_group_attr_list.length > 0) {
                  // 根据groupId，拿到所在分组信息
                  let select_group = this.store_attr_group.filter((item)=>values.groupId.includes(item.groupId))
                  // 所有分组选择的属性信息
                  let parameterList = []
                  this.store_attr_group_attr_list.forEach((item) => {
                      if (values[`store_attr_${ item.parameterId}`] != undefined && values[`store_attr_${ item.parameterId}`]) {
                          parameterList.push({
                              groupId:item.groupId,
                              parameterId: item.parameterId,
                              parameterName: item.parameterName,
                              parameterValue: values[`store_attr_${ item.parameterId}`]
                          });
                      }
                  });
                  // 构造数据 分组归类
                  let group_list = []
                  select_group.forEach((item)=>{
                      let temp = parameterList.filter((ele)=>ele.groupId==item.groupId)
                      if(temp.length>0){
                          group_list.push({
                              groupId:item.groupId,
                              groupName:item.groupName,
                              parameterList:temp
  
                          })
                      }
                  })
                  params.parameterGroups = group_list
              }

              if (spec_data_table.list.length > 0) {
                  //规格信息列表,多规格必传
                  params.specInfoList = [];
                  // for (let i in spec_set_data[0].show_data) {change by wbb
                  for(let i = 0; i < spec_set_data[0].show_data.length; i++) {
                      let item_spec_data = spec_set_data[0].show_data[i];
                      let tmp_spec_data = {};//选择的规格数据
                      tmp_spec_data.specId = item_spec_data.specId;
                      tmp_spec_data.specName = item_spec_data.specName;
                      tmp_spec_data.isMainSpec = item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec ? 1 : 0;
                      tmp_spec_data.specValueInfoList = [];
                      tmp_spec_data.storeId = storeId
                      for(let j = 0; j < item_spec_data.showValList.length; j++) {
                          let tmp_spec_val_data = {};
                          tmp_spec_val_data.specValueId = item_spec_data.showValList[j].specValueId;
                          tmp_spec_val_data.specValueName = item_spec_data.showValList[j].specValueName;
                          if (item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec) {
                              //如果是图片规格的话需要传图片
                              tmp_spec_val_data.imageList = [];
                              let cur_img_data = goods_img_data.filter(item => item.specValueId == item_spec_data.showValList[j].specValueId)[0].fileList;
                              if (cur_img_data.length == 0) {
                                  failTip(`${sldComLanguage('规格值为')}${ item_spec_data.showValList[j].specValueName }${sldComLanguage('的图片组,至少上传一张商品图片')}`);
                                  return false;
                              }

                              for(let s = 0; s < cur_img_data.length; s++) {
                                  let item = cur_img_data[s].response;
                                  if (item.state == 200) {
                                      tmp_spec_val_data.imageList.push({
                                          image: item.data.path,
                                          isMain: s == 0 ? 1 : 2//主图标识[1==主图,2==非主图]
                                      });
                                  }
                              }

                          }
                          tmp_spec_data.specValueInfoList.push(tmp_spec_val_data);
                      }
                      params.specInfoList.push(tmp_spec_data);
                  }

                  //货品列表--启用规格必填
                  for(let sku = 0; sku < spec_data_table.list.length; sku++) {
                      let sku_item = spec_data_table.list[sku];
                      let sku_data = {};//每个sku的数据

                      sku_data.specInfoList = [];
                      for(let spec = 0; spec < sku_item.spec_info.length; spec++) {
                          let spec_data = {};
                          spec_data.specId = sku_item.spec_info[spec].specId;
                          spec_data.specName = sku_item.spec_info[spec].specName;
                          spec_data.specValueId = sku_item.spec_info[spec].specValueId;
                          spec_data.specValueName = sku_item.spec_info[spec].specValueName;
                          sku_data.specInfoList.push(spec_data);
                      }

                      //   sku_data.marketPrice = sku_item.marketPrice;
                      sku_data.salePrice = sku_item.productPrice;
                      sku_data.settlementPrice = sku_item.settlementPrice; //结算价
                      sku_data.skuStock = sku_item.productStock;
                      sku_data.skuStockWarning = sku_item.productStockWarning;
                      sku_data.weight = sku_item.weight;
                      sku_data.length = sku_item.length;
                      sku_data.width = sku_item.width;
                      sku_data.height = sku_item.height;
                      //   sku_data.productCode = sku_item.productCode;
                      sku_data.sku = sku_item.productId;
                      sku_data.barCode = sku_item.barCode;
                      sku_data.state = sku_item.state;//是否启用，1-启用；2-不启用
                      //   sku_data.isDefault = sku_item.isDefault;//是否默认货品：0-否；1-是，只有一个默认，如果未设置默认，则默认第一个货品

                      sku_data.skuName = tab_spec_list[sku].skuName;
                      sku_data.detail = tab_spec_list[sku].description;
                      sku_data.skuVideo = tab_spec_list[sku].skuVideo;
                      sku_data.taxCode = tab_spec_list[sku].taxCode;
                      sku_data.taxRate = tab_spec_list[sku].taxRate;
                      // 处理图片
                      let imageList = [];
                      for(let s = 0; s < goods_img_data[sku].fileList.length; s++) {
                          let item = goods_img_data[sku].fileList[s].response;
                          if (item.state == 200) {
                              imageList.push({
                                  image: item.data.path,
                                  imageType: 2   
                              });
                          }
                      }
                      sku_data.imageList = imageList
                      // 处理版式
                      sku_data.relatedTemplateIdTop = values[`relatedTemplateIdTop${sku}`] > 0 ? values[`relatedTemplateIdTop${sku}`] : null;//顶部关联版式
                      sku_data.relatedTemplateIdBottom = values[`relatedTemplateIdBottom${sku}`] > 0 ? values[`relatedTemplateIdBottom${sku}`] : null;//底部关联版式

                      params.skuList.push(sku_data);
                  }

              } else {
                  //默认sku信息 
                  let defaultSku = {};
                  let tab_spec_init_item = tab_spec_list[0]
                  //   defaultSku.marketPrice = values.marketPrice;//市场价
                  defaultSku.salePrice = values.productPrice;//销售价
                  defaultSku.settlementPrice = values.settlementPrice;//结算价
                  defaultSku.skuStock = values.goodsStock;//商品库存
                  defaultSku.skuStockWarning = values.stockWarning;//库存预警值
                  defaultSku.weight = values.weight;//重量kg
                  defaultSku.length = values.length;//长度cm
                  defaultSku.width = values.width;//宽度cm
                  defaultSku.height = values.height;//高度cm
                  defaultSku.sku = values.productId;//商品sku
                  defaultSku.barCode = values.barCode;//条形码
                  defaultSku.skuName = tab_spec_init_item.skuName;
                  defaultSku.detail = tab_spec_init_item.description;
                  defaultSku.skuVideo = tab_spec_init_item.skuVideo;
                  defaultSku.taxCode = tab_spec_init_item.taxCode;
                  defaultSku.taxRate = tab_spec_init_item.taxRate;
                  defaultSku.state = 1 // 默认规格是启用状态
                  // 处理图片
                  let imageList = [];
                  for(let s = 0; s < goods_img_data[0].fileList.length; s++) {
                      let item = goods_img_data[0].fileList[s].response;
                      if (item.state == 200) {
                          imageList.push({
                              image: item.data.path,
                              imageType: 2   
                          });
                      }
                  }
                  defaultSku.imageList = imageList
                  // 处理版式
                  defaultSku.relatedTemplateIdTop = values[`relatedTemplateIdTop${tab_spec_init_item.key}`] > 0 ? values[`relatedTemplateIdTop${tab_spec_init_item.key}`] : null;//顶部关联版式
                  defaultSku.relatedTemplateIdBottom = values[`relatedTemplateIdBottom${tab_spec_init_item.key}`] > 0 ? values[`relatedTemplateIdBottom${tab_spec_init_item.key}`] :null;//底部关联版式

                  params.skuList.push(defaultSku)

              }

              //   params.goodsDetails = description;//商品描述—富文本内容

              //图片信息
              //   params.imageList = [];
              //   let goods_data = goods_img_data[0].fileList;
              //   if (goods_data.length == 0) {
              //       failTip(`${sldComLanguage('至少上传一张商品图片')}`);
              //       return false;
              //   }
              //   for(let i=0;i<goods_data.length;i++){
              //       let item = goods_data[i].response;
              //       if (item.state == 200) {
              //           params.imageList.push({
              //               image: item.data.path,
              //               isMain: i == 0 ? 1 : 2//主图标识[1==主图,2==非主图]
              //           });
              //       }
              //   }
              this.setState({ pageLoading: true });
              let dis_type = '';
              if (query.id != undefined) {
                  //编辑商品
                  params.spu = query.id;
                  dis_type = 'product/edit_goods';
              } else {
                  //新增商品
                  dis_type = 'product/add_goods';
              }
              console.log('params',params)
              let errInfo = [] //用来收集错误信息，统一提示
              if(params.spuImageList.length==0){
                  errInfo.push(`上一步spu信息商品图片不能为空`)
              }
              params.skuList.forEach((item,index)=>{
                  if(!item.taxCode){
                      errInfo.push(`请检查第${index+1}个商品的商品税务编码`)
                      return false
                  }
                  if(!item.taxRate){
                      errInfo.push(`请检查第${index+1}个商品的商品的税率`)
                      return false
                  }
                  if(item.imageList.length==0){
                      errInfo.push(`第${index+1}个商品的图片不能为空`)
                      return false
                  }
              })
              if(errInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${errInfo.join('\n')}`}</p>)
                  failTip(rdom,6);
                  errInfo = [];
                  this.setState({ pageLoading: false });
                  return false;
              }
              dispatch({
                  type: dis_type,
                  payload: params,
                  callback: (res) => {
                      sthis.setState({ pageLoading: false });
                      if (res.state == 200) {
                          removeSession('keepGoodsStatus')
                          sucTip(res.msg, 1);
                          //提示并返回上级页面
                          setTimeout(() => {
                              sthis.props.history.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });

          }
      },
      );

  };

  //返回上个页面
  backPre = () => {
      removeSession('keepGoodsStatus')
      this.props.history.goBack();
  };

  //slodon_获取富文本返回的内容_商品详情
  handleGetContent = (value) => {
      let { tab_spec_list,activeKey } = this.state;
      let tar_item = tab_spec_list.filter(item => item.key == activeKey)[0];
      tar_item.description = value
      console.log(tab_spec_list,value)
      this.setState({
          tab_spec_list
      });
  };

  //slodon_获取富文本返回的内容_商品详情
  handleSpuContent = (value) => {
      this.setState({
          spuDetail:value
      });
  };

  changeTab = (key)=>{
      this.setState({
          activeKey: key
      });
  }

  skuNameChange = (value)=>{
      let { tab_spec_list,activeKey } = this.state;
      let tar_item = tab_spec_list.filter(item => item.key == activeKey)[0];
      tar_item.skuName = value
      this.setState({
          tab_spec_list
      });
  }

  skuTaxChange = (value,type) => {
      let { tab_spec_list,activeKey } = this.state;
      let tar_item = tab_spec_list.filter(item => item.key == activeKey)[0];
      if(type=='taxCode'){
          tar_item.taxCode = value
      }else if(type=='taxRate'){
          tar_item.taxRate = value
      }else if(type=='both'){
          const {taxCode,taxRate} = value
          tar_item.taxCode = taxCode
          tar_item.taxRate = taxRate
      }
      this.setState({
          tab_spec_list
      });
  }

  //下一步，填写商品信息事件
  sldAddGoodsSecond = () => {
      //选择的分类显示在页面上
      let { goods_base_data, sele_goods_cat_data } = this.state;
      for(let i=0;i<goods_base_data.length;i++){
          if (goods_base_data[i].name == 'goods_cat') {
              goods_base_data[i].initialValue = '';
              for(let j=0;j<sele_goods_cat_data.length;j++){
                  goods_base_data[i].initialValue += sele_goods_cat_data[j].categoryName;
                  if (j < sele_goods_cat_data.length - 1) {
                      goods_base_data[i].initialValue += ' > ';
                  }
              }
              break;
          }
      }
      this.setState({ goods_base_data, sele_goods_cat_data, step: 2, top_nav_step: 2 });
  };

  //分类选择弹窗确认事件
  sldHandleConfirm = () => {
  };

  //分类选择取消事件
  sldCancle = () => {
      this.setState({ modalVisible: false });
  };

  operateCurNavStep = (step_val) => {
      let {query} = this.state
      if (this.state.step == 1) {
          failTip(`${sldComLanguage('只有三级分类才可发布商品,请先选择分类')}`);
          return;
      }
      if(step_val==3&&query.id==undefined){
          this.initTabSpecListInfo()
      }
      this.setState({
          top_nav_step: step_val
      });
      setTimeout(() => {
          this.refs.scrollbars.scrollToTop()
      }, 0);
  };

  //获取店铺信息
  get_store_info = () => {
      const { dispatch } = this.props;
      dispatch({
          type:"product/get_store_info",
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({
                      store_info: res.data
                  });
                  this.get_spec_list()
              }
          }
      });
  };

  resize() {
      let scrollY = 0;
      let screentW = document.body.clientWidth;
      let screentH = document.body.clientHeight;
      //73为底部高度，50为顶部高度
      if (screentW > 1649) {
          scrollY = screentH - 73 - 50 - 310;
      } else if (screentW <= 1649) {
          scrollY = screentH - 73 - 50 - 350;
      }
      sthis.setState({ scrollY, screentW, screentH });
  }

  //spec_data_table 表格编辑事件
  handleFieldChange(val, fieldName, key) {
      const { spec_data_table } = this.state;
      const newData = spec_data_table.list.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
          target[fieldName] = val;
          spec_data_table.list = newData;
          this.setState({ spec_data_table });
      }
  }

  //spec_data_table 表格设为默认选中事件
  handleFieldChangeDefault(val, fieldName, key) {
      const { spec_data_table } = this.state;
      let tar_data = spec_data_table.list.filter(item => item.key == key);
      tar_data[0].isDefault = val;
      if (val == 1) {
          //如果是默认选中的话，需要将其余的默认选中去掉
          spec_data_table.list.forEach((item, index) => {
              if (item.key != key) {
                  this.props.form.resetFields([`isDefault${ item.key}`]);
                  spec_data_table.list[index].isDefault = 0;
              } else {
                  this.props.form.resetFields([`state${ item.key}`]);
                  spec_data_table.list[index].state = 1;
              }
          });
      }
      this.setState({ spec_data_table });
  }

  //spu_data_table 表格编辑事件
  handleFieldChangeSpu(val, fieldName, key) {
      const { spu_data_table } = this.state;
      const newData = spu_data_table.list.map(item => ({ ...item }));
      const target = this.getRowByKeySpu(key, newData);
      if (target) {
          target[fieldName] = val;
          spu_data_table.list = newData;
          this.setState({ spu_data_table });
      }
  }

  save(){
      saveData(this)
  }

  use(){
      let that = this
      confirm({
          title: '提示',
          content: '检测到有未完成的商品发布,是否应用',
          cancelText:'取消',
          okText:'确定',
          className:`${global.p20}`,
          onOk() {
              useData(that)
          },
          onCancel() {
           
          }
      });
      
  } 

  render() {
      const { goods_base_data, spec_data_table, columns_spec, query, preview_img, preview_alt_con, show_preview_modal, modal_width, disable_spec, goods_img_data, spec_set_data, goods_cat, sele_goods_cat_data, cur_data, express_show, express_data, other_data, top_nav_step, spu_data_table, columns_spu, pageLoading, step, invoice_data, top_bottom_tpl_data, store_attr_data, search_attr_data, show_radio_flag, goods_video_data,tab_spec_list,spu_img_data,spuDetail } = this.state;
      
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              <div className={`${global.flex_com_space_between} ${global.add_goods_title}`}>
                  {sldLlineRtextAddGoods('#69A2F2', query.id != undefined ? `${sldComLanguage('编辑商品')}` : `${sldComLanguage('发布商品')}`)}
                  {sldIconBtnBg(() => this.backPre(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
             
              <Spin spinning={pageLoading}>
                  <div className={`${global.add_goods_top_nav} ${global.flex_row_start_center}`}>
                      <div
                          className={`${global.top_nav_item} ${global.step1} ${global.right_row} ${top_nav_step >= 1 ? global.finished : null}`}
                      >
                          <div className={`${global.step} ${global.flex_row_start_center}`}>
                              <div className={`${global.left} ${global.flex_row_center_center}`}>1</div>
                              <div className={`${global.right} ${global.flex_column_center_start}`}>
                                  <span className={`${global.title}`}>{sldComLanguage('商品分类')}</span>
                                  <span className={`${global.sub_title}`}>{sldComLanguage('请选择您的商品分类,只有三级分类才能发布商品')}</span>
                              </div>
                          </div>
                      </div>
                      <div
                          className={`${global.top_nav_item} ${global.step2} ${global.left_row} ${global.right_row} ${top_nav_step >= 2 ? global.finished : null}`}
                          onClick={() => this.operateCurNavStep(2)}
                      >
                          <div className={`${global.step} ${global.flex_row_start_center}`}>
                              <div className={`${global.left} ${global.flex_row_center_center}`}>2</div>
                              <div className={`${global.right} ${global.flex_column_center_start}`}>
                                  <span className={`${global.title}`}>{sldComLanguage('基本信息')}</span>
                                  <span className={`${global.sub_title}`}>{sldComLanguage('填写商品基本信息,物流信息以及其他信息')}</span>
                              </div>
                          </div>
                      </div>
                      <div
                          className={`${global.top_nav_item} ${global.left_row} ${top_nav_step >= 3 ? global.finished : null}`}
                          onClick={() => this.operateCurNavStep(3)}
                      >
                          <div
                              className={`${global.step} ${global.flex_row_start_center}`}
                              style={{
                                  borderBottomLeftRadius: 0,
                                  borderBottomRightRadius: 3,
                                  borderTopLeftRadius: 0,
                                  borderTopRightRadius: 3
                              }}
                          >
                              <div className={`${global.left} ${global.flex_row_center_center}`}>3</div>
                              <div className={`${global.right} ${global.flex_column_center_start}`}>
                                  <span className={`${global.title}`}>{sldComLanguage('商品详情')}</span>
                                  <span className={`${global.sub_title}`}>{sldComLanguage('设置规格信息,上传商品图片并完善商品详情')}</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  {step == 1
                      ? <SelGoodsCat
                          data={goods_cat}
                          cur_data={cur_data}
                          sldHandleGoodsCat={this.sldHandleGoodsCat}
                          sldAddGoodsSecond={this.sldAddGoodsSecond}
                          sele_goods_cat_data={sele_goods_cat_data}
                      />
                      : <Form layout="inline">
                          <Scrollbars
                              ref="scrollbars"
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight}
                          >
                              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                                  <div style={{ display: top_nav_step == 2 ? 'block' : 'none' }}>

                                      <div>
                                          {sldCommonTitleByBg(`${sldComLanguage('基本信息')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableRowTwo
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              form={this.props.form}
                                              data={goods_base_data}
                                          />
                                      </div>

                                      {search_attr_data.length > 0 &&
                    <Fragment>
                        {getSldEmptyH(10)}
                        {sldCommonTitleByBg(`${sldComLanguage('检索属性')}`)}
                        {getSldEmptyH(10)}
                        <SldTableRowTwo form={this.props.form} data={search_attr_data} />
                    </Fragment>
                                      }

                                      {getSldEmptyH(10)}
                                      {sldCommonTitleByBg(`${sldComLanguage('店铺自定义属性')}`)}
                                      {getSldEmptyH(10)}
                                      <SldTableRowTwo form={this.props.form} data={store_attr_data} />
                                      {getSldEmptyH(10)}
                                      {sldCommonTitleByBg(`${sldComLanguage('物流信息')}`)}
                                      {getSldEmptyH(10)}
                                      {
                                          //编辑商品 初始化数据后再进行数据渲染
                                          (query.id == undefined || (query.id != undefined && query.id && express_show) > 0) &&

                      <SldTableRowTwo
                          part_width={100}
                          lwidth={10}
                          rwidth={90}
                          form={this.props.form}
                          data={express_data} 
                      />
                                      }

                                      {getSldEmptyH(10)}
                                      {sldCommonTitleByBg(`${sldComLanguage('发票信息')}`)}
                                      {getSldEmptyH(10)}
                                      {show_radio_flag &&
                    <SldTableRowTwo
                        part_width={100}
                        lwidth={10}
                        rwidth={90}
                        form={this.props.form}
                        data={invoice_data} 
                    />
                                      }

                                      {getSldEmptyH(10)}
                                      {sldCommonTitleByBg(`${sldComLanguage('其他信息')}`)}
                                      {getSldEmptyH(10)}
                                      {show_radio_flag &&
                    <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form} data={other_data} />
                                      }
                                      {getSldEmptyH(10)}
                                      <div>spu信息</div>
                                      <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品图片')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableRowTwo
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              form={this.props.form}
                                              data={spu_img_data}
                                          />
                                      </div>
                                      <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品视频')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableRowTwo
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              form={this.props.form}
                                              data={goods_video_data}
                                          />
                                      </div>
                                      <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品详情描述')}`)}
                                          {getSldEmptyH(10)}
                                      </div>
                                      <SldTableRowTwo
                                          part_width={100}
                                          lwidth={10}
                                          rwidth={90}
                                          form={this.props.form}
                                          data={top_bottom_tpl_data}
                                      />
                                      <div style={{
                                          width: '800px'
                                      }}
                                      >
                                          <SldReactQuill
                                              height={document.body.clientHeight - 400}
                                              value={spuDetail}
                                              getRQContent={this.handleSpuContent}
                                          />
                                      </div>
                                      {getSldEmptyH(110)}
                                  </div>
                                  <div style={{ display: top_nav_step == 3 ? 'block' : 'none' }}>
                                      <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品规格')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableSingleRow
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              disable_spec={disable_spec}
                                              form={this.props.form}
                                              data={spec_set_data}
                                          />

                                      </div>

                                      {spec_data_table.list != undefined && spec_data_table.list.length > 0
                                          ? <Fragment>
                                              {/*可编辑表格-start this.props.global.leftWidth暂时换成150 */}
                                              {getSldEmptyH(10)}
                                              <div className={global.add_goods_sku_list}>
                                                  <Table
                                                      pagination={false}
                                                      columns={columns_spec}
                                                      dataSource={spec_data_table.list}
                                                      scroll={{ x: 1500, y: 300 }}
                                                      size="small" 
                                                  />
                                              </div>
                                          </Fragment>
                                          : <Fragment>
                                              {/* spu价格信息 */}
                                              {getSldEmptyH(10)}
                                              <div className={global.add_goods_sku_list}>
                                                  <Table
                                                      pagination={false}
                                                      columns={columns_spu}
                                                      dataSource={spu_data_table.list}
                                                      scroll={{ x: 1500, y: 300 }}
                                                      size="small" 
                                                  />
                                              </div>
                                          </Fragment>
                                      }
                                      {/* 可编辑表格-end*/}

                                      {/* 商品图片 */}
                                      <Tabs defaultActiveKey="1" onChange={(key)=>{this.changeTab(key)}} type="card">
                                          {
                                              tab_spec_list.map((item,index)=>(
                                                  <TabPane tab={item.name} key={item.key}>
                                                      <div>
                                                          {getSldEmptyH(10)}
                                                          {sldCommonTitleByBg(`${sldComLanguage('商品名称')}`)}
                                                          {getSldEmptyH(10)}
                                                          <Input
                                                              maxLength={250}
                                                              style={{ width: '100%' }}
                                                              value={item.skuName}
                                                              onChange={e => this.skuNameChange(e.target.value)}
                                                          />
                                                      </div>
                                                      <div>
                                                          {getSldEmptyH(10)}
                                                          {sldCommonTitleByBg(`${sldComLanguage('商品税率')}`)}
                                                          {getSldEmptyH(10)}
                                                          <Tax form={this.props.form} skuName={item.skuName} taxCode={item.taxCode} taxRate={item.taxRate} onChange={(value,type) => this.skuTaxChange(value,type)} />
                                                      </div>
                                                      <div>
                                                          {getSldEmptyH(10)}
                                                          {sldCommonTitleByBg(`${sldComLanguage('商品图片')}`)}
                                                          {getSldEmptyH(10)}
                                                          <SldTableRowTwo
                                                              part_width={100}
                                                              lwidth={10}
                                                              rwidth={90}
                                                              form={this.props.form}
                                                              data={[{...goods_img_data[index]}]}
                                                          />
                                                      </div>
                                                      <div>
                                                          {getSldEmptyH(10)}
                                                          {sldCommonTitleByBg(`${sldComLanguage('商品视频')}`)}
                                                          {getSldEmptyH(10)}
                                                          <SldTableRowTwo
                                                              part_width={100}
                                                              lwidth={10}
                                                              rwidth={90}
                                                              form={this.props.form}
                                                              data={goods_video_data}
                                                          />
                                                      </div>
                                                      <div>
                                                          {getSldEmptyH(10)}
                                                          {sldCommonTitleByBg(`${sldComLanguage('商品详情描述')}`)}
                                                          {getSldEmptyH(10)}
                                                      </div>
                                                      <SldTableRowTwo
                                                          part_width={100}
                                                          lwidth={10}
                                                          rwidth={90}
                                                          form={this.props.form}
                                                          data={item.top_bottom_tpl_data}
                                                      />
                                                      <div style={{
                                                          width: '800px'
                                                      }}
                                                      >
                                                          <SldReactQuill
                                                              height={document.body.clientHeight - 400}
                                                              value={item.description}
                                                              getRQContent={this.handleGetContent}
                                                          />
                                                      </div>
                                                      {getSldEmptyH(110)}
                                                  </TabPane>
                                              ))
                                          }
                                      </Tabs>
                                      {/* <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品图片')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableRowTwo
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              form={this.props.form}
                                              data={goods_img_data}
                                          />
                                      </div> */}
                                      {/* 商品视频-start */}
                                      {/* <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品视频')}`)}
                                          {getSldEmptyH(10)}
                                          <SldTableRowTwo
                                              part_width={100}
                                              lwidth={10}
                                              rwidth={90}
                                              form={this.props.form}
                                              data={goods_video_data}
                                          />
                                      </div> */}
                                      {/* 商品视频-end */}
                                      {/* 商品详情描述 */}
                                      {/* <div>
                                          {getSldEmptyH(10)}
                                          {sldCommonTitleByBg(`${sldComLanguage('商品详情描述')}`)}
                                          {getSldEmptyH(10)}
                                      </div>
                                      <SldTableRowTwo
                                          part_width={100}
                                          lwidth={10}
                                          rwidth={90}
                                          form={this.props.form}
                                          data={top_bottom_tpl_data}
                                      />
                                      <div style={{
                                          width: document.body.clientWidth - 209
                                      }}
                                      >
                                          <SldReactQuill
                                              height={document.body.clientHeight - 400}
                                              value={description}
                                              getRQContent={this.handleGetContent}
                                          />
                                      </div>
                                      {getSldEmptyH(110)} */}
                                  </div>
                              </div>
                              {/*</div>*/}

                              {getSldEmptyH(130)}
                              <div
                                  className={global.m_diy_bottom_wrap}
                                  style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                              >
                                  <div onClick={() => this.backPre()} className={global.add_goods_bottom_btn}>
                                      {sldComLanguage('返回')}
                                  </div>
                                  <div
                                      onClick={() => this.operateCurNavStep(top_nav_step == 2 ? 3 : 2)}
                                      className={global.add_goods_bottom_btn}
                                  >
                                      {top_nav_step == 2 ? `${sldComLanguage('下一步')}` : `${sldComLanguage('上一步')}`}
                                  </div>

                                  {!(query.id != undefined) && <Button type="primary" disabled={top_nav_step != 3} onClick={() => this.handleSaveAllData()}>{sldComLanguage('发布')}</Button> }
                                  {(query.id != undefined) && <Button type="primary" disabled={top_nav_step != 3} onClick={() => this.handleSaveAllData()}>{sldComLanguage('保存')}</Button> }
                              </div>
                              {/*</div>*/}
                          </Scrollbars>
                      </Form>

                  }
              </Spin>
              {/*图片预览-start*/}
              <SldPreviewImg
                  img={preview_img}
                  show_preview_modal={show_preview_modal}
                  modal_width={modal_width}
                  preview_alt_con={preview_alt_con}
                  closePreviewModal={() => this.viewImg(false)}
              />
              {/*图片预览-end*/}
          </div>
      );
  }
}
