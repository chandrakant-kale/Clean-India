import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          phone: number,
          password,
        }
      );

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-5 py-10 text-[#252820]">
      <section className="grid w-full max-w-5xl overflow-hidden border border-[#DEDCD3] bg-white md:grid-cols-2">
        {/* Introduction panel */}
        <div className="flex flex-col justify-between bg-[#30382B] p-8 text-[#F8F7F2] sm:p-12">
          <div>
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7CBB9] hover:text-white"
            >
              Clean-India
            </Link>

            <div className="mt-14 sm:mt-20">
              <p className="text-sm text-[#D0A18B]">
                Welcome back
              </p>

              <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Good habits build cleaner communities.
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#D5D7CE]">
                Sign in to continue managing your account and taking part
                in responsible waste disposal.
              </p>
            </div>
          </div>

          <div className="mt-14 border-t border-white/15 pt-5">
            <p className="text-xs leading-5 text-[#C7CBB9]">
              Every responsible action makes a difference.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <div>
            <p className="text-sm font-medium text-[#626B4F]">
              Your account
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Sign in
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#696A61]">
              Enter your registered mobile number and password.
            </p>
          </div>

          {/* Login / Register navigation */}
          <div className="mt-8 grid grid-cols-2 border-b border-[#DEDCD3]">
            <Link
              to="/login"
              aria-current="page"
              className="border-b-2 border-[#C65B35] px-4 py-3 text-center text-sm font-semibold text-[#252820]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border-b-2 border-transparent px-4 py-3 text-center text-sm font-medium text-[#858579] transition-colors hover:text-[#252820]"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[#252820]"
              >
                Mobile number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter 10-digit mobile number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                maxLength={10}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number"
                className="w-full border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3.5 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#252820]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3.5 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-between bg-[#30382B] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C65B35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Login to dashboard"}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="mt-7 text-sm text-[#696A61]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#A7472B] underline decoration-[#A7472B]/30 underline-offset-4 transition-colors hover:text-[#C65B35]"
            >
              Create an account
            </Link>
          </p>

          <Link
            to="/"
            className="mt-8 self-start text-xs text-[#858579] transition-colors hover:text-[#252820]"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}