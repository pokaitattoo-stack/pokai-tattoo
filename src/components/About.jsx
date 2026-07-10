import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'

function ExperienceItem({ text, index, visible }) {
  return (
    <li
      className={`transition-all duration-[900ms] ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: visible ? `${index * 110}ms` : '0ms' }}
    >
      {text}
    </li>
  )
}

function About() {
  const [imgRef, imgVisible] = useReveal()
  const [textRef, textVisible] = useReveal()
  const [listRef, listVisible] = useReveal()
  const { t } = useLanguage()

  return (
    <section id="about" className="bg-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-14 md:grid-cols-2 md:gap-20">
        <div
          ref={imgRef}
          className={`relative w-full overflow-hidden transition-all duration-[1300ms] ease-out md:-ml-6 lg:-ml-10 ${
            imgVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <img
            src="/images/IMG_9836.JPG"
            alt="Portrait tattoo artwork by Pokai"
            width={1079}
            height={1348}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
        </div>

        <div className="mx-auto max-w-[560px] text-center md:mx-0 md:text-left">
          <p
            ref={textRef}
            className={`font-body text-xs tracking-[0.3em] text-neutral-500 transition-all duration-[1100ms] ease-out ${
              textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {t.aboutTitle}
          </p>

          <h2
            className={`font-display mt-4 text-[clamp(1.8rem,4vw,2.75rem)] tracking-[0.05em] text-white transition-all duration-[1100ms] ease-out ${
              textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: textVisible ? '120ms' : '0ms' }}
          >
            {t.aboutIntro}
          </h2>

          <p
            className={`font-body mt-10 text-base leading-[1.9] text-neutral-400 transition-all duration-[1100ms] ease-out md:text-lg ${
              textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: textVisible ? '280ms' : '0ms' }}
          >
            {t.aboutBody}
          </p>

          <div ref={listRef} className="mt-12">
            <p
              className={`font-body text-xs tracking-[0.3em] text-neutral-500 transition-all duration-[900ms] ease-out ${
                listVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              {t.aboutExperienceLabel}
            </p>
            <ul className="font-body mt-5 space-y-3 text-sm leading-relaxed text-neutral-300 md:text-base">
              {t.aboutExperience.map((item, index) => (
                <ExperienceItem key={item} text={item} index={index} visible={listVisible} />
              ))}
            </ul>
          </div>

          <a
            href="#booking"
            className="font-body mt-12 inline-block border border-white/70 px-10 py-4 text-[11px] tracking-[0.3em] text-white transition-colors duration-500 hover:bg-white hover:text-black"
          >
            {t.aboutCta}
          </a>
        </div>
      </div>
    </section>
  )
}

export default About
