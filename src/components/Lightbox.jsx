import { useCallback, useEffect, useRef, useState } from 'react'

const SWIPE_THRESHOLD = 50
const SLIDE_DURATION = 320

function Slide({ work, priority }) {
  return (
    <div className="flex h-full w-full shrink-0 grow-0 basis-1/3 items-center justify-center px-2">
      {work && (
        <img
          src={work.src}
          alt="Dark realism tattoo artwork, full view"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain"
        />
      )}
    </div>
  )
}

function Lightbox({ works, initialIndex, onClose }) {
  const total = works.length

  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  const closeBtnRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)
  const touchStartX = useRef(null)

  const prevIndex = (index - 1 + total) % total
  const nextIndex = (index + 1) % total

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  const goNext = useCallback(() => {
    if (animating || total < 2) return
    setDirection('next')
    setAnimating(true)
  }, [animating, total])

  const goPrev = useCallback(() => {
    if (animating || total < 2) return
    setDirection('prev')
    setAnimating(true)
  }, [animating, total])

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'transform' || !animating) return
    setIndex((i) => (direction === 'next' ? (i + 1) % total : (i - 1 + total) % total))
    setAnimating(false)
    setDirection(null)
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()

      if (e.key === 'Tab') {
        const focusable = [prevBtnRef.current, nextBtnRef.current, closeBtnRef.current].filter(Boolean)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev, onClose])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (deltaX <= -SWIPE_THRESHOLD) goNext()
    else if (deltaX >= SWIPE_THRESHOLD) goPrev()
  }

  let translate = -100 / 3
  if (animating && direction === 'next') translate = -200 / 3
  if (animating && direction === 'prev') translate = 0

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDuration: '250ms' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Tattoo work gallery viewer"
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close gallery"
        className="absolute right-4 top-4 rounded-full p-3 text-2xl leading-none text-neutral-300 transition-colors duration-300 hover:bg-white/10 hover:text-white sm:right-8 sm:top-8"
      >
        &times;
      </button>

      {total > 1 && (
        <button
          ref={prevBtnRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          aria-label="Previous artwork"
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full p-3 text-3xl text-neutral-300 transition-colors duration-300 hover:bg-white/10 hover:text-white sm:left-4 md:left-8"
        >
          &#8249;
        </button>
      )}

      {total > 1 && (
        <button
          ref={nextBtnRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          aria-label="Next artwork"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-3 text-3xl text-neutral-300 transition-colors duration-300 hover:bg-white/10 hover:text-white sm:right-4 md:right-8"
        >
          &#8250;
        </button>
      )}

      <div
        className={`relative h-[90vh] w-[90vw] overflow-hidden transition-all ease-out ${
          mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ transitionDuration: '250ms' }}
      >
        <div
          className="flex h-full"
          style={{
            width: '300%',
            transform: `translateX(${translate}%)`,
            transition: animating ? `transform ${SLIDE_DURATION}ms ease-out` : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <Slide work={works[prevIndex]} />
          <Slide work={works[index]} priority />
          <Slide work={works[nextIndex]} />
        </div>
      </div>

      <div
        className="font-body absolute bottom-5 right-5 text-xs tracking-[0.2em] text-neutral-400 sm:bottom-8 sm:right-8"
        aria-live="polite"
      >
        {index + 1} / {total}
      </div>
    </div>
  )
}

export default Lightbox
