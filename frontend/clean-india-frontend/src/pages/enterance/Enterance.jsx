import { Link } from "react-router-dom";

export default function Enterance() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-5 py-12 text-[#252820]">
      <section className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#DEDCD3] bg-white">
        <div className="grid md:grid-cols-2">
          {/* Intro section */}
          <div className="flex flex-col justify-between bg-[#30382B] p-8 text-[#F8F7F2] sm:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7CBB9]">
                Clean-India Initiative
              </p>

              <div className="mt-16 max-w-md">
                <span className="text-sm text-[#D0A18B]">
                  Small actions. Cleaner communities.
                </span>

                <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  A cleaner future starts with you.
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-[#D5D7CE]">
                  Join your community in responsible waste disposal and help
                  make everyday spaces cleaner.
                </p>
              </div>
            </div>

            <div className="mt-16 border-t border-white/15 pt-5">
              <p className="text-xs text-[#C7CBB9]">
                Responsible disposal begins with one step.
              </p>
            </div>
          </div>

          {/* Action section */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-sm font-medium text-[#626B4F]">
              Welcome
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Get started
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#696A61]">
              Choose how you would like to continue.
            </p>

            <div className="mt-10 space-y-4">
              <Link
                to="/login"
                className="group flex w-full items-center justify-between border border-[#30382B] bg-[#30382B] px-5 py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C65B35]"
              >
                <span>Login to your account</span>
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                to="/register"
                className="group flex w-full items-center justify-between border border-[#DEDCD3] bg-[#F8F7F2] px-5 py-4 text-sm font-medium text-[#252820] transition-colors duration-200 hover:border-[#C65B35] hover:bg-[#EFEEE6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C65B35]"
              >
                <span>Create an account</span>
                <span
                  aria-hidden="true"
                  className="text-lg text-[#C65B35] transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            <p className="mt-8 text-xs leading-5 text-[#858579]">
              By continuing, you help build cleaner and more responsible
              communities.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}