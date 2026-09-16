import { useState, type FormEvent, type ReactNode } from 'react'
import spicesImage from '../assets/naj-spices.jpg'
import GoldDiamond from '../components/GoldDiamond'
import { useSettings } from '../store/content'
import { instagramUrl } from '../store/settings'
import type { ContactService } from '../types'

const FORM_ENDPOINT = import.meta.env.VITE_FORMSUBMIT_ENDPOINT

const SUBJECT_DEFAULT = 'New Enquiry: Home Cooking with Naj'
const SUBJECT_BRAND = 'New Brand Partnership Enquiry: Home Cooking with Naj'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full bg-charcoal border border-cream/10 text-cream px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-cream/20'
const labelClass = 'block text-[10px] tracking-[0.3em] uppercase text-gold mb-2'

interface ContactProps {
  /** Service to preselect in the form, e.g. when arriving from a service card. */
  initialService?: ContactService | ''
}

export default function Contact({ initialService = '' }: ContactProps) {
  const settings = useSettings()
  const igUrl = instagramUrl(settings.instagramHandle)
  const [status, setStatus] = useState<Status>('idle')
  const sending = status === 'sending'
  const submitted = status === 'sent'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // Brand enquiries get their own subject line so they stand out in the inbox.
    data.set('_subject', data.get('service') === 'brand-partnership' ? SUBJECT_BRAND : SUBJECT_DEFAULT)

    if (!FORM_ENDPOINT) {
      console.warn('Contact form: VITE_FORMSUBMIT_ENDPOINT is not set, so the message was not sent.')
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`Form endpoint responded with ${res.status}`)
      setStatus('sent')
    } catch (err) {
      console.error('Contact form submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <main className="pt-20">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-charcoal">
          <img
            src={spicesImage}
            alt="Naj reaching into a drawer of labelled spice jars"
            className="w-full h-full object-cover object-[50%_35%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/50 to-obsidian" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-gold tracking-[0.45em] text-xs uppercase mb-6">Let's Connect</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream italic leading-tight mb-6">
            I'd Love to
            <br />
            Cook for
            <br />
            You
          </h1>
          <div className="max-w-xs mx-auto mb-6">
            <GoldDiamond />
          </div>
          <p className="text-cream-muted text-lg font-light leading-relaxed">
            Whether you have a date in mind or just a craving, reach out and let's make it happen.
          </p>
        </div>
      </section>

      {/* ── Form + Info ─────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16 lg:gap-24">
          {/* Form */}
          <div className="md:col-span-3">
            <h2 className="font-display text-4xl text-cream mb-2">Send a Message</h2>
            <p className="text-cream-muted text-sm mb-10">
              Fill out the form and I'll get back to you within 48 hours.
            </p>

            {submitted ? (
              <div className="border border-gold/30 bg-gold/5 py-16 px-10 text-center">
                <div className="w-12 h-px bg-gold mx-auto mb-8" />
                <p className="font-display text-3xl italic text-gold mb-4">Thank You!</p>
                <p className="text-cream-muted leading-relaxed max-w-sm mx-auto">
                  Your message has been sent. I can't wait to chat, and I'll be in touch shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_subject" value={SUBJECT_DEFAULT} />
                {/* Honeypot: hidden from people, filled in by bots, rejected by FormSubmit */}
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input name="first_name" required placeholder="Jane" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input name="last_name" required placeholder="Smith" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input name="phone" type="tel" placeholder="+1 (905) 000-0000" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Service of Interest *</label>
                  <div className="relative">
                    <select
                      name="service"
                      required
                      defaultValue={initialService}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="" className="bg-charcoal">Select a service...</option>
                      <option value="private-dinner" className="bg-charcoal">Private In-Home Dinner</option>
                      <option value="cooking-workshop" className="bg-charcoal">Cooking Workshop or Demo</option>
                      <option value="grazing-table" className="bg-charcoal">Grazing Table or Charcuterie</option>
                      <option value="meal-prep-weekly" className="bg-charcoal">Weekly Family Meal Planning</option>
                      <option value="meal-prep-freezer" className="bg-charcoal">Freezer Meal Package</option>
                      <option value="brand-partnership" className="bg-charcoal">Brand Partnership or Collaboration</option>
                      <option value="other" className="bg-charcoal">Other / Not Sure Yet</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none text-xs">▾</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Preferred Date</label>
                    <input name="preferred_date" type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Number of Guests</label>
                    <input name="guests" type="number" min="1" placeholder="e.g. 8" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell me about your occasion, any dietary needs, allergies, or anything else I should know..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gold text-obsidian py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'error' && (
                  <p
                    role="alert"
                    className="border border-red-500/30 bg-red-500/5 text-red-300/90 text-sm px-5 py-4 leading-relaxed"
                  >
                    Sorry, your message couldn't be sent right now. Please try again in a moment, or reach me directly on{' '}
                    <a
                      href={igUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline underline-offset-4 hover:text-gold-light transition-colors"
                    >
                      Instagram
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-28 space-y-6">
              <div className="border border-gold/20 p-8">
                <h3 className="font-display text-xl italic text-gold mb-8">Find Me Here</h3>
                <div className="space-y-6">
                  <InfoItem label="Location">
                    <p className="text-cream-muted text-sm">Ancaster, Ontario<br />Serving Ancaster, Hamilton, Burlington & Oakville</p>
                  </InfoItem>
                  <InfoItem label="Response Time">
                    <p className="text-cream-muted text-sm">Within 48 hours</p>
                  </InfoItem>
                  <InfoItem label="Instagram">
                    <a
                      href={igUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream-muted hover:text-gold transition-colors text-sm"
                    >
                      @{settings.instagramHandle}
                    </a>
                  </InfoItem>
                  <InfoItem label="Facebook">
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream-muted hover:text-gold transition-colors text-sm"
                    >
                      Home Cooking with Naj
                    </a>
                  </InfoItem>
                </div>
              </div>

              <div className="border border-gold/20 p-8">
                <h3 className="font-display text-xl italic text-gold mb-3">Follow Along</h3>
                <p className="text-cream-muted text-sm mb-6">
                  Recipes, behind-the-scenes, and food inspo. Find me on social.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Instagram', href: igUrl },
                    { label: 'Facebook', href: settings.facebookUrl },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase group"
                    >
                      {label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="border border-gold/20 p-8 bg-gold/5">
                <p className="font-display text-base italic text-cream leading-relaxed">
                  "Every experience begins with a conversation. I can't wait to hear about yours."
                </p>
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase mt-4">Naj</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-1">{label}</p>
      {children}
    </div>
  )
}
