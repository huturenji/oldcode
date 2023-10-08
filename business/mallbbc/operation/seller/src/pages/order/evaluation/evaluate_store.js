import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Modal, Rate } from 'antd';
import {
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_10,
    getTableNum, dateFormat, sldComLanguage,getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import styles from '@/assets/css/order.less';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class EvaluateStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalvisibleImg: false,
            previewImage: '',
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('评价人')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入评价人')}`
            },{
                type: 'rangepicker',
                label: `${sldComLanguage('评价时间')}`,
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }
            ],
            formValues: {},//搜索条件
            columns: [
                {
                    title: '',
                    dataIndex: 'commentId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('订单号')}`,
                    dataIndex: 'orderSn',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('评价人')}`,
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('评分')}`,
                    dataIndex: 'deliverSpeed',
                    align: 'center',
                    width: 150,
                    render: function(text, record) {
                        return <div className={styles.eva_part}>
                            <div>{sldComLanguage('描述相符：')}<Rate disabled defaultValue={record.description * 1} /></div>
                            <div>{sldComLanguage('服务态度：')}<Rate disabled defaultValue={record.serviceAttitude * 1} /></div>
                            <div>{sldComLanguage('发货速度：')}<Rate disabled defaultValue={record.deliverSpeed * 1} /></div>
                        </div>;
                    }
                },
                {
                    title: `${sldComLanguage('评价时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                }
            ]
        };
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
    }

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'order/get_store_comment_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ loading: false });
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

  handlePreview = (imgurl) => {
      this.setState({
          modalvisibleImg: true,
          previewImage: imgurl
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      if (type == 'main') {
          const { formValues } = this.state;
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          this.setState({
              params: params
          });
          this.get_list(params);
      }
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
      }
      for(let i in values){
          if(values[i] == ''){
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

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //图片预览关闭功能
  handleModalVisible = () => {
      this.setState({
          modalvisibleImg: false
      });
  };

  render() {
      const { selectedRows, search_data, columns, data, loading, modalvisibleImg, previewImage } = this.state;
      return (
          <div className={global.common_page} style={{paddingTop:0}}>
              <AuthBtn btnAuth={btnAuth} eventKey={["evaluation_view"]} showPage>
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <Spin spinning={loading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight - 190}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="commentId"
                          isCheck={false}
                          columns={columns}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                          showMarkColor
                      />
                      {/*标准表格-end*/}

                  </Spin>
                  {/*图片预览功能*/}
                  <Modal
                      centered
                      style={{ textAlign: 'center' }}
                      visible={modalvisibleImg}
                      footer={null}
                      onCancel={this.handleModalVisible}
                  >
                      <img alt="example" style={{ maxWidth: '100%', maxHeight: '100%' }} src={previewImage} />
                  </Modal>
              </AuthBtn>
          </div>

      );
  }
}
