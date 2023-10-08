import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Form, Spin, Switch } from 'antd';
import {
    failTip,
    sucTip,
    list_com_page_size_10,
    list_com_page_num_1,
    list_com_page_more,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    getTableNum,
    sldComLanguage,
    getSldCopyData,
    sldtbaleOpeBtnText,
    hasAuth,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SelectMemberPop from '@/components/SelectMemberPop';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
// 请求渠道信息最大条数为10000
let pageMore = list_com_page_more;
let pageNum = list_com_page_num_1;
let tplruleEnum = {
    all_buying_reminder:{
        bisType:'rule'
    },
    summary_buytogether_reminder:{
        bisType:'buyTogetherRule'
    },
    preview_buyeveryday_reminder:{
        bisType:'buyEverydayRule'
    }
}
@connect(({ sldsetting, common }) => ({
    sldsetting,
    common
}))
@Form.create()
export default class MemberMsgTplList extends Component {
    cur_edit_id = '';//当前操作数据id

    email_content = '';//邮件内容

    selectedMemberRows= [] ;//选中的指定会员

    selectedMemberRowKeys=[];//选中的指定会员id
    
    sele_more_members = {
        info: [],//选择的会员数组
        ids: [],//选择的会员id数组
        min_num: 1,//最小数量，0为不限制
        max_num: 10000//最多选择10000个
    };

    editTplAuth1='edit_member_tpl'

    editTplAuth2='edit_push_all'

    columns_member=[
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center',
            width: 56,
            render: (text, record, index) => index + 1
        },
        {
            title: '会员名',
            dataIndex: 'memberName',
            align: 'center',
            width: 100
        },
        {
            title: '会员ID',
            dataIndex: 'memberId',
            align: 'center',
            width: 100
        },

        {
            title: `${sldComLanguage('手机号')}`,//手机号
            dataIndex: 'memberMobile',
            align: 'center',
            width: 120
        },
        {
            title: `${sldComLanguage('会员昵称')}`,//会员昵称
            dataIndex: 'memberNickName',
            align: 'center',
            width: 80,
            render: (text) => text?text:'--'
        },
        {
            title: '公司',//渠道
            dataIndex: 'companyName',
            align: 'center',
            width: 80,
            render: (text) => text?text:'--'
        },
        {
            title: '渠道',//渠道
            dataIndex: 'channelName',
            align: 'center',
            width: 80,
            render: (text) => text?text:'--'
        }
    ]

    constructor(props) {
        super(props);
        this.state = {
            DescEncodeVal:'',
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            operationData: {},//渠道列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: '',//消息模板编辑类型
            params: { pageSize: pageSize },//搜索条件
            upload_img_info: {},//上传的图片信息
            operateData: [],//操作的数据
            allBuyRuleData: {},//都在买规则数据
            buyTogetherData: null,//一起买接口规则数据
            buyEverydayData: null,//天天专场接口规则数据
            ruleChannelInfos: [],//都在买规则渠道
            modalVisibleMember: false,//选择会员的模态框开关
            selectedMemberRows: [], //选中的指定会员
            selectedMemberRowKeys: [],//选中的指定会员id
            channelProps:{
                channelId:'',
                channelName:''
            },
            BuyingPushConfigRequest:{},//一起买和都在买请求的接口数据
            //站内信modal框的数据
            msgData: [
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启')}`,
                    name: 'msgSwitch',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'textarea',
                    label: `${sldComLanguage('模板内容')}`,
                    name: 'msgContent',
                    placeholder: `${sldComLanguage('请输入模板内容')}`,
                    extra: `${sldComLanguage('最多输入1000个字')}`,
                    initialValue: '',
                    maxLength: 1000,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                }

            ],
            //邮件modal框的数据
            emailData: [
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启')}`,
                    name: 'emailSwitch',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('邮件标题')}`,//邮件标题
                    name: 'email_subject',
                    placeholder: `${sldComLanguage('请输入邮件标题')}`,
                    initialValue: '',
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                }, {
                    type: 'quill',
                    label: `${sldComLanguage('邮件内容')}`,
                    name: 'email_content',
                    placeholder: ``,
                    initialValue: '',
                    handleGetContent: (val) => this.handleGetContent(val)
                }

            ],
            //短信modal框的数据
            smsData: [
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启')}`,
                    name: 'smsSwitch',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('短信模版ID')}`,
                    name: 'templateId',
                    placeholder: `${sldComLanguage('请输入短信模版ID')}`,
                    initialValue: '',
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                },
                {
                    type: 'textarea',
                    label: `${sldComLanguage('模板内容')}`,//模板内容
                    name: 'templateContent',
                    placeholder: `${sldComLanguage('请输入模板内容')}`,
                    extra: `${sldComLanguage('最多输入100个字')}`,
                    initialValue: '',
                    maxLength: 100,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                }

            ],
            //微信modal框的数据
            wxData: [
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启')}`,
                    name: 'wxSwitch',
                    placeholder: ``,
                    initialValue: 1
                }, {
                    type: 'input',
                    label: `${sldComLanguage('微信模板ID')}`,
                    name: 'templateId',
                    placeholder: `${sldComLanguage('请输入微信模板ID')}`,
                    initialValue: '',
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                },
                {
                    type: 'textarea',
                    label: `${sldComLanguage('模板内容')}`,
                    name: 'templateContent',
                    placeholder: `${sldComLanguage('请输入模板内容')}`,
                    initialValue: '',
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入模板内容')}`
                    }]
                }

            ],
            //app推送模板数据
            appData: [
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启')}`,
                    name: 'appSwitch',
                    placeholder: ``,
                    initialValue: 1
                }, {
                    type: 'select',
                    label: `${sldComLanguage('推送渠道')}`,
                    name: 'channelId',
                    sldChange: this.changeTextarea,
                    sel_data: [

                    ]
                },
                {
                    type: 'textarea',
                    label: `${sldComLanguage('模板内容')}`,
                    name: 'appContent',
                    placeholder: `${sldComLanguage('请输入模板内容')}`,
                    initialValue: '',
                    textareaRows: 13
                    // rules: [{
                    //     required: true,
                    //     whitespace: true,
                    //     message: `${sldComLanguage('请输入模板内容')}`
                    // }]
                },{
                    type: 'Popconfirmswitch',
                    label: `${sldComLanguage('富文本base64加密')}`,
                    name: 'descEncodeSwitch',
                    placeholder: ``,
                    initialValue: 0,
                    changeDescEncode:this.changeDescEncode
                }

            ],
            //都在买规则数据
            ruleData: [
                {
                    type: 'onlytxt',
                    fontSize: '16px',
                    content: '消息推送设置',
                    fontWeight: 'bold',
                    marginBottom: '0'
                },
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启消息推送')}`,
                    name: 'startState',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'tpl_select',
                    mode: 'multiple',
                    allowClear: true,
                    label: `${sldComLanguage('推送渠道')}`,
                    name: 'pushChannelList',
                    sldChange: this.changePushChannel,
                    sel_data: [

                    ]
                },
                {
                    type: 'msgRadioGroup',
                    label: `${sldComLanguage('推送指定人所在渠道')}`,
                    name: 'pushMemberChannel',
                    sldChange: this.changeMemberChannel,
                    memberChannelList:[]
                },
                {
                    type: 'msgTable',
                    show:false,
                    label: `${sldComLanguage('当前渠道已选会员')}`,
                    name: 'pushMember',
                    sldChange: this.resetSelMembers,
                    columns:this.columns_member,
                    dataSource:[],
                    rowKey:"keyId"
                },
                {
                    type: 'select',
                    label: `${sldComLanguage('推送方式')}`,
                    name: 'pushType',
                    sldChange: this.changePushType,
                    sel_data: [
                        {
                            key: 'TIMING',
                            name: '定时推送'
                        },
                        {
                            key: 'REALTIME',
                            name: '实时推送'
                        }
                    ]
                },
                {
                    type: 'tpl_timing_select',
                    label: `${sldComLanguage('发送频率')}`,
                    name: 'sendFrequency',
                    show: true,
                    width: '80%',
                    tailContext: '次/天',
                    sendTime: [{
                        type: 'timepicker',
                        format: 'HH:mm',
                        label: `${sldComLanguage('活动时间')}`,
                        name: 'sendTime',
                        placeholder: `${sldComLanguage('请选择时间')}`
                    }],
                    sldChange: this.changeFrequency,
                    sel_data: [
                        {
                            key: '1',
                            name: '1'
                        },
                        {
                            key: '2',
                            name: '2'
                        },
                        {
                            key: '3',
                            name: '3'
                        },
                        {
                            key: '4',
                            name: '4'
                        }
                    ]
                },
                {
                    type: 'tpl_realtime_select',
                    label: `${sldComLanguage('免打扰时间')}`,
                    name: 'timeQuantumList',
                    show: false,
                    timeQuantumList: [
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'TimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        }
                    ]
                },

                {
                    type: 'tpl_goods_select',
                    label: `${sldComLanguage('推荐商品数')}`,
                    name: 'goodsCount',
                    show: true,
                    sel_data: [
                        {
                            key: '1',
                            name: '1'
                        },
                        {
                            key: '2',
                            name: '2'
                        },
                        {
                            key: '3',
                            name: '3'
                        },
                        {
                            key: '4',
                            name: '4'
                        },
                        {
                            key: '5',
                            name: '5'
                        }
                    ]
                },
                {
                    type: 'onlytxt',
                    fontSize: '16px',
                    content: '红点推送设置',
                    fontWeight: 'bold',
                    marginBottom: '0'
                },
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启红点推送')}`,
                    name: 'redStartState',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'tpl_select',
                    mode: 'multiple',
                    allowClear: true,
                    label: `${sldComLanguage('推送渠道')}`,
                    name: 'redPushChannelList',
                    sldChange: this.changeRedPushChannel,
                    sel_data: [

                    ]
                },
                {
                    type: 'select',
                    label: `${sldComLanguage('推送方式')}`,
                    name: 'redPushType',
                    sldChange: this.changeRedPushType,
                    sel_data: [
                        {
                            key: 'TIMING',
                            name: '定时推送'
                        },
                        {
                            key: 'REALTIME',
                            name: '实时推送'
                        }
                    ]
                },
                {
                    type: 'tpl_redtiming_select',
                    label: `${sldComLanguage('发送频率')}`,
                    name: 'redSendFrequency',
                    show: true,
                    width: '80%',
                    tailContext: '次/天',
                    redSendTime: [{
                        type: 'timepicker',
                        format: 'HH:mm',
                        label: `${sldComLanguage('活动时间')}`,
                        name: 'redSendTime',
                        placeholder: `${sldComLanguage('请选择时间')}`
                    }],
                    sldChange: this.changeRedFrequency,
                    sel_data: [
                        {
                            key: '1',
                            name: '1'
                        },
                        {
                            key: '2',
                            name: '2'
                        },
                        {
                            key: '3',
                            name: '3'
                        },
                        {
                            key: '4',
                            name: '4'
                        }
                    ]
                },
                {
                    type: 'tpl_redrealtime_select',
                    label: `${sldComLanguage('免打扰时间')}`,
                    name: 'redTimeQuantumList',
                    show: false,
                    redTimeQuantumList: [
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择开始时间')}`
                        },
                        {
                            format: 'HH:mm',
                            name: 'redTimeQuantum',
                            placeholder: `${sldComLanguage('请选择结束时间')}`
                        }
                    ]
                }
            ],
            buyTogetherRuleData: [
                {
                    type: 'onlytxt',
                    fontSize: '16px',
                    content: '消息推送设置',
                    fontWeight: 'bold',
                    marginBottom: '0'
                },
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启消息推送')}`,
                    name: 'startState',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'tpl_buyTogether_select',
                    mode: 'multiple',
                    height: 400,
                    allowClear: true,
                    label: `${sldComLanguage('推送渠道')}`,
                    name: 'pushChannelList',
                    sldChange: this.changePushChannel,
                    sel_data: [

                    ]
                },
                {
                    type: 'msgRadioGroup',
                    label: `${sldComLanguage('推送指定人所在渠道')}`,
                    name: 'pushMemberChannel',
                    sldChange: this.changeMemberChannel,
                    memberChannelList:[]
                },
                {
                    type: 'msgTable',
                    label: `${sldComLanguage('当前渠道已选会员')}`,
                    name: 'pushMember',
                    sldChange: this.resetSelMembers,
                    columns:this.columns_member,
                    dataSource:[],
                    show:false,
                    rowKey:"keyId"
                },
                {
                    type: 'select',
                    label: `${sldComLanguage('推送方式')}`,
                    name: 'pushType',
                    // sldChange: this.changeBuyTogetherPushType,
                    sel_data: [
                        {
                            key: 'TIMING',
                            name: '定时推送'
                        }
                    ]
                },
                {
                    type: 'tpl_timing_select',
                    label: `${sldComLanguage('发送频率')}`,
                    name: 'sendFrequency',
                    show: true,
                    width: '80%',
                    tailContext: '次/天',
                    sendTime: [{
                        type: 'timepicker',
                        format: 'HH:mm',
                        label: `${sldComLanguage('活动时间')}`,
                        name: 'sendTime',
                        placeholder: `${sldComLanguage('请选择时间')}`
                    }],
                    sldChange: this.changeBuyTogetherFrequency,
                    sel_data: [
                        {
                            key: '1',
                            name: '1'
                        },
                        {
                            key: '2',
                            name: '2'
                        },
                        {
                            key: '3',
                            name: '3'
                        },
                        {
                            key: '4',
                            name: '4'
                        }
                    ]
                }
            ],
            buyEverydayRuleData: [
                {
                    type: 'onlytxt',
                    fontSize: '16px',
                    content: '消息推送设置',
                    fontWeight: 'bold',
                    marginBottom: '0'
                },
                {
                    type: 'switch',
                    label: `${sldComLanguage('是否开启消息推送')}`,
                    name: 'startState',
                    placeholder: ``,
                    initialValue: 1
                },
                {
                    type: 'tpl_buyTogether_select',
                    mode: 'multiple',
                    height: 400,
                    allowClear: true,
                    label: `${sldComLanguage('推送渠道')}`,
                    name: 'pushChannelList',
                    sldChange: this.changePushChannel,
                    sel_data: [

                    ]
                },
                {
                    type: 'msgRadioGroup',
                    label: `${sldComLanguage('推送指定人所在渠道')}`,
                    name: 'pushMemberChannel',
                    sldChange: this.changeMemberChannel,
                    memberChannelList:[]
                },
                {
                    type: 'msgTable',
                    show:false,
                    label: `${sldComLanguage('当前渠道已选会员')}`,
                    name: 'pushMember',
                    sldChange: this.resetSelMembers,
                    columns:this.columns_member,
                    dataSource:[],
                    rowKey:"keyId"
                }
            ],
            formValues: {},//搜索条件、
            columns: [
                {
                    title: ' ',
                    dataIndex: 'tplCode',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('模板描述')}`,
                    dataIndex: 'tplName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('站内信')}`,
                    dataIndex: 'msgSwitch',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={this.getBtnAuthSwitch()}
                            onChange={(checked) => this.operateMsg({
                                tplCode: record.tplCode,
                                msgSwitch: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                },
                {
                    title: `${sldComLanguage('APP')}`,
                    dataIndex: 'appSwitch',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={this.getBtnAuthSwitch()}
                            onChange={(checked) => this.operateMsg({
                                tplCode: record.tplCode,
                                appSwitch: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                },
                {
                    title: `${sldComLanguage('邮件')}`,
                    dataIndex: 'emailSwitch',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={this.getBtnAuthSwitch()}
                            onChange={(checked) => this.operateMsg({
                                tplCode: record.tplCode,
                                emailSwitch: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                }, {
                    title: `${sldComLanguage('短信')}`,
                    dataIndex: 'smsSwitch',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={this.getBtnAuthSwitch()}
                            onChange={(checked) => this.operateMsg({
                                tplCode: record.tplCode,
                                smsSwitch: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                }, {
                    title: `${sldComLanguage('微信')}`,
                    dataIndex: 'wxSwitch',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={this.getBtnAuthSwitch()}
                            onChange={(checked) => this.operateMsg({
                                tplCode: record.tplCode,
                                wxSwitch: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                },
                {
                    title: `${sldComLanguage('模板')}`,
                    width: 100,
                    align: 'center',
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={this.getBtnAuthEdit()} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('站内信')}`, () => this.editMsg(record, 'msg'))}
                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('APP')}`, () => this.editMsg(record, 'app'))}
                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('邮件')}`, () => this.editMsg(record, 'email'))}
                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('短信')}`, () => this.editMsg(record, 'sms'))}
                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('微信')}`, () => this.editMsg(record, 'wx'))}
                            </AuthBtn>
                        </Fragment>
                    )
                }, {
                    title: `${sldComLanguage('规则')}`,
                    dataIndex: 'rule',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <div>
                            <AuthBtn eventKey={['edit_push_all_rule']} btnAuth={btnAuth}>
                                {props.noticeType == 'multiple'&&
                                <Fragment>
                                    {sldtbaleOpeBtnText(`${sldComLanguage('APP')}`, () => this.editMsg(record, tplruleEnum[record.tplCode].bisType))}
                                </Fragment>
                                }
                            </AuthBtn>
                        </div>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        btnAuth = getAuthBtn();
        this.props.onRef(this)
        this.get_list({ pageSize: pageSize });
        this.get_operation_list({ pageSize: pageMore, pageNum: pageNum });//获取渠道信息
        this.get_rule()
        this.get_tplruleDate('summary_buytogether_reminder','buyTogetherData');
        
        this.get_tplruleDate('preview_buyeveryday_reminder','buyEverydayData');
    }

    changeDescEncode=(val)=>{
        let {operateData} = this.state
        let DescEncodeIndex = operateData.findIndex(item=>item.name=='descEncodeSwitch')
        operateData[DescEncodeIndex].initialValue = val
        this.setState({
            DescEncodeVal:val,
            operateData
        })
    }

    //编辑消息模板 val: 单条数据  type: 编辑类型
    editMsg = (val, type) => {
        let { operateData, allBuyRuleData, ruleData, buyTogetherData, buyTogetherRuleData, buyEverydayData, buyEverydayRuleData ,BuyingPushConfigRequest} = this.state;
        this.setState({
            type:type
        },()=>{
            operateData = getSldCopyData(this.state[`${type}Data`]);
            let tmp_data = {};
            if (type == 'msg') {
            //站内信
                for (let i = 0; i < operateData.length; i++) {
                    operateData[i].initialValue = val[operateData[i].name];
                }
            } else if (type == 'email') {
                if(val.emailContent){
                    tmp_data = JSON.parse(val.emailContent);
                }
                val = { ...val, ...tmp_data };
                for (let i = 0; i < operateData.length; i++) {
                    operateData[i].initialValue = val[operateData[i].name];
                }
            } else if (type == 'sms') {
            //短信
                tmp_data = {};
                if (val.smsContent) {
                    tmp_data = JSON.parse(val.smsContent);
                } else {
                    tmp_data = { templateId: '', templateContent: '' };
                }
                val = { ...val, ...tmp_data };
                for (let i = 0; i < operateData.length; i++) {
                    operateData[i].initialValue = val[operateData[i].name];
                }
            } else if (type == 'wx') {
            //微信
                tmp_data = {};
                if (val.wxContent) {
                    tmp_data = JSON.parse(val.wxContent);
                } else {
                    tmp_data = { templateId: '', templateContent: '' };
                }
                val = { ...val, ...tmp_data };
                for (let i = 0; i < operateData.length; i++) {
                    operateData[i].initialValue = val[operateData[i].name];
                }
            } else if (type == 'app') {
                operateData[0].initialValue = val.appSwitch;
                if (!!val.appNoticeList && !!val.appNoticeList.length && val.appNoticeList.length > 0) {
                    operateData[2].initialValue = val.appNoticeList.find(item => item.channelId==operateData[1].sel_data[0].key)?.appContent;
                    operateData[3].initialValue = val.appNoticeList.find(item => item.channelId==operateData[1].sel_data[0].key)?.descEncodeSwitch;
                }
            } else if (type == 'rule') {
            //消息推送的初始值
                let startStateIndex = ruleData.findIndex(item => item.name == 'startState')
                ruleData[startStateIndex].initialValue = allBuyRuleData.messagePushResponse?.startState
                let pushChannelListIndex = ruleData.findIndex(item => item.name == 'pushChannelList')
                if (allBuyRuleData.messagePushResponse.pushChannelList && allBuyRuleData.messagePushResponse.pushChannelList.length > 0) {
                    let list = []
                    allBuyRuleData.messagePushResponse.pushChannelList.forEach((item) => {
                        list.push(
                            item.pushChannelId
                        )
                    })
                    allBuyRuleData.messagePushResponse.pushChannelList.forEach((item)=>{
                        item.channelId = item.pushChannelId
                        item.channelName = item.pushChannelName
                    })
                    ruleData[pushChannelListIndex].initialValue = list
                }
                let pushMemberChannelIndex = ruleData.findIndex(item => item.name == 'pushMemberChannel')
                ruleData[pushMemberChannelIndex].memberChannelList = allBuyRuleData.messagePushResponse.pushChannelList
                ruleData[pushMemberChannelIndex].initialValue = allBuyRuleData.messagePushResponse?.pushChannelList?.[0]?.channelId
                BuyingPushConfigRequest.channels = JSON.parse(JSON.stringify(allBuyRuleData.messagePushResponse.pushChannelList)) 
                this.setState({
                    BuyingPushConfigRequest
                },()=>{
                    if (allBuyRuleData.messagePushResponse.pushChannelList && allBuyRuleData.messagePushResponse.pushChannelList.length > 0) {
                        ruleData[pushChannelListIndex].initialValue = allBuyRuleData.messagePushResponse.pushChannelList.map((item) => item.channelId);
                        let e ={
                            target:{
                                value:allBuyRuleData.messagePushResponse.pushChannelList[0].channelId
                            },
                            showmodile:true
                        }
                        this.changeMemberChannel(e)
                    }else{
                        let pushMemberIndex = ruleData.findIndex(item => item.name == 'pushMember')
                        ruleData[pushMemberIndex].dataSource = []
                    }
                })
                let pushTypeIndex = ruleData.findIndex(item => item.name == 'pushType')
                ruleData[pushTypeIndex].initialValue = allBuyRuleData.messagePushResponse?.pushType
                let goodsCountIndex = ruleData.findIndex(item => item.name == 'goodsCount')
                ruleData[goodsCountIndex].initialValue = allBuyRuleData.messagePushResponse?.goodsCount
                let sendFrequencyIndex = ruleData.findIndex(item => item.name == 'sendFrequency')
                ruleData[sendFrequencyIndex].initialValue = allBuyRuleData.messagePushResponse?.sendFrequency
                ruleData[sendFrequencyIndex].sendTime = []
                if (allBuyRuleData?.messagePushResponse?.sendFrequency > ruleData[sendFrequencyIndex].sendTime.length) {
                    for (let i = 0; i < allBuyRuleData?.messagePushResponse.sendFrequency; i++) {
                        ruleData[sendFrequencyIndex].sendTime.push({
                            type: 'timepicker',
                            format: 'HH:mm',
                            label: `${sldComLanguage('活动时间')}`,
                            name: 'sendTime',
                            placeholder: `${sldComLanguage('请选择时间')}`
                        })
                    }
                }
                ruleData[sendFrequencyIndex].sendTime.forEach((item, index) => {
                    if (allBuyRuleData?.messagePushResponse.timestampsList && allBuyRuleData.messagePushResponse.timestampsList.length > 0) {
                        allBuyRuleData.messagePushResponse.timestampsList.forEach((items, indexs) => {
                            if (index == indexs) {
                                item.initialValue = moment(items, 'HH:mm')
                            }
                        })
                    }
                })
                let timeQuantumListIndex = ruleData.findIndex(item => item.name == 'timeQuantumList')
                if (allBuyRuleData?.messagePushResponse.timeQuantumList && allBuyRuleData.messagePushResponse.timeQuantumList.length > 0) {
                    ruleData[timeQuantumListIndex].timeQuantumList[0].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[0].startTimestamp, 'HH:mm')
                    ruleData[timeQuantumListIndex].timeQuantumList[1].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[0].endTimestamp, 'HH:mm')
                    if (allBuyRuleData.messagePushResponse.timeQuantumList.length > 1) {
                        ruleData[timeQuantumListIndex].timeQuantumList[2].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[1].startTimestamp, 'HH:mm')
                        ruleData[timeQuantumListIndex].timeQuantumList[3].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[1].endTimestamp, 'HH:mm')
                    }
                    if (allBuyRuleData.messagePushResponse.timeQuantumList.length > 2) {
                        ruleData[timeQuantumListIndex].timeQuantumList[4].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[2].startTimestamp, 'HH:mm')
                        ruleData[timeQuantumListIndex].timeQuantumList[5].initialValue = moment(allBuyRuleData.messagePushResponse.timeQuantumList[2].endTimestamp, 'HH:mm')
                    }
                } else {
                    for (let i = 0; i < 6; i++) {
                        ruleData[timeQuantumListIndex].timeQuantumList[i].initialValue = undefined
                    }
                }
                if (allBuyRuleData.messagePushResponse.pushType == "TIMING") {
                    ruleData[sendFrequencyIndex].show = true
                    ruleData[timeQuantumListIndex].show = false
                    ruleData[goodsCountIndex].show = true
                } else {
                    ruleData[sendFrequencyIndex].show = false
                    ruleData[timeQuantumListIndex].show = true
                    ruleData[goodsCountIndex].show = false
                }
                //红点推送的初始值
                let redStartStateIndex = ruleData.findIndex(item => item.name == 'redStartState')
                ruleData[redStartStateIndex].initialValue = allBuyRuleData.redPointPushResponse?.startState
                let redPushChannelListIndex = ruleData.findIndex(item => item.name == 'redPushChannelList')
                if (allBuyRuleData.redPointPushResponse.pushChannelList && allBuyRuleData.redPointPushResponse.pushChannelList.length > 0) {
                    let list = []
                    if (allBuyRuleData.redPointPushResponse.pushIsAll) {
                        list.push(
                            '-2'
                        )
                    } else {
                        allBuyRuleData.redPointPushResponse.pushChannelList.forEach((item) => {
                            list.push(
                                item.pushChannelId
                            )
                        })
                    }
                    ruleData[redPushChannelListIndex].initialValue = list
                }
                let redPushTypeIndex = ruleData.findIndex(item => item.name == 'redPushType')
                ruleData[redPushTypeIndex].initialValue = allBuyRuleData.redPointPushResponse?.pushType
                let redSendFrequencyIndex = ruleData.findIndex(item => item.name == 'redSendFrequency')
                ruleData[redSendFrequencyIndex].initialValue = allBuyRuleData.redPointPushResponse?.sendFrequency
                ruleData[redSendFrequencyIndex].redSendTime = []
                if (allBuyRuleData?.redPointPushResponse?.sendFrequency >= ruleData[redSendFrequencyIndex].redSendTime.length) {
                    for (let i = 0; i < allBuyRuleData.redPointPushResponse.sendFrequency; i++) {
                        ruleData[redSendFrequencyIndex].redSendTime.push({
                            type: 'timepicker',
                            format: 'HH:mm',
                            label: `${sldComLanguage('活动时间')}`,
                            name: 'redSendTime',
                            placeholder: `${sldComLanguage('请选择时间')}`
                        })
                    }
                }
                ruleData[redSendFrequencyIndex].redSendTime.forEach((item, index) => {
                    if (allBuyRuleData.redPointPushResponse.timestampsList && allBuyRuleData.redPointPushResponse.timestampsList.length > 0) {
                        allBuyRuleData.redPointPushResponse.timestampsList.forEach((items, indexs) => {
                            if (index == indexs) {
                                item.initialValue = moment(items, 'HH:mm')
                            }
                        })
                    }
                })
                let redTimeQuantumListIndex = ruleData.findIndex(item => item.name == 'redTimeQuantumList')
                if (allBuyRuleData?.redPointPushResponse.timeQuantumList && allBuyRuleData.redPointPushResponse.timeQuantumList.length > 0) {
                    ruleData[redTimeQuantumListIndex].redTimeQuantumList[0].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[0].startTimestamp, 'HH:mm')
                    ruleData[redTimeQuantumListIndex].redTimeQuantumList[1].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[0].endTimestamp, 'HH:mm')
                    if (allBuyRuleData.redPointPushResponse.timeQuantumList.length > 1) {
                        ruleData[redTimeQuantumListIndex].redTimeQuantumList[2].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[1].startTimestamp, 'HH:mm')
                        ruleData[redTimeQuantumListIndex].redTimeQuantumList[3].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[1].endTimestamp, 'HH:mm')
                    }
                    if (allBuyRuleData.redPointPushResponse.timeQuantumList.length > 2) {
                        ruleData[redTimeQuantumListIndex].redTimeQuantumList[4].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[2].startTimestamp, 'HH:mm')
                        ruleData[redTimeQuantumListIndex].redTimeQuantumList[5].initialValue = moment(allBuyRuleData.redPointPushResponse.timeQuantumList[2].endTimestamp, 'HH:mm')
                    }
                } else {
                    for (let i = 0; i < 6; i++) {
                        ruleData[redTimeQuantumListIndex].redTimeQuantumList[i].initialValue = undefined
                    }
                }
                if (allBuyRuleData.redPointPushResponse.pushType == "TIMING") {
                    ruleData[redSendFrequencyIndex].show = true
                    ruleData[redTimeQuantumListIndex].show = false
                } else {
                    ruleData[redSendFrequencyIndex].show = false
                    ruleData[redTimeQuantumListIndex].show = true
                }
                operateData = getSldCopyData(ruleData)
            } else if (type == 'buyTogetherRule') {
                if (!!buyTogetherData) {
                    let startStateIndex = buyTogetherRuleData.findIndex(item => item.name == 'startState')
                    buyTogetherRuleData[startStateIndex].initialValue = Boolean(buyTogetherData?.pushFlag);
                    let pushChannelListIndex = buyTogetherRuleData.findIndex(item => item.name == 'pushChannelList');
                    if (buyTogetherData.channels && buyTogetherData.channels.length > 0) {
                        buyTogetherRuleData[pushChannelListIndex].initialValue = buyTogetherData.channels.map((item) => item.channelId);
                    }
                    let pushMemberChannelIndex = buyTogetherRuleData.findIndex(item => item.name == 'pushMemberChannel')
                    buyTogetherRuleData[pushMemberChannelIndex].memberChannelList = buyTogetherData.channels
                    buyTogetherRuleData[pushMemberChannelIndex].initialValue = buyTogetherData?.channels?.[0]?.channelId
                    BuyingPushConfigRequest.channels = JSON.parse(JSON.stringify(buyTogetherData.channels))
                    this.setState({
                        BuyingPushConfigRequest
                    },()=>{
                        if (buyTogetherData.channels && buyTogetherData.channels.length > 0) {
                            buyTogetherRuleData[pushChannelListIndex].initialValue = buyTogetherData.channels.map((item) => item.channelId);
                            let e ={
                                target:{
                                    value:buyTogetherData.channels[0].channelId
                                },
                                showmodile:true
                            }
                            this.changeMemberChannel(e)
                        }else{
                            let pushMemberIndex = buyTogetherRuleData.findIndex(item => item.name == 'pushMember')
                            buyTogetherRuleData[pushMemberIndex].dataSource = []
                        }
                    })
                    let sendFrequencyIndex = buyTogetherRuleData.findIndex(item => item.name == 'sendFrequency')
                    buyTogetherRuleData[sendFrequencyIndex].initialValue = buyTogetherData.pushFrequency
                    buyTogetherRuleData[sendFrequencyIndex].sendTime = []
                    if (buyTogetherData.pushFrequency > buyTogetherRuleData[sendFrequencyIndex].sendTime.length) {
                        for (let i = 0; i < buyTogetherData.pushFrequency; i++) {
                            buyTogetherRuleData[sendFrequencyIndex].sendTime.push({
                                type: 'timepicker',
                                format: 'HH:mm',
                                label: `${sldComLanguage('活动时间')}`,
                                name: 'sendTime',
                                placeholder: `${sldComLanguage('请选择时间')}`
                            })
                        }
                    }
                    buyTogetherRuleData[sendFrequencyIndex].sendTime.forEach((item, index) => {
                        if (buyTogetherData.pushTimeList && buyTogetherData.pushTimeList.length > 0) {
                            buyTogetherData.pushTimeList.forEach((items, indexs) => {
                                if (index == indexs) {
                                    item.initialValue = moment(items, 'HH:mm')
                                }
                            })
                        }
                    })
                }
                operateData = getSldCopyData(buyTogetherRuleData)
            } else if (type == 'buyEverydayRule') {
                if (!!buyEverydayData) {
                    let startStateIndex = buyEverydayRuleData.findIndex(item => item.name == 'startState')
                    buyEverydayRuleData[startStateIndex].initialValue = Boolean(buyEverydayData?.pushFlag);
                    let pushChannelListIndex = buyEverydayRuleData.findIndex(item => item.name == 'pushChannelList');
                    let pushMemberChannelIndex = buyEverydayRuleData.findIndex(item => item.name == 'pushMemberChannel')
                    buyEverydayRuleData[pushMemberChannelIndex].memberChannelList = buyEverydayData.channels
                    buyEverydayRuleData[pushMemberChannelIndex].initialValue = buyEverydayData?.channels?.[0]?.channelId
                    BuyingPushConfigRequest.channels = JSON.parse(JSON.stringify(buyEverydayData.channels)) //深拷贝一份 防止选择会员时更改BuyingPushConfigRequest 改变buyEverydayData
                    this.setState({
                        BuyingPushConfigRequest
                    },()=>{
                        if (buyEverydayData.channels && buyEverydayData.channels.length > 0) {
                            buyEverydayRuleData[pushChannelListIndex].initialValue = buyEverydayData.channels.map((item) => item.channelId);
                            let e ={
                                target:{
                                    value:buyEverydayData.channels[0].channelId
                                },
                                showmodile:true
                            }
                            this.changeMemberChannel(e)
                        }else{
                            let pushMemberIndex = buyEverydayRuleData.findIndex(item => item.name == 'pushMember')
                            buyEverydayRuleData[pushMemberIndex].dataSource = []
                        }
                    })
                    
                }
                operateData = getSldCopyData(buyEverydayRuleData)
            }
            this.cur_edit_id = val.tplCode;//当前操作数据的唯一值
            this.setState({
                title: `${sldComLanguage('编辑消息模板')}`,
                operateData,
                ruleData,
                buyTogetherRuleData,
                buyEverydayRuleData,
                modalVisible: true
            });//编辑消息模板
        })
    };

    //改变推送方式
    changePushType = (val) => {
        let { ruleData, operateData } = this.state
        let timingIndex = ruleData.findIndex(item => item.name == 'sendFrequency')
        let realtimeIndex = ruleData.findIndex(item => item.name == 'timeQuantumList')
        let goodsCountIndex = ruleData.findIndex(item => item.name == 'goodsCount')
        if (val == 'TIMING') {
            ruleData[timingIndex].show = true
            if(ruleData[timingIndex].sendTime==[]){
                ruleData[timingIndex].sendTime=[{
                    type: 'timepicker',
                    format: 'HH:mm',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'sendTime',
                    placeholder: `${sldComLanguage('请选择时间')}`
                }]
            }
            ruleData[realtimeIndex].show = false
            ruleData[goodsCountIndex].show = true
        } else {
            ruleData[timingIndex].show = false
            ruleData[realtimeIndex].show = true
            ruleData[goodsCountIndex].show = false
        }
        operateData = getSldCopyData(ruleData)
        this.setState({
            operateData,
            ruleData: ruleData
        })
    }

    //改变推送渠道的方法
    changePushChannel = (val) =>{
        let {ruleChannelInfos,operateData,BuyingPushConfigRequest,type,buyEverydayRuleData,buyTogetherRuleData,ruleData} = this.state
        let data = this.state[`${type}Data`]
        let pushMemberChannelIndex = data.findIndex(e => e.name == 'pushMemberChannel')
        data[pushMemberChannelIndex].memberChannelList = []
        let channelsList = BuyingPushConfigRequest.channels
        if (val.length > channelsList.length) {
            val.forEach((items) => {
                let index = channelsList.findIndex(item => item.channelId === items)
                if (index === -1) {
                    let channel = ruleChannelInfos.find(item => item.channelId === items)
                    channelsList.push({
                        channelId: channel.channelId,
                        channelName: channel.channelName,
                        userList: []
                    })
                }
            })
        } else {
            let pushMemberIndex = data.findIndex(item => item.name == 'pushMember')
            data[pushMemberIndex].dataSource = []
            channelsList = channelsList.filter(item => val.includes(item.channelId))
        }
        BuyingPushConfigRequest.channels = channelsList
        val.forEach((items) => {
            ruleChannelInfos.forEach((item) => {
                if (item.channelId == items) {
                    data[pushMemberChannelIndex].memberChannelList.push({
                        channelId: item.channelId,
                        channelName: item.channelName
                    })
                }
            })
        })
        operateData = getSldCopyData(data);
        this.setState({
            operateData,
            BuyingPushConfigRequest,
            buyEverydayRuleData,
            buyTogetherRuleData,
            ruleData
        })
    }

    changeMemberChannel = async (e)=>{
        const { dispatch } = this.props;
        let {ruleChannelInfos,BuyingPushConfigRequest,buyEverydayRuleData,operateData,type,buyTogetherRuleData} = this.state
        let data = this.state[`${type}Data`]
        const el = ruleChannelInfos.find((item)=>item.channelId==e.target.value)
        let pushMemberIndex = data.findIndex(item => item.name == 'pushMember')
        data[pushMemberIndex].show = true
        let pageSizes = 1000;
        let couponMemberList = []
        BuyingPushConfigRequest.channels.forEach((item)=>{
            if(item.channelId == e.target.value){
                try {
                    pageSizes = item.userList.length;
                    item.userList.forEach((items)=>{
                        couponMemberList.push({
                            companyId:items.companyId,
                            memberName:items.memberName
                        })
                    })
                } catch (error) {
    
                }
                
            }
        })
        await dispatch({
            type: 'project/get_member_detail_lists',
            payload: { memberInfoList:couponMemberList, pageSizes },
            callback: async (res) => {
                if (res.state == 200) {
                    if (res.data.length > 0) {
                        res.data = res.data.map(item => ({
                            ...item,
                            keyId:`${item.companyId}${item.memberId}`
                        }))
                        data[pushMemberIndex].dataSource = res.data
                        let membersInfoList = []
                        res.data.forEach((items)=>{
                            membersInfoList.push(items.keyId)
                        })
                        this.sele_more_members.info = JSON.parse(JSON.stringify(res.data))
                        this.sele_more_members.ids = membersInfoList;
                    }else{
                        data[pushMemberIndex].dataSource = []
                        this.sele_more_members.ids = [];
                        this.sele_more_members.info = [];
                    }
                    
                }
            }
        });
        operateData = getSldCopyData(data);
        this.setState({
            operateData,
            buyEverydayRuleData,
            BuyingPushConfigRequest,
            buyTogetherRuleData,
            channelProps: el
        },()=>{
            if(!!!e.showmodile){
                this.setState({
                    modalVisibleMember:true
                })
            }
        })
    }
    
    //改变红点推送方式
    changeRedPushType = (val) => {
        let { ruleData, operateData } = this.state
        let redTimingIndex = ruleData.findIndex(item => item.name == 'redSendFrequency')
        let redRealtimeIndex = ruleData.findIndex(item => item.name == 'redTimeQuantumList')
        if (val == 'TIMING') {
            ruleData[redTimingIndex].show = true
            if(ruleData[redTimingIndex].redSendTime==[]){
                ruleData[redTimingIndex].redSendTime = [{
                    type: 'timepicker',
                    format: 'HH:mm',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'redSendTime',
                    placeholder: `${sldComLanguage('请选择时间')}`
                }]
            }
            ruleData[redRealtimeIndex].show = false
        } else {
            ruleData[redTimingIndex].show = false
            ruleData[redRealtimeIndex].show = true
        }
        operateData = getSldCopyData(ruleData);
        this.setState({
            operateData,
            ruleData: ruleData
        })
    }

    //改变都在买红点推送发送频率
    changeRedFrequency = (val) => {
        let { ruleData, operateData } = this.state
        let redIndex = ruleData.findIndex(item => item.name == 'redSendFrequency')
        let redList = ruleData[redIndex].redSendTime
        if (val > redList.length) {
            let addlength = val - redList.length
            for (let i = 0; i < addlength; i++) {
                redList.push({
                    type: 'timepicker',
                    format: 'HH:mm',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'redSendTime',
                    placeholder: `${sldComLanguage('请选择时间')}`
                })
            }
        } else if (redList.length > val) {
            let reducelength = redList.length - val
            redList.splice(val, reducelength)
        }
        operateData = getSldCopyData(ruleData);
        this.setState({
            ruleData,
            operateData
        })
    }

    //改变都在买消息推送发送频率
    changeFrequency = (val) => {
        let { ruleData, operateData } = this.state
        let index = ruleData.findIndex(item => item.name == 'sendFrequency')
        let list = ruleData[index].sendTime
        if (val > list.length) {
            let addlength = val - list.length
            for (let i = 0; i < addlength; i++) {
                list.push({
                    type: 'timepicker',
                    format: 'HH:mm',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'sendTime',
                    placeholder: `${sldComLanguage('请选择时间')}`
                })
            }
        } else if (list.length > val) {
            let reducelength = list.length - val
            list.splice(val, reducelength)
        }
        operateData = getSldCopyData(ruleData);
        this.setState({
            ruleData,
            operateData
        })
    }

    //改变一起买消息推送发送频率
    changeBuyTogetherFrequency = (val) => {
        let { buyTogetherRuleData, operateData } = this.state
        let index = buyTogetherRuleData.findIndex(item => item.name == 'sendFrequency')
        let list = buyTogetherRuleData[index].sendTime
        if (val > list.length) {
            let addlength = val - list.length
            for (let i = 0; i < addlength; i++) {
                list.push({
                    type: 'timepicker',
                    format: 'HH:mm',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'sendTime',
                    placeholder: `${sldComLanguage('请选择时间')}`
                })
            }
        } else if (list.length > val) {
            let reducelength = list.length - val
            list.splice(val, reducelength)
        }
        operateData = getSldCopyData(buyTogetherRuleData);
        this.setState({
            buyTogetherRuleData,
            operateData
        })
    }

    //渠道变更对应模板内容的变更
    changeTextarea = (val, setfun) => {
        let {operateData} = this.state
        let index = this.state.data.list.findIndex(item => item.tplCode == this.cur_edit_id);
        let appNoticeList = this.state.data.list[index]?.appNoticeList;
        let content = '';
        operateData[3].initialValue = appNoticeList?.find(item => item.channelId==val)?.descEncodeSwitch;
        if (appNoticeList && appNoticeList.length > 0) {
            appNoticeList.forEach((item) => {
                if (item.channelId == val) {
                    content = item.appContent
                }
            })
            setfun({
                'appContent': content
            })
        }
        this.setState({
            operateData
        })
    }

    //消息模板操作  edit：编辑 switch：开关切换
    operateMsg = (id, type) => {
        const { params } = this.state;
        const { dispatch } = this.props;
        let dis_type = '';
        let param_data = {};
        if (type == 'switch') {
            dis_type = 'sldsetting/update_member_msg_tpl';
            param_data = id;
        } else if (type == 'edit') {
            dis_type = 'sldsetting/update_member_msg_tpl';
            param_data = id;
        }
        this.setState({ submiting: true });
        dispatch({
            type: dis_type,
            payload: param_data,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.setState({ modalVisible: false });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            }
        });
    };

    //获取都在买规则信息
    get_rule = () => {
        this.setState({ initLoading: true });
        let { allBuyRuleData } = this.state
        const { dispatch } = this.props;
        dispatch({
            type: 'sldsetting/get_rule_msg_tpl',
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    allBuyRuleData = res.data;
                }
                this.setState({ allBuyRuleData });
            }
        });

    }

    //获取一起买规则信息
    get_tplruleDate = (tplCode,key) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'sldsetting/get_msg_rule',
            payload: { tplCode: tplCode },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200 && !!res.data) {
                    this.setState({ [key]:res.data });
                }
            }
        });

    }

    //获取数据列表
    get_list = () => {
        this.setState({ initLoading: true });
        const { dispatch, noticeType } = this.props;
        let { data } = this.state;
        dispatch({
            type: 'sldsetting/get_member_msg_tpl_lists',
            payload: { noticeType: noticeType },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    data.list = res.data.map((item, index) => Object.assign({}, item, { index }));
                    this.setState({ data });
                    console.log(1111,data);
                }
            }
        });
    };

    //获取渠道信息
    get_operation_list = (params) => {
        let { appData, ruleData, ruleChannelInfos, buyTogetherRuleData, buyEverydayRuleData } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'sldsetting/operation_list',
            payload: { ...params },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if (res.data.channelInfos && res.data.channelInfos.length > 0) {
                        let channelInfos = res.data.channelInfos.map((item)=> ({key: item.channelId,name: `${item.channelName}(${item.channelId})`}));
                        ruleChannelInfos = res.data.channelInfos.map((item)=> ({channelId: item.channelId,channelName: item.channelName}));
                        
                        let channelInfosAndAll = ruleChannelInfos.map((item)=> ({key: item.channelId,name: `${item.channelName}(${item.channelId})`}));

                        let appDataIndex = appData.findIndex(item => item.type == 'select')
                        appData[appDataIndex].sel_data = channelInfos;

                        let buyTogetherRuleDataIndex = buyTogetherRuleData.findIndex(item => item.name == 'pushChannelList')
                        buyTogetherRuleData[buyTogetherRuleDataIndex].sel_data = channelInfos;

                        let buyEverydayRuleDataIndex = buyEverydayRuleData.findIndex(item => item.name == 'pushChannelList')
                        buyEverydayRuleData[buyEverydayRuleDataIndex].sel_data = channelInfos;
                        
                        let ruleDataIndex = ruleData.findIndex(item => item.name == 'pushChannelList')
                        ruleData[ruleDataIndex].sel_data = channelInfosAndAll;

                        let ruleDataRedIndex = ruleData.findIndex(item => item.name == 'redPushChannelList')
                        ruleData[ruleDataRedIndex].sel_data = channelInfosAndAll;

                    } else {
                        failTip('未查询到渠道信息，请添加渠道');
                    }
                    this.setState({
                        appData,
                        ruleData,
                        buyTogetherRuleData,
                        buyEverydayRuleData,
                        ruleChannelInfos
                    });
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
        const { formValues } = this.state;
        if (type == 'main') {
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
            pageSize = params.pageSize;
            this.setState({ params });
            this.get_list(params);
        }
    };


    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    sldHandleCancle = () => {
        this.setState({ modalVisible: false,BuyingPushConfigRequest:{} });
    };

    memberPopCancle = () => {
        this.setState({
            modalVisibleMember: false
        });
    };

    //指定会员多选-回调事件
    confirmMemberChoose = (selectedRows, selectedRowKeys) => {
        let {operateData,buyEverydayRuleData,BuyingPushConfigRequest,type,buyTogetherRuleData,ruleData,channelProps} = this.state
        let data = this.state[`${type}Data`]
        console.log(channelProps);
        this.sele_more_members.ids = [...selectedRowKeys];
        this.sele_more_members.info = JSON.parse(JSON.stringify(selectedRows));
        BuyingPushConfigRequest.channels.forEach((item)=>{
            
            if(channelProps.channelId ===item.channelId){
                if(selectedRows.length>0){
                    item.userList = []
                    selectedRows.forEach((items)=>{
                        if(items.channelId === item.channelId){
                            item.userList.push({
                                companyId:items.companyId,
                                userId:items.userId,
                                memberName:items.memberName
                            })
                        }
                    })
                }else{
                    item.userList = []
                }
            }
        })
        let pushMemberIndex = data.findIndex(e => e.name == 'pushMember')
        data[pushMemberIndex].dataSource = selectedRows
        operateData = getSldCopyData(data);
        this.setState({
            operateData,
            buyEverydayRuleData,
            buyTogetherRuleData,
            BuyingPushConfigRequest,
            ruleData
        });
        this.memberPopCancle();
    };

    //重新选择会员
    resetSelMembers = () => {
        this.setState({
            modalVisibleMember: true,
            sle_more_title: `${sldComLanguage('指定会员发放(最少选择1个)')}`
        });
    };

    sldHandleConfirm = (val) => {
        const { type, ruleChannelInfos,BuyingPushConfigRequest,DescEncodeVal } = this.state;
        let tmp_data = {};
        let appNoticeList = [];
        val.tplCode = this.cur_edit_id;
        if (type == 'msg') {
            val.msgSwitch = val.msgSwitch ? 1 : 0;
            this.operateMsg(val, 'edit');
        } else if (type == 'sms') {
            val.smsSwitch = val.smsSwitch ? 1 : 0;
            tmp_data.templateId = val.templateId;
            tmp_data.templateContent = val.templateContent;
            delete val.templateId;
            delete val.templateContent;
            val.smsContent = JSON.stringify(tmp_data);
            this.operateMsg(val, 'edit');
        } else if (type == 'email') {
            val.emailSwitch = val.emailSwitch ? 1 : 0;
            tmp_data.email_subject = val.email_subject;
            tmp_data.email_content = this.email_content;
            delete val.email_subject;
            val.emailContent = JSON.stringify(tmp_data);
            this.operateMsg(val, 'edit');
        } else if (type == 'wx') {
            val.wxSwitch = val.wxSwitch ? 1 : 0;
            tmp_data.templateId = val.templateId;
            tmp_data.templateContent = val.templateContent;
            delete val.templateId;
            delete val.templateContent;
            val.wxContent = JSON.stringify(tmp_data);
            this.operateMsg(val, 'edit');
        } else if (type == 'app') {
            val.appSwitch = val.appSwitch ? 1 : 0;
            tmp_data.appContent = val.appContent;
            appNoticeList.push({
                channelId: val.channelId.toString(),
                appContent: val.appContent,
                descEncodeSwitch:DescEncodeVal
            })
            delete val.channelId;
            delete val.appContent;
            val.appNoticeList = JSON.stringify(appNoticeList);
            this.operateMsg(val, 'edit');
        } else if (type == 'rule') {
            //消息推送params
            let messagePushRequest = {}
            messagePushRequest.goodsCount = Number(val.goodsCount)
            messagePushRequest.pushChannelList = BuyingPushConfigRequest.channels
            messagePushRequest.pushChannelList.forEach((item)=>{
                item.pushChannelId = !!item.pushChannelId?item.pushChannelId:item.channelId
                item.pushChannelName = !!item.pushChannelName?item.pushChannelName:item.channelName
                delete item.channelId
                delete item.channelName
            })
            messagePushRequest.pushType = val.pushType
            messagePushRequest.startState = val.startState
            messagePushRequest.sendFrequency = Number(val.sendFrequency)
            
            if (messagePushRequest.pushType == 'TIMING') {
                messagePushRequest.timeQuantumList = []
                messagePushRequest.timestampsList = []
                for (let i = 0; i < messagePushRequest.sendFrequency; i++) {
                    if (val[`sendTime_${i + 1}`] != undefined) {
                        messagePushRequest.timestampsList.push(
                            val[`sendTime_${i + 1}`].format('HH:mm')
                        )
                    } else {
                        failTip('请输入消息推送时间');
                        return
                    }
                }
            } else {
                messagePushRequest.timestampsList = []
                messagePushRequest.timeQuantumList = []
                messagePushRequest.timeQuantumList.push(
                    {
                        startTimestamp: !!val[`TimeQuantum_1`] ? val[`TimeQuantum_1`].format('HH:mm') : '',
                        endTimestamp: !!val[`TimeQuantum_2`] ? val[`TimeQuantum_2`].format('HH:mm') : ''
                    },
                    {
                        startTimestamp: !!val[`TimeQuantum_3`] ? val[`TimeQuantum_3`].format('HH:mm') : '',
                        endTimestamp: !!val[`TimeQuantum_4`] ? val[`TimeQuantum_4`].format('HH:mm') : ''
                    },
                    {
                        startTimestamp: !!val[`TimeQuantum_5`] ? val[`TimeQuantum_5`].format('HH:mm') : '',
                        endTimestamp: !!val[`TimeQuantum_6`] ? val[`TimeQuantum_6`].format('HH:mm') : ''
                    },
                )
                messagePushRequest.goodsCount = 1
            }
            BuyingPushConfigRequest.messagePushRequest = messagePushRequest
            //红点推送params
            let redPointPushRequest = {}
            redPointPushRequest.pushChannelList = []
            if (typeof (val.redPushChannelList) == 'string') {
                val.redPushChannelList = [val.redPushChannelList]
            }
            if (val.redPushChannelList.length > 0) {
                if (val.redPushChannelList.some(item => item == '-2')) {
                    if (ruleChannelInfos.some(item => item.channelId == '-2')) { ruleChannelInfos.shift() }
                    ruleChannelInfos.forEach((item) => {
                        redPointPushRequest.pushChannelList.push({
                            pushChannelId: item.channelId,
                            pushChannelName: item.channelName
                        })
                    })
                } else {
                    val.redPushChannelList.forEach((items) => {
                        ruleChannelInfos.forEach((item) => {
                            if (item.channelId == items) {
                                redPointPushRequest.pushChannelList.push({
                                    pushChannelId: item.channelId,
                                    pushChannelName: item.channelName
                                })
                            }
                        })
                    })
                }
            } else {
                failTip('请选择红点推送渠道');
                return
            }
            redPointPushRequest.pushType = val.redPushType
            redPointPushRequest.startState = val.redStartState
            redPointPushRequest.sendFrequency = Number(val.redSendFrequency)
            redPointPushRequest.timeQuantumList = []
            //state中免打扰时间为6个
            redPointPushRequest.timeQuantumList.push(
                {
                    startTimestamp: !!val[`redTimeQuantum_1`] ? val[`redTimeQuantum_1`].format('HH:mm') : '',
                    endTimestamp: !!val[`redTimeQuantum_2`] ? val[`redTimeQuantum_2`].format('HH:mm') : ''
                },
                {
                    startTimestamp: !!val[`redTimeQuantum_3`] ? val[`redTimeQuantum_3`].format('HH:mm') : '',
                    endTimestamp: !!val[`redTimeQuantum_4`] ? val[`redTimeQuantum_4`].format('HH:mm') : ''
                },
                {
                    startTimestamp: !!val[`redTimeQuantum_5`] ? val[`redTimeQuantum_5`].format('HH:mm') : '',
                    endTimestamp: !!val[`redTimeQuantum_6`] ? val[`redTimeQuantum_6`].format('HH:mm') : ''
                },
            )
            redPointPushRequest.timestampsList = []
            for (let i = 0; i < redPointPushRequest.sendFrequency; i++) {
                if (val[`redSendTime_${i + 1}`] != undefined) {
                    redPointPushRequest.timestampsList.push(
                        val[`redSendTime_${i + 1}`].format('HH:mm')
                    )
                } else {
                    failTip('请输入红点推送时间');
                    return
                }
            }
            if (redPointPushRequest.pushType == 'TIMING') {
                redPointPushRequest.timeQuantumList = []
            } else {
                redPointPushRequest.timestampsList = []
            }
            BuyingPushConfigRequest.redPointPushRequest = redPointPushRequest
            // delete BuyingPushConfigRequest.channels
            this.changeRule(BuyingPushConfigRequest)
        } else if (type == 'buyTogetherRule') {
            BuyingPushConfigRequest.promotionType = 106
            BuyingPushConfigRequest.tplCode = 'summary_buytogether_reminder'
            
            BuyingPushConfigRequest.pushFlag = Number(val.startState)
            
            BuyingPushConfigRequest.pushFrequency = Number(val.sendFrequency)
            // BuyingPushConfigRequest.pushType = 0
            BuyingPushConfigRequest.pushTimeList = []
            for (let i = 0; i < BuyingPushConfigRequest.pushFrequency; i++) {
                if (val[`sendTime_${i + 1}`] != undefined) {
                    BuyingPushConfigRequest.pushTimeList.push(
                        val[`sendTime_${i + 1}`].format('HH:mm')
                    )
                } else {
                    failTip('请输入消息推送时间');
                    return
                }
            }
            this.changeBuytogetherRule(BuyingPushConfigRequest)
        } else if (type == 'buyEverydayRule') {
            BuyingPushConfigRequest.promotionType = 107
            BuyingPushConfigRequest.tplCode = 'preview_buyeveryday_reminder'
            BuyingPushConfigRequest.pushFlag = Number(val.startState)
            console.log(BuyingPushConfigRequest);
            this.changeBuyEverydayRule(BuyingPushConfigRequest)
        }
    };

    //新增或者修改都在买规则
    changeRule = (val) => {
        const { params } = this.state;
        const { dispatch } = this.props;
        this.setState({ submiting: true });
        dispatch({
            type: 'sldsetting/update_rule_msg_tpl',
            payload: val,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.get_rule()
                    this.setState({ modalVisible: false });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            }
        });
    }

    //新增或者修改一起买规则
    changeBuytogetherRule = (val) => {
        const { params } = this.state;
        const { dispatch } = this.props;
        this.setState({ submiting: true });
        dispatch({
            type: 'sldsetting/update_msg_rule',
            payload: val,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.get_tplruleDate('summary_buytogether_reminder','buyTogetherData')
                    this.setState({ modalVisible: false });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            }
        });
    }

    //新增或者修改天天专场规则
    changeBuyEverydayRule = (val) => {
        const { params } = this.state;
        const { dispatch } = this.props;
        this.setState({ submiting: true });
        dispatch({
            type: 'sldsetting/update_msg_rule',
            payload: val,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.get_tplruleDate('preview_buyeveryday_reminder','buyEverydayData')
                    this.setState({ modalVisible: false });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            }
        });
    }

    //slodon_获取富文本返回的内容
    handleGetContent = (value) => {
        let { operateData } = this.state;
        let tmp_data = operateData.filter(item => item.name == 'email_content')[0];
        tmp_data.initialValue = value;
        this.email_content = value;
        this.setState({ operateData });
    };

    getBtnAuthSwitch = () => {
        if(hasAuth('view_member_tpl')){
            return !hasAuth(this.editTplAuth1)
        }
        
        if(hasAuth('view_push_all')){
            return !hasAuth(this.editTplAuth2 )
        }

        return false        
    }

    getBtnAuthEdit = () => {
        if(hasAuth('view_member_tpl')){
            return [this.editTplAuth1]
        }
        
        if(hasAuth('view_push_all')){
            return [this.editTplAuth2]
        }

        return []  
    }

    render() {
        const { selectedRows, columns, initLoading, data, submiting, operateData, modalVisible, title,modalVisibleMember,channelProps } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="tplCode"
                        isCheck={false}
                        sldpagination={false}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        onSldHandleSeleRow={this.onSldHandleSeleRow}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize
                    />
                    {/*标准表格-end*/}

                </Spin>
                {/*新增/编辑对话框-start*/}
                <SldModal
                    title={title}
                    submiting={submiting}
                    width={900}
                    autoHeightMin={300}
                    modalVisible={modalVisible}
                    sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                    sldHandleCancle={this.sldHandleCancle}
                    formItemLayoutModal={formItemLayoutModal}
                    content={operateData}
                />
                {/*新增/编辑对话框-end*/}
                {/*选择指定会员modal框-start*/}
                <SelectMemberPop 
                    selectedRows={this.sele_more_members.info}
                    selectedRowKeys={this.sele_more_members.ids}
                    modalVisible={modalVisibleMember}
                    emptyfalg
                    channelProps={channelProps} 
                    width={1100}
                    height={document.body.clientHeight - 400}
                    modalCancle={this.memberPopCancle} 
                    confirmMember={this.confirmMemberChoose}
                    title="选择要推送的会员(最少 1 个)"
                />
                {/*选择指定会员modal框-end*/}
            </div>

        );
    }
}
