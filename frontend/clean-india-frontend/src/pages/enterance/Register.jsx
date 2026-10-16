import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  locationData,
  getDistricts,
  getTalukas,
  getVillages,
} from "../../data/locationData";
import { useToast } from "../../context/ToastContext";

const inputClass =
  "w-full border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15 disabled:cursor-not-allowed disabled:bg-[#EFEEE6] disabled:text-[#858579]";

const labelClass = "mb-2 block text-sm font-medium text-[#252820]";

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p role="alert" className="mt-1.5 text-xs leading-5 text-[#A7472B]">
      {children}
    </p>
  );
}

function SectionHeading({ number, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#DEDCD3] text-xs font-semibold text-[#626B4F]">
        {number}
      </span>

      <div>
        <h3 className="text-base font-semibold text-[#252820]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm leading-5 text-[#696A61]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
    role: "citizen",
  });

  const [errors, setErrors] = useState({});
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function startTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

    if (name === "mobile") {
      const mobile = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({ ...prev, mobile }));
      setErrors((prev) => ({ ...prev, mobile: "" }));
      return;
    }

    if (name === "state") {
      setDistricts(getDistricts(value));
      setTalukas([]);
      setVillages([]);

      setFormData((prev) => ({
        ...prev,
        state: value,
        district: "",
        taluka: "",
        village: "",
      }));

      setErrors((prev) => ({
        ...prev,
        state: "",
        district: "",
        taluka: "",
        village: "",
      }));
      return;
    }

    if (name === "district") {
      setTalukas(getTalukas(formData.state, value));
      setVillages([]);

      setFormData((prev) => ({
        ...prev,
        district: value,
        taluka: "",
        village: "",
      }));

      setErrors((prev) => ({
        ...prev,
        district: "",
        taluka: "",
        village: "",
      }));
      return;
    }

    if (name === "taluka") {
      setVillages(getVillages(formData.state, formData.district, value));

      setFormData((prev) => ({
        ...prev,
        taluka: value,
        village: "",
      }));

      setErrors((prev) => ({
        ...prev,
        taluka: "",
        village: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const err = {};

    if (!formData.firstName.trim()) {
      err.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      err.firstName = "First name should only contain letters";
    }

    if (!formData.lastName.trim()) {
      err.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      err.lastName = "Last name should only contain letters";
    }

    if (!/^[789]\d{9}$/.test(formData.mobile)) {
      err.mobile =
        "Enter a valid 10-digit mobile number starting with 7, 8, or 9";
    }

    if (!formData.password.trim()) {
      err.password = "Password is required";
    }

    if (!formData.address.trim()) {
      err.address = "Address is required";
    }

    if (!formData.state) err.state = "State is required";
    if (!formData.district) err.district = "District is required";
    if (!formData.taluka) err.taluka = "Taluka is required";
    if (!formData.village) err.village = "Village is required";

    return err;
  }

  async function sendOTP() {
    if (!/^[789]\d{9}$/.test(formData.mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile:
          "Enter a valid 10-digit mobile number starting with 7, 8, or 9",
      }));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.mobile }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setOtpStep(true);
        setOtp("");
        setOtpVerified(false);
        setTimer(300);
        startTimer();

        showToast("OTP sent to your mobile number!", "success");
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    if (!/^\d{6}$/.test(otp)) {
      showToast("Enter a valid 6-digit OTP", "error");
      return;
    }

    if (timer <= 0) {
      showToast("OTP has expired. Please request another OTP.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.mobile, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        showToast("OTP verified successfully!", "success");
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    if (!otpVerified) {
      showToast("Please verify your mobile number first", "error");
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please correct the highlighted fields", "error");
      return;
    }

    setErrors({});
    setLoading(true);

    const endpoint =
      formData.role === "worker"
        ? "http://localhost:5000/api/auth/register-worker"
        : formData.role === "owner"
          ? "http://localhost:5000/api/auth/register-owner"
          : "http://localhost:5000/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.mobile,
          password: formData.password,
          address: formData.address,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          village: formData.village,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful! Please login.", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  const formattedTimer = `${Math.floor(timer / 60)}:${String(
    timer % 60
  ).padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[#30382B] transition-colors hover:text-[#C65B35]"
          >
            Clean-India
          </Link>

          <p className="text-sm text-[#696A61]">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#A7472B] underline decoration-[#A7472B]/30 underline-offset-4 hover:text-[#C65B35]"
            >
              Login
            </Link>
          </p>
        </header>

        <div className="grid overflow-hidden border border-[#DEDCD3] bg-white lg:grid-cols-[0.72fr_1.28fr]">
          {/* Introduction panel */}
          <aside className="flex flex-col justify-between bg-[#30382B] p-7 text-[#F8F7F2] sm:p-10 lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C7CBB9]">
                Community registration
              </p>

              <h1 className="mt-8 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                A cleaner neighbourhood starts with you.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#D5D7CE]">
                Join Clean-India to participate in responsible waste disposal
                and help create cleaner communities.
              </p>

              <div className="mt-10 border-t border-white/15 pt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C7CBB9]">
                  Your registration
                </p>

                <div className="mt-5 space-y-5">
                  <div className="flex gap-3">
                    <span className="text-sm text-[#D0A18B]">01</span>
                    <div>
                      <p className="text-sm font-medium">Verify your number</p>
                      <p className="mt-1 text-xs leading-5 text-[#C7CBB9]">
                        Confirm your mobile number with an OTP.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-sm text-[#D0A18B]">02</span>
                    <div>
                      <p className="text-sm font-medium">Add your details</p>
                      <p className="mt-1 text-xs leading-5 text-[#C7CBB9]">
                        Provide your name and residential location.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-sm text-[#D0A18B]">03</span>
                    <div>
                      <p className="text-sm font-medium">Create your account</p>
                      <p className="mt-1 text-xs leading-5 text-[#C7CBB9]">
                        Submit your information to get started.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-12 border-t border-white/15 pt-5 text-xs leading-5 text-[#C7CBB9]">
              Better communities begin with responsible choices.
            </p>
          </aside>

          {/* Form panel */}
          <section className="min-w-0 p-5 sm:p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-medium text-[#626B4F]">
                Citizen registration
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#696A61]">
                Enter your details below to join the Clean-India community.
              </p>

              <div className="mt-6 grid grid-cols-2 border-b border-[#DEDCD3]">
                <Link
                  to="/login"
                  className="border-b-2 border-transparent px-4 py-3 text-center text-sm font-medium text-[#858579] transition-colors hover:text-[#252820]"
                >
                  Login
                </Link>

                <span
                  aria-current="page"
                  className="border-b-2 border-[#C65B35] px-4 py-3 text-center text-sm font-semibold text-[#252820]"
                >
                  Register
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-9">
              {/* Personal information */}
              <section>
                <SectionHeading
                  number="01"
                  title="Personal information"
                  description="Tell us a little about yourself."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className={inputClass}
                      required
                    />
                    <FieldError>{errors.firstName}</FieldError>
                  </div>

                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={inputClass}
                      required
                    />
                    <FieldError>{errors.lastName}</FieldError>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="password" className={labelClass}>
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={inputClass}
                      required
                    />
                    <FieldError>{errors.password}</FieldError>
                  </div>
                </div>
              </section>

              {/* Phone verification */}
              <section>
                <SectionHeading
                  number="02"
                  title="Mobile verification"
                  description="Verify your mobile number before creating your account."
                />

                <div>
                  <label htmlFor="mobile" className={labelClass}>
                    Mobile number
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      disabled={otpSent}
                      className={`${inputClass} min-w-0 flex-1`}
                      required
                    />

                    {!otpSent && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={loading}
                        className="shrink-0 border border-[#30382B] bg-[#30382B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>

                  <FieldError>{errors.mobile}</FieldError>

                  {otpSent && !otpVerified && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpStep(false);
                        setOtp("");
                        setTimer(0);

                        if (timerRef.current) {
                          clearInterval(timerRef.current);
                          timerRef.current = null;
                        }
                      }}
                      className="mt-2 text-xs font-medium text-[#A7472B] underline underline-offset-4 hover:text-[#C65B35]"
                    >
                      Change mobile number
                    </button>
                  )}

                  {otpStep && (
                    <div className="mt-5 border border-[#DEDCD3] bg-[#F8F7F2] p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold">
                            Verify your number
                          </h4>
                          <p className="mt-1 text-xs leading-5 text-[#696A61]">
                            Enter the 6-digit OTP sent to your mobile.
                          </p>
                        </div>

                        {otpVerified && (
                          <span className="border border-[#D6DDCD] bg-[#E8EDE2] px-2.5 py-1 text-xs font-medium text-[#48533E]">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <input
                          id="otp"
                          name="otp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          disabled={otpVerified}
                          className={`${inputClass} min-w-0 flex-1`}
                        />

                        {!otpVerified && (
                          <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={loading || timer === 0}
                            className="shrink-0 border border-[#626B4F] px-5 py-3 text-sm font-semibold text-[#48533E] transition-colors hover:bg-[#EFEEE6] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loading ? "Verifying..." : "Verify OTP"}
                          </button>
                        )}
                      </div>

                      {!otpVerified && (
                        <p
                          className={`mt-3 text-xs ${
                            timer > 0 ? "text-[#696A61]" : "text-[#A7472B]"
                          }`}
                        >
                          {timer > 0
                            ? `OTP expires in ${formattedTimer}`
                            : "OTP timer expired. Change the mobile number to request another OTP."}
                        </p>
                      )}

                      {otpVerified && (
                        <p className="mt-3 text-xs font-medium text-[#48533E]">
                          Your mobile number has been verified.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Address */}
              <section>
                <SectionHeading
                  number="03"
                  title="Residential address"
                  description="Select your state, district, taluka and village or city."
                />

                <div className="space-y-5">
                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Full address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, area"
                      rows={3}
                      className={`${inputClass} resize-y`}
                      required
                    />
                    <FieldError>{errors.address}</FieldError>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="state" className={labelClass}>
                        State
                      </label>
                      <select
                        id="state"
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
                      <FieldError>{errors.state}</FieldError>
                    </div>

                    <div>
                      <label htmlFor="district" className={labelClass}>
                        District
                      </label>
                      <select
                        id="district"
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
                      <FieldError>{errors.district}</FieldError>
                    </div>

                    <div>
                      <label htmlFor="taluka" className={labelClass}>
                        Taluka
                      </label>
                      <select
                        id="taluka"
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
                      <FieldError>{errors.taluka}</FieldError>
                    </div>

                    <div>
                      <label htmlFor="village" className={labelClass}>
                        Village / city
                      </label>
                      <select
                        id="village"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        disabled={!formData.taluka}
                        className={inputClass}
                        required
                      >
                        <option value="">Select village / city</option>
                        {villages.map((village) => (
                          <option key={village} value={village}>
                            {village}
                          </option>
                        ))}
                      </select>
                      <FieldError>{errors.village}</FieldError>
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit */}
              <div className="border-t border-[#DEDCD3] pt-6">
                {!otpVerified && (
                  <p className="mb-4 text-xs leading-5 text-[#696A61]">
                    Verify your mobile number to enable registration.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!otpVerified || loading}
                  className="flex w-full items-center justify-between bg-[#30382B] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C65B35] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {loading ? "Creating account..." : "Create account"}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>

                <p className="mt-5 text-center text-sm text-[#696A61]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#A7472B] underline decoration-[#A7472B]/30 underline-offset-4 hover:text-[#C65B35]"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </div>

        <footer className="py-5 text-center text-xs text-[#858579]">
          Clean-India · Responsible waste disposal starts with us.
        </footer>
      </div>
    </main>
  );
}