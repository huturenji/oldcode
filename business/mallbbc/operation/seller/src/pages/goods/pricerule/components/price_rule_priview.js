/*
* 定价管理-选择SKU组件
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Modal, Tag, Table,Tooltip } from 'antd';
import {
    failTip,
    sldComLanguage,
    getSldListGoodsImg80,
    getStorage
} from '@/utils/utils';
import ALibbSvg from '@/components/ALibbSvg';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../../product.less';

const storeId = getStorage('storeId');
const sourceType = {
    'JDW':'京东官网到手价',
    'JDU':'京东联盟价',
    'JD':'京东建议销售价'
}

const { CheckableTag } = Tag;
@connect(({ pricerule }) => ({
    pricerule
}))
export default class PriceRulePriview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,//列表数据加载框
            cateProfit: 0,//列表的平均利率
            tableData: [],//要显示的商品列表
            selectedTags: [],//选中的分类标签页，目前只有单选模式
            columns: [
                {
                    title: `SKU`,
                    dataIndex: 'sku',
                    key: "sku",
                    width: 100,
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('商品信息')}`,
                    dataIndex: 'skuName',
                    key: "skuName",
                    align: 'center',
                    // width: 150,
                    render: (text, record) => (
                        <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
                            <div className={styles.goods_img}>{getSldListGoodsImg80(record.mainImage)}</div>
                            <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                                <span className={styles.goods_name}>
                                    {text}
                                </span>
                            </div>
                        </div>
                    )
                },
                {
                    title: `${sldComLanguage('供应商销售价')}`,
                    dataIndex: 'supplierSalePrice',
                    key: "supplierSalePrice",
                    width: 120,
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'supplierSettlePrice',
                    key: "supplierSettlePrice",
                    width: 120,
                    align: 'center'
                },
                {
                    title: (
                        <div>
                             参考价
                            <Tooltip title="按以下优先级获取：京东官网到手价、京东联盟销售价、京东建议销售价">
                                <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                            </Tooltip>
                        </div>
                    ),
                    dataIndex: 'supplierReferencePrice',
                    key: "supplierReferencePrice",
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参考价来源')}`,
                    dataIndex: 'supplierReferenceSource',
                    key: "supplierReferenceSource",
                    align: 'center',
                    width: 100,
                    render:(text)=>sourceType[text]||''
                },
                {
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: `${this.props.previewType==1?'salePrice':'unitPrice'}`,
                    key: "salePrice",
                    width: 100,
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('毛利率')}`,
                    dataIndex: 'profit',
                    key: "profit",
                    width: 100,
                    align: 'center'
                }
            ],
            modalVisible: true
        };
    }

    componentDidMount() {
        const { previewType, cateList } = this.props
        this.setState({ modalVisible: true });
        if (previewType == 1) {
            // console.log(111, cateList)
            //分类模式，传入的只有分类信息，需要通过接口获取商品，没有商品信息，也没有价格信息，需要自己获取。
            cateList.length > 0 && this.setState({ selectedTags: [cateList[0]] }, () => {
                this.searchGoods()
            })
        } else {
            //SKU模式,传入的数据直接展示
            const tableData = JSON.parse(JSON.stringify(this.props.tableData))
            console.log(tableData)
            this.setState({
                tableData: tableData
            })
        }
    }

    componentWillUnmount() { }

  //搜搜商品列表
  searchGoods = () => {
      const { dispatch } = this.props;
      const { selectedTags } = this.state;
      this.setState({ loading: true });

      dispatch({
          type: 'pricerule/product_search',
          payload: {storeId,pageIndex:1,pageSize:20, ...selectedTags[0] },
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({
                      tableData: res.data.list
                  }, () => {
                      this.state.tableData.length > 0 ? this.getProductPrices() : this.setState({ loading: false });
                  });
              } else {
                  this.setState({ loading: false });
                  failTip(res.msg)
              }
          }
      })
  }

  //获取商品价格
  getProductPrices = () => {
      const { dispatch } = this.props;
      // 价格参数
      const { priceDetailInfo } = this.props
      let priceRuleParamVO = {
          discountRate:priceDetailInfo.discountRate,
          premiumRate:priceDetailInfo.premiumRate,
          buyPriceDiscountRate:priceDetailInfo.buyPriceDiscountRate,
          unionPriceDiscountRate:priceDetailInfo.unionPriceDiscountRate,
          salePriceDiscountRate:priceDetailInfo.salePriceDiscountRate
      }
      dispatch({
          type: 'pricerule/get_product_prices',
          payload: {
              skuInfos: this.state.tableData,
              priceRuleParamVO
          },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  const { tableData } = this.state;
                  this.setState({ cateProfit: res.data.profit });
                  //刷新已选商品的价格信息
                  tableData.forEach(item => {
                      this.updateSelectGoodPrice(item, res.data.skuPrice)
                  })
                  this.setState({
                      tableData: tableData
                  });
              } else {
                  failTip(res.msg)
              }
          }
      })
  }

  //更新某一条商品的价格信息
  updateSelectGoodPrice = (product, priceResult) => {
      let find = priceResult.find(price => price.sku == product.sku)
      if (find) {
          product['supplierSalePrice'] = find.supplierSalePrice
          product['supplierSettlePrice'] = find.supplierSettlePrice
          product['supplierReferencePrice'] = find.supplierReferencePrice
          product['supplierReferenceSource'] = find.supplierReferenceSource
          product['salePrice'] = find.salePrice
          product['profit'] = find.profit
      }
  }

  //用户选中某个标签的操作
  handleChange = (cate, checked) => {
      const { selectedTags } = this.state;
      if (checked) {
          selectedTags.splice(0, selectedTags.length, cate);
      }
      this.setState({ selectedTags: selectedTags }, () => {
          this.searchGoods()
      });
  }


  render() {
      const { columns, cateProfit, tableData, selectedTags, loading, modalVisible } = this.state;
      const { previewType, cateList } = this.props
      return (
          <Modal
              title={`${sldComLanguage('预览')}`}
              visible={modalVisible}
              footer={null}
              onCancel={() => {
                  this.setState({ modalVisible: false })
                  this.props.modalCancel(false);
              }}
              width="68%"
          >
              <div style={{ margin: "10px" }}>
                  <div style={{ fontSize: "18px", color: '#333' }}>
                      {/* eslint-disable-next-line no-useless-concat */}
                      {`${`${sldComLanguage('产品范围')}` + "—"}${ previewType == 1 ? sldComLanguage('分类') : sldComLanguage('SKU')}`}
                  </div>
                  {
                      //分类才有
                      previewType == 1 &&
            <div style={{ display: 'flex' }}>
                <Scrollbars
                    style={{ height: '100px', flex: '5' }}
                >
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {cateList && cateList.map((item, index) => <CheckableTag
                            key={index}
                            checked={selectedTags.findIndex(cate => item.categoryId3 == cate.categoryId3) > -1}
                            onChange={checked => this.handleChange(item, checked)}
                        >
                            <span>{item.categoryName}</span>
                        </CheckableTag>)}
                    </div>
                </Scrollbars>
                <div style={{ fontSize: "18px", color: '#333', flex: '1', borderLeft: '1px solid #e2e2e2' }}>{`${sldComLanguage('毛利率') }：${ cateProfit}`}</div>
            </div>
                  }
                  <div style={{}}>
                      <Table
                          size="middle"
                          className='move-table'
                          loading={loading}
                          columns={columns}
                          rowKey="sku"
                          pagination={false}
                          scroll={{ y: 390 }}
                          dataSource={tableData}
                      />
                  </div>
              </div>
          </Modal>
      );
  }
}
