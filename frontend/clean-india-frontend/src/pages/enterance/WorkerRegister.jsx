import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  locationData,
  getDistricts,
  getTalukas,
  getVillages,
} from "../../data/locationData";

const API = "http://localhost:5000/api/auth";

const inputClass =
  "w-full rounded-lg border border-[#DEDCD3] bg-white px-4 py-3 text-sm text-[#252820] placeholder:text-[#A09F95] outline-none transition focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/10 disabled:cursor-not-allowed disabled:bg-[#EFEEE6] disabled:text-[#858579]";

const labelClass =
  "mb-2 block text-sm font-medium text-[#393B33]";

function FieldError({ children }) {
  if (!children) return null;

  return <p className="mt-1.5 text-xs text-[#B54435]">{children}</p>;
}

function Field({ label, error, className = "", children }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export default function WorkerRegister() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    address: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    role: "worker",
  });

  const [errors, setErrors] = useState({});
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState("");

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    setTimer(300);

    timerRef.current = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

    if (name === "mobile") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      setFormData((previous) => ({
        ...previous,
        mobile: digits,
      }));

      setErrors((previous) => ({
        ...previous,
        mobile: "",
      }));

      return;
    }

    if (name === "state") {
      setDistricts(getDistricts(value));
      setTalukas([]);
      setVillages([]);

      setFormData((previous) => ({
        ...previous,
        state: value,
        district: "",
        taluka: "",
        village: "",
      }));

      return;
    }

    if (name === "district") {
      setTalukas(getTalukas(formData.state, value));
      setVillages([]);

      setFormData((previous) => ({
        ...previous,
        district: value,
        taluka: "",
        village: "",
      }));

      return;
    }

    if (name === "taluka") {
      setVillages(getVillages(formData.state, formData.district, value));

      setFormData((previous) => ({
        ...previous,
        taluka: value,
        village: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  }

  function validate() {
    const nextErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (!nameRegex.test(formData.firstName.trim())) {
      nextErrors.firstName = "Use letters only.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (!nameRegex.test(formData.lastName.trim())) {
      nextErrors.lastName = "Use letters only.";
    }

    if (!/^[789]\d{9}$/.test(formData.mobile)) {
      nextErrors.mobile =
        "Enter a valid 10-digit number starting with 7, 8, or 9.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (!formData.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!formData.state) nextErrors.state = "Select a state.";
    if (!formData.district) nextErrors.district = "Select a district.";
    if (!formData.taluka) nextErrors.taluka = "Select a taluka.";
    if (!formData.village) nextErrors.village = "Select a village or city.";

    return nextErrors;
  }

  async function sendOTP() {
    if (!/^[789]\d{9}$/.test(formData.mobile)) {
      setErrors({
        mobile: "Enter a valid 10-digit number starting with 7, 8, or 9.",
      });
      return;
    }

    setLoading(true);
    setRequestType("send");

    try {
      const response = await fetch(`${API}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to send OTP.");
        return;
      }

      setOtpSent(true);
      setOtpStep(true);
      setOtpVerified(false);
      setOtp("");
      startTimer();

      alert("OTP sent to your mobile number.");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRequestType("");
    }
  }

  async function verifyOTP() {
    if (timer <= 0) {
      alert("Your OTP has expired. Please request a new one.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      alert("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setRequestType("verify");

    try {
      const response = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.mobile,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid OTP.");
        return;
      }

      setOtpVerified(true);
      clearInterval(timerRef.current);
      setTimer(0);

      alert("Mobile number verified successfully.");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRequestType("");
    }
  }

  function changeMobileNumber() {
    clearInterval(timerRef.current);
    setOtp("");
    setOtpSent(false);
    setOtpStep(false);
    setOtpVerified(false);
    setTimer(0);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!otpVerified) {
      alert("Please verify your mobile number first.");
      return;
    }

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setRequestType("register");

    try {
      const response = await fetch(`${API}/register-worker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          phone: formData.mobile,
          password: formData.password,
          address: formData.address.trim(),
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          village: formData.village,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Worker registration successful. Please log in.");
      navigate("/login");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRequestType("");
    }
  }

  const isBusy = loading;

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#DEDCD3] bg-white lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#30382B] p-10 text-[#F8F7F2] lg:flex xl:p-12">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-8 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full border border-[#C65B35]/30" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C65B35] text-lg font-semibold text-white">
                C
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Clean-India
              </span>
            </Link>
          </div>

          <div className="relative my-16">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#C9CEBB]">
              Worker registration
            </p>

            <h1 className="max-w-md text-4xl font-medium leading-tight tracking-tight xl:text-5xl">
              Make your work matter.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#D2D5CA]">
              Join the people helping keep our communities cleaner, one
              collection at a time.
            </p>

            <div className="mt-10 h-px w-16 bg-[#C65B35]" />
            <p className="mt-5 text-sm leading-6 text-[#D2D5CA]">
              A cleaner neighbourhood begins with people who care.
            </p>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-xs text-[#BFC5B5]">
            <span>Community. Cleanliness. Change.</span>
            <span>01 / 03</span>
          </div>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10 xl:p-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#30382B] font-semibold text-white">
                C
              </span>
              <span className="font-semibold">Clean-India</span>
            </Link>

            <span className="ml-auto rounded-full border border-[#DEDCD3] px-3 py-1.5 text-xs font-medium text-[#696A61]">
              Worker account
            </span>
          </div>

          <header className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
              Join the collection team
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#696A61]">
              Enter your details to register as a waste collection worker.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFEEE6] text-xs font-semibold text-[#48533E]">
                  01
                </span>
                <h3 className="text-sm font-semibold">Personal information</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={errors.firstName}>
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Last name" error={errors.lastName}>
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Mobile number" error={errors.mobile} className="sm:col-span-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-4 flex items-center text-sm text-[#696A61]">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        disabled={otpSent}
                        maxLength={10}
                        className={`${inputClass} pl-14`}
                        required
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={isBusy}
                        className="rounded-lg bg-[#30382B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#48533E] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {requestType === "send" ? "Sending…" : "Send OTP"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={changeMobileNumber}
                        disabled={isBusy || otpVerified}
                        className="rounded-lg border border-[#DEDCD3] px-4 py-3 text-sm font-medium text-[#48533E] transition hover:bg-[#EFEEE6] disabled:opacity-50"
                      >
                        Change number
                      </button>
                    )}
                  </div>
                </Field>

                {otpStep && (
                  <div className="rounded-xl border border-[#DEDCD3] bg-[#F8F7F2] p-4 sm:col-span-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#252820]">
                          Verify your mobile number
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#696A61]">
                          Enter the six-digit code sent to your phone.
                        </p>
                      </div>

                      {otpVerified ? (
                        <span className="rounded-full bg-[#E5EADD] px-3 py-1 text-xs font-medium text-[#48533E]">
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs font-medium tabular-nums text-[#626B4F]">
                          Expires in {Math.floor(timer / 60)}:
                          {String(timer % 60).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(event) =>
                          setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="000000"
                        maxLength={6}
                        disabled={otpVerified || timer <= 0}
                        className={`${inputClass} tracking-[0.3em] sm:max-w-xs`}
                      />

                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={verifyOTP}
                          disabled={isBusy || timer <= 0 || otp.length !== 6}
                          className="rounded-lg bg-[#626B4F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#48533E] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {requestType === "verify" ? "Verifying…" : "Verify code"}
                        </button>
                      )}
                    </div>

                    {timer <= 0 && !otpVerified && (
                      <p className="mt-3 text-xs text-[#B54435]">
                        This code has expired. Change the number and restart
                        verification to request a fresh code.
                      </p>
                    )}

                    {otpVerified && (
                      <p className="mt-3 text-xs font-medium text-[#48533E]">
                        Your mobile number has been verified.
                      </p>
                    )}
                  </div>
                )}

                <Field label="Password" error={errors.password} className="sm:col-span-2">
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className={inputClass}
                    minLength={8}
                    required
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-[#DEDCD3] pt-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFEEE6] text-xs font-semibold text-[#48533E]">
                  02
                </span>
                <h3 className="text-sm font-semibold">Address and location</h3>
              </div>

              <div className="space-y-4">
                <Field label="Full address" error={errors.address}>
                  <textarea
                    name="address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, and area"
                    rows={3}
                    className={`${inputClass} resize-y`}
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="State" error={errors.state}>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select state</option>
                      {locationData.states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="District" error={errors.district}>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={inputClass}
                      required
                    >
                      <option value="">Select district</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Taluka" error={errors.taluka}>
                    <select
                      name="taluka"
                      value={formData.taluka}
                      onChange={handleChange}
                      disabled={!formData.district}
                      className={inputClass}
                      required
                    >
                      <option value="">Select taluka</option>
                      {talukas.map((taluka) => (
                        <option key={taluka.id} value={taluka.id}>
                          {taluka.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Village / city" error={errors.village}>
                    <select
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      disabled={!formData.taluka}
                      className={inputClass}
                      required
                    >
                      <option value="">Select village or city</option>
                      {villages.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            <div className="border-t border-[#DEDCD3] pt-6">
              <button
                type="submit"
                disabled={!otpVerified || isBusy}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#C65B35] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#AD4D2D] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {requestType === "register"
                  ? "Creating your account…"
                  : "Register as a worker"}
                {requestType !== "register" && <span aria-hidden="true">→</span>}
              </button>

              <p className="mt-4 text-center text-sm text-[#696A61]">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#48533E] underline decoration-[#A9AF9A] underline-offset-4 hover:text-[#C65B35]"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>

          <p className="mt-8 border-t border-[#DEDCD3] pt-5 text-center text-xs leading-5 text-[#858579]">
            By registering, you agree to provide accurate information for
            worker verification and collection coordination.
          </p>
        </section>
      </div>
    </main>
  );
}