<template>
    <svg class='icon' :class='type' :style='size ? `width: ${size}rem; height: ${size}rem;` : ""'>
        <use :xlink:href="`#${type}`"></use>
    </svg>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import icon from 'sprite/svg/icon';
export default {
    name: 'icon',
    props: {
        type: {
            type: String,
            required: true
        },
        size: {
            type: String
        }
    }
}
</script>