/*
*待审核商品详情的布局
* */
import React, { PureComponent } from 'react';
import {
    Row, Col, Modal 
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
// import global from '@/global.less';
import previewstyle from './css/preview.less';
import { getSldEmptyH } from '@/utils/utils';

export default class PreviewDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            props_data: props
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            props_data: props
        });
    }

  //取消事件-清空表单
  sldCancle = () => {
      this.props.sldHandleCancle();
      // this.init_flag = false;
  };


  getItem = (val, index) => {
	  if (val.type == 'show_spec') {
		  let con = <div className={`${previewstyle.params}`}>
			  <div className={`${previewstyle.tittle}`}>{val.tittle}</div>
			  {
				  val.data.length > 0 ? val.data.map((item, key) => <div
					  key={key}
					  className={`${previewstyle.params_item}`}
					  style={{ borderTop: key == 0 ? "1px solid #dfdfdf" : "0" }}
				  >
					  <Row className={`${previewstyle.params_item_row}`}>
						  <Col span={8} className={`${previewstyle.params_item_col}`} style={{ borderRight: "1px solid #dfdfdf" }}>{item.name}</Col>
						  <Col span={16} className={`${previewstyle.params_item_col}`}>{item.values}</Col>
					  </Row>
				  </div>) : ""
			  }
		  </div>;
		  return con;
	  } if (val.type == 'show_params') {
		  let con = <div className={`${previewstyle.params}`}>
			  <div className={`${previewstyle.tittle}`}>{val.tittle}</div>
			  {
				  val.data.length > 0 ? val.data.map((item1, key1) => <div
					  key={key1}
					  className={`${previewstyle.params_item}`}
					  style={{ borderTop: key1 == 0 ? "1px solid #dfdfdf" : "0" }}
				  >
					  <div className={`${previewstyle.params_item_tittle}`}>{item1.groupName}</div>
					  {item1.attrs.length > 0 &&
						  <div>

							  {item1.attrs.map((item2, key2) =>
								  <Row key={key2} className={`${previewstyle.params_item_row}`}>
									  <Col span={8} className={`${previewstyle.params_item_col}`} style={{ borderRight: "1px solid #dfdfdf" }}>{item2.name}</Col>
									  <Col span={16} className={`${previewstyle.params_item_col}`}>{item2.values}</Col>
								  </Row>
							  )}


						  </div>
					  }
				  </div>) : ""
			  }
		  </div>;
		  return con;
	  } if (val.type == 'detail') {
		  return <div key={index} className={`${previewstyle.detail}`}>
			  <div className={`${previewstyle.tittle}`}>{val.tittle}</div>
			  {/* eslint-disable-next-line react/no-danger */}
			  <div dangerouslySetInnerHTML={{
				  __html: val.data
			  }}
			  />
		  </div>;
	  } 
  };

  //渲染主体内容
  rendeForm = (content) => content.map((items, index) => this.getItem(items, index));
  
  render() {
      const { title, previewVisible, content, zIndex } = this.state.props_data;
	    return <Modal
          destroyOnClose
          // maskClosable={true}
          title={title}
          zIndex={zIndex}
          width={this.props.width ? this.props.width : 416}
          visible={previewVisible}
          onCancel={this.sldCancle}
          footer={null}
          style={{ top: "50px" }}
	    >
	            
	  <div style={{ overflow: 'hidden', maxHeight: document.body.clientHeight - 150 }}>
		  <Scrollbars
			  ref={(scrollv) => {
				  this.scrollRef = scrollv;
			  }}
			  autoHeight
			  autoHeightMin={100}
			  autoHeightMax={document.body.clientHeight - 150}
		  >
			  {getSldEmptyH(6)}
			  {content.length>0?this.rendeForm(content):<div style={{padding:"20px"}}>暂无更多详情数据...</div>}
		  </Scrollbars>
	  </div>
	    </Modal>;
  }
}
