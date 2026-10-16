import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactDetails = [
  {
    title: "Email",
    value: "support@cleanindia.gov.in",
    description: "For questions and general enquiries",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    title: "Phone",
    value: "1800-XXX-XXXX",
    description: "Toll-free support line",
    icon: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
      </>
    ),
  },
  {
    title: "Office",
    value: "Ministry of Environment",
    description: "New Delhi, India",
    icon: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

function ContactIcon({ children, className = "" }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  multiline = false,
}) {
  const sharedClasses = `w-full border bg-[#F8F7F2] px-4 py-3.5 text-sm text-[#252820] outline-none transition placeholder:text-[#A09F94] focus:border-[#626B4F] focus:ring-1 focus:ring-[#626B4F] ${
    error ? "border-[#C65B35]" : "border-[#DEDCD3]"
  }`;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#252820]"
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={`${sharedClasses} resize-y`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}

      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-xs text-[#B34D2C]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [contact, setContact] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSuccess(false);
    setErrors({});
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (!contact.name.trim()) {
      err.name = "Name is required";
    }

    if (!contact.email.trim()) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contact.email)) {
      err.email = "Enter a valid email address";
    }

    if (!contact.subject.trim()) {
      err.subject = "Subject is required";
    }

    if (!contact.message.trim()) {
      err.message = "Message is required";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    // Preserve the original simulated submission.
    setTimeout(() => {
      setSuccess(true);
      setContact(initialForm);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12 text-[#252820] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 border-b border-[#DEDCD3] pb-8 sm:mb-14 sm:pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
            Clean-India / Contact
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_320px] md:items-end">
            <div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Let&apos;s make our
                <span className="block text-[#626B4F]">
                  communities cleaner.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#696A61] sm:text-base">
                Have a question, need assistance, or want to share an
                idea? Send us a message and let us know how we can help.
              </p>
            </div>

            <div className="border-l-2 border-[#C65B35] py-1 pl-5">
              <p className="text-sm font-medium leading-6 text-[#252820]">
                Every cleaner community begins with people working
                together.
              </p>
              <p className="mt-2 text-xs leading-5 text-[#858579]">
                We welcome your questions and feedback.
              </p>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          <section className="border border-[#DEDCD3] bg-white">
            <div className="border-b border-[#DEDCD3] px-5 py-5 sm:px-8 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#858579]">
                Contact form
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#696A61]">
                Complete the fields below. All fields are required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 p-5 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  name="name"
                  value={contact.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Your name"
                />

                <FormField
                  label="Email address"
                  name="email"
                  type="email"
                  value={contact.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                />
              </div>

              <FormField
                label="Subject"
                name="subject"
                value={contact.subject}
                onChange={handleChange}
                error={errors.subject}
                placeholder="What would you like help with?"
              />

              <FormField
                label="Message"
                name="message"
                value={contact.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Tell us how we can help..."
                multiline
              />

              <div className="border-t border-[#DEDCD3] pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 bg-[#626B4F] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
                >
                  {loading ? "Sending message..." : "Send message"}

                  {!loading && (
                    <ContactIcon className="h-4 w-4">
                      <path d="M22 2 11 13" />
                      <path d="m22 2-7 20-4-9-9-4Z" />
                    </ContactIcon>
                  )}
                </button>

                {success && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 border-l-4 border-[#626B4F] bg-[#EEF0E8] p-4"
                  >
                    <p className="text-sm font-semibold text-[#48533E]">
                      Message submitted successfully.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#626B4F]">
                      Thank you for getting in touch with Clean-India.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </section>

          <aside>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
                Get in touch
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Contact information
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#696A61]">
                Choose the contact method that works best for you.
              </p>
            </div>

            <div className="divide-y divide-[#DEDCD3] border-y border-[#DEDCD3]">
              {contactDetails.map((item, index) => (
                <article
                  key={item.title}
                  className="flex gap-4 py-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
                    <ContactIcon className="h-5 w-5">
                      {item.icon}
                    </ContactIcon>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#858579]">
                      0{index + 1} / {item.title}
                    </p>

                    <h3 className="mt-2 break-words text-base font-semibold text-[#252820]">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#696A61]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 bg-[#30382B] p-6 text-[#F8F7F2] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D5A66D]">
                Our shared responsibility
              </p>

              <h3 className="mt-3 text-xl font-semibold leading-snug">
                A cleaner India starts with a conversation.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Your suggestions help us improve waste collection and
                community participation.
              </p>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#858579]">
              Please note: the contact details shown here are retained
              from the existing page and should be verified before
              publishing.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}