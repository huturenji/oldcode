import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import Link from 'umi/link';
// import QRCode from 'qrcode.react';
import {
    sldIconBtn,
    failTip,
    sucTip,
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_10,
    formItemLayoutModal,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldPopConfirmDiy,
    getSldCopyData,
    sldSearchValClear,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_10;
@connect(({ article }) => ({
    article
}))
@Form.create()
export default class Lists extends Component {
    modal_tip = [
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的图片,图片不可以超过1M,否则影响页面加载效果')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
    
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
                    placeholder: `${sldComLanguage('请输入页面名称')}`,
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
                    label: `${sldComLanguage('页面ID')}`,//页面ID
                    name: 'decoId',
                    placeholder: `${sldComLanguage('请输入页面ID')}`,//请输入页面ID
                    initialValue: '',
                    maxLength: 9,
                    extra: `${sldComLanguage('最多输入9个数字')}`,
                    disable:false,
                    rules: [{
                        required: true,
                        pattern:new RegExp(/^[1-9]{1}[0-9]{0,8}$/),
                        whitespace: true,
                        message: `${sldComLanguage('请输入页面ID,1-9位数字')}`//请输入页面ID
                    }]
                }
            ],//modal框的数据
            columns: [
                {
                    title: ' ',
                    dataIndex: 'decoId',
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
                    title: `${sldComLanguage('创建时间')}`,//创建时间
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                }, {
                    title: `${sldComLanguage('更新时间')}`,//更新时间
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 150
                },
                // {
                //     title: `${sldComLanguage('Android')}`,//Android
                //     width: 80,
                //     align: 'center',
                //     dataIndex: 'android',
                //     render: (text, record) => <Switch
                //         checked={text == 1 ? true : false}
                //         onChange={(val) => this.handleSetEnable(val, record.decoId, 'android')}
                //     />
                // },
                // {
                //     title: `${sldComLanguage('IOS')}`,//IOS
                //     dataIndex: 'ios',
                //     align: 'center',
                //     width: 80,
                //     render: (text, record) => <Switch
                //         checked={text == 1 ? true : false}
                //         onChange={(val) => this.handleSetEnable(val, record.decoId, 'ios')}
                //     />
                // },
                {
                    title: `${sldComLanguage('微商城')}`,//H5
                    dataIndex: 'h5',
                    align: 'center',
                    width: 80,
                    render: (text, record) => <Switch
                        disabled={!hasAuth('switch_home_deco')}
                        checked={text == 1 ? true : false}
                        onChange={(val) => this.handleSetEnable(val, record.decoId, 'h5')}
                    />
                }, {
                    title: `${sldComLanguage('微信小程序')}`,//是否推荐
                    dataIndex: 'weixinXcx',
                    align: 'center',
                    width: 80,
                    render: (text, record) => <Switch
                        disabled={!hasAuth('switch_home_deco')}
                        checked={text == 1 ? true : false}
                        onChange={(val) => this.handleSetEnable(val, record.decoId, 'weixinXcx')}
                    />
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={['deco_home_deco']} btnAuth={btnAuth}>
                                {this.diyLinkButton(record)}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <AuthBtn eventKey={['edit_home_deco']} btnAuth={btnAuth}>

                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editMDiyPage(record))}{/*编辑*/}
                            </AuthBtn>
                            {/* <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => this.operateMDiyPage(record.decoId, 'copy'))}复制 */}
                            <AuthBtn eventKey={['set_img_home_deco']} btnAuth={btnAuth}>

                                <span className={global.splitLine} />
                                {sldtbaleOpeBtnText(`${sldComLanguage('开屏图')}`, () => this.addScreenAdv(record))}
                            </AuthBtn>
                            <AuthBtn eventKey={['delete_home_deco']} btnAuth={btnAuth}>

                                <span className={global.splitLine} />
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateMDiyPage(record.decoId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))//删除后不可恢复，是否确定删除？
                                }
                            </AuthBtn>
                            {/*扫描查看效果*/}
                            {/* <span className={global.splitLine}></span>
              <Popover placement="leftBottom" content={<QRCode value={record.previewUrl}/>}
                       title={'扫描查看效果'}>
                {
                  sldtbaleOpeBtnText('预览', () => null)
                }
              </Popover> */}
                        </Fragment>
                    )
                }
            ],
            screen_data: [],//开屏图数据
            origion_data: {
                width: 580,
                height: 776,
                admin_show_width: 290,
                admin_show_height: 388,
                data: [{
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: '',
                    width:0,
                    height:0
                }]
            },//多图选择器的数据
            modalTitle: ''
        };
    }

    componentDidMount() {
        let { getChild } = this.props
        getChild('home', this)
        this.get_list({ pageSize: pageSize });
    }

    componentWillUnmount() {}

    // 装修按钮
    diyLinkButton = (data) => {
        const { id } = this.props
        return (
            <Link to={{
                pathname: '/decorate_m/lists_to_diy',
                query: {
                    id: data.decoId,
                    type: 'home',
                    source: '/decorate_m/lists',
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
    }

    //获取数据列表
    get_list = (params) => {
        const { dispatch, id } = this.props;
        dispatch({
            type: 'mdecorate/get_diy_page_lists',
            payload: { ...params, type: 'home', channelId: id },
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
            this.setState({ params });
            this.get_list(params);
        }
    };

    //开关操作
    handleSetEnable = (val, decoId, os) => {
        const { id } = this.props
        let params = {};
        params.decoId = decoId;
        params.isUse = val ? 1 : 0;
        params.os = os;
        params.channelId = id;
        this.operateMDiyPage(params, 'enable');
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
        val.type = 'home';
        val.channelId = id
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
        this.setState({ modalVisible: false, modalVisibleAdv: false });
    };

    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    //新增功能
    addMDiyPage = () => {
        let { addData } = this.state;
        for (let i = 0; i < addData.length; i++) {
            addData[i].initialValue = '';
            addData[1].disable = false
        }
        this.setState({
            modalVisible: true,
            type: 'add',
            title: `${sldComLanguage('添加首页装修')}`,
            addData: addData
        });//添加首页装修
    };

    //编辑功能
    editMDiyPage = (record) => {
        let { addData } = this.state;
        for (let i = 0; i < addData.length; i++) {
            addData[i].initialValue = record[addData[i].name];
            addData[1].disable = true
        }
        this.setState({
            modalVisible: true,
            type: 'edit',
            title: `${sldComLanguage('编辑首页装修')}`,
            addData: addData,
            curData: record
        });//添加首页装修
    };

    //设置开屏图
    addScreenAdv = (val) => {
        let { modalTitle, screen_data, origion_data } = this.state;
        screen_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
        if (val.showTip != null && val.showTip) {
            modalTitle = `${sldComLanguage('编辑开屏图')}`;
            let adv_data = JSON.parse(val.showTip);
            for (let i = 0; i < screen_data.data.length; i++) {
                screen_data.data[i] = adv_data[i];
            }
        } else {
            modalTitle = `${sldComLanguage('设置开屏图')}`;
        }
        
        for (let i = 0; i < screen_data.data.length; i++) {
            if (!screen_data.data[i].marginList || screen_data.data[i].marginList.length==0) { 
                screen_data.data[i].marginList = [0,0,0,0]
            }
            // 有效期限
            if (screen_data.data[i].deadline==null || screen_data.data[i].deadline==undefined) {
                screen_data.data[i].deadline = []
            }
            // 每天最大展示次数
            if (!screen_data.data[i].maxShowTime) {
                screen_data.data[i].maxShowTime = ''
            }
        }
        this.setState({
            modalVisibleAdv: true,
            modalTitle,
            screen_data: screen_data,
            curData: val
        });
    };

    //开屏图确认事件
    sldHandleConfirmScreenAdv = (val) => {
        const { id } = this.props
        let { curData } = this.state;
        let param = {};
        param.decoId = curData.decoId;
        param.type = 'home';
        param.channelId = id;
        val.forEach((item)=>{
            item.url = item.link_value
            item.url_type = item.link_type
        })
        param.showTip = JSON.stringify(val);
        this.operateMDiyPage(param, 'edit');
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

    render() {
        const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, search_con, modalTitle, modalVisibleAdv, screen_data } = this.state;
        return (
            <div className={global.common_page}>
                <Spin spinning={loading}>
                    { /*公共功能条-start*/}
                    <div className={global.operate_bg}>
                        <AuthBtn eventKey={['add_home_deco']} btnAuth={btnAuth}>
                            {sldIconBtn(() => this.addMDiyPage(), `${sldComLanguage('新建页面')}`, 7, 7)}{/*新增*/}
                        </AuthBtn>
                        {sldSearchValClear(`${sldComLanguage('请输入页面名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
                    </div>
                    { /*公共功能条-end*/}
                    { /*标准表格-start*/}
                    <StandardTable
                        totalHeight={document.body.clientHeight - 200 - 15}
                        selectedRows={selectedRows}
                        data={data}
                        rowKey="decoId"
                        isCheck={false}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize
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
                        defaultSolt={this.defaultSolt}
                    />
                    { /*新增/编辑对话框-end*/}
                </Spin>
                <SldDiyMoreImgModal
                    width={1000}
                    title={modalTitle}
                    sldSeleSingleRow
                    submiting={submiting}
                    modalVisible={modalVisibleAdv}
                    sldHandleConfirm={(val) => this.sldHandleConfirmScreenAdv(val)}
                    sldHandleCancle={this.sldHandleCancle}
                    content={screen_data}
                    modal_tip={this.modal_tip}
                    client="mobile"
                />
            </div>
        );
    }
}
