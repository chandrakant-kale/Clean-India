import { Link } from 'react-router-dom';
import wasteImg from '../../images/waste.png';

export default function Last() {
  return (
    <section className="mx-auto mb-10 max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid overflow-hidden border border-[#DEDCD3] bg-[#F8F7F2] md:grid-cols-2">

        {/* Image panel */}
        <div className="relative min-h-[300px] overflow-hidden bg-[#E6E5DA] sm:min-h-[380px] md:min-h-full">
          <img
            src={wasteImg}
            alt="Responsible waste disposal"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#252820]/15"
          />

          {/* Image caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171A15]/80 to-transparent px-6 pb-7 pt-20 sm:px-9 sm:pb-9">
            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-white/75">
              CLEAN-INDIA / OUR MISSION
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-1px] text-white sm:text-4xl">
              A cleaner future
              <span className="block text-[#D9DDC8]">
                starts with us.
              </span>
            </h2>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">

          <div className="mb-7 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#C65B35]" />
            <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#626B4F]">
              Take the first step
            </span>
          </div>

          <h3 className="max-w-lg text-3xl font-semibold leading-tight tracking-[-1.5px] text-[#252820] sm:text-4xl lg:text-5xl">
            Small actions.
            <span className="block text-[#626B4F]">
              Meaningful change.
            </span>
          </h3>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#696A61] sm:text-base sm:leading-8">
            CLEAN-INDIA is a civic-tech initiative that encourages
            responsible waste disposal by connecting citizens with
            waste collection services and supporting participation
            through incentives.
          </p>

          <div className="mt-9">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-6 bg-[#30382B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C65B35]"
            >
              Get started
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Footer detail */}
          <div className="mt-12 border-t border-[#DEDCD3] pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#858579]">
              Responsible disposal. Better communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}