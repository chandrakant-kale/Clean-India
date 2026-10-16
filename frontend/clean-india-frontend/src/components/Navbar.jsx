import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Help', path: '/help' },
    { label: 'Contact', path: '/contact' },
    { label: 'Rewards', path: '/rewards' },
    ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  const linkClass = (path) =>
    `relative py-2 text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-[#C65B35] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#C65B35]'
        : 'text-[#696A61] hover:text-[#252820]'
    }`;

  return (
    <header className="relative z-50 mx-auto mt-4 w-[calc(100%-2rem)] max-w-[1440px] border border-[#DEDCD3] bg-[#F8F7F2] sm:mt-6 sm:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)]">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">

        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="CLEAN-INDIA home"
          className="flex shrink-0 flex-col gap-1"
        >
          <span className="text-xl font-extrabold tracking-[-1px] text-[#252820] sm:text-2xl">
            CLEAN<span className="text-[#C65B35]">-INDIA</span>
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-[2px] text-[#77786E]">
            A cleaner tomorrow
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 md:flex lg:gap-9"
        >
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={linkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Account actions */}
        <div className="flex shrink-0 items-center gap-3">
          {user ? (
            <>
              <span className="hidden max-w-[130px] truncate text-sm font-medium text-[#45463F] lg:block">
                {user.name}
              </span>

              <button
                type="button"
                onClick={logout}
                className="hidden border border-[#DEDCD3] px-4 py-2.5 text-sm font-semibold text-[#45463F] transition-colors hover:border-[#C65B35] hover:bg-[#C65B35] hover:text-white sm:block"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="hidden min-h-10 items-center gap-3 bg-[#30382B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] sm:inline-flex sm:px-5"
            >
              Get started
              <span aria-hidden="true">↗</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-mobile-menu"
            className="flex h-10 w-10 items-center justify-center border border-[#DEDCD3] text-[#252820] transition-colors hover:bg-[#EFEEE6] md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6L18 18M18 6L6 18" />
              ) : (
                <path d="M4 7H20M4 12H20M4 17H20" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="main-mobile-menu"
          className="border-t border-[#DEDCD3] bg-[#F8F7F2] px-5 pb-5 md:hidden"
        >
          {user && (
            <div className="border-b border-[#DEDCD3] py-4">
              <p className="text-sm font-semibold text-[#252820]">
                {user.name}
              </p>
              <p className="mt-1 text-xs text-[#77786E]">Your account</p>
            </div>
          )}

          <nav aria-label="Mobile navigation" className="py-2">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`block border-b border-[#E5E2D9] py-3.5 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-[#C65B35]'
                    : 'text-[#45463F] hover:text-[#C65B35]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full border border-[#DEDCD3] px-4 py-3 text-sm font-semibold text-[#45463F] transition-colors hover:border-[#C65B35] hover:bg-[#C65B35] hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-4 flex min-h-11 items-center justify-between bg-[#30382B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#48533E]"
            >
              Get started
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}