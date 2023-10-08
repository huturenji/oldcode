
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Empty,
    Form, Modal,Upload,Button,message, Table 
} from 'antd';
import XLSX from 'xlsx';
import {
    failTip,
    list_com_page_size_16,
    sldComLanguage,
    downLoad_front
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import Search from '@/components/Search/Search';
import ALibbSvg from '../ALibbSvg';

let pageSize = list_com_page_size_16;
@connect(({ project}) => ({
    project
}))
@Form.create()
export default class SelectMemberPop extends Component {
    loading_pagination_flag = false;//分页加载标识，防止分页重复加载

    // upProps = {
    //     name: 'file', //发到后台的文件参数名
    //     // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
    //     headers: { Authorization: 'SID' }, // 
    //     showUploadList: false,
    //     beforeUpload: this.beforeUploadFun
    // }

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            loading: true,
            data: {},
            title: '',
            params: { pageSize },
            search_data: [
                {
                    type: 'input',
                    label: '会员昵称',
                    name: 'memberNickName',
                    placeholder: `${sldComLanguage('请输入会员昵称')}`
                },
                {
                    type: 'input',
                    label: `手机号`,
                    name: 'memberMobile',
                    placeholder: `请输入手机号`
                }
                //   {
                //   type: 'select',
                //   label: `促销活动`,
                //   name: 'activity_type',
                //   placeholder: `请选择促销活动`,
                //   sel_data: [
                //     { key: '', name: `全部` },
                //     { key: '1', name: `手机专享` },
                //     { key: '2', name: `拼团` },
                //     { key: '3', name: `团购` },
                //     { key: '4', name: `限时` },
                //     { key: '5', name: `预售` },
                //     { key: '6', name: `阶梯团` },
                //   ],
                // }
            ],
            formValues: {},//搜索条件
            uploading:false,
            columns: [
                {
                    title: '序号',
                    dataIndex: 'kys',
                    align: 'center',
                    width: 45,
                    render: (text, record, index) => index + 1
                },
                {
                    title: '会员ID',
                    dataIndex: 'memberId',
                    align: 'center',
                    width: 60
                },
                {
                    title: `${sldComLanguage('手机号')}`,//手机号
                    dataIndex: 'memberMobile',
                    align: 'center',
                    width: 80
                },
                {
                    title: `${sldComLanguage('会员昵称')}`,//会员昵称
                    dataIndex: 'memberNickName',
                    align: 'center',
                    width: 80,
                    render: (text) => text?text:'--'
                },
                {
                    title: '公司',//公司
                    dataIndex: 'companyName',
                    align: 'center',
                    width: 80,
                    render: (text) => text?text:'--'
                },
                {
                    title: '渠道',//渠道
                    dataIndex: 'channelName',
                    align: 'center',
                    width: 80,
                    render: (text) => text?text:'--'
                }
                // {
                //   title: `${sldComLanguage('会员名')}`,//会员名
                //   dataIndex: 'memberName',
                //   align: 'center',
                //   width: 100,
                // },
        
                // {
                //   title: `${sldComLanguage('会员头像')}`,//会员头像
                //   dataIndex: 'memberAvatar',
                //   align: 'center',
                //   width: 100,
                //   render: (text) => {
                //     return getSldComImg(text, 100, 100, 50, 50);//图片预览
                //   },
                // },
       
                // {
                //   title: `${sldComLanguage('账户余额')}`,//账户余额
                //   dataIndex: 'balance',
                //   align: 'center',
                //   width: 80,
                // },
                // {
                //   title: `${sldComLanguage('注册时间')}`,//注册时间
                //   dataIndex: 'registerTime',
                //   align: 'center',
                //   width: 100,
                // },
                // {
                //   title: `${sldComLanguage('操作')}`,//操作
                //   align: 'center',
                //   width: 120,
                //   render: (text, record) => (
                //     <Fragment>
                //       {sldtbaleOpeBtnText(`${sldComLanguage('添加')}`, () => this.editMember(record))}{/*添加*/}
                //       <span className={global.splitLine}></span>
                //       {sldtbaleOpeBtnText(`${sldComLanguage('取消')}`, () => this.changePwd(record))}{/*取消*/}
                //     </Fragment>
                //   ),
                // },
            ]
        };
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible) {
            this.get_member_list({ pageSize });
            this.setState({
                selectedRows: [...nextProps.selectedRows],
                selectedRowKeys: [...nextProps.selectedRowKeys]
            });
        }
    }


  //获取数据列表 有options参数 代表是导入的  导入用下面的新接口
  get_member_list = (params, options={type: 1, step: 0}) => new Promise((resolve)=>{

      this.setState({ loading: true });
      if(options.type==2){this.setState({ uploading: true })}
      const { dispatch } = this.props;
      let { data, selectedRows, selectedRowKeys } = this.state;
      let new_params = { ...params };
      dispatch({
          type: 'project/get_member_lists',
          payload: new_params,
          callback: (res) => { 
              this.setState({ loading: false });
              if(options.type==2){this.setState({ uploading: false })}
              if (res.state == 200) {
  
                  if (res.data.pagination != undefined) {
                      // todo 经过沟通，公司相关的数据暂时前端写死，后续再优化 2021-12-14
                      // 不同公司的会员id (memberId) 是一样的 ，用companyId和memberId拼接一个唯一key
                      res.data.list = res.data.list.map(item => ({
                          ...item,
                          keyId:`${item.companyId}${item.memberId}`
                          // companyName: companyConfig[BP_ENV].companyName,
                          // companyId: companyConfig[BP_ENV].companyId
                      }))
                      if (res.data.pagination.current == 1) {
                          if(!!!options.step || options.step == 1){ //正常请求数据 或者如果导入的时候 是切片的第一张切片
                              data = res.data;
                          }else{
                              data.list = data.list.concat(res.data.list);
                          }
                      } else {
                          data.list = data.list.concat(res.data.list);
                          data.pagination = res.data.pagination;
                      }
                  }
                  // 导入模板的数据，此时需要商品要是选中状态
                  if(options.type==2 && data.list.length>0){
                      selectedRowKeys = data.list.map(item=>item.keyId)
  
                      selectedRows = JSON.parse(JSON.stringify(data.list))
                      this.setState({
                          selectedRowKeys,
                          selectedRows
                      });
                  }
                  this.setState({
                      data
                  });
                  this.loading_pagination_flag = false;
                  if(options.type==2){this.loading_pagination_flag = true}
                  resolve(true)
              }
          }
      });
  });

   // 会员导入接口，和查询接口不一样了，这个接口没有分页 
   get_member_detail_lists = (params, options={type: 1, step: 0}) => new Promise((resolve)=>{
       this.setState({ uploading: true })
       const { dispatch } = this.props;
       let { data, selectedRows, selectedRowKeys } = this.state;
       let new_params = { ...params };
       dispatch({
           type: 'project/get_member_detail_lists',
           payload: new_params,
           callback: (res) => { 
               this.setState({ uploading: false })
               if (res.state == 200) {
  
                   if (res.data != undefined) {
                       res.data = res.data.map(item => ({
                           ...item,
                           keyId:`${item.companyId}${item.memberId}`
                       }))
      
                       if(options.step == 1){ //如果导入的时候 是切片的第一张切片
                           data = {list:res.data};
                           data.pagination = {current: 1,total:1}
                       }else{
                           data.list = data.list.concat(res.data);
                       }
            
                   }
           
                   // 导入模板的数据，此时需要商品要是选中状态
                   if(options.type==2 && data.list.length>0){
                       selectedRowKeys = data.list.map(item=>item.keyId)
  
                       selectedRows = JSON.parse(JSON.stringify(data.list))
                       this.setState({
                           selectedRowKeys,
                           selectedRows
                       });
                   }
                   this.setState({
                       data
                   });
                   this.loading_pagination_flag = true;
                   resolve(true)
               }
           }
       });
   });

  //搜索事件
  search = (data) => {
      for (let i in data) {
          if (data[i] == '') {
              delete data[i];
          }
      }
      this.setState({
          formValues: data,
          params: { pageSize: pageSize }
      });
      this.get_member_list({ pageSize: pageSize, ...data });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize },
          selectedRows: [],
          selectedRowKeys: []//selectedRows的key
      });
      this.get_member_list({ pageSize: pageSize });
  };

  //取消事件
  sldCancle = () => {
      this.setState({
          selectedRows: [],
          selectedRowKeys: [],//selectedRows的key
          params: { pageSize: pageSize }
      });
      this.props.modalCancle();
  };

  sldConfirm = () => {
      let { selectedRows, selectedRowKeys } = this.state;
      if (selectedRowKeys.length > 0) {      
          this.props.confirmMember(selectedRows, selectedRowKeys);
          this.setState({
              selectedRows: [],
              selectedRowKeys: []
          });
      } else {
          failTip(`${sldComLanguage('请选择指定会员')}`);//请选择指定会
      }
      this.setState({ params: { pageSize: pageSize } });
  };

  //关闭modal之后重置数据
  closeReset = () => {
  
  };

  //滚动条滚动到底部事件
  handleScrollLeft = () => {


      let { data,formValues } = this.state;
      //是否还有数据
      if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
      //请求分页数据
          this.loading_pagination_flag = true;
          this.get_member_list({...formValues, pageSize: pageSize, current: data.pagination.current * 1 + 1 });
      }
  };


  // 直接导模板
  downFile = () =>{
      downLoad_front('member')
  }

  beforeUploadFun = (file,fileList)=>{
      let that = this;
      //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
      fileList = fileList.slice(-1);
      const isExcle = file.name.split('.')[file.name.split('.').length-1] === 'xlsx';
      if (!isExcle) {
          message.error('请按模板上传xlsx文件!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
          message.error('上传文件需小于10MB!');
      }
      var rABS = true;
      const f = fileList[0];
   
      var reader = new FileReader();
      reader.onload = function(e){
          var data = e.target.result;
          if (!rABS) {data = new Uint8Array(data);}
          var workbook = XLSX.read(data, {
              type: rABS ? 'binary' : 'array'
          });
          // 假设我们的数据在第一个标签
          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // XLSX自带了一个工具把导入的数据转成json
          var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
          // 通过自定义的方法处理Json，比如加入state来展示
          that.handleImpotedJson(jsonArr);
       
      };
      if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
      return false;
  }

  handleImpotedJson = async (jsonData)=>{

      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let memberNameList = [];
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==0){
                          if(ele[0]=='会员ID'){
                              // todo
                          }else{
                              message.error('第一列应为会员ID,请按格式重新上传!');
                              return false
                          }
                          if(ele[4]=='公司ID'){
                              // todo
                          }else{
                              message.error('第五列应为公司ID,请按格式重新上传!');
                              return false
                          }
                      }else{
                          let params = {}
                          // 会员ID
                          if( ele[0] ){
                              params.memberName = ele[0]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行排序数据`,5);
                              return false;
                          }
                          // 公司ID
                          if( ele[4] ){
                              params.companyId = ele[4]
                          }else{
                              message.error(`解析失败,请检查第${index+1}行排序数据`,5);
                              return false;
                          }
                          memberNameList.push(params)
                      }
                  }
              }
        
              if(memberNameList.length>1000){
                  message.error(`最多支持导入1000条数据`);
                  return false
              }
              if(memberNameList.length>0){
                  let stepNum = 100;
                  let num = Math.ceil(memberNameList.length/stepNum)
                  for(let i=0; i < num; i++){
                      let memberListItem = memberNameList.slice(i*stepNum, (i+1)*stepNum)
                      await this.get_member_detail_lists({ pageSize: memberListItem.length, current: 1, memberInfoList: memberListItem }, {type: 2, step: i+1});
                  }
              }

          }else{
              message.error('解析失败,请按格式上传!');
          }
      
      } catch (error) {
          message.error('解析失败,请按格式上传!');
      }
  }

  // eslint-disable-next-line react/sort-comp
  upProps = {
      name: 'file', //发到后台的文件参数名
      // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
      headers: { Authorization: 'SID' }, // 
      showUploadList: false,
      beforeUpload: this.beforeUploadFun
  }

  // 点击右侧的选择人员的弹框
  handleRightSelectChange = (record) => {

      let { selectedRows, selectedRowKeys } = this.state;
      selectedRows = selectedRows.filter(items => items.keyId != record.keyId);
      selectedRowKeys = selectedRowKeys.filter(items => items != record.keyId);
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  // 点击左侧的选择人员的弹框
  handleLeftSelectChange = (record) => {

      let { selectedRows, selectedRowKeys } = this.state;
      if (selectedRowKeys.indexOf(record.keyId) == -1) {
          selectedRowKeys.push(record.keyId);
          selectedRows.push(record);
      }else{
          selectedRowKeys = selectedRowKeys.filter(items => items != record.keyId);
          selectedRows = selectedRows.filter(items => items.keyId != record.keyId);
      }
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  // 点击左侧的选择人员的全选弹框
  handleSelectAllChange = (selected, rows) => {

      let rowKeys = rows.map(item=>item.keyId)
      this.setState({
          selectedRowKeys: rowKeys,
          selectedRows: rows
      });
  };

  render() {
      const { modalVisible, width, title, height } = this.props;
      const { selectedRows, columns, search_data, data, selectedRowKeys, uploading } = this.state;

      const rowSelectionRight = {
          type: 'checkbox',
          selectedRowKeys,
          onSelect: this.handleRightSelectChange,
          onSelectAll: this.handleSelectAllChange,
          getCheckboxProps: record => ({
              disabled: (record.disabled == 'true' || record.disabled == true) ? true : false
          })
      };
      const rowSelectionLeft = {
          type: 'checkbox',
          selectedRowKeys,
          onSelect: this.handleLeftSelectChange,
          onSelectAll: this.handleSelectAllChange,
          getCheckboxProps: record => ({
              disabled: (record.disabled == 'true' || record.disabled == true) ? true : false
          })
      };
      return (
          <Modal
              destroyOnClose
              onOk={this.sldConfirm}
              afterClose={this.closeReset}
              onCancel={this.sldCancle}
              visible={modalVisible}
              width={width}
              title={title}
          >
              <div className={`${styles.component_sele_more} ${global.flex_column_start_start}`}>
                  <div className={global.tableListForm}>
                      <div style={{ position: 'relative' }}>
                          <Search
                              search_data={search_data}
                              top={0}
                              seaSubmit={(data1) => this.search(data1)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                      <div>
                          <Button onClick={()=>{this.downFile()}} style={{marginRight:'10px'}}>下载模板</Button>
                          <Upload {...this.upProps} disabled={uploading}>
                              <Button loading={uploading}>点击上传</Button>
                          </Upload>
                      </div>
                  </div>
                  <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height }}>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              onScrollFrame={(e) => this.handleScrollLeft(e)}
                              style={{ width: 500, zIndex: 1 }}
                          >
                              <div className={`${styles.left} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {!!data.list && data.list.length > 0 ?
                 
                    
                                      <Table 
                                          rowSelection={rowSelectionLeft} 
                                          columns={columns} 
                                          dataSource={data.list} 
                                          pagination={false}
                                          rowKey="keyId"
                                      />
                      
                   
                                      :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                      </div>
                                  }
                              </div>
                          </Scrollbars>
                      </div>
                      <div className={`${styles.center} ${global.flex_row_center_center}`}>
                          <ALibbSvg fill="#FFE3D5" width={39} height={32} type="move-up1" />
                      </div>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              style={{ width: 500, zIndex: 1 }}
                          >
                              <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {selectedRows.length > 0 ? 
                                      <Table 
                                          rowSelection={rowSelectionRight} 
                                          columns={columns} 
                                          dataSource={selectedRows} 
                                          pagination={false}
                                          rowKey="keyId"
                                      />
                                      :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('您还未选择数据')}`} />
                                      </div>
                                  }
                              </div>
                          </Scrollbars>
                      </div>
                  </div>
              </div>
          </Modal>
      );
  }
}
