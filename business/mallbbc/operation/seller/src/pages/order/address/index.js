import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
    sldComLanguage,
    sldLlineRtextAddGoodsAddMargin,getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import ReturnAddress from './return_address';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
@connect(({ order }) => ({
    order
}))

@Form.create()
export default class AddressList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className={global.common_page}>
                <AuthBtn btnAuth={btnAuth} eventKey={["address_list_view"]} showPage>
                    {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('地址管理')}`, 0, 0, 10)}
                    <ReturnAddress type={2} />
                </AuthBtn>
            </div>
        );
    }
}
