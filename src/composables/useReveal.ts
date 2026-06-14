import { ref, onMounted, onUnmounted } from 'vue'

export function useReveal() {
  const reveals = ref<HTMLElement[]>([])

  function addReveal(el: unknown) {
    if (el instanceof HTMLElement) reveals.value.push(el)
  }

  function onScroll() {
    reveals.value.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add('revealed')
      }
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    // trigger once on mount for elements already in view
    setTimeout(onScroll, 200)
  })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { addReveal }
}
