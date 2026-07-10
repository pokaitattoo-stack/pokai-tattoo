import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { scrollToId } from '../utils/scroll'

const NAV_ITEMS = [
  { key: 'work', target: 'work' },
  { key: 'about', target: 'about' },
  { key: 'booking', target: 'booking' },
  { key: 'contact', target: 'contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${
        scrolled ? 'bg-black/70' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8 md:h-28 md:px-16">
        <span className="font-display text-base tracking-[0.35em] text-white">POKAI</span>

        <nav className="flex items-center gap-6 text-[10px] tracking-[0.22em] text-neutral-300 sm:gap-9 md:text-xs md:tracking-[0.25em]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => scrollToId(item.target)}
              className="font-body transition-colors duration-300 hover:text-white"
            >
              {t[item.key]}
            </button>
          ))}

          <span className="flex items-center gap-1.5 font-body">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`transition-opacity duration-300 ${
                lang === 'en' ? 'text-white opacity-100' : 'text-neutral-300 opacity-50'
              }`}
            >
              EN
            </button>
            <span className="text-neutral-600">/</span>
            <button
              type="button"
              onClick={() => setLang('zh')}
              className={`transition-opacity duration-300 ${
                lang === 'zh' ? 'text-white opacity-100' : 'text-neutral-300 opacity-50'
              }`}
            >
              中文
            </button>
          </span>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
