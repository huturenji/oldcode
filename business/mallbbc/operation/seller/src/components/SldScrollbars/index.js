/*
* 封装的通用滚动条，透明颜色
* */
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default class ColoredScrollbars extends Component {

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = { top: 0 };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.renderView = this.renderView.bind(this);
        this.renderThumb = this.renderThumb.bind(this);
    }

    handleUpdate(values) {
        const { top } = values;
        this.setState({ top });
    }

    renderView({ style, ...props }) {
        const viewStyle = {
            backgroundColor: `rgba(0,0,0,0)`
        };
        return (
            <div
                className="box"
                style={{ ...style, ...viewStyle }}
                {...props}
            />
        );
    }

    renderThumb({ style, ...props }) {
        const thumbStyle = {
            backgroundColor: `rgba(0,0,0,0)`
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}
            />
        );
    }

    render() {
        return (
            <Scrollbars
                renderView={this.renderView}
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                onUpdate={this.handleUpdate}
                {...this.props}
            />
        );
    }
}
