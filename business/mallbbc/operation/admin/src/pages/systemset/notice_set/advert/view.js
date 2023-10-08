import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Icon } from 'antd';
import router from 'umi/router';
import {
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldCommonTitleByBg,
    getSldHorLine,
    getSldEmptyH,
    sldIconBtnBg,
    failTip,
    downlad
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import _style from './css/advert.less';

// eslint-disable-next-line no-shadow
@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class ViewAdvert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            detail: {}, //查看详情
            query: props.location.query
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined) {
            this.getDetail(query.id);
        }
    }

    componentWillUnmount() {
    }

  //获取详情
  getDetail = (id) => {
      const { dispatch } = this.props;
      this.setState({
          loading:true
      })
      dispatch({
          type: 'advert/get_detail',
          payload: { id },
          callback: (res) => {
              if (res.state == 200) {
                  //初始化数据
                  let detail = {
                      pushTimeData:res.data.pushTime,//推送时间
                      channelId: res.data.pushChannel.pushChannelId,
                      channelName: res.data.pushChannel.pushChannelName,
                      pushObjectEnum:res.data.pushObjectEnum, //推送方式
                      pushCompanyList:res.data.pushCompanyList||[], // 推送企业
                      pushUserEnum:res.data.pushUserEnum, // 所有用户  指定用户
                      pushUserCompanyEnum:res.data.pushUserCompanyEnum, // 所有用户下的推送企业
                      upInfo: res.data.upInfo, // 指定用户
                      title: res.data.title,//标题
                      imageUrl:res.data.imageUrl, // 封面图
                      linkUrl:res.data.linkUrl, // 地址链接
                      attachmentName:res.data.attachmentName,
                      attachmentUrl:res.data.attachmentUrl
                      
                  }
                  this.setState({
                      detail:detail,
                      loading:false
                  })
              } else {
                  failTip(res.msg);
                  this.setState({
                      loading:false
                  })
              }
          }
      });
  };

  render() {
      const {
          loading,detail
      } = this.state;
      return (
          <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
              <Spin spinning={loading}>
                  <Form layout="inline">
                      <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                          <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('推送详情')}`, 0, 0, 0)}
                              {sldIconBtnBg(() => {router.go(-1)}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                          </div>
                          {getSldHorLine(1)}
                          <Scrollbars
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight - 120}
                          >
                              {/* 基本信息-start */}
                              {getSldEmptyH(10)}
                             
                              {getSldEmptyH(10)}
                              <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`} style={{paddingBottom:'30px'}}>
                                  
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('推送时间')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {detail.pushTimeData}
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('推送渠道')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {detail.channelName}({detail.channelId})
                                      </div>
                                  </div>
                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('推送方式')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {detail.pushObjectEnum=='COMPANY'?'按企业推送':'按用户推送'}
                                      </div>
                                  </div>
                                  {
                                      detail.pushObjectEnum=='COMPANY' && 
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('推送企业')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {
                                                detail.pushCompanyList && detail.pushCompanyList.map((item)=><div>{`${item.pushCompanyName}(${item.pushCompanyId})`}</div>)
                                            }
                                        </div>
                                    </div>
                                  }

                                  {
                                      detail.pushObjectEnum=='USER' && 
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('推送用户')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {detail.pushUserEnum=='USER_ALL'?'所有用户':'指定用户'}
                                        </div>
                                    </div>
                                  }

                                  {
                                      detail.pushObjectEnum=='USER' && detail.pushUserEnum=='USER_ALL' &&
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('用户下推送企业')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            {detail.pushUserCompanyEnum =='NOW_COMPANY'?'当前企业':'所有企业'}
                                        </div>
                                    </div>
                                  }

                                  {
                                      detail.pushObjectEnum=='USER' && detail.pushUserEnum=='USER_LIST' &&
                                    <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                        <div className={`${promotion.left}`}>
                                            {sldComLanguage('上传用户推送数据')}
                                        </div>
                                        <div className={`${promotion.right}`}>
                                            <span onClick={()=>{downlad(detail.attachmentUrl,detail.attachmentName)}} className={_style.down_url}><Icon type="link" style={{marginRight:'4px'}} />{detail.attachmentName}</span>
                                        </div>
                                    </div>
                                  }

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('推送标题')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {detail.title}
                                      </div>
                                  </div>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('封面图')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <img src={detail.imageUrl} alt="" style={{width:140,height:140}} />
                                      </div>
                                  </div>

                                  <div className={`${promotion.item} ${global.flex_row_start_center}`}>
                                      <div className={`${promotion.left}`}>
                                          {sldComLanguage('地址链接')}
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          {detail.linkUrl}
                                      </div>
                                  </div>
                              </div>
                          </Scrollbars>
                      </div>
                  </Form>
              </Spin>
          </div>
      );
  }
}

