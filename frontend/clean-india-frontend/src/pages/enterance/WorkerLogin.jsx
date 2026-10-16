import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function WorkerLogin() {
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

      if (res.data.role !== "worker") {
        alert("This login is only for workers. Please use the citizen login.");
        return;
      }

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
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C7CBB9] transition-colors hover:text-white"
            >
              Clean-India
            </Link>

            <div className="mt-16 sm:mt-20">
              <p className="text-sm text-[#D0A18B]">
                Worker portal
              </p>

              <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Your work keeps communities cleaner.
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#D5D7CE]">
                Sign in to access your worker dashboard and continue your
                waste collection and verification work.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-white/15 pt-5">
            <p className="text-xs leading-5 text-[#C7CBB9]">
              Every collection is a step toward a cleaner community.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <div>
            <p className="text-sm font-medium text-[#626B4F]">
              Staff access
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Worker login
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#696A61]">
              Enter your registered mobile number and password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-9 space-y-6">
            <div>
              <label
                htmlFor="worker-phone"
                className="mb-2 block text-sm font-medium text-[#252820]"
              >
                Mobile number
              </label>

              <input
                id="worker-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter 10-digit mobile number"
                value={number}
                onChange={(e) =>
                  setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                maxLength={10}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number"
                className="w-full border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3.5 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15"
                required
              />
            </div>

            <div>
              <label
                htmlFor="worker-password"
                className="mb-2 block text-sm font-medium text-[#252820]"
              >
                Password
              </label>

              <input
                id="worker-password"
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
              <span>
                {loading ? "Signing in..." : "Login as worker"}
              </span>
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="mt-7 border-t border-[#DEDCD3] pt-6">
            <p className="text-sm text-[#696A61]">
              Not a worker?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#A7472B] underline decoration-[#A7472B]/30 underline-offset-4 transition-colors hover:text-[#C65B35]"
              >
                Citizen login
              </Link>
            </p>

            <Link
              to="/"
              className="mt-5 inline-block text-xs text-[#858579] transition-colors hover:text-[#252820]"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}