import heroImg from '../assets/hero.svg'
import { useMouseParallax } from '../hooks/useMouseParallax'
import { useLanguage } from '../context/LanguageContext'

function Hero() {
  const mouse = useMouseParallax()
  const { t } = useLanguage()

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `translate3d(${mouse.x * -12}px, ${mouse.y * -12}px, 0) scale(1.08)` }}
      >
        <img
          src={heroImg}
          alt="Dark realism tattoo artwork backdrop"
          className="h-full w-full object-cover object-center grayscale"
          loading="eager"
        />
      </div>

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.78)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.9), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="animate-fade-in-up font-display text-[clamp(3.4rem,11vw,9rem)] leading-none tracking-[0.04em] text-white"
          style={{ animationDelay: '0.2s' }}
        >
          POKAI TATTOO
        </h1>

        <p
          className="animate-fade-in-up font-body mt-8 text-[clamp(0.78rem,1.8vw,1.05rem)] tracking-[0.5em] text-neutral-300"
          style={{ animationDelay: '0.55s' }}
        >
          {t.heroSubtitle}
        </p>

        <div
          className="animate-fade-in-up font-body mt-5 flex items-center gap-3 text-[10px] tracking-[0.35em] text-neutral-400"
          style={{ animationDelay: '0.85s' }}
        >
          <span className="h-px w-6 bg-neutral-500" />
          {t.location}
          <span className="h-px w-6 bg-neutral-500" />
        </div>

        <button
          type="button"
          className="animate-fade-in-up font-body mt-14 border border-white/70 px-10 py-4 text-[11px] tracking-[0.3em] text-white transition-colors duration-500 hover:bg-white hover:text-black"
          style={{ animationDelay: '1.15s' }}
        >
          {t.bookConsultation}
        </button>
      </div>

      <div
        className="animate-fade-in absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ animationDelay: '1.6s' }}
      >
        <span className="font-body text-[9px] tracking-[0.35em] text-neutral-400">{t.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-neutral-700">
          <span className="animate-scroll-line absolute inset-0 origin-top scale-y-0 bg-neutral-300" />
        </span>
      </div>
    </section>
  )
}

export default Hero
