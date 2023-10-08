import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Resizable } from 'react-resizable';
import { sldEmptyHandle1 } from '@/utils/utils';
import styles from './index.less';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import SldRowMoreColumnLR from '@/components/SldRowMoreColumnLR';

function initTotalList(columns) {
    const totalList = [];
    columns.forEach(column => {
        if (column.needTotal) {
            totalList.push({ ...column, total: 0 });
        }
    });
    return totalList;
}

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <th {...restProps} />;
    }
    return (
        <Resizable width={width ? width : 100} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};

class StandardTable extends PureComponent {
    components = {
	    header: {
	        cell: ResizeableTitle
	    }
    };
    
    constructor(props) {
        super(props);
        const { columns } = props;
        const needTotalList = initTotalList(columns);

        this.state = {
            selectedRowKeys: [],
            needTotalList,
            rowId: ''// 选中行的id
        };
    }

    static getDerivedStateFromProps(nextProps) {
        // clean state
        if (nextProps.selectedRows != undefined && nextProps.selectedRows.length === 0) {
            const needTotalList = initTotalList(nextProps.columns);
            return {
                selectedRowKeys: [],
                needTotalList
            };
        } 
        if (nextProps.flag_show_sele_data != undefined && nextProps.flag_show_sele_data) {
            return {
                selectedRowKeys: nextProps.selectedRowKeys
            };
        }
		
        return null;
    }

	handleRowSelectChange = (selectedRowKeys, selectedRows) => {
	    let { needTotalList } = this.state;
		
	    needTotalList = needTotalList.map(item => ({
	        ...item,
	        total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0)
	    }));
	    const { onSelectRow } = this.props;
	    if (onSelectRow) {
	        onSelectRow(selectedRows, selectedRowKeys);
	    }

	    this.setState({ selectedRowKeys, needTotalList });
	};

	handleTableChange = (pagination, filters, sorter) => {
	    const { onChange } = this.props;
	    if (onChange) {
	        onChange(pagination, filters, sorter);
	    }
	};

	cleanSelectedKeys = () => {
	    this.handleRowSelectChange([], []);
	};

	//表格单行点击事件
	sldHandleRow = (record, index, rowKey) => {
	    this.props.onSldHandleSeleRow(record);
	    let cur_id = '';
	    if (rowKey == 'id') {
	        cur_id = record.id;
	    } else if (rowKey == 'upTime') {
	        cur_id = record.upTime;
	    } else if (rowKey == 'specId') {
	        cur_id = record.specId;
	    } else if (rowKey == 'brandId') {
	        cur_id = record.brandId;
	    } else if (rowKey == 'sku') {
	        cur_id = record.sku;
	    } else if (rowKey == 'categoryId') {
	        cur_id = record.categoryId;
	    } else if (rowKey == 'decoId') {
	        cur_id = record.decoId;
	    } else if (rowKey == 'seckillId') {
	        cur_id = record.seckillId;
	    } else if (rowKey == 'promotionId') {
	        cur_id = record.promotionId;
	    } else if (rowKey == 'promotionId') {
	        cur_id = record.promotionId;
	    } else if (rowKey == 'labelId') {
	        cur_id = record.labelId;
	    } else if (rowKey == 'integralGoodsId') {
	        cur_id = record.integralGoodsId;
	    } else if (rowKey == 'couponId') {
	        cur_id = record.couponId;
	    } else if (rowKey == 'attributeId') {
	        cur_id = record.attributeId;
	    } else if (rowKey == 'signActivityId') {
	        cur_id = record.signActivityId;
	    }
	    this.setState({
	        rowId: cur_id
	    });
	};

	//设置选中行的背景色
	setRowClassName = (rowKey, record) => {
	    if (this.props.onSldHandleSeleRow) {
	        let cur_id = '';
	        if (rowKey == 'id') {
	            cur_id = record.id;
	        }else if (rowKey == 'specId') {
	            cur_id = record.specId;
	        } else if (rowKey == 'brandId') {
	            cur_id = record.brandId;
	        } else if (rowKey == 'sku') {
	            cur_id = record.sku;
	        }else if (rowKey == 'categoryId') {
	            cur_id = record.categoryId;
	        }else if (rowKey == 'decoId') {
	            cur_id = record.decoId;
	        }else if (rowKey == 'seckillId') {
	            cur_id = record.seckillId;
	        }else if (rowKey == 'promotionId') {
	            cur_id = record.promotionId;
	        }else if (rowKey == 'promotionId') {
	            cur_id = record.promotionId;
	        } else if (rowKey == 'labelId') {
	            cur_id = record.labelId;
	        } else if (rowKey == 'integralGoodsId') {
	            cur_id = record.integralGoodsId;
	        } else if (rowKey == 'couponId') {
	            cur_id = record.couponId;
	        } else if (rowKey == 'attributeId') {
	            cur_id = record.attributeId;
	        } else if (rowKey == 'signActivityId') {
	            cur_id = record.signActivityId;
	        }
	        let showClassName = '';
	        if (this.props.showMarkColor && record.mark_color) {
	            //去掉#
	            let color = record.mark_color.replace('#', '');
	            //小写转为大写，方便获取类名
	            showClassName = `row_sld_color_${ color.toUpperCase()}`;
	        }
	        if (cur_id === this.state.rowId) {
	            showClassName = 'seleSingle';
	        }
	        return showClassName;
	    } 
	    return '';
		
	};

	handleResize = index => (e, { size }) => {
	    if (this.props.resizeTable) {this.props.resizeTable(index, size);}
	};

	onExpand = (expanded, record) => {
	    if (this.props.onExpand) {
	        this.props.onExpand(expanded, record);
	    }
	};

	render() {
	    const { selectedRowKeys } = this.state;
	    const {
	        data: { list, pagination },
	        rowKey, isCheck, sldpagination, scroll, isColumnResize,pageSizeOption,
	        ...rest
	    } = this.props;
	    let PAGESIZEOPTION = pageSizeOption || ['10','20','30','40']
	    const paginationProps = {
	        showSizeChanger: true,
	        showQuickJumper: true,
	        pageSizeOptions:PAGESIZEOPTION,
	        ...pagination
	    };

	    const rowSelection = {
	        type: this.props.sel_type != undefined ? this.props.sel_type : 'checkbox',
	        selectedRowKeys,
	        onChange: this.handleRowSelectChange,
	        getCheckboxProps: record => ({
	            disabled: (record.disabled == 'true' || record.disabled == true) ? true : false
	        })
	    };
	    const columns = isColumnResize ? this.props.columns.map((col, index) => ({
	        ...col,
	        onHeaderCell: column => ({
	            width: column.width,
	            onResize: this.handleResize(index)
	        })
	    })) : this.props.columns;
	    let showData = <div
	        className={styles.standardTableSlo_don}
	        style={{ width: this.props.width != undefined ? this.props.width : '100%' }}
	    >
	        {this.props.expandedRowKeys != undefined && this.props.expandData == undefined && <Table
	            expandedRowKeys={this.props.expandedRowKeys}
	            showHeader={this.props.showHeader != undefined ? this.props.showHeader : true}
	            bordered={this.props.border!=undefined?this.props.border:true}
	            components={this.components}
	            size="small"
	            scroll={typeof (scroll) != 'undefined' ? scroll : {}}
	            rowClassName={(record) => this.setRowClassName(rowKey, record)}
	            onRow={(record, index) => ({
	                onClick: () => {
	                    if (this.props.onSldHandleSeleRow) {
	                        this.sldHandleRow(record, index, rowKey);
	                    }
	                }
	            })}
	            indentSize={this.props.indentSize}
	            rowKey={rowKey || 'key'}
	            rowSelection={isCheck ? rowSelection : null}
	            dataSource={list}
	            pagination={sldpagination != undefined ? (sldpagination ? paginationProps : false) : paginationProps}
	            onChange={this.handleTableChange}
	            onExpand={this.onExpand}
	            {...rest}
	            columns={columns}
	        />}
	        {this.props.expandedRowKeys == undefined && this.props.expandData != undefined && <Table
	            expandedRowRender={(record) => {
	                let expand_data = [];
	                for (let i = 0; i < this.props.expandData.length; i++) {
	                    expand_data.push({
	                        lval: this.props.expandData[i].key,
	                        rval: sldEmptyHandle1(record[this.props.expandData[i].val])
	                    });
	                }
	                return <SldRowMoreColumnLR item_width={400} data={expand_data} />;
	            }}
	            showHeader={this.props.showHeader != undefined ? this.props.showHeader : true}
	            bordered={this.props.border!=undefined?this.props.border:true}
	            components={this.components}
	            size="small"
	            scroll={typeof (scroll) != 'undefined' ? scroll : {}}
	            rowClassName={(record) => this.setRowClassName(rowKey, record)}
	            onRow={(record, index) => ({
	                onClick: () => {
	                    if (this.props.onSldHandleSeleRow) {
	                        this.sldHandleRow(record, index, rowKey);
	                    }
	                }
	            })}
	            indentSize={this.props.indentSize}
	            rowKey={rowKey || 'key'}
	            rowSelection={isCheck ? rowSelection : null}
	            dataSource={list}
	            pagination={sldpagination != undefined ? (sldpagination ? paginationProps : false) : paginationProps}
	            onChange={this.handleTableChange}
	            {...rest}
	            columns={columns}
	        />}
	        {this.props.expandedRowKeys == undefined && this.props.expandData == undefined && <Table
	            showHeader={this.props.showHeader != undefined ? this.props.showHeader : true}
	            bordered={this.props.border!=undefined?this.props.border:true}
	            components={this.components}
	            size="small"
	            scroll={typeof (scroll) != 'undefined' ? scroll : {}}
	            rowClassName={(record) => this.setRowClassName(rowKey, record)}
	            onRow={(record, index) => ({
	                onClick: () => {
	                    if (this.props.onSldHandleSeleRow) {
	                        this.sldHandleRow(record, index, rowKey);
	                    }
	                }
	            })}
	            indentSize={this.props.indentSize}
	            rowKey={rowKey || 'key'}
	            rowSelection={isCheck ? rowSelection : null}
	            dataSource={list}
	            pagination={sldpagination != undefined ? (sldpagination ? paginationProps : false) : paginationProps}
	            onChange={this.handleTableChange}
	            {...rest}
	            columns={columns}
	        />}
	    </div>;
	    return (
		  <Fragment>
	            {this.props.showScrollbar!=undefined&&!this.props.showScrollbar
	                ?showData
	                :<Scrollbars
	                    autoHeight
	                    autoHeightMax={this.props.totalHeight != undefined ? this.props.totalHeight : document.body.clientHeight - 250}
	                >
	                    {showData}
	                </Scrollbars>
	            }
	        </Fragment>
	    );
	}
}

export default StandardTable;
