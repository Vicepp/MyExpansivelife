import { useState } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'
import { sendMessage } from '../lib/messages'

const FIELDS = [
  { name: 'fullName', label: 'Full Name', required: true, type: 'text' },
  { name: 'email', label: 'Email Address', required: true, type: 'email' },
  { name: 'phone', label: 'Phone Number', required: false, type: 'tel' },
]

const EMPTY = { fullName: '', email: '', phone: '', message: '' }

function Field({ field, value, onChange }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-ink">
        {field.label}
        {field.required && <span className="text-gold">*</span>}
      </span>
      <input
        type={field.type}
        name={field.name}
        value={value}
        required={field.required}
        onChange={onChange}
        className="mt-3 w-full border-b border-ink/40 bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-gold"
      />
    </label>
  )
}

export default function AffiliateForm() {
  const [values, setValues] = useState(EMPTY)
  const [sent, setSent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const update = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      // Lands in the admin Inbox. Returns false when Firebase is unconnected.
      const stored = await sendMessage({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        subject: 'Affiliate application',
        body: values.message || 'No message provided.',
        source: 'Affiliate page',
      })
      setSent(stored ? 'stored' : 'local')
      setValues(EMPTY)
    } catch {
      setError('Something went wrong sending that. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-[15px] text-ink/70">Chat with our support</p>
            <h2 className="mt-3 text-[32px] font-bold leading-[1.15] text-gold lg:text-[44px]">
              Apply to become an affiliate.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[480px] text-[15px] leading-relaxed text-ink/80 lg:mt-4">
              Fill in your details below to submit your request. Once it&rsquo;s
              reviewed, we&rsquo;ll send you an invitation to join the MXL Circle
              Community, where the rest of your affiliate setup happens.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} className="mt-14">
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
              {FIELDS.map((f) => (
                <Field
                  key={f.name}
                  field={f}
                  value={values[f.name]}
                  onChange={update}
                />
              ))}
            </div>

            <label className="mt-10 block">
              <span className="text-[14px] font-semibold text-ink">Message</span>
              <input
                type="text"
                name="message"
                value={values.message}
                onChange={update}
                className="mt-3 w-full border-b border-ink/40 bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-gold"
              />
            </label>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-gold px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-gold-text disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Submit Application'}
              </button>
              {sent === 'stored' && (
                <p role="status" className="text-[14px] font-medium text-mint">
                  Thanks — your application has been received.
                </p>
              )}
              {sent === 'local' && (
                <p role="status" className="text-[14px] font-medium text-ink/60">
                  Form works, but no database is connected yet, so this wasn&rsquo;t
                  saved.
                </p>
              )}
              {error && (
                <p role="alert" className="text-[14px] font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  )
}
