import React, { Component } from 'react';
import {
    Table
} from 'antd';
import {
    
} from '@/utils/utils';

export default class Log extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '操作序号',
                    dataIndex: 'key',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => index + 1
                },
                {
                    title: '操作时间',
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 100
                },
                {
                    title: '操作用户',
                    dataIndex: 'operator',
                    align: 'center',
                    width: 150
                },
                {
                    title: '操作说明',
                    dataIndex: 'content',
                    align: 'center',
                    width: 100
                }
            ]
        };
    }


    componentDidMount() {
       
    }

    componentWillReceiveProps() {
       
    }


    render() {
        const { columns } = this.state;
        const {logList} = this.props
        return (
            <div>
                <Table 
                    rowKey="id"
                    pagination={false}
                    columns={columns}
                    dataSource={logList}
                    size="small"
                />
            </div>

        );
    }
}
