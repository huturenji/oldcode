import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin } from 'antd';
import {
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    failTip,
    isNotEmpty,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    getAuthBtn
} from '@/utils/utils';
import AuthBtn from '@/components/AuthBtn';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';

let btnAuth = getAuthBtn();
// eslint-disable-next-line no-shadow
@connect(({ offline_shop,global }) => ({
    offline_shop,global
}))
@Form.create()
export default class View extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            query: props.location.query,
            detail: {},
            loading:false
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (isNotEmpty(query.id)) {
            this.get_detail(query.id);
        }
    }

    componentWillUnmount() {
    }

  //获取详情
  get_detail = (id) => {
      const { dispatch } = this.props;
      this.setState({ loading: true });
      dispatch({
          type: 'offline_shop/get_offlineShop_detail',
          payload: { id },
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({
                      detail:res.data,
                      loading:false
                  });
              }else{
                  failTip(res.msg);
              }
          }
      });
  };


  render() {
      const {
          loading,detail
      } = this.state;
    
      return (
          <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_view"]} showPage>
              <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                              <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                                  {sldLlineRtextAddMargin('#FA6F1E', '门店详情', 0, 0, 0)}
                                  {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `返回上级页面`, '#fff', 7, 0, 15, 15, 5)}
                              </div>
                              {getSldHorLine(1)}
                              <Scrollbars
                                  autoHeight
                                  autoHeightMin={100}
                                  autoHeightMax={document.body.clientHeight - 100}
                              >
                                  {/* 基本信息-start */}
                                  {getSldEmptyH(10)}
                                  {sldCommonTitleByBg(`基本信息`)}
                                  {getSldEmptyH(10)}
                                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                          门店ID
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.id}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                          门店名称
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.shopName}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                          门店logo
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <img src={`${isNotEmpty(detail.logo)?detail.logo:require('@/assets/icon_login_LOGO.svg')}`} alt="" style={{width:140,height:140}} />
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                           门店地址
                                          </div>
                                          <div className={`${promotion.right}`} style={{whiteSpace:'pre-line'}}>
                                              {detail.address}
                                          </div>
                                      </div>

                                      {
                                          detail.servicePhones && detail.servicePhones.map((item,index)=>(
                                              <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                                  <div className={`${promotion.left}`}>
                                                      {`门店电话${index+1}`}
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      {item}
                                                  </div>
                                              </div>
                                          )
                                          )
                                      }
                                  

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                          创建时间
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.createTime}
                                          </div>
                                      </div>

                                      <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                          <div className={`${promotion.left}`}>
                                          门店状态
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              {detail.state==1?'已启用':'已停用'}
                                          </div>
                                      </div>
                                  </div>
                                  {/* 基本信息-end */}
                                  {getSldEmptyH(30)}
                            
                              </Scrollbars>
                          </div>
                      </Form>
                  </Spin>
              </div>
          </AuthBtn>
         
      );
  }
}

