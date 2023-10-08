import { connect } from 'dva/index';
import React, { Component
} from 'react';
import { Form, Input, Spin, Switch, Radio
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    sldLlineRtextAddGoods,
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const FormItem = Form.Item;
let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ product, global }) => ({
    product, global
}))
@Form.create()
export default class Add_article extends Component {

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            bisEdit: !!props.location.query.id ? true : false,//'add'新增  'edit'编辑
            detail: {
                channelId: '',
                channelName: '',
                approvalRequestUrl: '',//审批接入地址
                pushRequestUrl: '',//推送接入地址
                companyInvoiceTitleUrl: '',//企业发票抬头接入地址
                sendPointRecordUrl: '',//红点推送接入地址
                complaintUrl:'',//投诉地址
                clientId:'',//上报发票参数clientId
                clientSecret:'',//上报发票参数clientSecret
                keyCloakUrl:'',//上报发票参数keyCloakUrl
                syncInvoiceUrl:'',//上报发票参数syncInvoiceUrl
                ifcApplyUrl:'',//商云白条接入地址                                
                supportShareWx:false,//是否支持分享微信
                supportShareWxMini:false,//是否支持分享微信小程序
                wxMiniAppletId:'',//巨拾惠小程序原始id
                shareWxMiniVersion:0,//巨拾惠小程序分享类型正式版:0，测试版:1，体验版:2
                sensorAppId:'',//智e采appId
                sensorToken:'',//智e采token
                sensorServerAddress:'',//智e采上报服务地址
                giftSwitch:false,//鹅毛情业务开关
                priceComparisonSwitch:false,//是否展示比价信息
                theme:'bnj',//主题
                grayscaleFull:false,//灰度100%，即黑白色
                guideSwitch:false//引导页开关
            },//渠道详情
            query: props.location.query,
            showLoading: true,
            optionKeys:['approvalRequestUrl','pushRequestUrl','companyInvoiceTitleUrl','sendPointRecordUrl','complaintUrl','clientId','clientSecret','keyCloakUrl','syncInvoiceUrl','ifcApplyUrl','supportShareWx','supportShareWxMini','wxMiniAppletId','shareWxMiniVersion','sensorAppId','sensorToken','sensorServerAddress','giftSwitch','priceComparisonSwitch','theme','grayscaleFull','guideSwitch'],
            optionKeysDataTypeMap:{'supportShareWx':'Boolean','supportShareWxMini':'Boolean','shareWxMiniVersion':'Number','giftSwitch':'Boolean','priceComparisonSwitch':'Boolean','grayscaleFull':'Boolean','guideSwitch':'Boolean'}//数据类型不为字符串的枚举，其他字段默认为字符串
        };
    }

    componentDidMount() {
        this.getDetail();
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
    }

    //根据id获取详细信息
    getDetail = () => {
        let { detail, query ,optionKeysDataTypeMap} = this.state;
        const { dispatch } = this.props;
        if (!!query.id) {
            dispatch({
                type: 'maintaince_channel/maintenance_detail',
                payload: { 'channelId': query.id },
                callback: (res) => {
                    if (res.state == 200) {
                        //初始化数据
                        detail = res.data;
                        (detail.channelAccessConfigs || []).forEach(item => {
                            if(!!optionKeysDataTypeMap[item.configKey]){
                                if(optionKeysDataTypeMap[item.configKey]=='Boolean'){
                                    detail[item.configKey] = item.configValue=='true';
                                }else if(optionKeysDataTypeMap[item.configKey]=='Number'){
                                    detail[item.configKey] = parseInt(item.configValue);
                                }else{
                                    detail[item.configKey] = item.configValue;
                                }
                            }else{
                                detail[item.configKey] = item.configValue;
                            }
                            
                        });
                        this.setState({ detail, showLoading: false });
                    } else {
                        failTip(res.msg);
                    }
                }
            });
        }else{
            this.setState({ detail });
        }
    };

    //保存并新增事件
    handleSaveAllData = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                const { query,optionKeys } = this.state;
                let dis_type = 'maintaince_channel/maintenance_add';
                //如果有id，则编辑该条数据信息
                if (!!query.id) {
                    dis_type = 'maintaince_channel/maintenance_upData';
                }
                let params = {
                    channelId: values.channelId,
                    channelName: values.channelName
                }
                let channelAccessConfigs = [];
                optionKeys.forEach((key)=>{
                    //兼容数据为0的情况
                    if ((!!values[key] && '' != values[key])||values[key]===0 || values[key]===false) {
                        channelAccessConfigs.push({ configKey: key, configValue: values[key] })
                    }
                })  
                if (0 < channelAccessConfigs.length) {
                    params.channelAccessConfigs = channelAccessConfigs;
                }
                dispatch({
                    type: dis_type,
                    payload: params,
                    callback: (res) => {
                        if (res.state == 200) {
                            sucTip(res.msg);
                            setTimeout(() => {
                                sthis.props.history.goBack();
                            }, 500);
                        } else {
                            failTip(res.msg);
                        }
                    }
                });
            }
        });
    };

    render() {
        const { detail, showLoading, query, bisEdit } = this.state;
        let { form: { getFieldDecorator } } = this.props;
        return (
            <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 160}
            >
                <Spin spinning={query.id != undefined ? showLoading : false}>
                    <div
                        className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                    >
                        {sldLlineRtextAddGoods('#FA6F1E', `${('基础信息')}`)}
                        {getSldEmptyH(10)}
                        <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                            <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                <div style={{ display: 'flex', flexDirection: 'column',width: '800px' }}>
                                    <Form layout="inline">

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }}>*</span>渠道ID
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('channelId', {
                                                        initialValue: detail.channelId, rules: [{
                                                            required: true,
                                                            message: `${('请输入渠道ID')}`
                                                        }]
                                                    })(
                                                        <Input maxLength={20} disabled={bisEdit} style={{ width: 400 }} placeholder={`${('请输入渠道ID，找行长确认')}`} />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }}>*</span>渠道全称
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('channelName', {
                                                        initialValue: detail.channelName, rules: [{
                                                            required: true,
                                                            whitespace: true,
                                                            message: `${('请输入渠道全称')}`
                                                        }]
                                                    })(
                                                        <Input maxLength={50} style={{ width: 400 }} placeholder={`${('如有多套环境，请找行长确认，需清晰表示当前环境')}`} />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        {getSldEmptyH(35)}
                                        {sldLlineRtextAddGoods('#FA6F1E', `${('接入配置')}`)}{/*内容编辑*/}

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />审批接入地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('approvalRequestUrl', {
                                                        initialValue: detail.approvalRequestUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入审批接入地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            maxLength={255}
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入审批接入地址')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />推送接入地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('pushRequestUrl', {
                                                        initialValue: detail.pushRequestUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入推送接入地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入推送接入地址')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />企业发票抬头地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('companyInvoiceTitleUrl', {
                                                        initialValue: detail.companyInvoiceTitleUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入企业发票抬头地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入企业发票抬头地址，找行长确认')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />红点推送接入地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('sendPointRecordUrl', {
                                                        initialValue: detail.sendPointRecordUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入红点推送接入地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入红点推送接入地址')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />投诉接入地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('complaintUrl', {
                                                        initialValue: detail.complaintUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入投诉接入地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入投诉接入地址')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />商云白条地址
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('ifcApplyUrl', {
                                                        initialValue: detail.ifcApplyUrl, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入商云白条地址')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('请输入商云白条地址')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div style={{ border: '1px solid #e8e8e8',margin: '10px 0',padding:'10px 0' }}>
                                            <div style={{ paddingLeft:'20px',fontWeight:'bold' }}>发票推送配置</div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />ClientId
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('clientId', {
                                                            initialValue: detail.clientId, rules: [{
                                                                required: false,
                                                                whitespace: true,
                                                                message: `${('请输入ClientId')}`
                                                            }]
                                                        })(
                                                            <Input
                                                                style={{ width: 400 }}
                                                                placeholder={`${('可选配置，渠道分配给B+的token接口入参，请找行长确认')}`}
                                                            />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />ClientSecret
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('clientSecret', {
                                                            initialValue: detail.clientSecret, rules: [{
                                                                required: false,
                                                                whitespace: true,
                                                                message: `${('请输入ClientSecret')}`
                                                            }]
                                                        })(
                                                            <Input
                                                                style={{ width: 400 }}
                                                                placeholder={`${('可选配置，渠道分配给B+的token接口入参，请找行长确认')}`}
                                                            />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />token-url
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('keyCloakUrl', {
                                                            initialValue: detail.keyCloakUrl, rules: [{
                                                                required: false,
                                                                whitespace: true,
                                                                message: `${('请输入token-url')}`
                                                            }]
                                                        })(
                                                            <Input
                                                                style={{ width: 400 }}
                                                                placeholder={`${('可选配置，渠道提供的，用于B+授权的token接口地址，请找行长确认')}`}
                                                            />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />上报发票接口地址
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('syncInvoiceUrl', {
                                                            initialValue: detail.syncInvoiceUrl, rules: [{
                                                                required: false,
                                                                whitespace: true,
                                                                message: `${('请输入上报发票接口地址')}`
                                                            }]
                                                        })(
                                                            <Input
                                                                style={{ width: 400 }}
                                                                placeholder={`${('可选配置，渠道提供的，用于B+同步发票信息的接口地址，请找行长确认')}`}
                                                            />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div> 
                                        </div>

                                        {getSldEmptyH(35)}
                                        {sldLlineRtextAddGoods('#FA6F1E', `${('微信配置')}`)}{/*内容编辑*/}

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />是否支持分享微信
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('supportShareWx', {
                                                        initialValue: detail.supportShareWx, valuePropName: 'checked' 
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />是否支持分享微信小程序
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('supportShareWxMini', {
                                                        initialValue: detail.supportShareWxMini, valuePropName: 'checked' 
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div style={{ border: '1px solid #e8e8e8',margin: '10px 0',padding:'10px 0' }}>
                                            <div style={{ paddingLeft:'20px',fontWeight:'bold' }}>巨拾惠小程序配置</div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />巨拾惠小程序原始id
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('wxMiniAppletId', {
                                                            initialValue: detail.wxMiniAppletId, rules: [{
                                                                required: false,
                                                                whitespace: true,
                                                                message: `${('请输入巨拾惠小程序原始id')}`
                                                            }]
                                                        })(
                                                            <Input
                                                                style={{ width: 400 }}
                                                                placeholder={`${('巨拾惠小程序原始id')}`}
                                                            />,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`}>
                                                    <span style={{ color: '#FF1515' }} />巨拾惠小程序分享类型
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        {getFieldDecorator('shareWxMiniVersion', {
                                                            initialValue: detail.shareWxMiniVersion
                                                        })(
                                                            <Radio.Group>
                                                                <Radio value={0}>正式版</Radio>
                                                                <Radio value={1}>测试版</Radio>
                                                                <Radio value={2}>体验版</Radio>
                                                            </Radio.Group>,
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div> 
                                        </div>
                                        {getSldEmptyH(35)}
                                        {sldLlineRtextAddGoods('#FA6F1E', `${('智e采配置')}`)}{/*内容编辑*/}

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />appId
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('sensorAppId', {
                                                        initialValue: detail.sensorAppId, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入appId')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('智e采分配的appId')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />token
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('sensorToken', {
                                                        initialValue: detail.sensorToken, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入token')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('智e采分配的token')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />serverAddress
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('sensorServerAddress', {
                                                        initialValue: detail.sensorServerAddress, rules: [{
                                                            required: false,
                                                            whitespace: true,
                                                            message: `${('请输入serverAddress')}`
                                                        }]
                                                    })(
                                                        <Input
                                                            style={{ width: 400 }}
                                                            placeholder={`${('智e采分配的serverAddress')}`}
                                                        />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>                                        
                                        {getSldEmptyH(35)}
                                        {sldLlineRtextAddGoods('#FA6F1E', `${('通用配置')}`)}{/*内容编辑*/}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />是否开放鹅毛情入口
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                    extra="开放后会在商品详情、下单页面展示鹅毛情入口"
                                                >
                                                    {getFieldDecorator('giftSwitch', {
                                                        initialValue: detail.giftSwitch,valuePropName: 'checked'
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />是否开放比价信息
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                    extra="开放后会在商品列表、详情页面展示比价信息"
                                                >
                                                    {getFieldDecorator('priceComparisonSwitch', {
                                                        initialValue: detail.priceComparisonSwitch,valuePropName: 'checked'
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />主题设置
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('theme', {
                                                        initialValue: detail.theme
                                                    })(
                                                        <Radio.Group>
                                                            <Radio value="bnj">比N家</Radio>
                                                            <Radio value="jushihui">巨拾惠</Radio>
                                                        </Radio.Group>,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div> 

                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />设置页面为黑白色
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                    extra="开放后所有页面显示为黑白色"
                                                >
                                                    {getFieldDecorator('grayscaleFull', {
                                                        initialValue: detail.grayscaleFull,valuePropName: 'checked'
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>                                        
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />引导页开关
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    style={{ width: 300 }}
                                                    extra="启用后首次访问首页展示引导页"
                                                >
                                                    {getFieldDecorator('guideSwitch', {
                                                        initialValue: detail.guideSwitch,valuePropName: 'checked'
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>                                         
                                        <div
                                            className={global.m_diy_bottom_wrap}
                                            style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                                        >
                                            <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                                                {sldComLanguage('返回')}{/*返回*/}
                                            </div>
                                            <AuthBtn eventKey={["add_channel_config","edit_channel_config"]} btnAuth={btnAuth}>
                                                <div
                                                    onClick={() => this.props.form.submit(this.handleSaveAllData)}
                                                    className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                                >
                                                保存并返回
                                                </div>
                                            </AuthBtn>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Scrollbars>
        );
    }
}
