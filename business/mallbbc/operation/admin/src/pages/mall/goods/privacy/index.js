import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    dragSldTableColumn,
    sldComLanguage,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
@connect(({ privacy }) => ({
    privacy
}))
@Form.create()
export default class CateLists extends Component {
    cat_data = {
        type: 'TreeSelectDIy',
        label: `${sldComLanguage('上级分类')}`,//上级分类
        name: 'pid',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('上级分类')}`,//请选择上级分类
        initialValue: '',
        help: `${sldComLanguage('默认为最顶级')}`,//默认为最顶级
        disabled: false,
        data: [],
        sele_key: 'categoryId',
        sele_name: 'categoryName',
        allowClear: true
    };

    constructor(props) {
        super(props);
        this.state = {
            expandedRowKeys: [],//展开的行
            data: {},
            formValues: {},
            loading: false,//按钮loading
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: {},//搜索条件
            privacyCount: 0,
            columns: [
                {
                    title: `${sldComLanguage('分类名称')}`,//分类名称
                    align: 'left',
                    dataIndex: 'categoryName',
                    width: 200
                },
                {
                    title: `${sldComLanguage('在售/全部商品')}`,
                    dataIndex: 'onSaleGoodsNum',
                    align: 'center',
                    width: 120,
                    render: (text, record) => <div>{text}/{record.totalGoodsNum}</div>
                },
                {
                    title: `${sldComLanguage('是否设为隐私')}`,// 是否设为隐私
                    align: 'center',
                    width: 100,
                    render: (text, record) => <div><Switch disabled={!hasAuth('edit_privacy_cate')} checked={record.privacyState === 2} onChange={(checked)=>{this.updatePrivacy(record, checked)}} /></div>
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ categoryId: 0 }); // grade为1表示获取一级数据
        this.get_count()
    }

    //获取数据列表
    get_list = (params, grade = '') => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        let { data, expandedRowKeys } = this.state;

        dispatch({
            type: 'privacy/get_privacyCategory_list',
            payload: params,
            callback: (res) => {
                this.setState({ loading: false });
                let list = res.data.goodsPrivacyCategoryResponseList
                // 数据上添加pid字段
                list.forEach(item => item.pid = params.categoryId)
                // 一级和二级分类，统一加上children字段，否则无法显示多级菜单伸缩功能
                if (list && list.length && list[0].grade != '3') {
                    list.forEach(item=>{
                        item.children = [];
                    })
                }
                // grade为1直接赋值
                if (grade != '') {
                    for (let i = 0; i < data.list.length; i++) {
                        if (grade == 1) {
                            if (data.list[i].categoryId == params.categoryId) {
                                data.list[i].children = list;
                                break;
                            }
                        } else {
                            if (data.list[i].children != undefined) {
                                for (let j = 0; j < data.list[i].children.length; j++) {
                                    if (data.list[i].children[j].categoryId == params.categoryId) {
                                        data.list[i].children[j].children = list;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    data.list = list
                }
                this.setState({
                    data: data,
                    expandedRowKeys: grade == '' ? [] : expandedRowKeys
                });
                this.cat_data.data = list
            }
        });
    };

    // 获取设置隐私的数量
    get_count = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'privacy/get_privacyCategory_count',
            callback: (res) => {
                if (res.state === 200) {
                    this.setState({ privacyCount: res.data.privacyCount })
                }
            }
        });
    }

    handleSelectRows = (rows, rowkeys) => {
        this.setState({
            selectedRows: rows,
            selectedRowKeys: rowkeys
        });
    };

    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    onExpand = (expanded, record) => {
        let { expandedRowKeys } = this.state;
        if (expanded) {
            expandedRowKeys.push(record.categoryId);
            this.get_list({ categoryId: record.categoryId }, record.grade);
        } else {
            expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
        }
        this.setState({ expandedRowKeys });
    };

    updatePrivacy = (record, checked) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'privacy/update_privacyCategory',
            payload: {
                categoryId: record.categoryId,
                privacyState: checked ? 2 : 1
            },
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list({ categoryId: record.pid }, record.grade > 1 ? record.grade - 1 : '');
                    this.get_count()
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    render() {
        const { selectedRows, columns, data, loading, expandedRowKeys, privacyCount } = this.state;

        return (
            <div className={global.common_page}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('隐私商品管理')}`, 0, 0, 5)}{/* 隐私商品管理*/}
                <AuthBtn eventKey={["view_privacy_cate"]} btnAuth={btnAuth} showPage>
                    <Spin spinning={loading}>
                        <div className={global.operate_bg}>
                            <div style={{ paddingLeft: 10 }}>已设置隐私三级类目 共 { privacyCount } 个</div>
                        </div>
                        { /*标准表格-start*/}
                        <StandardTable
                            totalHeight={document.body.clientHeight-150-20}
                            expandedRowKeys={expandedRowKeys}
                            selectedRows={selectedRows}
                            data={data}
                            rowKey="categoryId"
                            isCheck={false}
                            columns={columns}
                            onSelectRow={this.handleSelectRows}
                            sldpagination={false}
                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                            isColumnResize
                            onExpand={this.onExpand}
                        />
                        { /*标准表格-end*/}
                    </Spin>
                </AuthBtn>
            </div>
        );
    }
}
