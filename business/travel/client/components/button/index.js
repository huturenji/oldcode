import Icon from '../icon';
import './index.less';

var Button = {
    name: 'SnButton',
    props: {
        loading: {
            type: Boolean,
            'default': false
        },
        type: {
            type: String,
            'default': 'default'
        },
        size: {
            type: String,
            'default': ''
        },
        inline: {
            type: Boolean,
            'default': false
        },
        ghost: {
            type: Boolean,
            'default': false
        },
        disabled: {
            type: Boolean,
            'default': false
        },
        icon: String,
        shape: String
    },
    methods: {
        // 绑定事件
        handleClick: function handleClick() {
            var loading = this.loading,
                disabled = this.disabled;

            if (!loading && !disabled) {
                this.$emit("click");
            }
        }
    },
    render: function render() {
        var h = arguments[0];
        var loading = this.loading,
            type = this.type,
            size = this.size,
            inline = this.inline,
            ghost = this.ghost,
            disabled = this.disabled,
            icon = this.icon,
            shape = this.shape,
            $slots = this.$slots;

        var className = {
            'normal-btn': true,
            'bp-button': true,
            'bp-button-loading': loading,
            'bp-button-inline': inline,
            'bp-button-ghost': ghost,
            'bp-button-disabled': disabled || loading
        };
        className['bp-button-' + type] = true;
        if (size === 'medium' || size === 'small') {
            className['bp-button-' + size] = true;
        }
        if (shape === 'square' || shape === 'round') {
            className['bp-button-' + shape] = true;
        }

        var btnIcon = $slots.icon
            ? $slots.icon
            : icon && h(Icon, {
                attrs: { type: icon },
                'class': 'bp-button-icon' 
            });

        return h(
            'button',
            {
                'class': className,
                on: {
                    'click': this.handleClick
                },
                attrs: {
                    disabled: disabled
                }
            },
            [btnIcon, h('span', [$slots['default']])]
        );
    }
};

Button.install = function (Vue) {
    Vue.component(Button.name, Button);
};

export default Button;