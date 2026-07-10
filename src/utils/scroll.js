export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return

  const header = document.querySelector('header')
  const offset = header?.offsetHeight ?? 0
  const top = target.getBoundingClientRect().top + window.scrollY - offset

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
}
