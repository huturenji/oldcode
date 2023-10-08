/*
* 模板列表页面
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
    getSldEmptyH,
    list_com_page_more,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import diy_page from './diy_page.less';
import styles from './pcdecorate.less';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_more;
// eslint-disable-next-line no-unused-vars
let getFieldDecorator_new = '';
@connect(({ pc_home }) => ({
    pc_home
}))
@Form.create()
export default class Tpl_lists extends Component {
    constructor(props) {
        super(props);
        const {
            form: { getFieldDecorator }
        } = props;
        getFieldDecorator_new = getFieldDecorator;
        this.state = {
            data: { list: [], pagination: {} }
        };
    }

    componentDidMount() {
        this.get_list();
    }

    componentWillUnmount() {

    }

	//获取模板列表
	get_list = () => {
	    let { data } = this.state;
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'pc_home/get_tpl_list',
	        payload: { pageSize: pageSize },
	        callback: (res) => {
	            if (res.state == 200) {
	                data = res.data;
	            }
	            this.setState({ data });
	        }
	    });
	};

	render() {
	    const { data } = this.state;
	    return (
         	<AuthBtn btnAuth={btnAuth} eventKey={["template_view"]} showPage>
	          <div className={`${global.common_page} ${styles.allow_show_edit}`} style={{padding:0}}>
	              {getSldEmptyH(10)}
	            <Scrollbars
	                autoHeight
	                autoHeightMin={50}
	                autoHeightMax={document.body.clientHeight - 150}
	            >
	                <div className={global.flex_com_row_wrap}>
	                    {data.list!=null&&data.list.length > 0 &&
						data.list.map(val => (
						    <div key={val.id} className={`${global.flex_com_column} ${diy_page.tpl_list_item}`}>
						        <span className={`${diy_page.img_wrap}`}>
						            {/* eslint-disable-next-line import/no-dynamic-require */}
						            <img src={require(`@/assets/tpl/tplPcId_${ val.tplPcId }.png`)} />
						        </span>
						        <span className={diy_page.title}>{val.name}</span>
						        <span className={diy_page.desc}>{val.desc}</span>
						    </div>
						))
	                    }
	                </div>
          			{getSldEmptyH(40)}
	            </Scrollbars>
	        </div>
         	</AuthBtn>
	    );
	}
}
