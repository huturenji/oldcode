/**
 * 渲染单个组件
 */
export function renderComponent(name, {data, handleCurSelData,changeChildrenFlag} = {},childrenFlag, type){
    type = !!type ? `-${type}` : ''
    let Element = require(`../${name}/${name}${type}.js`).default;
    return <Element key={`${data.name}_${data.id}`} data={data} handleCurSelData={handleCurSelData} changeChildrenFlag={changeChildrenFlag}/>
}

/**
 * 渲染子组件
 */
export function renderChildren(children, {handleCurSelData} = {}, type){
    return (children?.map(child => renderComponent(child.name, {data:child, handleCurSelData}, type)))
}

/**
 * 初始化组件最外层数据结构
 */
export function constructCompData({id, name, menuData}){
    let con = {
        props: {}
    };
    con.id = id;
    con.name = name;
    con.type = menuData.type;
    // 组件属性 is_show：是否显示；admin_text，admin_icon：组件icon；firstInit：组件是否进行了初始化
    con.props.is_show = true;
    con.props.admin_text = menuData.showName;
    con.props.admin_icon = menuData.icon;
    con.props.firstInit = true;//定义状态来区分初始化数据时，是用自己定义的数据还是接口请求的数据
    return con
}