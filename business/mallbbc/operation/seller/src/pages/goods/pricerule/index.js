/*
* 商品管理——定价管理
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Button, Popover } from 'antd';
import router from 'umi/router';
import {
    failTip,
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoodsAddMargin,
    getAuthBtn,
    sldSvgIcon,
    accMul,
    isNotEmpty
} from '@/utils/utils';
import global from '@/global.less';
import priceRuleStyles from './css/price_rule.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ pricerule }) => ({
    pricerule
}))
@Form.create()
export default class PriceRuleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            initLoading: false,
            tableData: {},//列表数据
            prlParams: { pageSize: pageSize },//规则列表入参
            formValues: {},//搜索条件
            selectedRows: [],//选中的数据
            selectedRowKeys: [],//selectedRows的key
            search_data: [//搜索组件数据
                {
                    type: 'input',
                    label: `${sldComLanguage('关键字')}`,
                    name: 'keyword',
                    placeholder: `${sldComLanguage('商品分类/SKU编号/规则名称')}`,
                    widthMode: 'fat'//widthMode组件宽度模式，不输入就是普通的，fat模式就是加宽的
                }
            ],
            columns: [
                {
                    title: `${sldComLanguage('规则名称')}`,
                    dataIndex: 'pricingRuleName',
                    key: "pricingRuleName",
                    align: 'center',
                    width: 200,
                    render: (text) => <div>
                        <Popover
                            placement="bottom"
                            content={<div className={`${global.flex_com_row_center}`}>
                                {text}
                            </div>}
                        >
                            <div className={`${priceRuleStyles.text_no_wrap}`} style={{ width: '200px' }}>
                                {text}
                            </div>
                        </Popover>
                    </div>
                },
                {
                    title: `${sldComLanguage('产品范围')}`,
                    dataIndex: 'goodsRange',
                    key: "goodsRange",
                    align: 'center',
                    width: 300,
                    render: (text) => <div>
                        <Popover
                            placement="bottom"
                            content={<div className={`${priceRuleStyles.Popover}`}>
                                {text}
                            </div>}
                        >
                            <div className={`${priceRuleStyles.text_no_wrap}`} style={{ width: '300px' }}>
                                {text}
                            </div>
                        </Popover>
                    </div>
                },
                {
                    title: `${sldComLanguage('定价规则')}`,
                    dataIndex: 'pricingStrategy',
                    key: "pricingStrategy",
                    align: 'center',
                    render: (text, record) => <div>
                        {this.getRuleInfo(record)}
                    </div>
                    
                },
                {
                    title: `${sldComLanguage('状态')}`,
                    dataIndex: 'state',
                    key: "state",
                    align: 'center',
                    width: 100,
                    filters: [//状态筛选条件
                        { text: `${sldComLanguage('已启用')}`, value: 'STARTED' },
                        { text: `${sldComLanguage('已停用')}`, value: 'STOPPED' }
                    ],
                    filterMultiple: false,
                    render: (text) => text == 'STARTED' ? <span style={{ color: 'green' }}>{sldComLanguage('已启用')}</span>
                        : <span style={{ color: 'red' }}>{sldComLanguage('已停用')}</span>
                },
                {
                    title: `${sldComLanguage('启用/停用时间')}`,
                    dataIndex: 'lastOperationTime',
                    key: "lastOperationTime",
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    key: "spLogo",
                    // width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn btnAuth={btnAuth} eventKey={["price_rule_list_view"]}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('详情')}`, () => {
                                    router.push({
                                        pathname: '/goods/price_rule_list_detail',
                                        query: {
                                            pricingRuleId: record.pricingRuleId
                                        }
                                    });
                                })}
                            </AuthBtn>
                            {/* {sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => {
                                this.deletePriceRule(record.pricingRuleId);
                            })} */}
                        </Fragment>
                    )
                }
            ],
            price_rule_tips: [//定价规则的提示语
                '1.当对同一品类/产品制定了不同的规则，且其生效时间存在交集时，则按规则的生效时间排序，后生效的规则优先于前面制定的规则',
                '2.规则的优先级为指定SKU定价> 指定分类定价>默认定价',
                '3.指定sku销售价时，最终生效的价格为指定的销售价与供应商结算价两者中的较大者',
                '4.京东官网到手价折扣率、京东联盟价折扣率、京东建议销售价折扣率>理想折扣率,都不填则使用理想折扣率'
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize, current: 1 });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  // 获取定价规则详情
  getRuleInfo = ({ pricingStrategy,premiumRate ,discountRate,buyPriceDiscountRate,unionPriceDiscountRate,salePriceDiscountRate}) => {
      let str = ''
      if(pricingStrategy=='SPECIFIED_SKU'){
          str = '指定SKU'
      }else{
          str = `最高溢价率*${accMul(premiumRate,100)}% 理想折扣率*${accMul(discountRate,100)}%`
          if(isNotEmpty(buyPriceDiscountRate)){
              str = `${str} 京东官网到手价折扣率*${accMul(buyPriceDiscountRate,100)}`
          }
          if(isNotEmpty(unionPriceDiscountRate)){
              str = `${str} 京东联盟价折扣率*${accMul(unionPriceDiscountRate,100)}`
          }
          if(isNotEmpty(salePriceDiscountRate)){
              str = `${str} 京东建议销售价折扣率*${accMul(salePriceDiscountRate,100)}`
          }
      }
      return str
      
  };

  resize = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight })
          }
      }
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      params.pageIndex = params.current||1
      dispatch({
          type: 'pricerule/get_price_rule_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  this.setState({
                      tableData: {
                          list: res.data.list,
                          pagination: {
                              ...res.data.pagination
                          }
                      }
                  });
              } else {
                  failTip(res.msg)
              }
          }
      });
  };

  deletePriceRule = (prId) => {
      this.setState({ initLoading: true });

      const { dispatch } = this.props;
      dispatch({
          type: 'pricerule/delete_priceRule',
          payload: { pricingRuleId: prId },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  failTip(sldComLanguage('删除成功'))
                  this.get_list({ pageSize: pageSize, current: 1 })
              } else {
                  failTip(res.msg)
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

  //分页事件
  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues } = this.state;
      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          // this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //搜索事件
  searchSub = (data) => {
      const values = { ...data };

      for (let i in values) {
          if (values[i] == '') {
              delete values[i]
          }
      }
      this.setState({
          formValues: values,
          prlParams: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          prlParams: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, current: 1 });
  };

  //搜索点击
  moreSearchToggle = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight })
          }
      }
  }

  //处理新增按钮的点击
  handlerAddEvent = () => {
      //跳转到新增规则页面
      router.push('/goods/price_rule_list_add');
  };

  render() {
      const { search_data, columns, initLoading, tableData, price_rule_tips } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, overflow: 'auto' }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["price_rule_list_view"]} showPage>
                  <div className={priceRuleStyles.price_rule_title}>
                      {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('定价管理')}`, 0, 0, 10)}
                      <AuthBtn btnAuth={btnAuth} eventKey={["price_rule_list_add"]}>
                          <Button type="primary" onClick={this.handlerAddEvent}>
                              {sldComLanguage('新增')}
                          </Button>                        
                      </AuthBtn>
                  </div>
                  <div className={priceRuleStyles.price_rule_tips}>
                      {sldSvgIcon('#FC701E', 20, 20, 'cuowutishi')}
                      <div>{price_rule_tips && price_rule_tips.map(item => <p key={item}>{item}</p>)}</div>
                  </div>
                  <div className={global.tableListForm} ref="search_part">
                      <Search
                          search_data={search_data}
                          moreSearchToggle={() => this.moreSearchToggle()}
                          seaSubmit={(data) => this.searchSub(data)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          style={{ height: '200px' }}
                          bordered={false}
                          data={tableData}
                          rowKey="pricingRuleId"
                          columns={columns}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      />
                      {/*标准表格-end*/}

                  </Spin>
              </AuthBtn>
          </div>

      );
  }
}
