import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = {
  owner: [
    { label: 'Coupons', path: '/owner-coupons' },
    { label: 'Workers', path: '/workers-monitoring' },
    { label: 'Profile', path: '/profile' },
  ],
  worker: [
    { label: 'Start Shift', path: '/worker-start-shift' },
    { label: 'Verify QR', path: '/worker-verify' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
  ],
  citizen: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Profile', path: '/profile' },
  ],
};

const homeRoutes = {
  owner: '/owner-coupons',
  worker: '/worker-start-shift',
  citizen: '/dashboard',
};

export default function AuthNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role || 'citizen';
  const links = navigation[role] || navigation.citizen;
  const homeRoute = homeRoutes[role] || '/dashboard';

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative block py-2 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-[#C65B35] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#C65B35]'
        : 'text-[#65665D] hover:text-[#252820]'
    }`;

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <header className="relative z-50 w-full border-b border-[#DEDCD3] bg-[#F8F7F2]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          to={homeRoute}
          onClick={() => setMenuOpen(false)}
          aria-label="Clean India home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-[#D8D8C9] bg-[#E9EADD]">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M7 23.5C7 13 13.5 7 25 6.5C24.5 18 18.5 24.5 8 24.5"
                stroke="#555F43"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M7 26L20 13"
                stroke="#555F43"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M19.5 24.5H26"
                stroke="#C65B35"
                strokeWidth="2"
              />
            </svg>
          </span>

          <span className="flex flex-col gap-0.5">
            <span className="text-[17px] font-extrabold leading-none tracking-[-0.8px] text-[#252820]">
              CLEAN<span className="text-[#C65B35]">-INDIA</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[2px] text-[#77786E]">
              A cleaner tomorrow
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex lg:gap-9"
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

        {/* Account controls */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="hidden text-right sm:block">
            <p className="max-w-[150px] truncate text-sm font-semibold text-[#252820]">
              {user?.name || 'Account'}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#858579]">
              {role}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden border border-[#D6D4CA] px-4 py-2 text-sm font-semibold text-[#45463F] transition-colors hover:border-[#C65B35] hover:bg-[#C65B35] hover:text-white sm:block"
          >
            Sign out
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center border border-[#DEDCD3] text-[#252820] transition-colors hover:bg-[#E9EADD] md:hidden"
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
          id="mobile-navigation"
          className="border-t border-[#DEDCD3] bg-[#F8F7F2] px-5 pb-5 md:hidden"
        >
          <div className="border-b border-[#E5E2D9] py-4">
            <p className="text-sm font-semibold text-[#252820]">
              {user?.name || 'Account'}
            </p>
            <p className="mt-1 text-xs capitalize text-[#77786E]">
              {role} account
            </p>
          </div>

          <nav aria-label="Mobile navigation" className="py-2">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-[#EAE8E0] py-3.5 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-[#C65B35]'
                    : 'text-[#45463F] hover:text-[#C65B35]'
                }`}
              >
                <span className="flex items-center justify-between">
                  {item.label}
                  {isActive(item.path) && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#C65B35]"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full border border-[#D6D4CA] px-4 py-3 text-sm font-semibold text-[#45463F] transition-colors hover:border-[#C65B35] hover:bg-[#C65B35] hover:text-white"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}