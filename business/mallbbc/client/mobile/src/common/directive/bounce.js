import Bounce from '@/utils/bounce'

export default {
    name: 'bounce',
    directive: (el, binding) => {
        let config = {el, bounceTop: binding.value.bounceTop, bounceBottom: binding.value.bounceBottom, scrollEl: binding.value.scrollEl}
        let events = {onBounceTop: binding.value.onBounceTop, onBounceBottom: binding.value.onBounceBottom};
        if (!el.bounceIns){
            el.bounceIns = new Bounce(config, events);
        } else {
            el.bounceIns.set(config)
        }
    }
}
