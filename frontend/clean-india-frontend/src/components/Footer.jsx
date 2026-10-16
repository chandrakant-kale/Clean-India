import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#DEDCD3] bg-[#F8F7F2] text-[#252820]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-8 sm:py-16 lg:px-12">

        {/* Main footer */}
        <div className="grid gap-12 border-b border-[#DEDCD3] pb-12 md:grid-cols-2 md:gap-20 lg:gap-32">

          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="CLEAN-INDIA home"
              className="inline-flex flex-col gap-2"
            >
              <span className="text-2xl font-extrabold tracking-[-1px] text-[#252820]">
                CLEAN<span className="text-[#C65B35]">-INDIA</span>
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[2.5px] text-[#77786E]">
                A cleaner tomorrow
              </span>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#696A61] sm:text-base">
              A civic-tech initiative encouraging responsible waste disposal
              through technology, collection services, and community
              participation.
            </p>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center border border-[#DEDCD3] text-[#626B4F] transition-colors hover:border-[#C65B35] hover:text-[#C65B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
              >
                <svg
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-[#DEDCD3] text-[#626B4F] transition-colors hover:border-[#C65B35] hover:text-[#C65B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
              >
                <svg
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center border border-[#DEDCD3] text-[#626B4F] transition-colors hover:border-[#C65B35] hover:text-[#C65B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
              >
                <svg
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mission */}
          <div className="flex flex-col">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#C65B35]" />
              <h2 className="text-xs font-bold uppercase tracking-[2px] text-[#626B4F]">
                Our mission
              </h2>
            </div>

            <h3 className="max-w-md text-2xl font-semibold leading-snug tracking-[-0.8px] text-[#252820] sm:text-3xl">
              Building cleaner communities through collective action.
            </h3>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#696A61] sm:text-base">
              Supporting{' '}
              <span className="font-semibold text-[#626B4F]">
                Swachh Bharat Abhiyan
              </span>{' '}
              through responsible waste disposal, technology, and community
              participation.
            </p>

            <div className="mt-7 flex items-center gap-4 border-t border-[#DEDCD3] pt-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <p className="max-w-xs text-xs leading-6 text-[#77786E] sm:text-sm">
                Making India cleaner, one responsible action at a time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#858579]">
            © {new Date().getFullYear()} CLEAN-INDIA. All rights reserved.
          </p>

          <nav
            aria-label="Legal and support links"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            <Link
              to="/privacy"
              className="text-xs text-[#696A61] transition-colors hover:text-[#C65B35]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-[#696A61] transition-colors hover:text-[#C65B35]"
            >
              Terms of Service
            </Link>

            <Link
              to="/help"
              className="text-xs text-[#696A61] transition-colors hover:text-[#C65B35]"
            >
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}