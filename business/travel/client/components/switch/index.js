'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _functional = require('./functional');

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Switch = {
    functional: true,
    name: 'SnSwitch',
    props: {
        size: String,
        value: null,
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        activeValue: {
            type: Boolean,
            'default': true
        },
        inactiveValue: {
            type: Boolean,
            'default': false
        }
    },
    render: function render(h, context) {
        var props = context.props;
        var value = props.value,
            loading = props.loading,
            disabled = props.disabled,
            activeColor = props.activeColor,
            activeValue = props.activeValue,
            inactiveColor = props.inactiveColor,
            inactiveValue = props.inactiveValue;


        var checked = value === activeValue;

        var switchStyle = {
            backgroundColor: checked ? activeColor : inactiveColor
        };

        function onClick(event) {
            (0, _functional.emit)(context, 'click', event);

            if (!disabled && !loading) {
                var newValue = checked ? inactiveValue : activeValue;
                (0, _functional.emit)(context, 'input', newValue);
                (0, _functional.emit)(context, 'change', newValue);
            }
        }

        return h(
            'div',
            (0, _babelHelperVueJsxMergeProps2['default'])([{
                'class': {
                    "sn-switch": true,
                    "sn-switch-on": checked,
                    "sn-switch-disabled": disabled
                },
                attrs: {
                    role: 'switch',

                    'aria-checked': String(checked)
                },
                style: switchStyle,
                on: {
                    'click': onClick
                }
            }, (0, _functional.inherit)(context)]),
            [h('div', { 'class': 'sn-switch-node' })]
        );
    }
};

exports['default'] = Switch;
module.exports = exports.default;