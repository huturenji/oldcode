import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react'
import { Form, Spin, message, Button, Upload, notification, Tooltip } from 'antd';
import Link from 'umi/link';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import {
    sldIconBtn,
    failTip,
    sucTip,
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_40,
    formItemLayoutModal,
    sldComLanguage,
    sldPopConfirmDiy,
    sldtbaleOpeBtnText,
    sldSearchValClear,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_40;
@connect(({ article }) => ({
    article
}))
@Form.create()
export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            submiting: false,//按钮loading
            loading: false,//按钮loading
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            modalVisible: false,
            title: '',
            search_con: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            addData: [
                {
                    type: 'input',
                    label: `${sldComLanguage('页面名称')}`,//页面名称
                    name: 'name',
                    placeholder: `${sldComLanguage('请输入页面名称')}`,//请输入页面名称
                    initialValue: '',
                    maxLength: 8,
                    extra: `${sldComLanguage('最多输入8个字')}`,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入页面名称')}`//请输入页面名称
                    }]
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('显示名称')}`,//显示名称
                    name: 'showName',
                    placeholder: `${sldComLanguage('请输入显示名称')}`,//请输入页面名称
                    initialValue: '',
                    maxLength: 8,
                    extra: `${sldComLanguage('最多输入8个字')}`,
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入显示名称')}`//请输入页面名称
                    }]
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('页面ID')}`,//页面ID
                    name: 'decoId',
                    placeholder: `${sldComLanguage('请输入页面ID')}`,//请输入页面ID
                    initialValue: '',
                    maxLength: 9,
                    extra: `${sldComLanguage('最多输入9位数字')}`,
                    disable:false,
                    rules: [{
                        required: true,
                        pattern: new RegExp(/^[1-9]{1}[0-9]{0,8}$/),
                        whitespace: true,
                        message: `${sldComLanguage('请输入页面ID,1-9位数字')}`//请输入页面ID
                    }]
                }
            ],//modal框的数据
            columns: [
                {
                    title: ' ',
                    dataIndex: 'id',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => (comm_cur_page - 1) * pageSize + index + 1
                },
                {
                    title: `${sldComLanguage('页面名称')}`,//页面名称
                    align: 'center',
                    dataIndex: 'name',
                    width: 100
                },
                {
                    title: `${sldComLanguage('显示名称')}`,//页面名称
                    align: 'center',
                    dataIndex: 'showName',
                    width: 100
                },
                {
                    title: `${sldComLanguage('页面ID')}`,//页面ID
                    align: 'center',
                    dataIndex: 'decoId',
                    width: 100
                },
                {
                    title: `${sldComLanguage('创建时间')}`,//创建时间
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('更新时间')}`,//更新时间
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={['deco_topic_deco']} btnAuth={btnAuth}>

                                {this.diyLinkButton(record)}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <AuthBtn eventKey={['edit_topic_deco']} btnAuth={btnAuth}>

                                {sldtbaleOpeBtnText(sldComLanguage('编辑'), () => this.editMDiyPage(record))}{/*编辑*/}
                            </AuthBtn>
                            {/* <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateMDiyPage(record.decoId, 'copy'))} */}
                            <AuthBtn eventKey={['delete_topic_deco']} btnAuth={btnAuth}>

                                <span className={global.splitLine} />
                                {
                                    record.decoId>0?
                                        sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateMDiyPage(record.decoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null)) : '删除'//删除后不可恢复，是否确定删除？
                                }
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ],
            isTableCheck: false,
            fileLoaing: false
        };
    }

    componentDidMount() {
        let { getChild } = this.props
        getChild('topic', this)
        this.get_list({ pageSize: pageSize });
    }

    componentWillUnmount() {}

    // 装修按钮
    diyLinkButton = (data) => {
        const { id } = this.props
        return (
            <Link to={{
                pathname: '/decorate_m/lists_to_diy_topic',
                query: {
                    id: data.decoId,
                    type: 'topic',
                    source: '/decorate_m/topic_lists',
                    channelId: id
                }
            }}
            >
                {sldtbaleOpeBtnText(`${sldComLanguage('装修')}`, () => null)}
            </Link>
        )
    }

    channelChange = () => {
        comm_cur_page = 1
        this.setState({ params: { pageSize: pageSize } }, () => {
            this.get_list({ pageSize: pageSize });
        });
        this.importCancel()
    }

    //获取数据列表
    get_list = (params) => {
        const { dispatch, id } = this.props;
        dispatch({
            type: 'mdecorate/get_diy_page_lists',
            payload: { ...params, type: 'topic', channelId: id },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if (res.data.list.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        this.get_list(params);
                    } else {
                        this.setState({
                            data: res.data,
                            isReset: false
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
            comm_cur_page = pagination.current;
            this.setState({ params });
            this.get_list(params);
        }
    };

    //装修页面操作，edit 编辑，del 删除，enable 启用/禁用  copy 复制
    operateMDiyPage = (decoId, type) => {
        const { dispatch, id } = this.props;
        let dis_type = '';
        let params = { decoId: decoId, channelId: id };
        if (type == 'edit') {
            dis_type = 'mdecorate/edit_m_diy_page';
            params = decoId;
        } else if (type == 'del') {
            dis_type = 'mdecorate/del_m_diy_page';
        } else if (type == 'copy') {
            dis_type = 'mdecorate/copy_m_diy_page';
        } else if (type == 'enable') {
            dis_type = 'mdecorate/set_m_diy_page';
            params = decoId;
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
                this.setState({ submiting: false });
            }
        });
    };

    sldHandleConfirm = (val) => {
        this.setState({ submiting: true });
        const { curData, type } = this.state;
        const { dispatch, id } = this.props;
        val.type = 'topic';
        val.channelId = id;
        if (type == 'edit') {
            val.decoId = curData.decoId;
            this.operateMDiyPage(val, 'edit');
        } else {
            val.data = '';
            dispatch({
                type: 'mdecorate/add_m_diy_page',
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

    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    //新增功能
    addMDiyPage = () => {
        let { addData } = this.state;
        let decoIdIndex = addData.findIndex(item=>item.name=='decoId');
        for (let i = 0; i < addData.length; i++) {
            addData[i].initialValue = '';
            addData[decoIdIndex].disable = false;
        }
        this.setState({
            modalVisible: true,
            type: 'add',
            title: `${sldComLanguage('添加专题装修')}`,
            addData: addData
        });//添加专题装修
    };

    //编辑功能
    editMDiyPage = (record) => {
        let { addData } = this.state;
        let decoIdIndex = addData.findIndex(item=>item.name=='decoId');
        for (let i = 0; i < addData.length; i++) {
            addData[i].initialValue = record[addData[i].name];
            addData[decoIdIndex].disable = true;
        }
        this.setState({
            modalVisible: true,
            type: 'edit',
            title: `${sldComLanguage('编辑专题装修')}`,
            addData: addData,
            curData: record
        });//添加专题装修
    };

    //搜索
    sldSearch = (val) => {
        this.setState({
            formValues: { name: val },
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize, name: val });
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
        this.sldSearch('');
    };

    // 导出功能
    renderImportBox = () => {
        let { isTableCheck, fileLoading } = this.state;
        let tmp = ''

        const upProps = {
            name: 'file', //发到后台的文件参数名
            headers: { Authorization: 'SID' }, // 
            showUploadList: false,
            accept: '.zip',
            beforeUpload: this.beforeUploadFun
        }

        const importBtn = () => (
            <span>
                <Tooltip placement="top" title="导出：页面名称，显示名称，页面id和装修数据；导入：如果在该渠道下已存在数据的id或页面名称，那这条数据将会导入失败！">
                    <img src={require('@/assets/img/statistics/pv_icon.png')} alt='' />
                </Tooltip>
                <Upload {...upProps}>
                    <Button style={{marginLeft: '10px'}} type="primary" loading={fileLoading}>导入装修数据</Button>
                </Upload>
            </span>
        )

        if (isTableCheck) {
            tmp = (
                <div style={{position: 'absolute', right: 10}}>
                    { importBtn() }
                    <Button style={{marginLeft: '10px'}} type="primary" onClick={() => this.exportPage()}>导出</Button>
                    <Button style={{marginLeft: '10px'}} type="primary" onClick={() => this.importCancel()}>取消</Button>
                </div>
            )
        } else {
            tmp = (
                <div style={{position: 'absolute', right: 10}}>
                    <AuthBtn eventKey={['import_topic_deco']} btnAuth={btnAuth}>
                        { importBtn() }
                    </AuthBtn>
                    <AuthBtn eventKey={['export_topic_deco']} btnAuth={btnAuth}>
                        <Button style={{marginLeft: '10px'}} type="primary" onClick={() => this.setState({isTableCheck: true})}>导出装修数据</Button>
                    </AuthBtn>
                </div>
            )
        }
        return tmp
    }

    importCancel = () => {
        this.setState({
            isTableCheck: false,
            selectedRows: [],
            selectedRowKeys: []
        })
    }

    exportPage = () => {
        const { selectedRows } = this.state
        if(selectedRows.length === 0) {
            message.warning('请勾选装修数据！')
            return
        }
        let list = selectedRows.map(item => {
            let obj = {
                decoId: item.decoId,
                name: item.name,
                showName: item.showName,
                type: item.type,
                data: item.data ? JSON.parse(item.data) : []
            }
            return obj
        })
        var export_blob = new Blob([JSON.stringify(list)]);
        const Zip = new JSZip();
        Zip.file("index.txt", export_blob);
        Zip.generateAsync({type:"blob"}).then((files) => {
            FileSaver.saveAs(files , `批量装修数据.zip`);//后缀名为tar、zip都可
        })
    }

    beforeUploadFun = (file,fileList) => {
        fileList = fileList.slice(-1);
        const isZip = file.name.split('.')[file.name.split('.').length - 1] === 'zip';
        if (!isZip) {
            message.error('请上传zip文件!');
            return false
        }
        let new_zip = new JSZip();
        new_zip.loadAsync(fileList[0]).then(() => {
            // 你现在已经有加载的zip中包含的每个文件
            if(!!new_zip.file("index.txt")){
                new_zip.file("index.txt").async("string").then(content => {
                    //得到我们需要的JSON文件内容
                    let dataList = JSON.parse(content)
                    if(Array.isArray(dataList)) {
                        this.setState({ fileLoading: true })
                        let requestList = dataList.map(item => this.addDataItem(item))
                        Promise.allSettled(requestList).then(list => {
                            this.uploadFn(list)
                        })
                    } else {
                        message.error('zip文件数据有问题!');
                    }
                });
            } else {
                message.error('zip文件中必须包含index.txt!');
                return false
            }
        });
    }

    addDataItem = (data) => {
        const { dispatch, id } = this.props;
        return new Promise((resolve, reject) => {
            let query = {
                name: data.name,
                showName: data.showName,
                decoId: data.decoId,
                type: 'topic',
                channelId: id,
                data: ''
            }
            dispatch({
                type: 'mdecorate/add_m_diy_page',
                payload: query,
                callback: (res) => {
                    if (res.state == 200) {
                        query.data = JSON.stringify(data.data)
                        dispatch({
                            type: 'mdecorate/edit_m_diy_page',
                            payload: query,
                            callback: (result) => {
                                if (result.state == 200) {
                                    resolve(`${data.name} 导入成功！`)
                                } else {
                                    reject(`${data.name} ${result.msg}`)
                                }
                            }
                        });
                    } else {
                        reject(`${data.name} ${res.msg}`)
                    }
                }
            });
        })
    }

    uploadFn = (list) => {
        this.channelChange()
        this.setState({ fileLoading: false })
        const msgDom = (
            <div style={{maxHeight: '250px', 'overflowY': 'auto'}}>
                {list.map(item => (
                    <div style={{color: item.value ? '#52c41a' : '#ff4d4f', margin: '2px 0' }}>{item.value || item.reason}</div>
                ))}
            </div>
        )
        notification.open({
            message: '导入结果',
            description: msgDom,
            onClick: () => {},
            duration: null
        })
    }

    render() {
        const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, search_con, isTableCheck } = this.state;
        return (
            <div className={global.common_page}>
                <Spin spinning={loading}>
                    { /*公共功能条-start*/}
                    <div className={global.operate_bg} style={{ position: 'relative' }}>
                        <AuthBtn eventKey={['add_topic_deco']} btnAuth={btnAuth}>

                            {sldIconBtn(() => this.addMDiyPage(), `${sldComLanguage('新建页面')}`, 7, 7)}{/*新增*/}
                        </AuthBtn>
                        {sldSearchValClear(`${sldComLanguage('请输入页面名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
                        { this.renderImportBox() } {/*新增*/}
                    </div>
                    { /*公共功能条-end*/}
                    { /*标准表格-start*/}
                    <div style={{color:'red',fontWeight:'bold',fontSize:16}}>
                    专题装修必须页面：领券中心（页面ID为2000001）
                    </div>
                    <StandardTable
                        totalHeight={document.body.clientHeight - 200 - 45}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="decoId"
                        isCheck={isTableCheck}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize
                        pageSizeOption={['10', '20', '30', '40']}
                    />
                    { /*标准表格-end*/}
                    { /*新增/编辑对话框-start*/}
                    <SldModal
                        title={title}
                        submiting={submiting}
                        modalVisible={modalVisible}
                        sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                        sldHandleCancle={this.sldHandleCancle}
                        formItemLayoutModal={formItemLayoutModal}
                        content={addData}
                    />
                    { /*新增/编辑对话框-end*/}
                </Spin>
            </div>
        );
    }
}
