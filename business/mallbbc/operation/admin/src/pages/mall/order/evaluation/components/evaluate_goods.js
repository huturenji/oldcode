import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Modal, Rate } from 'antd';
import {
    failTip,
    sucTip,
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_10,
    getTableNum, dateFormat, sldComLanguage, sldtbaleOpeBtnText,
    sldPopConfirmDiy,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import styles from '@/assets/css/manage.less';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ evaluate }) => ({
    evaluate
}))
@Form.create()
export default class EvaluateGoods extends Component {
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            loading: false,
            submiting: false,
            modalVisible: false,
            modalvisibleImg: false,
            previewImage: '',
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            searchHeight: 0,
            operateData: [],
            addData: [{
                type: 'textarea',
                label: `${sldComLanguage('回复')}`,//描述
                name: 'replyContent',
                maxLength:100,
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('描述')}`,//请输入描述
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('描述')}`//请输入描述
                }
                ]
            }
            ],//modal框-积分经验值数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,//商品名称
                name: 'goodsName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`//请输入商品名称
            }, {
                type: 'input',
                label: `${sldComLanguage('评价人')}`,//评价人
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('评价人')}`//请输入评价人
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('评价时间')}`,//评价时间
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
                placeholder2: `${sldComLanguage('结束时间')}`//结束时间
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
                    title: `${sldComLanguage('商品名称')}`,//商品名称
                    dataIndex: 'goodsName',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('评价描述')}`,
                    dataIndex: 'content',
                    width: 300,
                    render: function(text, record) {
                        return <div className={styles.eva_part}>
                            <div>{sldComLanguage('商品评分')}：<Rate disabled defaultValue={record.score * 1} />{record.createTime}</div>
                            <div>{sldComLanguage('评价内容')}：{record.content}</div>
                            {record.imageValue.length > 0 && (
                                <div><span className={styles.img_name}>{sldComLanguage('晒单图片')}：</span>
                                    <ul className={styles.eval_pic_ul}>
                                        {record.imageValue.map((item) => (
                                            <li onClick={()=>sthis.handlePreview(item)} className={styles.eval_pic_li}>
                                                <img src={item} />
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                            )}
                            <div>{record.replyContent ? (`${sldComLanguage('商家回复：')}${ record.replyContent}`) : ''}</div>
                        </div>;
                    }
                },
                {
                    title: `${sldComLanguage('评价人')}`,//评价人
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('店铺名称')}`,//店铺名称
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('评价时间')}`,//评价时间
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 120,
                    render: (text, record) => (
                        <Fragment>
                            {/*删除后不可恢复，是否确定删除？*/}
                            <AuthBtn eventKey={['delete_goods_comment']} btnAuth={btnAuth}>
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.del(record.commentId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                            </AuthBtn>
                        </Fragment>
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
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'evaluate/get_goods_comment_list',
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

  del = (id) => {
      this.props.dispatch({
          type: 'evaluate/goods_comment_del',
          payload: {
              commentIds: id
          },
          callback: res => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({ pageSize: pageSize });
              } else {
                  failTip(res.msg);
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

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  //图片预览关闭功能
  handleModalVisible = () => {
      this.setState({
          modalvisibleImg: false
      });
  };

  render() {
      const {
          selectedRows, search_data, columns, data, loading, modalvisibleImg, previewImage
      } = this.state;
      return (
          <div className={global.common_page} style={{paddingTop:0}}>
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
                      totalHeight={document.body.clientHeight - 200}
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
          </div>

      );
  }
}
