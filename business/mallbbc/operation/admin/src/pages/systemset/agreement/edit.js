import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import router from 'umi/router';
import {
    sldLlineRtextAddGoods,
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import SldReactQuill from '@/components/SldReactQuill';
import SldEditFormCom from '@/components/SldEditFormCom/SldEditFormCom';

// eslint-disable-next-line no-shadow
@connect(({ agreement,global }) => ({
    agreement,global
}))
@Form.create()
export default class Edit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            agreement_con: '',//协议内容
            query: props.location.query,
            operate_data: [ {
                type: 'input',
                label: `${sldComLanguage('协议标题')}`,//协议标题
                name: 'title',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('协议标题')}`,//请输入协议标题
                initialValue: '',
                maxLength:20,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('协议标题')}`//请输入协议标题
                }]
            } ]
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
        this.get_detail();
    }

    componentWillUnmount() {

    }

	//获取协议详情
	get_detail = () => {
	    const { dispatch } = this.props;
	    let { operate_data, query } = this.state;
	    dispatch({
	        type: 'agreement/get_agreement_detail',
	        payload: { agreementCode: query.agreementCode },
	        callback: (res) => {
	            for (let i = 0; i < operate_data.length; i++) {
	                if (operate_data[i].name == 'title') {
	                    operate_data[i].initialValue = res.data.title;
	                }
	            }
	            this.setState({ operate_data,agreement_con:res.data.content });
	        }
	    });
	};

	//保存并新增事件
	handleSaveAllData = () => {
	    const { agreement_con} = this.state;
	    this.props.form.validateFieldsAndScroll((err, values) => {
	        if (!err) {
	            const { dispatch } = this.props;
	            values.content = agreement_con;
	            const { query } = this.state;
	            values.agreementCode = query.agreementCode;
	            let dis_type = 'agreement/update_agreement';
	            dispatch({
	                type: dis_type,
	                payload: values,
	                callback: (res) => {
	                    if (res.state == 200) {
	                        sucTip(res.msg);
	                        router.replace(query.source);
	                    } else {
	                        failTip(res.msg);
	                    }
	                }
	            });
	        }
	    });
	};


	//slodon_获取富文本返回的内容
	handleGetContent = (value) => {
	    this.setState({
	        agreement_con: value
	    });
	};

	render() {
	    const { operate_data, agreement_con } = this.state;

	    return (
	        <div
	            className={global.common_page_20}
				 style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
	        >
	            {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('基本信息')}`)}{/*基本信息*/}
	            <div style={{ marginTop: 20 }} className={global.tableListFormAdd}>
	                <div style={{ display: 'flex', flexDirection: 'column' }}>
	                    <Form onSubmit={() => this.handleSaveAllData()} layout="inline">
	                        <SldEditFormCom form={this.props.form} search_data={operate_data} />
	                        {getSldEmptyH(15)}
	                        {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('内容编辑')}`)}{/*内容编辑*/}
	                        <div
	                            className={global.goods_sku_tab}
								 style={{ display: 'flex', flex: 1, marginTop: 20, position: 'relative' }}
	                        >
	                            <SldReactQuill
	                                height={document.body.clientHeight - 300}
	                                value={agreement_con}
	                                getRQContent={this.handleGetContent}
	                            />
	                        </div>

	                        <div className={global.m_diy_bottom_wrap} style={{ position: 'fixed',left:this.props.global.collapsed?90:160 }}>
	                            <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
	                                {sldComLanguage('返回')}
	                            </div>

	                            <div onClick={() => this.handleSaveAllData()} className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
	                                {sldComLanguage('保存并返回')}
	                            </div>
	                        </div>
	                    </Form>
	                </div>
	            </div>
	        </div>
	    );
	}
}
