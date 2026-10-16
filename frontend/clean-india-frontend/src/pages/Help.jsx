import React from "react";

const wasteProcesses = [
  {
    number: "01",
    title: "Waste segregation",
    description:
      "Collected waste is separated into wet, dry, and hazardous categories at processing centres for appropriate treatment.",
    icon: (
      <>
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        <circle cx="12" cy="12" r="6" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    number: "02",
    title: "Composting",
    description:
      "Organic waste, such as food leftovers, can be converted into compost for agriculture, gardens, and public parks.",
    icon: (
      <>
        <path d="M12 21c-4.5-2.5-7-6-7-10a5 5 0 0 1 10 0c0 4-1 7-3 10Z" />
        <path d="M12 21c0-5 2-9 7-12" />
        <path d="M15 6c2-2 4-2 6-2-1 3-3 5-6 6" />
      </>
    ),
  },
  {
    number: "03",
    title: "Recycling",
    description:
      "Materials such as plastic, paper, metal, and glass can be sent to recycling facilities and used to make new products.",
    icon: (
      <>
        <path d="m7 7 3-4 3 4" />
        <path d="M10 3v7H4" />
        <path d="m17 17-3 4-3-4" />
        <path d="M14 21v-7h6" />
        <path d="m20 8-1-5-5 1" />
        <path d="M19 3a8 8 0 0 0-6 4" />
      </>
    ),
  },
  {
    number: "04",
    title: "Waste to energy",
    description:
      "Suitable waste may be processed to produce electricity or biogas, helping recover useful energy from discarded materials.",
    icon: (
      <>
        <path d="m13 2-3 8h6l-5 12 1-9H6l7-11Z" />
      </>
    ),
  },
  {
    number: "05",
    title: "Hazardous waste handling",
    description:
      "Medical and chemical waste requires separate collection and specialised treatment to reduce risks to people, soil, and water.",
    icon: (
      <>
        <path d="M10 3h4m-3 0v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-6-10V3" />
        <path d="M8 16h8" />
      </>
    ),
  },
];

const citizenBenefits = [
  "Earn money for responsible waste disposal",
  "Receive reward points based on waste weight",
  "Redeem eligible discount coupons and vouchers",
  "Review waste disposal history",
  "Use QR-based collection verification",
];

function LineIcon({ children, className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
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

export default function Help() {
  return (
    <main className="min-h-screen bg-[#F8F7F2] text-[#252820]">
      {/* Header */}
      <header className="border-b border-[#DEDCD3]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
            Clean-India / Help centre
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px] md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                A little guidance.
                <span className="block text-[#626B4F]">
                  A cleaner tomorrow.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#696A61] sm:text-base">
                Learn how Clean-India supports responsible waste disposal,
                how collection verification works, and how citizens can
                participate in building cleaner communities.
              </p>
            </div>

            <div className="border-l-2 border-[#C65B35] py-2 pl-5">
              <p className="text-sm font-medium leading-6">
                Better waste management starts with informed choices.
              </p>
              <p className="mt-2 text-xs leading-5 text-[#858579]">
                Find guidance for citizens and collection workers.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-12 sm:px-8 sm:py-16">
        {/* Why waste collection matters */}
        <section className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C65B35]">
              01 / The purpose
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              Why proper waste collection matters
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm leading-7 text-[#696A61] sm:text-base">
              Proper waste collection helps maintain public health, reduce
              pollution, and protect the environment. Clean-India encourages
              citizens to dispose of waste responsibly by connecting them
              with government cleaning vehicles through a QR-based
              verification system.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-3">
              {[
                ["01", "Responsible disposal"],
                ["02", "Verified collection"],
                ["03", "Community participation"],
              ].map(([number, label]) => (
                <div key={number} className="bg-[#EFEEE6] p-4 sm:p-5">
                  <span className="font-mono text-xs text-[#858579]">
                    {number}
                  </span>
                  <p className="mt-3 text-sm font-medium leading-5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waste processing */}
        <section>
          <div className="mb-7 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C65B35]">
              02 / After collection
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              How collected waste can be processed
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#696A61]">
              Different waste materials require different treatment
              methods. Appropriate processing helps recover resources and
              minimise environmental harm.
            </p>
          </div>

          <div className="grid gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2 lg:grid-cols-3">
            {wasteProcesses.map((item) => (
              <article
                key={item.number}
                className={`flex flex-col bg-white p-6 transition-colors hover:bg-[#FBFAF6] sm:p-7 ${
                  item.number === "05" ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center bg-[#EFEEE6] text-[#626B4F]">
                    <LineIcon>{item.icon}</LineIcon>
                  </div>

                  <span className="font-mono text-xs text-[#858579]">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#696A61]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-[#858579]">
            Actual treatment methods depend on local facilities, waste
            composition, and applicable waste-management procedures.
          </p>
        </section>

        {/* Citizen benefits */}
        <section className="grid gap-8 border-y border-[#DEDCD3] py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C65B35]">
              03 / For citizens
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              Participate. Dispose responsibly. Earn rewards.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#696A61]">
              Clean-India brings collection verification, disposal records,
              and reward-related features into one place.
            </p>
          </div>

          <ul className="divide-y divide-[#DEDCD3] border-y border-[#DEDCD3]">
            {citizenBenefits.map((benefit, index) => (
              <li
                key={benefit}
                className="flex items-center gap-4 py-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#D5DDCB] bg-[#EEF0E8] text-xs font-semibold text-[#626B4F]">
                  {index + 1}
                </span>

                <span className="text-sm leading-6 text-[#252820]">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Assistance */}
        <section className="grid gap-8 bg-[#30382B] p-6 text-[#F8F7F2] sm:p-9 md:grid-cols-[1fr_auto] md:items-center lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D5A66D]">
              04 / Need assistance?
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              We&apos;re here to help.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
              If you have trouble with registration, QR verification,
              rewards, or payments, contact support or speak with your
              local collection staff.
            </p>
          </div>

          <div className="border-t border-white/20 pt-5 md:min-w-64 md:border-l md:border-t-0 md:pl-7 md:pt-0">
            <div className="flex items-start gap-3">
              <LineIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#D5A66D]">
                <rect x="3" y="5" width="18" height="14" rx="1" />
                <path d="m3 7 9 6 9-6" />
              </LineIcon>

              <div>
                <p className="text-xs text-white/60">Email support</p>
                <p className="mt-1 break-all text-sm font-medium">
                  support@cleanindia.gov
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <LineIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#D5A66D]">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
              </LineIcon>

              <div>
                <p className="text-xs text-white/60">Helpline</p>
                <p className="mt-1 text-sm font-medium">
                  1800-123-456
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xs text-xs leading-5 text-white/50">
              Confirm these contact details are active before publishing.
            </p>
          </div>
        </section>

        {/* Closing statement */}
        <footer className="pb-4 text-center">
          <div className="mx-auto mb-5 h-px w-12 bg-[#C65B35]" />
          <p className="text-lg font-medium tracking-tight text-[#626B4F] sm:text-xl">
            “Clean surroundings reflect a responsible society.”
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#858579]">
            Clean-India
          </p>
        </footer>
      </div>
    </main>
  );
}