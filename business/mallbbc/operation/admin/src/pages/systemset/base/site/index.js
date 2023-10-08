import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
    failTip,
    sucTip,
    getAuthBtn,
    sldComLanguage,
    hasAuth
} from '@/utils/utils';
import { sld_need_update_setting, sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class SiteInfo extends Component {
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
        this.get_siet_base_info();
    }

    componentWillUnmount() {

    }

    //获取站点的基本信息
    get_siet_base_info = () => {
        const { dispatch } = this.props;
        let { info_data } = this.state;
        dispatch({
            type: 'sldsetting/get_site_base_info',
            callback: (res) => {
                if (res.state == 200) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].type == 1) {
                            if (res.data[i].name == 'basic_site_tongji') {
                                info_data.push({
                                    type: 'textarea',
                                    label: res.data[i].title,
                                    extra: res.data[i].description,
                                    name: res.data[i].name,
                                    placeholder: '',
                                    initialValue: res.data[i].value
                                });
                            } else {
                                info_data.push({
                                    type: 'input',
                                    label: res.data[i].title,
                                    extra: res.data[i].description,
                                    name: res.data[i].name,
                                    placeholder: '',
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
                                initialValue: res.data[i].value
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
        values.seller_center_entrance_is_enable = values.seller_center_entrance_is_enable ? 1 : 0;
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

    render() {
        const { info_data, submitting, initLoading, flag } = this.state;
        return (
            <Spin spinning={initLoading}>
                <div className={global.common_page}>
                    <SldComHeader
                        type={2}
                        title={sldComLanguage('站点基本配置')}
                        tip_title=""
                        tip_data={sld_need_update_setting()}
                    />
                    <AuthBtn eventKey={[`view_site_info`]} btnAuth={btnAuth} showPage>
                        {flag == 1 &&
                            <SldTableEdit
                                submiting={submitting}
                                width={1000}
                                data={info_data}
                                noSaveBtnAuth={!hasAuth('edit_site_info')}
                                handleSubmit={this.handleSubmit}
                            />
                        }
                    </AuthBtn>
                </div>
            </Spin>
        );
    }
}
