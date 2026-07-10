import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../context/LanguageContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FILES = 5
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdlnvlv'

const initialForm = {
  fullName: '',
  email: '',
  instagram: '',
  tattooPlacement: '',
  approximateSize: '',
  projectDescription: '',
  budgetRange: '',
  preferredStartDate: '',
  consent: false,
}

function FieldLabel({ htmlFor, required, optionalText, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-body block text-[11px] tracking-[0.2em] text-neutral-400"
    >
      {children}
      {required ? (
        <span className="ml-1 text-neutral-600">*</span>
      ) : (
        <span className="ml-2 text-neutral-600">({optionalText})</span>
      )}
    </label>
  )
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 font-body text-[11px] tracking-[0.02em] text-red-400">
      {message}
    </p>
  )
}

function BookSession() {
  const [ref, visible] = useReveal()
  const { t } = useLanguage()

  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle') // 'idle' | 'success' | 'error'
  const [serverError, setServerError] = useState('')

  const messageRef = useRef(null)

  useEffect(() => {
    if ((submitStatus === 'success' || submitStatus === 'error') && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [submitStatus])

  const inputClass = (hasError) =>
    `w-full border bg-transparent px-4 py-3 font-body text-sm text-white placeholder:text-neutral-600 transition-colors duration-300 focus:outline-none ${
      hasError ? 'border-red-400/60 focus:border-red-400' : 'border-white/20 focus:border-white/60'
    }`

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length > MAX_FILES) {
      setFiles(selected.slice(0, MAX_FILES))
      setErrors((prev) => ({ ...prev, files: t.errorTooManyFiles }))
    } else {
      setFiles(selected)
      setErrors((prev) => {
        if (!prev.files) return prev
        const next = { ...prev }
        delete next.files
        return next
      })
    }
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = t.errorRequired
    if (!form.email.trim()) next.email = t.errorRequired
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = t.errorEmailInvalid
    if (!form.instagram.trim()) next.instagram = t.errorRequired
    if (!form.tattooPlacement.trim()) next.tattooPlacement = t.errorRequired
    if (!form.approximateSize.trim()) next.approximateSize = t.errorRequired
    if (!form.projectDescription.trim()) next.projectDescription = t.errorRequired
    if (!form.consent) next.consent = t.errorRequired
    if (files.length > MAX_FILES) next.files = t.errorTooManyFiles
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formEl = e.currentTarget

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setServerError('')

    try {
      const formData = new FormData(formEl)
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setSubmitStatus('success')
        setForm(initialForm)
        setFiles([])
        formEl.reset()
      } else {
        let message = ''
        try {
          const data = await response.json()
          if (Array.isArray(data?.errors) && data.errors.length > 0) {
            message = data.errors.map((err) => err.message).filter(Boolean).join(' ')
          } else if (typeof data?.error === 'string') {
            message = data.error
          }
        } catch {
          message = ''
        }
        setServerError(message)
        setSubmitStatus('error')
      }
    } catch {
      setServerError('')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="booking"
      className="bg-black px-6 pb-10 pt-32 md:px-16 md:pb-10 md:pt-44"
    >
      <div
        ref={ref}
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-14 transition-all duration-[1100ms] ease-out md:grid-cols-2 md:gap-20 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="text-center md:text-left">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] tracking-[0.05em] text-white">
            {t.bookingTitle}
          </h2>
          <p className="font-body mt-6 text-lg leading-relaxed text-neutral-300">{t.bookingLead}</p>
          <p className="font-body mt-5 text-base leading-[1.9] text-neutral-400">
            {t.bookingDescription}
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto w-full text-left md:mx-0 md:max-w-[620px]"
        >
          <input type="hidden" name="_subject" value="New Tattoo Inquiry — POKAI Tattoo" />
          <input
            type="text"
            name="_gotcha"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />

          <div className="space-y-8">
            <div>
              <FieldLabel htmlFor="fullName" required>
                {t.fullNameLabel}
              </FieldLabel>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                value={form.fullName}
                onChange={handleChange}
                className={`mt-2 ${inputClass(Boolean(errors.fullName))}`}
              />
              <FieldError id="fullName-error" message={errors.fullName} />
            </div>

            <div>
              <FieldLabel htmlFor="email" required>
                {t.emailLabel}
              </FieldLabel>
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                value={form.email}
                onChange={handleChange}
                className={`mt-2 ${inputClass(Boolean(errors.email))}`}
              />
              <FieldError id="email-error" message={errors.email} />
            </div>

            <div>
              <FieldLabel htmlFor="instagram" required>
                {t.instagramLabel}
              </FieldLabel>
              <input
                id="instagram"
                name="instagram"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.instagram)}
                aria-describedby={errors.instagram ? 'instagram-error' : undefined}
                value={form.instagram}
                onChange={handleChange}
                className={`mt-2 ${inputClass(Boolean(errors.instagram))}`}
              />
              <FieldError id="instagram-error" message={errors.instagram} />
            </div>

            <div>
              <FieldLabel htmlFor="tattooPlacement" required>
                {t.placementLabel}
              </FieldLabel>
              <input
                id="tattooPlacement"
                name="tattooPlacement"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.tattooPlacement)}
                aria-describedby={errors.tattooPlacement ? 'tattooPlacement-error' : undefined}
                placeholder={t.placementPlaceholder}
                value={form.tattooPlacement}
                onChange={handleChange}
                className={`mt-2 ${inputClass(Boolean(errors.tattooPlacement))}`}
              />
              <FieldError id="tattooPlacement-error" message={errors.tattooPlacement} />
            </div>

            <div>
              <FieldLabel htmlFor="approximateSize" required>
                {t.sizeLabel}
              </FieldLabel>
              <input
                id="approximateSize"
                name="approximateSize"
                type="text"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.approximateSize)}
                aria-describedby={errors.approximateSize ? 'approximateSize-error' : undefined}
                value={form.approximateSize}
                onChange={handleChange}
                className={`mt-2 ${inputClass(Boolean(errors.approximateSize))}`}
              />
              <FieldError id="approximateSize-error" message={errors.approximateSize} />
            </div>

            <div>
              <FieldLabel htmlFor="projectDescription" required>
                {t.descriptionLabel}
              </FieldLabel>
              <textarea
                id="projectDescription"
                name="projectDescription"
                rows={5}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.projectDescription)}
                aria-describedby={errors.projectDescription ? 'projectDescription-error' : undefined}
                placeholder={t.descriptionPlaceholder}
                value={form.projectDescription}
                onChange={handleChange}
                className={`mt-2 resize-y ${inputClass(Boolean(errors.projectDescription))}`}
              />
              <FieldError id="projectDescription-error" message={errors.projectDescription} />
            </div>

            <div>
              <FieldLabel htmlFor="budgetRange" optionalText={t.optional}>
                {t.budgetLabel}
              </FieldLabel>
              <input
                id="budgetRange"
                name="budgetRange"
                type="text"
                value={form.budgetRange}
                onChange={handleChange}
                className={`mt-2 ${inputClass(false)}`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="preferredStartDate" optionalText={t.optional}>
                {t.startDateLabel}
              </FieldLabel>
              <input
                id="preferredStartDate"
                name="preferredStartDate"
                type="text"
                value={form.preferredStartDate}
                onChange={handleChange}
                className={`mt-2 ${inputClass(false)}`}
              />
            </div>

            <div>
              <FieldLabel optionalText={t.optional}>{t.referenceImagesLabel}</FieldLabel>
              <label className="mt-2 inline-flex cursor-pointer items-center border border-white/20 px-5 py-3 font-body text-[11px] tracking-[0.2em] text-neutral-300 transition-colors duration-300 hover:border-white/50 hover:text-white focus-within:border-white/70">
                <input
                  type="file"
                  name="referenceImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  aria-label={t.referenceImagesLabel}
                  aria-describedby="referenceImages-hint"
                  className="sr-only"
                />
                {t.referenceImagesUpload}
              </label>
              <p id="referenceImages-hint" className="mt-2 font-body text-[11px] text-neutral-600">
                {t.referenceImagesHint} ({files.length} / {MAX_FILES})
              </p>
              {files.length > 0 && (
                <ul className="mt-3 space-y-1 font-body text-[12px] text-neutral-500">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="truncate">
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
              <FieldError id="files-error" message={errors.files} />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  checked={form.consent}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                  className="mt-1 h-4 w-4 shrink-0 border border-white/30 bg-transparent accent-white focus:outline-none"
                />
                <span className="font-body text-sm text-neutral-300">{t.consentLabel}</span>
              </label>
              <FieldError id="consent-error" message={errors.consent} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-body w-full border border-white/70 px-10 py-4 text-[11px] tracking-[0.3em] text-white transition-colors duration-500 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white sm:w-auto"
            >
              {isSubmitting ? t.bookingSending : t.bookingSubmit}
            </button>

            {submitStatus === 'success' && (
              <p
                ref={messageRef}
                role="status"
                aria-live="polite"
                className="font-body text-sm text-neutral-300"
              >
                {t.bookingSuccess}
              </p>
            )}

            {submitStatus === 'error' && (
              <p
                ref={messageRef}
                role="alert"
                aria-live="assertive"
                className="font-body text-sm text-red-400"
              >
                {serverError || t.bookingError}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default BookSession
