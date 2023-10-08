import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Input, Form, Spin, Popover, Switch,InputNumber } from 'antd';
import {
    sldIconBtn,
    failTip,
    sucTip,
    sldPopConfirmDiy,
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_10,
    formItemLayoutModal,
    list_com_page_more,
    sldSvgIcon,
    validatorNumbe,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    setStorage,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import router from 'umi/router';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class Instance_template_lists extends Component {
    sele_tpl_data = {
        type: 'sele_tpl_type',
        handleTabChange(val) {
            sthis.handleTabChange(val);
        },
        handle_sele_tpl(val) {
            sthis.handle_sele_tpl(val);
        },
        activeKey: '',//默认第一个模板分类
        sele_tpl_info: {},//选中的模板信息
        data_left: [],//模板分类列表
        data_right: []//模板列表
    };//选择模板数据信息

    sele_tpl_title = {
        type: 'show_subtitle',
        color: '#ff7e28',
        name: `${sldComLanguage('选择模板')}`,
        distance: {
            left: 5,
            top: 10,
            right: 5,
            bottom: 10
        }
    };//选择模板的标题

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            search_height:0,
            formValues: {},//搜索条件
            submiting: false,//按钮loading
            loading: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            modalVisible: false,
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('实例化名称')}`,
                name: 'name',
                placeholder: `${sldComLanguage('实例化名称')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('使用状态')}`,
                name: 'isEnable',
                placeholder: `${sldComLanguage('请选择使用状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('启用')}` },
                    { key: '0', name: `${sldComLanguage('禁用')}` }
                ]
            }, {
                type: 'select',
                label: `${sldComLanguage('模板类型')}`,
                name: 'tplType',
                placeholder: `${sldComLanguage('请选择模板类型')}`,
                sel_data: [],
                sele_key: 'type',
                sele_name: 'typeName',
                diy: true
            }, {
                type: 'select',
                label: `${sldComLanguage('模板布局')}`,
                name: 'tplId',
                placeholder: `${sldComLanguage('请选择模板布局')}`,
                sel_data: [],
                sele_key: 'tplPcId',
                sele_name: 'name',
                diy: true
            }],//搜索数据
            addData: [{
                type: 'show_subtitle',
                color: '#ff7e28',
                name: `${sldComLanguage('基本信息')}`,
                distance: {
                    left: 5,
                    top: 5,
                    right: 5,
                    bottom: 10
                }
            }, {
                type: 'input',
                label: `${sldComLanguage('实例化模板名称')}`,
                name: 'name',
                placeholder: `${sldComLanguage('请输入实例化模板名称')}`,
                initialValue: '',
                maxLength:20,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入实例化模板名称')}`
                }]
            }, {
                type: 'inputnum',
                label: `${sldComLanguage('排序')}`,
                name: 'sort',
                placeholder: `${sldComLanguage('请输入排序')}`,
                extra: `${sldComLanguage('请输入0~255的数字,数据越小显示越靠前')}`,
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('排序必填')}`
                }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }]
            }
            ],//modal框的数据
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    dataIndex: 'dataId',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('实例化模板名称')}`,
                    align: 'center',
                    dataIndex: 'name',
                    width: 150,
                    render: (text, record) => (
                        <Fragment>
                            <div className={global.flex_com_space_between}>
                                {record.is_edit_name != undefined && record.is_edit_name
                                    ? <Input
                                        maxLength={20}
                                        onChange={(e) => this.edit_filed_con(record.dataId, 'name', e.target.value)}
                                        defaultValue={text}
                                    />
                                    : <span>{text}</span>
                                }
                                {record.is_edit_name != undefined && record.is_edit_name
                                    ? <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_edit"]}><a
                                        className={global.flex_com_column}
                                        href="javascript:void(0)"
                                        style={{ marginLeft: 7 }}
                                        onClick={() => this.save_edit_filed(record, 'name', text)}
                                    >{sldSvgIcon('#FA6F1E', 16, 16, 'xuanzhong')}</a></AuthBtn>
                                    : <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_edit"]}><a
                                        className={global.flex_com_column}
                                        href="javascript:void(0)"
                                        style={{ marginLeft: 7 }}
                                        onClick={() => this.edit_filed(record.dataId, 'is_edit_name', 'true')}
                                    >{sldSvgIcon('#FA6F1E', 16, 16, 'edit')}</a></AuthBtn>
                                }
                            </div>
                        </Fragment>
                    )
                },
                {
                    title: `${sldComLanguage('模板类型')}`,
                    dataIndex: 'tplPcTypeName',
                    align: 'center',
                    width: 80
                }, {
                    title: `${sldComLanguage('模板布局')}`,
                    dataIndex: 'tplPcName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('排序')}`,
                    dataIndex: 'sort',
                    align: 'center',
                    width: 80,
                    render: (text, record) => (
                        <Fragment>
                            <div className={global.flex_com_space_between}>
                                {record.is_edit_sort != undefined && record.is_edit_sort
                                    ? <InputNumber
                                        min={0}
                                        max={255}
                                        onChange={(e) => this.edit_filed_con(record.dataId, 'sort', e)}
                                        defaultValue={text}
                                    />
                                    : <span>{text}</span>
                                }
                                {record.is_edit_sort != undefined && record.is_edit_sort
                                    ? <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_edit"]}><a
                                        className={global.flex_com_column}
                                        href="javascript:void(0)"
                                        style={{ marginLeft: 7 }}
                                        onClick={() => this.save_edit_filed(record, 'sort', text)}
                                    >{sldSvgIcon('#FA6F1E', 16, 16, 'xuanzhong')}</a></AuthBtn>
                                    : <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_edit"]}><a
                                        className={global.flex_com_column}
                                        href="javascript:void(0)"
                                        style={{ marginLeft: 7 }}
                                        onClick={() => this.edit_filed(record.dataId, 'is_edit_sort', 'true')}
                                    >{sldSvgIcon('#FA6F1E', 16, 16, 'edit')}</a></AuthBtn>
                                }
                            </div>
                        </Fragment>
                    )
                },
                {
                    title: `${sldComLanguage('创建时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                }, {
                    title: `${sldComLanguage('更新时间')}`,
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('启用状态')}`,
                    dataIndex: 'isEnable',
                    align: 'center',
                    width: 80,
                    render: (text, record) => <Switch
                        disabled={!hasAuth('instantiate_edit')}
                        checked={text == 1 ? true : false}
                        onChange={(val) => this.handleSetEnable(val, record.dataId)}
                    />
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_edit"]}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.diyTpl(record))}
                                <span className={global.splitLine} />

                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateInstanceTpl(record.dataId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateInstanceTpl(record.dataId,'copy'))}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <Popover
                                placement="leftBottom"
                                content={<div
                                    className={global.com_zoom}
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{ __html: record.html }}
                                />}
                                title={`${sldComLanguage('装修模版效果预览')}`}
                            >
                                {
                                    sldtbaleOpeBtnText(`${sldComLanguage('预览')}`, null)
                                }
                            </Popover>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.get_tpl_type_list();
        this.get_tpl_list('');
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

    //获取所有模板类型列表
    get_tpl_type_list = () => {
        const { dispatch } = this.props;
        let { search_data } = this.state;
        dispatch({
            type: 'pc_home/get_tpl_type_list',
            callback: (res) => {
                if (res.state == 200) {
                    if(res.data.length != 0){
                        this.sele_tpl_data.data_left = res.data;
                        this.sele_tpl_data.activeKey = res.data[0].type;
                        this.get_tpl_list(res.data[0].type, 'first');
                        for(let i = 0; i < search_data.length; i++) {
                            if (search_data[i].name == 'tplType') {
                                search_data[i].sel_data = res.data;
                                break;
                            }
                        }
                        this.setState({ search_data });
                    }
                }
            }
        });
    };

    //根据模板类型获取该类型下的模板
    get_tpl_list = (tpl_type, type = '') => {
        const { dispatch } = this.props;
        let { addData,search_data } = this.state;
        let param = {};
        if(tpl_type){
            param.type = tpl_type;
        }
        param.pageSize = list_com_page_more;
        dispatch({
            type: 'pc_home/get_tpl_list',
            payload: param,
            callback: (res) => {
                if(tpl_type == ''){
                    //用于搜索
                    for(let i=0;i<search_data.length;i++){
                        if(search_data[i].name == 'tplId'){
                            search_data[i].sel_data = res.data.list;
                            break;
                        }
                    }
                    this.setState({search_data})
                }
                if (type == 'first') {
                    if (res.state == 200) {
                        this.sele_tpl_data.data_right = res.data.list;
                    } else {
                        this.sele_tpl_data.data_right = [];
                    }
                } else {
                    addData.forEach(item => {
                        if (item.type == 'sele_tpl_type') {
                            item.data_right = [];
                            if (res.state == 200) {
                                item.data_right = res.data.list;
                            }
                        }
                    });
                    this.setState({ addData });

                }

            }
        });
    };

    //获取数据列表
    get_list = (params) => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'pc_home/get_tpl_instance_list',
            payload: params,
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

    //保存表格列的内容
    save_edit_filed = (record, filed, value) => {
        let { data } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'pc_home/edit_instance_tpl',
            payload: { dataId: record.dataId, name: record.name, sort: record.sort },
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    let tmp = data.list.filter(item => item.dataId == record.dataId)[0];
                    tmp[filed] = value;
                    tmp.is_edit_name = false;
                    tmp.is_edit_sort = false;
                    this.setState({ data });
                } else {
                    failTip(res.msg);
                }
            }
        });

    };

    //编辑表格列的内容
    edit_filed_con = (id, filed, value) => {
        let { data } = this.state;
        let tmp = data.list.filter(item => item.dataId == id)[0];
        tmp[filed] = value;
        this.setState({ data });
    };

    //编辑表格列内容
    edit_filed = (id, filed, flag) => {
        let { data } = this.state;
        let tmp = data.list.filter(item => item.dataId == id)[0];
        tmp[filed] = flag;
        this.setState({ data });
    };


    //装修模板切换
    handleTabChange = (val) => {
        let { addData } = this.state;
        addData.forEach((item) => {
            if (item.type == 'sele_tpl_type') {
                item.activeKey = val;
            }
        });
        this.setState({ addData });
        this.get_tpl_list(val);
    };

    //装修模板的选择
    handle_sele_tpl = (val) => {
        let { addData } = this.state;
        addData.forEach((item) => {
            if (item.type == 'sele_tpl_type') {
                item.sele_tpl_info = val;
            }
        });
        this.setState({ addData });
    };

    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    handleTablePagination = (pagination, filtersArg, sorter) => {
        const { formValues } = this.state;
        const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
        pageSize = params.pageSize;
        this.setState({
            params: params
        });
        this.get_list(params);
    };

    //新增数据
    addData = () => {
        let { addData } = this.state;
        addData = addData.filter(item => item.type != 'sele_tpl_type' && item.name != `${sldComLanguage('选择模板')}`);
        addData.forEach(item => {
            if (item.type != 'show_subtitle') {
                item.initialValue = '';
            }
        });
        addData.push(this.sele_tpl_title);
        addData.push(this.sele_tpl_data);
        this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加装修模板')}`, addData: addData });
    };

    //编辑数据
    editData = (val) => {
        let { addData } = this.state;
        addData = addData.filter(item => item.type != 'sele_tpl_type' && item.name != `${sldComLanguage('选择模板')}`);
        addData.forEach(item => {
            if (item.type != 'show_subtitle') {
                item.initialValue = val[item.name];
            }
        });
        //编辑装修模板基本信息
        this.setState({ type: 'edit', title: `${sldComLanguage('编辑装修模板基本信息')}`, addData: addData, modalVisible: true, curData: val });
    };

    //模板装修
    diyTpl = (val) => {
        //装修数据存缓存
        val.back_route = '/diy/instance_template_lists';
        setStorage('pc_diy_tpl', JSON.stringify(val));
        router.push('/store/decorate_pc_instance_template_lists_to_edit');
    };

    sldHandleConfirm = (val) => {
        const { curData, type, addData } = this.state;
        const { dispatch } = this.props;
        if (type == 'edit') {
            val.dataId = curData.dataId;
            this.operateInstanceTpl(val, 'edit');
        } else {
            let sele_tpl_info = addData.filter(item => item.type == 'sele_tpl_type')[0].sele_tpl_info;
            val.html = sele_tpl_info.data;
            val.json = sele_tpl_info.defaultData;
            val.tplPcId = sele_tpl_info.tplPcId;
            if(val.tplPcId == undefined){
                failTip(`${sldComLanguage('请选择模板')}`);
                return false;
            }
            this.setState({ submiting: true });
            dispatch({
                type: 'pc_home/add_instance_tpl',
                payload: val,
                callback: (res) => {
                    if (res.state == 200) {
                        sucTip(res.msg);
                        this.get_list({ pageSize: pageSize });
                        this.setState({
                            modalVisible: false,
                            params: { pageSize: pageSize }
                        });
                    } else {
                        failTip(res.msg);
                    }
                    this.setState({ submiting: false });
                }
            });
        }
    };

    sldHandleCancle = () => {
        this.setState({ modalVisible: false });
    };

    //搜索事件
    search = (data) => {
        const values = { ...data };
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

    //是否启用
    handleSetEnable = (val, id) => {
        this.operateInstanceTpl({ dataId: id, isEnable: val }, 'enable');
    };


    //实例化模板操作，edit 编辑，del 删除，enable 启用/禁用, diy 装修 copy 复制
    operateInstanceTpl = (id, type) => {
        const { dispatch } = this.props;
        let dis_type = '';
        let params = { dataId: id };
        if (type == 'add') {
            dis_type = 'pc_home/add_home_flash';
            params = id;
        } else if (type == 'edit') {
            dis_type = 'pc_home/edit_instance_tpl';
            params = id;
        } else if (type == 'del') {
            dis_type = 'pc_home/del_instance_tpl';
        } else if (type == 'copy') {
            dis_type = 'pc_home/copy_instance_tpl';
        } else if (type == 'enable') {
            dis_type = 'pc_home/enable_instance_tpl';
            params = id;
        }
        dispatch({
            type: dis_type,
            payload: params,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(this.state.params);
                    this.setState({
                        modalVisible: false
                    });
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    render() {
        const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, type, search_data, search_height } = this.state;
        return (
            <AuthBtn btnAuth={btnAuth} eventKey={["instantiate_view"]} showPage>
                <div className={global.common_page} style={{padding:0}}>
                    <Spin spinning={loading}>
                        <div className={global.tableListForm} ref="search_part">
                            <Search
                                search_data={search_data}
                                seaSubmit={(datas) => this.search(datas)}
                                seaReset={() => this.seaReset()}
                            />
                        </div>
                        {/*公共功能条-start*/}
                        {hasAuth("instantiate_add")&&<div className={global.operate_bg}>
                            {sldIconBtn(() => this.addData(), `${sldComLanguage('添加装修模板')}`, 7, 7)}
                        </div>}
                        {/*公共功能条-end*/}
                        {/*标准表格-start*/}
                        <StandardTable
                            totalHeight={document.body.clientHeight - 190-search_height-15}
                            selectedRows={selectedRows}
                            data={data}
                            rowKey="dataId"
                            isCheck={false}
                            columns={columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                            isColumnResize
                        />
                        {/*标准表格-end*/}
                        {/*新增/编辑对话框-start*/}
                        <SldModal
                            width={type == 'add' ? 900 : 600}
                            title={title}
                            sldSeleSingleRow
                            submiting={submiting}
                            modalVisible={modalVisible}
                            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                            sldHandleCancle={this.sldHandleCancle}
                            formItemLayoutModal={formItemLayoutModal}
                            content={addData}
                        />
                        {/*新增/编辑对话框-end*/}
                    </Spin>

                </div>
            </AuthBtn>
        );
    }
}
