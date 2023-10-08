/*
* 拼团活动团队列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    failTip,
    sucTip,
    getTableNum,
    sldComLanguage,
    sldHandlePaginationData,
    dragSldTableColumn,
    sldtbaleOpeBtnText,
    sldIconBtnBg,
    sldLlineRtextAddGoods,
    list_com_page_size_10,
    sldPopConfirmDiy
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;

// eslint-disable-next-line no-shadow
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class SpellGroupTeamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            search_con: '',
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            formValues: {},//搜索条件
            search_data: [{
                type: 'select',
                label: `${sldComLanguage('拼团状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择拼团状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部状态')}` },
                    { key: '1', name: `${sldComLanguage('进行中')}` },
                    { key: '2', name: `${sldComLanguage('拼团成功')}` },
                    { key: '3', name: `${sldComLanguage('拼团失败')}` }
                ]
            }],
            columns: [
                {
                    title: '',
                    dataIndex: 'spellTeamId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('开团时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('成团结束时间')}`,
                    dataIndex: 'endTime',
                    align: 'center',
                    width: 150
                }, {
                    title: `${sldComLanguage('拼团人数')}`,
                    dataIndex: 'joinedNum',
                    align: 'center',
                    width: 100
                },{
                    title: `${sldComLanguage('会员')}`,
                    dataIndex: 'endTime',
                    align: 'center',
                    width: 100,
                    render: (text, record) => <Fragment>
                        {record.memberList.length>0
                            ?<div className={`${promotion.spell_group_team_wrap} ${global.flex_row_center_center}`}>
                                {record.memberList.map((item,index)=><div className={`${promotion.member} ${global.flex_column_start_center}`}>
                                    <div className={promotion.avatar} style={{backgroundImage:`url(${ item.memberAvatar })`}} />
                                    <span className={promotion.name} style={{background:index==0?'rgba(255, 106, 18, 1)':'rgba(255, 210, 183, 1)'}} title={index==0?sldComLanguage('团长：')+item.memberName:item.memberName}>{item.memberName}</span>
                                </div>)}
                            </div>
                            :'--'
                        }
                    </Fragment>
                },{
                    title: `${sldComLanguage('状态')}`,
                    dataIndex: 'stateValue',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {record.isSimulateGroup == 1
                                ?sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定执行模拟成团操作吗？')}`, () => this.operate(record,'spell'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('模拟成团')}`, () => null))
                                :'--'
                            }
                        </Fragment>
                    )
                }
            ]
        };
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
    }

  //操作  spell 模拟成团操作
  operate = (record) => {
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      param_data.spellTeamId = record.spellTeamId
      this.setState({ submiting: true });
      dispatch({
          type: 'promotion/spell_group_team_to_simulate_group',
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { query } = this.state;
      dispatch({
          type: 'promotion/get_spell_group_team_list',
          payload: { ...params, spellId: query.spellId,goodsId:query.goodsId },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
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
      for (let i in values) {
          if (values[i] == '') {
              delete values[i]
          }
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

  render() {
      const { selectedRows, columns, initLoading, data, search_data} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('活动团队')}`)}
                  {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
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
                      totalHeight={document.body.clientHeight - 155-15}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="spellTeamId"
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
      );
  }
}
