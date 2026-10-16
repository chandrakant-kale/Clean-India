import dayWasteImg from '../../images/waste2.png';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="mx-auto mt-6 mb-10 max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid overflow-hidden border border-[#DEDCD3] bg-[#F8F7F2] md:grid-cols-[1.05fr_0.95fr]">

        {/* Left: Editorial content */}
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">

          <div className="mb-8 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#C65B35]" />
            <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#626653]">
              A cleaner India starts here
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-2.5px] text-[#252820] sm:text-6xl lg:text-[68px]">
            Waste has a place.
            <span className="mt-2 block text-[#626B4F]">
              Let's find it.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-7 text-[#696A61] sm:text-lg sm:leading-8">
            A smarter way to manage everyday waste. Connect with collection
            services, dispose of waste responsibly, and contribute to a cleaner
            neighbourhood.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-5 bg-[#30382B] px-6 py-3 text-sm font-semibold 
              text-white transition-colors hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-4 
              focus-visible:outline-[#C65B35]"
            >
              Get started
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/help"
              className="inline-flex min-h-12 items-center justify-center border-b border-[#B9B8AC] px-1 py-3 text-sm 
              font-semibold text-[#45463F] transition-colors hover:border-[#C65B35] hover:text-[#C65B35] focus-visible:outline-2 
              focus-visible:outline-offset-4 focus-visible:outline-[#C65B35]"
            >
              How it works
            </Link>
          </div>

          {/* Editorial footer */}
          <div className="mt-12 border-t border-[#DEDCD3] pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#88887C]">
              Responsible disposal. Better communities.
            </p>
          </div>
        </div>

        {/* Right: Photography */}
        <div className="relative min-h-[340px] bg-[#E6E5DA] sm:min-h-[460px] md:min-h-full">
          <img
            src={dayWasteImg}
            alt="Waste management and cleaner communities"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Restrained image treatment */}
          <div
            className="absolute inset-0 bg-[#252820]/10"
            aria-hidden="true"
          />

          {/* Image caption */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#171A15]/80 to-transparent px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/75">
                Our shared responsibility
              </p>
              <p className="mt-2 max-w-xs text-xl font-medium tracking-tight text-white sm:text-2xl">
                Cleaner streets begin with everyday action.
              </p>
            </div>

            <span className="hidden shrink-0 border border-white/40 px-3 py-2 text-xs font-medium text-white sm:block">
              CLEAN-INDIA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}