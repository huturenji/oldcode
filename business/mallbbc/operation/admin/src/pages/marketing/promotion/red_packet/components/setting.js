import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Modal } from 'antd';
import settingStyle from './index.less';
import {
    failTip,
    hasAuth,
    sucTip
} from '@/utils/utils';
import { sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';

const { confirm } = Modal

@connect(({ common }) => ({
    common
}))
@Form.create()
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: 0,
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            info_data: []
        };
    }

    componentDidMount() {
        this.get_setting();
    }

    //获取设置信息
    get_setting = () => {
        const { dispatch } = this.props;
        let { info_data } = this.state;
        const settingAuthArr = ['redpacket_is_enable','redpacket_user_help'];
        let str_info = settingAuthArr.filter(item=>{
            console.log('item',hasAuth(item));
            return hasAuth(item)
            
        }).join(','); // redpacket_expired_reminder
        
        dispatch({
            type: 'project/getSetting',
            payload: { str: str_info },
            callback: (res) => {
                if (res.state == 200 && res.data) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].type == 1) {
                            if (res.data[i].name == 'redpacket_expired_reminder') {
                                info_data.push({
                                    type: 'inputnum',
                                    label: res.data[i].title,
                                    extra: res.data[i].description,
                                    name: res.data[i].name,
                                    placeholder: '',
                                    min: 0,
                                    max: 1439,//1440为1天，小于1天
                                    initialValue: res.data[i].value
                                });
                            }
                            if (res.data[i].name == 'redpacket_user_help') {
                                info_data.push({
                                    type: 'textarea',
                                    label: res.data[i].title,
                                    row: 6,
                                    placeholder: res.data[i].description,
                                    maxLength: 5000,
                                    name: res.data[i].name,
                                    num: res.data[i].value?.length || 0,
                                    initialValue: res.data[i].value
                                });
                            }
                        } else if (res.data[i].type == 4) {
                            info_data.push({
                                type: 'switch',
                                label: res.data[i].title,
                                extra: res.data[i].description,
                                name: res.data[i].name,
                                placeholder: '',
                                initialValue: res.data[i].value,
                                onClick: this.onClickRedpacketSwitch
                            });
                        }
                    }
                    if (info_data.length > 0) {
                        info_data.push(sld_config_save_btn);
                    }
                }
                this.setState({ info_data, flag: 1 });
            }
        });
    };

    //保存事件
    handleSubmit = (values) => {
        this.setState({ submitting: true });
        const { dispatch } = this.props;
        values.redpacket_is_enable = values.redpacket_is_enable ? 1 : 0;
        dispatch({
            type: 'project/saveSetting',
            payload: values,
            callback: (res) => {
                this.setState({ submitting: false });
                if (res.state == 200) {
                    sucTip(res.msg);
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    onClickRedpacketSwitch = (e, formObj) => {
        confirm({
            centered: true,
            title: `确定${e ? '开启' : '关闭'}红包活动？`,
            cancelText: '取消',
            okText: '确定',
            className:`${ settingStyle.p20 }`,
            onCancel: () => {
                formObj.setFieldsValue({ 'redpacket_is_enable': !e })
            }
        });
    }

    render() {
        const { info_data, submitting, initLoading, flag } = this.state;
        return (
            <Spin spinning={initLoading}>
                <div className={global.common_page}>
                    {flag == 1 &&
                        <SldTableEdit
                            submiting={submitting}
                            width={1000}
                            data={info_data}
                            handleSubmit={this.handleSubmit}
                            noSaveBtnAuth={!hasAuth('edit_redpacket_set')}
                        />
                    }
                </div>
            </Spin>
        );
    }
}
