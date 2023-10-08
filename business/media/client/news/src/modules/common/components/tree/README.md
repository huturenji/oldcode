
##组件使用说明
树形列表组件
参数：
list： 数据源，格式举例：
{
    root: true,
    children: [
                {
                    id: '01',
                    name: '采掘',
                    children:[
                        {
                            id: '011',
                            name: '采掘1',
                            uncollapsed: true,
                            children: [
                                {
                                    id: '0111',
                                    name: '采掘Ⅱ',
                                },
                                {
                                    id: '0112',
                                    name: '采掘Ⅱ',
                                },
                                {
                                    id: '0113',
                                    name: '采掘Ⅱ',
                                },
                            ]
                        }, 
                        {
                            id: '012',
                            name: '采掘2',
                        },
                        {
                            id: '013',
                            name: '采掘32',
                        },
                        {
                            id: '014',
                            name: '采掘4',
                        },
                        {
                            id: '015', 
                            name: '采掘5',
                        }
                    ],
                },
            ]
}
keyword： 配合搜索组件使用，将keyword内容高亮