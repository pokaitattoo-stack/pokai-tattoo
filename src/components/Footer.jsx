import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'

function Footer() {
  const [ref, visible] = useReveal()
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer
  id="contact"
  className="bg-black px-6 pb-32 pt-8 md:px-16 md:pb-44 md:pt-8"
>
      <div
        ref={ref}
        className={`mx-auto flex max-w-7xl flex-col items-center gap-6 text-center transition-all duration-[1100ms] ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <span className="font-display text-lg tracking-[0.35em] text-white">POKAI</span>

        <p className="font-body text-[13px] tracking-[0.35em] text-neutral-400">{t.footerTagline}</p>

        <p className="font-body text-[12px] tracking-[0.3em] text-neutral-500">{t.footerLocation}</p>

        <div className="mt-4 flex flex-col items-center gap-6 text-[13px] tracking-[0.25em] text-neutral-300 sm:flex-row sm:gap-16">
          <a
            href="https://www.instagram.com/pokai_tattoo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit POKAI TATTOO on Instagram (opens in a new tab)"
            className="font-body transition-colors duration-300 hover:text-white"
          >
            Instagram
          </a>
          <a
            href="mailto:your@email.com"
            aria-label="Email POKAI TATTOO"
            className="font-body transition-colors duration-300 hover:text-white"
          >
            Email
          </a>
        </div>

        <p className="mt-8 font-body text-[12px] tracking-[0.08em] text-neutral-600">
          &copy; {year} POKAI Tattoo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
