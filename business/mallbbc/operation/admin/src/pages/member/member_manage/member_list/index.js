import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { Form, Spin, Switch,Tooltip } from 'antd';
import {
    failTip,
    sucTip,
    dragSldTableColumn,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    formItemLayoutModal,
    validatorMemPwd,
    list_com_page_size_10,
    getTableNum, dateFormat, sldComLanguage, validatorMem, getSldComImg, getSldCopyData, sldtbaleOpeBtnText,mobile_reg,sldIconBtnBg, getAuthBtn, hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ project,member_manage }) => ({    
    project,
    member_manage
}))
@Form.create()
export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height:0,
            viewAuth:"view_member",
            loading: false,
            submiting: false,
            modalVisible: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            searchHeight: 0,
            operateData: [],
            changePwdData: [{
                type: 'input',
                label: `${sldComLanguage('新密码')}`,//新密码
                input_type: 'password',
                name: 'loginPwd',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('新密码')}`,//请输入新密码
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('新密码必填')}`//新密码必填
                }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
            }, {
                type: 'input',
                label: `${sldComLanguage('确认新密码')}`,//确认新密码
                name: 'confirmPwd',
                input_type: 'password',
                placeholder: `${sldComLanguage('请再次输入新密码')}`,//请再次输入新密码
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('确认新密码必填')}`//确认新密码必填
                }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
            }],
            addData: [{
                type: 'input',
                label: `${sldComLanguage('会员名')}`,//会员名
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('会员名')}`,//请输入会员名
                extra: `${sldComLanguage('请输入6-20位中、英文、数字、"-"及"_"，且不能全为数字')}`,//请输入6-20位中、英文、数字、"-"及"_"，且不能全为数字
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('会员名必填')}`//会员名必填
                }, { validator: (rule, value, callback) => validatorMem(rule, value, callback) }]
            }, {
                type: 'input',
                label: `${sldComLanguage('密码')}`,//密码
                input_type: 'password',
                name: 'loginPwd',
                placeholder: `${sldComLanguage('请设置6～20位字母、数字或符号组成的密码')}`,//请输入密码
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('密码必填')}`//密码必填
                }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
            }, {
                type: 'input',
                label: `${sldComLanguage('确认密码')}`,//确认密码
                name: 'confirmPwd',
                input_type: 'password',
                placeholder: `${sldComLanguage('请再次输入密码')}`,//请再次输入密码
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('确认密码必填')}`//确认密码必填
                }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
            }, {
                type: 'input',
                label: `${sldComLanguage('手机号')}`,//手机号
                name: 'memberMobile',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('手机号')}`,//请输入手机号
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('手机号必填')}`//手机号必填
                }, {
                    pattern: mobile_reg,
                    message: `${sldComLanguage('请输入正确的手机号')}`//请输入正确的手机号
                }]
            }, {
                type: 'input',
                label: `${sldComLanguage('邮箱')}`,//邮箱
                name: 'memberEmail',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('邮箱')}`,//请输入邮箱
                initialValue: '',
                rules: [{
                    pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    message: `${sldComLanguage('请输入正确的邮箱')}`//请输入正确的邮箱
                }]
            }, {
                type: 'input',
                label: `${sldComLanguage('真实姓名')}`,
                extra: `${sldComLanguage('最多输入10位')}`,
                name: 'memberTrueName',
                placeholder: `${sldComLanguage('请输入真实姓名')}`,//请输入真实姓名
                maxLength: 10,
                initialValue: ''
            }
            ],//modal框的数据
            pointData: [{
                type: 'show_content',
                name: 'memberName',
                label: `${sldComLanguage('会员名')}`,
                content: ''
            }, {
                type: 'show_content',
                name: 'memberIntegral',
                label: `${sldComLanguage('当前积分')}`,
                content: ''
            }, {
                type: 'radio_select',
                label: `${sldComLanguage('操作类型')}`,
                name: 'type',
                placeholder: `${sldComLanguage('请选择增减类型')}`,
                data: [{
                    key: 1,
                    value: `${sldComLanguage('增加')}`//增加
                }, {
                    key: 2,
                    value: `${sldComLanguage('减少')}`//减少
                }],
                initialValue: 1,
                callback:this.updateLimit
            }, {
                type: 'inputnum',
                label: `${sldComLanguage('积分')}`,
                name: 'value',
                placeholder: `${sldComLanguage('请输入积分数值')}`,
                precision: 0,
                min:1,
                max:99999999,
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请输入积分数值')}`
                }]
            }, {
                type: 'textarea',
                label: `${sldComLanguage('备注')}`,
                name: 'description',
                placeholder: `${sldComLanguage('请输入操作备注，最多15字')}`,
                maxLength: 15,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入操作备注')}`
                }]
            }
            ],//modal框-积分经验值数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('会员名')}`,//会员名
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('会员名')}`//请输入会员名
            }, {
                type: 'input',
                label: `${sldComLanguage('手机号')}`,//手机号
                name: 'memberMobile',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('手机号')}`,//请输入手机号
                rules: [{
                    pattern: mobile_reg,
                    message: `${sldComLanguage('请输入正确的手机号')}`//请输入正确的手机号
                }]
            }, {
                type: 'select',
                label: `${sldComLanguage('会员状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择会员状态')}`,//请选择会员状态
                sel_data: [
                    { key: '', name:  `${sldComLanguage('全部')}`},
                    { key: '1', name:  `${sldComLanguage('正常')}`},
                    { key: '0', name:  `${sldComLanguage('禁用')}`}
                ]
            }, 
            {
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [],
                label: `来源渠道`,
                name: 'channelIds',
                placeholder: '请选择来源渠道',
                sel_data: []
            },
            {
                type: 'rangepicker',
                label: `${sldComLanguage('注册时间')}`,//注册时间
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
                placeholder2: `${sldComLanguage('结束时间')}`//结束时间
            }
            ],
            formValues: {},//搜索条件

            columns: [
                {
                    title: ' ',
                    dataIndex: 'memberId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('会员名')}`,//会员名
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('手机号')}`,//手机号
                    dataIndex: 'memberMobile',
                    align: 'center',
                    width: 120
                },
                {
                    title: `${sldComLanguage('会员头像')}`,//会员头像
                    dataIndex: 'memberAvatar',
                    align: 'center',
                    width: 80,
                    render: (text) => 
                        getSldComImg(text, 100, 100, 50, 50)//图片预览
          
                },
                {
                    title: `${sldComLanguage('会员真实名称')}`,//会员昵称
                    dataIndex: 'memberTrueName',
                    align: 'center',
                    width: 80,
                    render: (text) => text?text:'--'
                },
                {
                    title: `${sldComLanguage('会员昵称')}`,//会员昵称
                    dataIndex: 'memberNickName',
                    align: 'center',
                    width: 80,
                    render: (text) => text?text:'--'
                },
                {
                    title: `${sldComLanguage('账户余额')}`,//账户余额
                    dataIndex: 'balance',
                    align: 'center',
                    width: 80
                },
                // {
                //     title: `${sldComLanguage('积分')}`,//积分
                //     dataIndex: 'memberIntegral',
                //     align: 'center',
                //     width: 80
                // },
                {
                    title: `${sldComLanguage('注册时间')}`,//注册时间
                    dataIndex: 'registerTime',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('来源渠道')}`,
                    dataIndex: 'channelName',
                    align: 'center',
                    width: 100,
                    render:(text, record) => `${text}(${record.channelId})`
                },
                {
                    title: `${sldComLanguage('所属企业')}`,//公司名称
                    dataIndex: 'companyName',
                    align: 'center',
                    width: 80,
                    render: (text, record) => `${text||''}(${record.companyId||''})`
                },                
                {
                    title: `${sldComLanguage('是否可用')}`,//是否可用
                    dataIndex: 'state',
                    align: 'center',
                    width: 80,
                    render: (text, record) => (
                        <Switch
                            disabled={!hasAuth('switch_member')}
                            checkedChildren={`${sldComLanguage('可用')}`}//可用
                            onChange={(checked) => this.operateMember({
                                memberId: record.memberId,
                                state: checked ? 1 : 2
                            }, 'switch')}
                            unCheckedChildren={`${sldComLanguage('禁用')}`}//禁用
                            checked={text == 1 ? true : false}
                            valuepropname="checked"
                        />
                    )
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 120,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={["edit_member"]} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editMember(record))}{/*编辑*/}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <AuthBtn eventKey={["reset_member_pwd"]} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('重置密码')}`, () => this.changePwd(record))}{/*重置密码*/}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            {/* 积分区别企业需求改动 暂时屏蔽 */}
                            {/* <AuthBtn eventKey={["set_member_point"]} btnAuth={btnAuth}> */}
                            {/* {sldtbaleOpeBtnText(`${sldComLanguage('积分设置')}`, () => this.setPoint(record))}
                            <span className={global.splitLine} /> */}
                            {/* </AuthBtn> */}
                            <Link to={{
                                pathname: '/member/lists_to_detail',
                                query: {
                                    id: record.memberId
                                }
                            }}
                            >
                                {
                                    sldtbaleOpeBtnText(sldComLanguage('查看'), null)//查看
                                }
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }


    componentDidMount() {
        this.get_operation_list();
        this.get_list({ pageSize: pageSize });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () =>{
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

   // 获取渠道信息
   get_operation_list = ()=>{
       const { dispatch } = this.props;
       const arr = []
       dispatch({
           type: 'project/operation_list',
           payload: { pageSize:1000, pageNum:1 },
           callback: (res) => {
               if (res.state == 200) {
                   if(res.data.channelInfos && res.data.channelInfos.length > 0) {
                       res.data.channelInfos.filter(item => item.channelId !== '-1').forEach(item => {
                           arr.push({
                               name: item.channelName,
                               key: item.channelId
                           })
                       })
                   }

                   this.setState(prev => ({
                       search_data: prev.search_data.map(item => {
                           if(item.name === 'channelIds') {
                               item.sel_data = arr
                           }
                           return item
                       })
                   }));
               }
           }
       });
   }

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'project/get_member_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.currentPage > 1) {
                      params.currentPage = params.currentPage - 1;
                      this.get_list(params);
                  } else {
                      res.data.list.forEach(element => {
                          element.myRowId = `${element.memberId}-${element.channelId}-${element.companyId}`
                      });
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  //积分操作类型切换 需要更新积分值的最大限制
  updateLimit = (e) => {
      let { pointData } = this.state;
      let pointVal = pointData.filter(item => item.name == 'memberIntegral')[0];
      let targetData = pointData.filter(item => item.name == 'value')[0];
      if (e.target.value == 1) {
      //增加积分
          targetData.max = 99999999;
      } else {
      //减少积分
          targetData.max = pointVal.content;
      }
      this.setState({
          pointData
      });
  };

  //设置积分
  setPoint = (val) => {
      let { pointData } = this.state;
      pointData.forEach(item => {
          if (item.name == 'memberName') {
              item.content = val.memberName;
          } else if (item.name == 'memberIntegral') {
              item.content = val.memberIntegral;
          } else if (item.name == 'value') {
              item.max = 99999999;
          }
      });
      this.setState({
          modalVisible: true,
          type: 'point',
          title: `${sldComLanguage('积分设置')}`,//积分设置
          operateData: pointData,
          curData: val
      });
  };

  //新增会员
  addMember = () => {
      let { addData } = this.state;
      let operateData = getSldCopyData(addData);
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage('新增')}${sldComLanguage('会员')}`,
          operateData,
          curData: {}
      });//新增会员
  };

  //修改密码
  changePwd = (val) => {
      let { changePwdData } = this.state;
      let operateData = getSldCopyData(changePwdData);
      this.setState({
          type: 'changePwd',
          title: `${sldComLanguage('修改会员密码')}`,
          operateData,
          modalVisible: true,
          curData: val
      });//修改会员密码

  };

  //编辑会员
  editMember = (val) => {
      let { addData } = this.state;
      let operateData = getSldCopyData(addData);
      //移除最后两项
      operateData = operateData.filter(this.removePwd);
      for (let i = 0; i < operateData.length; i++) {
          if (operateData[i].name == 'memberName') {
              operateData[i].disable = true;
          }
          operateData[i].initialValue = val[operateData[i].name];
      }
      this.setState({
          type: 'edit',
          title: `${sldComLanguage('编辑')}${sldComLanguage('会员')}`,
          operateData,
          modalVisible: true,
          curData: val
      });//编辑会员
  };

  removePwd = (item) => item.name != 'loginPwd' && item.name != 'confirmPwd';


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
      // 渠道处理
      if(values.channelIds){
          values.channelIds = values.channelIds.join(',')
      }
      for(let i in values){
          if(values[i] == ''){
              delete values[i]
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize,...values }
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

  //会员操作 edit 编辑  point  changePwd 修改密码 switch 修改会员状态
  operateMember = (id, type) => {
      const { params } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = id;
      if (type == 'edit') {
          dis_type = 'member_manage/edit_member';
      } else if (type == 'point') {
          dis_type = 'member_manage/set_member_point';
      } else if (type == 'switch') {
          dis_type = 'member_manage/switch_member_state';
      } else if (type == 'changePwd') {
          dis_type = 'member_manage/change_member_pwd';
      }
      this.setState({ submiting: true });
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
                  this.setState({
                      modalVisible: false
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  sldHandleConfirm = (val) => {
      const { curData, type } = this.state;
      const { dispatch } = this.props;
      let _this = this;
      if (type == 'point') {
          val.memberId = curData.memberId;//会员ID
          this.operateMember(val, 'point');
      } else if (type == 'changePwd') {
          val.memberId = curData.memberId;//会员ID
          if (val.loginPwd != val.confirmPwd) {
              failTip(`${sldComLanguage('两次密码不一致，请重新输入')}`);//两次密码不一致，请重新输入
              return false;
          }
          this.operateMember(val, 'changePwd');
      } else {
      //验证两次密码是否相等
          if (val.loginPwd != val.confirmPwd) {
              failTip(`${sldComLanguage('两次密码不一致，请重新输入')}`);//两次密码不一致，请重新输入
              return;
          }
          if (type == 'edit') {
              val.memberId = curData.memberId;
              this.operateMember(val, 'edit');
          } else {
              val.registerChannel = 5;//会员来源：1、pc；2、H5；3、Android；4、IOS ;5 商城管理平台 ; 6 微信商城
              this.setState({ submiting: true });
              dispatch({
                  type: 'member_manage/add_member_members',
                  payload: val,
                  callback: (res) => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          _this.get_list({ pageSize: pageSize });
                          this.setState({
                              modalVisible: false
                          });
                      } else {
                          failTip(res.msg);
                      }
                      this.setState({ submiting: false });
                  }
              });
          }
      }
  };

  handleSldExcel = () => {
      const { params, formValues,data } = this.state;
      if(data.list != undefined && data.list.length == 0){
          failTip('没有可导出的数据!');
          return 
      }
      let paramData = {
          ...params,
          ...formValues
      };
      paramData.fileName = `${sldComLanguage('会员导出')}`;
      const { dispatch } = this.props;
      this.setState({loading:true})
      dispatch({
          type: 'project/memberListExport',
          payload: paramData,
          callback: (res) => {
              if(res.state!=undefined&&res.state == 89101001){
                  failTip(res.msg);
              }
              this.setState({loading:false})
          }
      })
  };

  render() {
      const {
          selectedRows, search_data, columns, data, loading, operateData, submiting, title, modalVisible, search_height, viewAuth
      } = this.state;
      return (
          <div className={global.common_page}>
              <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('会员')}${sldComLanguage('管理')}`, 0, 0, 10)}{/*会员管理*/}
                  <AuthBtn eventKey={["export_member"]} btnAuth={btnAuth}>
                      <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth}>
                          <Tooltip title="单次支持最大的导出条数10000条"><span>{sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('会员导出')}`, '#fff', 7, 0, 15, 15, 3)}</span></Tooltip>
                      </AuthBtn>
                  </AuthBtn>
              </div>
              <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth} showPage>
                  <div>
                      <div className={global.tableListForm} ref="search_part">
                          <Search
                              search_data={search_data}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                      {/*公共功能条-start*/}
                      {/* 暂时屏蔽，后续待定 */}
                      {/* <div className={global.operate_bg}>
            {sldIconBtn(() => this.addMember(), `${sldComLanguage('新增会员')}`, 7, 0)}
          </div> */}
                      {/*公共功能条-end*/}
                      <Spin spinning={loading}>
                          {/*标准表格-start*/}
                          <StandardTable
                              totalHeight={document.body.clientHeight - 150-search_height-15}
                              selectedRows={selectedRows}
                              data={data}
                              rowKey="myRowId"
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
                  </div>
              </AuthBtn>
              {/*新增/编辑对话框-start*/}
              <SldModal
                  title={title}
                  submiting={submiting}
                  width={500}
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
              />
              {/*新增/编辑对话框-end*/}
          </div>

      );
  }
}
