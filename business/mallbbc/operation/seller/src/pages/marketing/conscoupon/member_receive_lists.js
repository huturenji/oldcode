/*
* 优惠券——优惠券领取详情
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import Link from 'umi/link';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    getSldEmptyH,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    getSldHorLine,
    sldtbaleOpeBtnText,
    getAuthBtn,
    isNotEmpty
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class MemberReceiveLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            operateData: [],
            modal_width: 700,//查看规格、下架优惠券的modal框宽度
            down_reason_list: [],//获取违规下架理由
            preview_img: '',
            preview_alt_con: '',
            show_preview_modal: false,
            modalVisibleDetail: false,
            initLoading: false,
            submiting: false,
            show_foot: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('优惠券规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('会员名称')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('会员昵称')}`,
                name: 'memberNickName',
                placeholder: `${sldComLanguage('请输入会员昵称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('劵码')}`,
                name: 'couponCode',
                placeholder: `${sldComLanguage('请输入劵码')}`
            },
            {
                type: 'select',
                label: `${sldComLanguage('使用状态')}`,
                name: 'useStateList',
                placeholder: `${sldComLanguage('请选择使用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('未使用')}` },
                    { key: '2', name: `${sldComLanguage('已使用')}` },
                    { key: '3', name: `${sldComLanguage('已过期')}` },
                    { key: '5', name: `${sldComLanguage('已失效')}` }
                ]
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('会员名称')}`,
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('会员昵称')}`,
                    dataIndex: 'memberNickName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('手机号')}`,
                    dataIndex: 'memberPhone',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('消费券劵码')}`,
                    dataIndex: 'couponCode',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('领取渠道')}`,
                    dataIndex: 'receiveChannelName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('领取时间')}`,
                    dataIndex: 'receiveTime',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('使用状态')}`,
                    dataIndex: 'useState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                       
                        case 1:
                            return <DotTag type='pending'>未使用</DotTag>
                        case 2:
                            return <DotTag type='sucess'>已使用</DotTag>
                        case 3:
                            return <DotTag type='normal'>已过期</DotTag> 
                        case 5:
                            return <DotTag type='normal'>已失效</DotTag>
                               
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: `${sldComLanguage('使用时间')}`,
                    dataIndex: 'useTime',
                    align: 'center',
                    width: 100,
                    render:(text)=>text||'--'
                },
                {
                    title: `${sldComLanguage('查看')}`,
                    dataIndex: '',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Link to={{
                            pathname: '/marketing/conscoupon_list_to_receive_list_detail',
                            query: {
                                couponMemberId : record.couponMemberId 
                            }
                        }}
                        >
                            {sldtbaleOpeBtnText(`查看`, () => null)}
                        </Link>
                    )

                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
    }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'conscoupon/receiveList',
          payload: { ...params,couponId:this.state.query.id},
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues } = this.state;
      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //领取时间处理
      if (values.search_receive_time) {
          values.receiveStartTime = values.search_receive_time[0] ? `${values.search_receive_time[0].format(dateFormat) } 00:00:00` : '';
          values.receiveEndTime = values.search_receive_time[1] ? `${values.search_receive_time[1].format(dateFormat) } 23:59:59` : '';
          delete values.search_receive_time;
      }
      //使用时间处理
      if (values.search_user_time) {
          values.useStartTime = values.search_user_time[0] ? `${values.search_user_time[0].format(dateFormat) } 00:00:00` : '';
          values.useEndTime = values.search_user_time[1] ? `${values.search_user_time[1].format(dateFormat) } 24:00:00` : '';
          delete values.search_user_time;
      }
      for(let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      if(isNotEmpty(values.useStateList)){
          values.useStateList = [values.useStateList]
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <AuthBtn btnAuth={btnAuth} eventKey={["conscoupon_list_view"]} showPage>
              <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
                  {getSldEmptyH(10)}
                  <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                      {sldLlineRtextAddMargin('#FA6F1E', `消费券 / 领取列表`, 0, 0, 0)}
                      {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                  </div>
                  {getSldHorLine(1)}
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          bordered={false}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="couponMemberId"
                          isCheck={false}
                          columns={columns}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          onSldHandleSeleRow={this.onSldHandleSeleRow}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                      />
                      {/*标准表格-end*/}
                  </Spin>
              </div>
          </AuthBtn>
         
      );
  }
}
