import React, { Fragment, Component } from 'react';
import SldReactQuill from '@/components/SldReactQuill';

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons

    [{ 'header': 1 }, { 'header': 2 }], // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
    [{ 'direction': 'rtl' }], // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': ['#000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#fff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, { 'background': [] }], // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'] // remove formatting button
];

export default class SnRichText extends Component{
    // 修改数据
    onChange = (value) => {
        this.props.onchange(value)
    }
    
    render(){
        let { value } = this.props
        
        return(
            <Fragment>
                <div style={{ display: 'flex', flex: 1, marginTop: 20}}>
                    <SldReactQuill
                        value={value}
                        getRQContent={con1 => this.onChange(con1)}
                        toolbarOptions={toolbarOptions}
                    />
                </div>
            </Fragment>
        )
    }
}