const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Register on CLEAN-INDIA and access your citizen account and QR code.',
    label: 'REGISTRATION',
  },
  {
    number: '02',
    title: 'Prepare your waste',
    description:
      'Separate your waste and make it ready for collection according to local guidelines.',
    label: 'PREPARATION',
  },
  {
    number: '03',
    title: 'Verify collection',
    description:
      'A collection worker scans your QR code and records the collected waste.',
    label: 'VERIFICATION',
  },
  {
    number: '04',
    title: 'Track your rewards',
    description:
      'View your recorded collection and check eligible rewards in your account.',
    label: 'REWARDS',
  },
];

export default function Info() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-8 lg:px-12">
      <div className="border-y border-[#DEDCD3] bg-[#F8F7F2] py-16 sm:py-20 lg:py-24">

        {/* Section heading */}
        <div className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#C65B35]" />
              <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#626B4F]">
                From disposal to collection
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-tight tracking-[-1.5px] text-[#252820] sm:text-4xl lg:text-5xl">
              A simple process.
              <span className="block text-[#626B4F]">
                A cleaner neighbourhood.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#696A61] sm:text-base">
            Every step helps make waste collection more organised,
            transparent, and accountable.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 border-l border-t border-[#DEDCD3] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group flex min-h-[250px] flex-col border-b border-r border-[#DEDCD3] p-6 transition-colors duration-200 hover:bg-[#EFEEE6] sm:min-h-[280px] sm:p-7 lg:p-6 xl:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold tabular-nums text-[#626B4F]">
                  {step.number}
                </span>

                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center border border-[#D6D5C9] text-lg text-[#626B4F] transition-colors duration-200 group-hover:border-[#626B4F] group-hover:bg-[#626B4F] group-hover:text-white"
                >
                  ↗
                </span>
              </div>

              <div className="mt-10">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[2px] text-[#969588]">
                  {step.label}
                </p>

                <h3 className="text-xl font-semibold tracking-[-0.5px] text-[#252820]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#696A61]">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#858579]">
            Better waste management starts with responsible participation.
          </p>

          <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#626B4F]">
            CLEAN-INDIA / PROCESS
          </span>
        </div>
      </div>
    </section>
  );
}
