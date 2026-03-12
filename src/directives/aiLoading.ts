// directives/aiLoading.ts
import type { Directive } from 'vue'

export const aiLoading: Directive = {
    mounted(el, binding) {
        const loadingEl = document.createElement('span')
        loadingEl.className = 'ai-loading-cursor'

        el.__aiLoadingEl = loadingEl

        if (binding.value) {
            el.appendChild(loadingEl)
        }
    },

    updated(el, binding) {
        const loadingEl = el.__aiLoadingEl

        if (binding.value) {
            if (!el.contains(loadingEl)) {
                el.appendChild(loadingEl)
            }
        } else {
            loadingEl?.remove()
        }
    },

    unmounted(el) {
        el.__aiLoadingEl?.remove()
    }
}