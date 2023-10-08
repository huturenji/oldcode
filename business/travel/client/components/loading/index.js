'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('./index.less');

var Loading = {
    name: 'Loading',
    props: {
        delay: {
            type: Number,
            'default': 0
        },
        indicator: {
            type: String,
            'default': ""
        },
        size: {
            type: String,
            'default': "default"
        },
        spinning: {
            type: Boolean,
            'default': false
        },
        tip: {
            type: String,
            'default': "加载中..."
        },
        turn: {
            type: Boolean,
            'default': false
        }
    },
    methods: {},
    render: function render() {
        var h = arguments[0];
        var indicator = this.indicator,
            size = this.size,
            spinning = this.spinning,
            tip = this.tip,
            turn = this.turn;

        var className = size,
            style = {};
        if (turn) {
            className += " turn";
        }
        if (!!indicator) {
            style = {
                "background": "url(" + indicator + ") no-repeat",
                "background-size": "contain"
            };
        }
        if (spinning) {
            return h(
                'section',
                { 'class': 'sn-loading' },
                [h(
                    'div',
                    { 'class': 'sn-loading-spinning' },
                    [h('i', { 'class': className, style: style })]
                ), h(
                    'div',
                    { 'class': 'sn-loading-tip' },
                    [tip]
                )]
            );
        }
    }
};

Loading.install = function (Vue) {
    Vue.component(Loading.name, Loading);
};

exports['default'] = Loading;
module.exports = exports.default;