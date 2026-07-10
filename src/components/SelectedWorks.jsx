import { useState } from 'react'
import { WORKS } from '../data/works'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'
import Lightbox from './Lightbox'

function WorkTile({ work, index, onOpen }) {
  const [ref, visible] = useReveal()

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(index)}
      className={`group mb-6 block w-full break-inside-avoid appearance-none border-0 bg-transparent p-0 text-left transition-all duration-[1100ms] ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: visible ? `${(index % 6) * 90}ms` : '0ms' }}
    >
      <span className="relative block overflow-hidden bg-neutral-950">
        <img
          src={work.src}
          alt="Dark realism tattoo artwork"
          width={work.width}
          height={work.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.02] group-hover:brightness-[1.05]"
        />
        <span className="pointer-events-none absolute inset-0 bg-black/5" />
      </span>
    </button>
  )
}

function SelectedWorks() {
  const [headingRef, headingVisible] = useReveal()
  const [openIndex, setOpenIndex] = useState(null)
  const { t } = useLanguage()

  return (
    <section className="bg-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`text-center transition-all duration-[1100ms] ease-out ${
            headingVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] tracking-[0.08em] text-white">
            {t.selectedWorksTitle}
          </h2>
          <p className="font-body mt-4 text-sm tracking-[0.15em] text-neutral-400 md:text-base">
            {t.selectedWorksSubtitle}
          </p>
        </div>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {WORKS.map((work, index) => (
            <WorkTile key={work.src} work={work} index={index} onOpen={setOpenIndex} />
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox works={WORKS} initialIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  )
}

export default SelectedWorks
