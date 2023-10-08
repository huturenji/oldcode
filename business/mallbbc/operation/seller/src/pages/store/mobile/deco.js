
import React, { Component } from 'react';
import global from '@/global.less';
import Deco from './decorate/deco'

export default class HomeDeco extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: props.location.query
        };
    }

    render() {
        const { query } = this.state;
        return (
            <div className={global.common_page}>
                <Deco query={query} />
            </div>
        );
    }
}


