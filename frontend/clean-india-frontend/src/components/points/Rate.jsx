export default function Rate() {
  const rates = [
    {
      number: '01',
      title: 'Dry Waste',
      description: 'Plastic, Paper, Metal',
      rate: '₹5',
      unit: '/ kg',
      category: 'RECYCLABLE MATERIALS',
    },
    {
      number: '02',
      title: 'Wet Waste',
      description: 'Food & Organic Waste',
      rate: '₹3',
      unit: '/ kg',
      category: 'ORGANIC MATERIALS',
    },
    {
      number: '03',
      title: 'E-Waste',
      description: 'Electronics & Batteries',
      rate: '₹10',
      unit: '/ kg',
      category: 'ELECTRONIC MATERIALS',
    },
  ];

  return (
    <section className="mx-auto my-10 max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="border-y border-[#DEDCD3] bg-[#F8F7F2] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">

        {/* Heading */}
        <div className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#C65B35]" />
              <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#626B4F]">
                Waste collection incentives
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-[-1.5px] text-[#252820] sm:text-4xl lg:text-5xl">
              Waste reward rates
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#696A61] sm:text-base">
            Understand the listed reward rates for different categories
            of waste.
          </p>
        </div>

        {/* Rate table */}
        <div className="border-l border-t border-[#DEDCD3]">
          {rates.map((item) => (
            <article
              key={item.number}
              className="group grid grid-cols-[44px_1fr] gap-x-4 border-b border-r border-[#DEDCD3] p-5 transition-colors duration-200 hover:bg-[#EFEEE6] sm:grid-cols-[60px_1fr_auto] sm:items-center sm:gap-6 sm:px-7 sm:py-7 lg:px-9"
            >
              {/* Index */}
              <span className="row-span-2 pt-1 text-sm font-semibold tabular-nums text-[#929284] sm:row-span-1 sm:pt-0">
                {item.number}
              </span>

              {/* Category */}
              <div className="min-w-0">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#858579]">
                  {item.category}
                </p>

                <h3 className="text-xl font-semibold tracking-[-0.5px] text-[#252820] sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-[#696A61]">
                  {item.description}
                </p>
              </div>

              {/* Rate */}
              <div className="col-start-2 mt-5 flex items-baseline gap-1 sm:col-start-auto sm:mt-0 sm:justify-self-end">
                <span className="text-3xl font-semibold tracking-[-1px] text-[#626B4F] sm:text-4xl">
                  {item.rate}
                </span>
                <span className="text-sm font-medium text-[#858579]">
                  {item.unit}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#858579]">
            Rates shown are subject to your actual reward programme rules.
          </p>

          <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#626B4F]">
            CLEAN-INDIA / REWARD RATES
          </span>
        </div>
      </div>
    </section>
  );
}