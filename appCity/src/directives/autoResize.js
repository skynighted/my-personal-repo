export const autoResize = {
    mounted(el, binding) {
        const callback = binding.value || (() => { })

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect
                callback({ width, height })
            }
        })

        resizeObserver.observe(el)
        el._resizeObserver = resizeObserver
    },

    unmounted(el) {
        if (el._resizeObserver) {
            el._resizeObserver.disconnect()
            delete el._resizeObserver
        }
    }
}