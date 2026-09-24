import { CircleCheck } from 'lucide-react'
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { INQUIRY_TYPES, type InquiryTypeId } from '../../content/site'
import { cn } from '../../lib/cn'
import { buttonClass } from './ui'

const CONTROL =
  'w-full rounded-xl bg-paper px-4 text-ink ring-1 ring-line ring-inset transition-shadow duration-200 placeholder:text-muted/70 hover:ring-ink/35 focus:ring-2 focus:ring-leaf focus:outline-none user-invalid:ring-[#b4574b]'

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  )
}

function emptyFields(type: InquiryTypeId, message: string) {
  return {
    inquiryType: type,
    fullName: '',
    institutionName: '',
    email: '',
    phone: '',
    location: '',
    message,
  }
}

type Fields = ReturnType<typeof emptyFields>

/**
 * Partnership enquiry form. There is no enquiries endpoint yet, so a valid
 * submission is acknowledged on the page but not sent anywhere.
 */
export function EnquiryForm({
  defaultType = 'franchise',
  initialMessage = '',
}: {
  defaultType?: InquiryTypeId
  initialMessage?: string
}) {
  const [fields, setFields] = useState<Fields>(() => emptyFields(defaultType, initialMessage))
  const [received, setReceived] = useState(false)
  const id = useId()

  const bind = (name: Exclude<keyof Fields, 'inquiryType'>) => ({
    id: `${id}-${name}`,
    name,
    value: fields[name],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((current) => ({ ...current, [name]: event.target.value })),
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setReceived(true)
  }

  if (received) {
    return (
      <div role="status" className="rounded-[1.25rem] bg-leaf-soft p-8 sm:p-10">
        <CircleCheck aria-hidden="true" className="h-8 w-8 text-leaf" />
        <p className="type-subheading mt-5 text-ink">Enquiry received.</p>
        <p className="mt-2 max-w-[40ch]">Our partnerships team will reach out within 48 hours.</p>
        <button
          type="button"
          onClick={() => {
            setFields(emptyFields(fields.inquiryType, ''))
            setReceived(false)
          }}
          className={buttonClass('secondary', 'mt-8')}
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-6 sm:grid-cols-6">
      <fieldset className="sm:col-span-6">
        <legend className="mb-3 text-[0.9375rem] font-semibold text-ink">Inquiry type</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {INQUIRY_TYPES.map((type) => {
            const checked = fields.inquiryType === type.id
            return (
              <label
                key={type.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-inset transition-[background-color,box-shadow] duration-200',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf',
                  checked
                    ? 'bg-leaf-soft ring-2 ring-leaf'
                    : 'bg-paper ring-1 ring-line hover:ring-ink/35',
                )}
              >
                <input
                  type="radio"
                  name="inquiryType"
                  value={type.id}
                  checked={checked}
                  onChange={() => setFields((current) => ({ ...current, inquiryType: type.id }))}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-inset',
                    checked ? 'bg-leaf ring-0' : 'bg-paper ring-2 ring-line',
                  )}
                >
                  {checked ? <span className="h-2 w-2 rounded-full bg-paper" /> : null}
                </span>
                <span className="text-[0.9375rem] leading-snug font-medium text-ink">
                  {type.label}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field id={`${id}-fullName`} label="Full name" className="sm:col-span-3">
        <input
          {...bind('fullName')}
          required
          minLength={2}
          autoComplete="name"
          placeholder="Dr. Ananya Rao"
          className={cn(CONTROL, 'h-12')}
        />
      </Field>
      <Field
        id={`${id}-institutionName`}
        label="School / organization name"
        className="sm:col-span-3"
      >
        <input
          {...bind('institutionName')}
          required
          minLength={2}
          autoComplete="organization"
          placeholder="Sunrise International School"
          className={cn(CONTROL, 'h-12')}
        />
      </Field>
      <Field id={`${id}-email`} label="Institutional email" className="sm:col-span-2">
        <input
          {...bind('email')}
          type="email"
          required
          autoComplete="email"
          placeholder="principal@school.edu.in"
          className={cn(CONTROL, 'h-12')}
        />
      </Field>
      <Field id={`${id}-phone`} label="Phone number" className="sm:col-span-2">
        <input
          {...bind('phone')}
          type="tel"
          required
          minLength={6}
          autoComplete="tel"
          placeholder="+91 98490 00000"
          className={cn(CONTROL, 'h-12')}
        />
      </Field>
      <Field id={`${id}-location`} label="City / region" className="sm:col-span-2">
        <input
          {...bind('location')}
          required
          minLength={2}
          autoComplete="address-level2"
          placeholder="Hyderabad"
          className={cn(CONTROL, 'h-12')}
        />
      </Field>
      <Field
        id={`${id}-message`}
        label="Institutional context / requirements"
        className="sm:col-span-6"
      >
        <textarea
          {...bind('message')}
          required
          minLength={10}
          rows={5}
          placeholder="Tell us about your institution, current enrollment, and where you want to be in 24 months…"
          className={cn(CONTROL, 'resize-y py-3 leading-relaxed')}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-6">
        <button type="submit" className={buttonClass('accent')}>
          Submit enquiry
        </button>
        <p className="text-[0.9375rem] text-muted">Answered within 48 hours.</p>
      </div>
    </form>
  )
}
