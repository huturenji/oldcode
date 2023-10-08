import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import router from 'umi/router';
import { sldComLanguage, sldLlineRtextAddGoodsAddMargin, getSession, removeSession, getAuthBtn, hasAuth, sldIconBtnBg, setSession } from '@/utils/utils';
import global from '@/global.less';
import FreightCouponDetail from './components/feight_coupon_detail';
import GetRecordList from './components/get_record_list';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class ViewFreightCouponHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth: "view_freight_coupon_info",
            tab2Auth: "view_get_record_list",
            tabActiveKey: "1"//动态设置Tab选中值
        };
    }

    componentDidMount() {
        const { tab1Auth } = this.state;
        if (hasAuth(tab1Auth)) {
            this.setState({ tabActiveKey: '1' });
        } else {
            this.setState({ tabActiveKey: '2' });
        }

        //从优惠券详情返回来的，默认选中Tab2
        if (getSession('freight_coupon_detail_back')) {
            removeSession('freight_coupon_detail_back')
            this.setState({ tabActiveKey: '1' });
        }

        if (this.props.location.query.type === 'view_record'){
            this.setState({ tabActiveKey: '2' });
        }
    }
    
    // tab栏切换
    onchagetab = (key) => {
        this.setState({ tabActiveKey: key });
    }

    render() {
        const { tabActiveKey, tab1Auth, tab2Auth } = this.state;
        const { id, type } = this.props.location.query;
        return (
            <div className={global.common_page}>
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('运费券详情')}`, 0, 0, 10)}
                    {sldIconBtnBg(() => { setSession('freight_coupon_detail_back', 1); router.go(-1) }, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                </div>

                <AuthBtn eventKey={[tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>

                    <Tabs type="card" activeKey={tabActiveKey} animated={false} onChange={this.onchagetab} onTabClick={this.onHandleTabClick}>
                        {hasAuth(tab1Auth) &&
                            <TabPane tab={`${sldComLanguage('运费券详情')}`} key="1">
                                <FreightCouponDetail type={type} couponId={id} />
                            </TabPane>
                        }
                        {hasAuth(tab2Auth) &&
                            <TabPane tab={`${sldComLanguage('领用记录')}`} key="2">
                                <GetRecordList couponId={id} />
                            </TabPane>
                        }
                    </Tabs>

                </AuthBtn>

            </div>

        );
    }
}
