<template>
    <svg class='icon' :class='type' :style='size ? `width: ${size}rem; height: ${size}rem;` : ""' @click='$emit("click")'>
        <use :xlink:href="`#${type}`"></use>
    </svg>
</template>

<script>
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