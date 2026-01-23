export const clickOutside = {
    mounted(el, binding) {
        el._clickOutsideHandler = (event) => {
            if (!el.contains(event.target)) {
                binding.value(event)
            }
        }
        document.addEventListener('click', el._clickOutsideHandler)
    },

    unmounted(el) {
        document.removeEventListener('click', el._clickOutsideHandler)
        delete el._clickOutsideHandler
    }
}