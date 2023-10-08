import React, { PureComponent } from 'react';
import { Form, Switch, Spin } from 'antd';
import {
    sldComLanguage,
    sldIconBtn,
    sldSearchValClear,
    list_com_page_size_10,
    getTableNum,
    sldPopConfirmDiy,
    sldtbaleOpeBtnText,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import styles from './css/index.less';
import StandardTable from '@/components/StandardTable';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;

@Form.create()
class ReasonList extends PureComponent {
  state = {
      flag: false,
      modalvisible: false,
      state: false,
      search_con: '',
      params: { pageSize: pageSize }//搜索条件
  };

  componentWillReceiveProps() {
      let {state,flag} = this.state
      if (this.props.lockup && !state) {
          this.setState({
              // eslint-disable-next-line react/no-access-state-in-setstate
              flag: !flag,
              modalvisible: false,
              state: true
          });
          this.props.form.resetFields();
      }

  }


  handleTableChange = (pagination, filters, sorter) => {
      this.props.onChange(pagination, filters, sorter);
  };

  //搜索功能
  search = (values) => {
      this.props.onHandleSearchList(values);
  };

  //slodon_搜索重置功能
  seaReset = () => {
      this.props.handleFormListReset();
  };

  //搜索框内容的变化
  sldSearChange = (val) => {
      this.setState({
          search_con: val.target.value
      });
  };

  //清空搜索内容
  sldSearClear = () => {
      this.setState({
          search_con: ''
      });
      this.search('');
  };

  //新增
  addGoodsLabel = (flag, type, record) => {
      this.props.onHandleModal(flag, type, record);
  };


  render() {
      const { data, loading, search_data } = this.props;
      const { search_con } = this.state;
      //编辑事件
      const handleEdit = (flag, type, record) => {
          this.props.onHandleModal(flag, type, record);
      };
      //操作 del
      const operateRecharge = (id) => {
          this.props.onHandleDel(id);
      };
      //原因是否显示
      const operateReason = (params,type='') => {
          this.props.onHandleshowReason(params,type);
      };

      const columns = [
          {
              title: `${sldComLanguage('序号')}`,
              dataIndex: 'reasonId',
              align: 'center',
              width: 30,
              render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
          },
          {
              title: `${sldComLanguage('申请原因')}`,
              dataIndex: 'content',
              align: 'center',
              width: 200
          },
          {
              title: `${sldComLanguage('排序')}`,
              align: 'center',
              dataIndex: 'sort',
              width: 100
          },
          {
              title: `${sldComLanguage('是否显示')}`,//是否可用
              dataIndex: 'isShow',
              align: 'center',
              width: 100,
              render: (text, record) => (
                  <Switch
                      disabled={!hasAuth('switch_reason')}
                      onChange={(checked) => operateReason({ reasonId: record.reasonId, isShow: checked ? 1 : 0 },'switch')}
                      checked={text == 1 ? true : false}
                      valuepropname="checked"
                  />
              )
          },
          {
              title: `${sldComLanguage('操作')}`,
              dataIndex: 'content',
              align: 'center',
              width: 100,
              render: function(text, record) {
                  return <div className={styles.wrapoperate}>
                      <AuthBtn eventKey={['edit_reason']} btnAuth={btnAuth}>
                          {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => handleEdit(true, 'edit', record))}{/*编辑*/}
                      </AuthBtn>
                      <span className={global.splitLine} />
                      {/*删除后不可恢复，是否确定删除？*/}
                      <AuthBtn eventKey={['delete_reason']} btnAuth={btnAuth}>
                          {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => operateRecharge(record.reasonId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                              sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                      </AuthBtn>
                  </div>;
              }
          }
      ];

      return (
          <div style={{ marginTop: 10 }}>
              <div className={global.operate_bg}>
                  <AuthBtn eventKey={['add_reason']} btnAuth={btnAuth}>
                      {sldIconBtn(() => this.addGoodsLabel(true, 'add', {}), `${sldComLanguage('新增原因')}`, 7, 7)}{/*新增*/}
                  </AuthBtn>
                  {sldSearchValClear(search_data[0].placeholder, 291, this.search, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
              </div>
              <Spin spinning={loading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      //selectedRows={selectedRows}
                      data={data}
                      rowKey="reasonId"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTableChange(pagination, filtersArg, sorter)}
                      isColumnResize
                  />
                  {/*标准表格-end*/}

              </Spin>

          </div>
      );
  }
}

export default ReasonList;
