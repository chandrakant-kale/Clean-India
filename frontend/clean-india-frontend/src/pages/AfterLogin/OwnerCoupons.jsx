import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import axios from "axios";

const palette = {
  background: "#F8F7F2",
  charcoal: "#252820",
  olive: "#626B4F",
  terracotta: "#C65B35",
  border: "#DEDCD3",
  muted: "#696A61",
  light: "#EFEEE6",
};

const initialFormData = {
  title: "",
  discount: "",
  description: "",
  validUntil: "",
  couponCode: "",
  price: "",
};

const inputClass =
  "w-full rounded-none border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15";

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
      {children}
    </p>
  );
}

function CouponIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        strokeLinejoin="round"
      />
      <path
        d="M14 8v2m0 4v2"
        strokeLinecap="round"
        strokeDasharray="1 1"
      />
    </svg>
  );
}

function StatCard({ label, value, number }) {
  return (
    <div className="border border-[#DEDCD3] bg-white p-5 sm:p-6">
      <div className="mb-7 flex items-start justify-between gap-3">
        <p className="text-sm text-[#696A61]">{label}</p>
        <span className="text-xs text-[#858579]">0{number}</span>
      </div>

      <p className="text-4xl font-semibold tracking-tight text-[#252820]">
        {value}
      </p>
    </div>
  );
}

function FormField({ label, name, children }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#252820]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function OwnerCoupons() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (user?.phone) {
      fetchCoupons();
    }
    // Refresh the owner's coupons when the authenticated user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCoupons = async () => {
    if (!user?.phone) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/coupons/owner/${user.phone}`
      );

      setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/coupons/create", {
        ownerPhone: user.phone,
        ownerName: user.name,
        ...formData,
      });

      showToast("Coupon created successfully!", "success");
      setFormData({ ...initialFormData });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create coupon";

      showToast(errorMsg, "error");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/coupons/delete/${couponId}`
      );

      showToast("Coupon deleted successfully!", "success");
      fetchCoupons();
    } catch (err) {
      showToast("Failed to delete coupon", "error");
      console.error(err);
    }
  };

  const activeCount = coupons.filter((coupon) => coupon.isActive).length;
  const expiredCount = coupons.filter((coupon) => !coupon.isActive).length;

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-9 border-b border-[#DEDCD3] pb-7 sm:mb-10">
          <SectionLabel>Clean-India / Partner portal</SectionLabel>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Coupon management
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#696A61]">
                Create and manage discount offers for citizens who participate
                in a cleaner community.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start border border-[#DEDCD3] bg-white px-4 py-3 sm:self-auto">
              <div className="flex h-9 w-9 items-center justify-center bg-[#EFEEE6] text-[#626B4F]">
                <CouponIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#252820]">
                  {user?.name || "Coupon owner"}
                </p>
                <p className="mt-0.5 text-xs text-[#696A61]">
                  Partner account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section
          aria-label="Coupon statistics"
          className="mb-9 grid grid-cols-1 gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-3"
        >
          <StatCard
            number={1}
            label="Total coupons"
            value={coupons.length}
          />
          <StatCard
            number={2}
            label="Active coupons"
            value={activeCount}
          />
          <StatCard
            number={3}
            label="Inactive / expired"
            value={expiredCount}
          />
        </section>

        {/* Create coupon action */}
        <section className="mb-9 flex flex-col justify-between gap-4 border border-[#DEDCD3] bg-[#EFEEE6] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#626B4F] text-white">
              <CouponIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#252820]">
                {showForm ? "Create a new offer" : "Add a new coupon"}
              </h2>
              <p className="mt-1 max-w-lg text-sm leading-5 text-[#696A61]">
                Set the discount, coupon code, price, and validity period for
                your next offer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#252820] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#404638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
          >
            {showForm ? (
              <>
                <span aria-hidden="true">×</span>
                Cancel
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    strokeLinecap="round"
                  />
                </svg>
                Create coupon
              </>
            )}
          </button>
        </section>

        {/* Create coupon form */}
        {showForm && (
          <section className="mb-10 border border-[#DEDCD3] bg-white">
            <header className="border-b border-[#DEDCD3] p-5 sm:p-7">
              <SectionLabel>New offer details</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-tight">
                Create coupon
              </h2>
              <p className="mt-2 text-sm text-[#696A61]">
                Complete all fields before publishing your offer.
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:gap-6 sm:p-7"
            >
              <FormField label="Coupon title" name="title">
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Food discount"
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Discount (%)" name="discount">
                <div className="relative">
                  <input
                    id="discount"
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-[#696A61]">
                    %
                  </span>
                </div>
              </FormField>

              <FormField label="Coupon code" name="couponCode">
                <input
                  id="couponCode"
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="e.g. SAVE20"
                  className={`${inputClass} font-mono uppercase`}
                  required
                />
              </FormField>

              <FormField label="Price (₹)" name="price">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-[#696A61]">
                    ₹
                  </span>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
              </FormField>

              <FormField label="Valid until" name="validUntil">
                <input
                  id="validUntil"
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </FormField>

              <FormField label="Description" name="description">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what this offer includes..."
                  rows={1}
                  className={`${inputClass} min-h-[46px] resize-y`}
                  required
                />
              </FormField>

              {/* Offer preview */}
              <div className="border border-[#DEDCD3] bg-[#F8F7F2] p-5 sm:col-span-2">
                <SectionLabel>Offer preview</SectionLabel>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-[#252820]">
                      {formData.title || "Your coupon title"}
                    </h3>
                    <p className="mt-1 break-words text-sm text-[#696A61]">
                      {formData.description ||
                        "Your coupon description will appear here."}
                    </p>
                    <p className="mt-3 font-mono text-sm font-semibold tracking-wider text-[#626B4F]">
                      {formData.couponCode || "COUPONCODE"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t border-[#DEDCD3] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div>
                      <p className="text-xs text-[#696A61]">Discount</p>
                      <p className="mt-1 text-2xl font-semibold text-[#C65B35]">
                        {formData.discount || "0"}%
                      </p>
                    </div>
                    <div className="h-10 w-px bg-[#DEDCD3]" />
                    <div>
                      <p className="text-xs text-[#696A61]">Price</p>
                      <p className="mt-1 text-2xl font-semibold text-[#252820]">
                        ₹{formData.price || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#DEDCD3] pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-[#DEDCD3] px-5 py-3 text-sm font-medium text-[#252820] transition-colors hover:bg-[#EFEEE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#C65B35] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#AD4D2D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
                >
                  Create coupon
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Coupons list */}
        <section>
          <header className="mb-6 flex flex-col justify-between gap-3 border-b border-[#DEDCD3] pb-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>Your offers</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-tight">
                Created coupons
              </h2>
            </div>
            <p className="text-sm text-[#696A61]">
              {coupons.length}{" "}
              {coupons.length === 1 ? "coupon" : "coupons"} in total
            </p>
          </header>

          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {coupons.map((coupon, index) => (
                <article
                  key={coupon._id || index}
                  className="flex min-w-0 flex-col border border-[#DEDCD3] bg-white transition-colors hover:border-[#626B4F]"
                >
                  {/* Card heading */}
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3">
                        <span
                          className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            coupon.isActive
                              ? "border-[#D5D9C9] bg-[#F0F1E9] text-[#48533E]"
                              : "border-[#E8C9BE] bg-[#F8EDE8] text-[#9F3828]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              coupon.isActive
                                ? "bg-[#626B4F]"
                                : "bg-[#B84732]"
                            }`}
                          />
                          {coupon.isActive ? "Active" : "Expired"}
                        </span>
                      </div>

                      <h3 className="break-words text-lg font-semibold leading-snug text-[#252820]">
                        {coupon.title}
                      </h3>

                      <p className="mt-2 break-words text-sm leading-6 text-[#696A61]">
                        {coupon.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(coupon._id)}
                      aria-label={`Delete ${coupon.title}`}
                      title="Delete coupon"
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#696A61] transition-colors hover:border-[#E8C9BE] hover:bg-[#F8EDE8] hover:text-[#B84732] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.7}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Coupon code */}
                  <div className="mx-5 border border-dashed border-[#DEDCD3] bg-[#F8F7F2] p-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#696A61]">
                      Coupon code
                    </p>

                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <p className="min-w-0 break-all font-mono text-lg font-semibold tracking-wider text-[#626B4F]">
                        {coupon.couponCode}
                      </p>
                      <span className="shrink-0 text-xs text-[#858579]">
                        CODE
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#DEDCD3] pt-4">
                      <div>
                        <p className="text-xs text-[#696A61]">Discount</p>
                        <p className="mt-1 text-2xl font-semibold text-[#C65B35]">
                          {coupon.discount}%
                        </p>
                      </div>

                      <p className="border border-[#DEDCD3] bg-white px-3 py-1.5 text-xs font-medium text-[#252820]">
                        {coupon.discount}% OFF
                      </p>
                    </div>
                  </div>

                  {/* Price and validity */}
                  <div className="mt-5 grid grid-cols-2 border-y border-[#DEDCD3]">
                    <div className="border-r border-[#DEDCD3] p-4">
                      <p className="text-xs text-[#696A61]">Price</p>
                      <p className="mt-2 text-xl font-semibold text-[#252820]">
                        ₹{coupon.price}
                      </p>
                    </div>

                    <div className="min-w-0 p-4">
                      <p className="text-xs text-[#696A61]">Valid until</p>
                      <p className="mt-2 break-words text-sm font-semibold text-[#252820]">
                        {new Date(coupon.validUntil).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 p-5">
                    <p className="text-xs text-[#858579]">
                      Offer {String(index + 1).padStart(2, "0")}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        coupon.isActive
                          ? "text-[#626B4F]"
                          : "text-[#B84732]"
                      }`}
                    >
                      {coupon.isActive ? "Available" : "Inactive"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#DEDCD3] bg-white px-5 py-16 text-center sm:py-20">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
                <CouponIcon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-semibold text-[#252820]">
                No coupons created yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#696A61]">
                Create your first offer to give citizens another reason to
                participate in a cleaner community.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 bg-[#252820] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#404638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
              >
                Create your first coupon
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          )}
        </section>

        <footer className="mt-10 border-t border-[#DEDCD3] pt-5">
          <p className="text-xs leading-5 text-[#858579]">
            Clean-India · Partner coupon management
          </p>
        </footer>
      </div>
    </main>
  );
}