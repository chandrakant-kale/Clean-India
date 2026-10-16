import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const COLORS = {
  background: "#F8F7F2",
  charcoal: "#252820",
  olive: "#626B4F",
  terracotta: "#C65B35",
  border: "#DEDCD3",
  muted: "#696A61",
  light: "#EFEEE6",
};

const WASTE_PRICES = {
  "Wet Waste": 3,
  "Dry Waste": 5,
  "Electronics Waste": 10,
};

const WASTE_COLORS = {
  "Wet Waste": "#626B4F",
  "Dry Waste": "#C65B35",
  "Electronics Waste": "#858579",
};

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
      {children}
    </p>
  );
}

function StatCard({ label, value, detail, onClick, index }) {
  const interactive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (interactive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={`border border-[#DEDCD3] bg-white p-5 sm:p-6 ${
        interactive
          ? "cursor-pointer transition-colors hover:border-[#626B4F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
          : ""
      }`}
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <p className="text-sm text-[#696A61]">{label}</p>
        <span className="text-xs font-medium text-[#858579]">
          0{index}
        </span>
      </div>

      <p className="break-words text-3xl font-semibold tracking-tight text-[#252820] sm:text-4xl">
        {value}
      </p>

      {detail && (
        <p className="mt-3 text-xs leading-5 text-[#696A61]">{detail}</p>
      )}
    </div>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-[#252820]"
    >
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-none border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15";

function Notice({ type, children }) {
  const styles = {
    error: {
      bg: "#F8EDE8",
      border: "#E8C9BE",
      text: "#9F3828",
      label: "Error",
    },
    success: {
      bg: "#F0F1E9",
      border: "#D5D9C9",
      text: "#48533E",
      label: "Success",
    },
  };

  const style = styles[type];

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className="mb-5 border p-4"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.text,
      }}
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
        {style.label}
      </p>
      <p className="text-sm leading-6">{children}</p>
    </div>
  );
}

function LoadingState({ label = "Loading records" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
      <p className="text-sm text-[#696A61]">{label}</p>
    </div>
  );
}

function WasteBreakdownModal({
  onClose,
  history,
  userStats,
  wasteBreakdown,
}) {
  const totalWaste = Number(userStats.totalWaste) || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#252820]/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="breakdown-title"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[#DEDCD3] bg-[#F8F7F2] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#DEDCD3] p-5 sm:p-7">
          <div>
            <SectionLabel>Collection report</SectionLabel>
            <h2
              id="breakdown-title"
              className="text-2xl font-semibold tracking-tight text-[#252820]"
            >
              Waste breakdown
            </h2>
            <p className="mt-2 text-sm text-[#696A61]">
              Summary of verified waste collections.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close waste breakdown"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#696A61] transition-colors hover:bg-[#EFEEE6] hover:text-[#252820]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="grid grid-cols-2 border-b border-[#DEDCD3]">
          <div className="border-r border-[#DEDCD3] p-5 sm:p-7">
            <p className="text-sm text-[#696A61]">Verifications</p>
            <p className="mt-3 text-3xl font-semibold text-[#252820]">
              {history.length}
            </p>
            <p className="mt-1 text-xs text-[#858579]">Total records</p>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm text-[#696A61]">Waste processed</p>
            <p className="mt-3 break-words text-3xl font-semibold text-[#626B4F]">
              {totalWaste} kg
            </p>
            <p className="mt-1 text-xs text-[#858579]">
              Total verified weight
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <SectionLabel>By waste category</SectionLabel>

          {wasteBreakdown.length === 0 ? (
            <div className="border border-dashed border-[#DEDCD3] py-10 text-center">
              <p className="text-sm text-[#696A61]">
                No waste collections verified yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              {wasteBreakdown.map((item, index) => {
                const percentage =
                  totalWaste > 0
                    ? Math.min(
                        100,
                        Math.max(0, (Number(item.weight) / totalWaste) * 100)
                      )
                    : 0;

                const color =
                  WASTE_COLORS[item.type] || COLORS.olive;

                return (
                  <div key={`${item.type}-${index}`}>
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <h3 className="text-sm font-semibold text-[#252820]">
                            {item.type}
                          </h3>
                        </div>
                        <p className="ml-[18px] mt-1 text-xs text-[#696A61]">
                          {item.count} collections
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-[#252820]">
                        {Number(item.weight).toLocaleString("en-IN")} kg
                        <span className="ml-2 text-xs font-normal text-[#696A61]">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </p>
                    </div>

                    <div className="h-2 w-full bg-[#EFEEE6]">
                      <div
                        className="h-full transition-[width] duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="border-t border-[#DEDCD3] p-5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#252820] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#404638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
          >
            Close report
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    weight: "",
    wasteType: "",
    area: "",
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userStats, setUserStats] = useState({
    totalEarning: 0,
    totalWaste: 0,
    ciPoints: 0,
  });

  const [showWasteModal, setShowWasteModal] = useState(false);
  const [wasteBreakdown, setWasteBreakdown] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const historyRef = useRef(null);

  useEffect(() => {
    if (user?.phone) {
      fetchHistory();
    }
    // fetchHistory intentionally runs when the authenticated user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async () => {
    try {
      if (user?.role === "worker") {
        const res = await axios.get(
          `http://localhost:5000/api/waste/worker-stats/${user.phone}`
        );

        setHistory(res.data.verifications);

        const uniqueCitizens = new Set(
          res.data.verifications.map((item) => item.phone)
        ).size;

        const breakdown = {};

        res.data.verifications.forEach((item) => {
          if (breakdown[item.wasteType]) {
            breakdown[item.wasteType].count += 1;
            breakdown[item.wasteType].weight += item.weight;
          } else {
            breakdown[item.wasteType] = {
              count: 1,
              weight: item.weight,
            };
          }
        });

        setWasteBreakdown(
          Object.entries(breakdown).map(([type, data]) => ({
            type,
            count: data.count,
            weight: data.weight,
          }))
        );

        setUserStats({
          totalEarning: 0,
          totalWaste: res.data.stats.totalWasteProcessed,
          ciPoints: res.data.stats.totalVerifications,
          workScore: res.data.stats.workScore || 0,
          uniqueCitizens,
        });
      } else {
        const res = await axios.get(
          `http://localhost:5000/api/waste/history/${user.phone}`
        );

        setHistory(res.data.history);

        const verifiedEntries = res.data.history.filter(
          (item) => item.status === "verified"
        );

        const totalEarning = verifiedEntries.reduce(
          (sum, item) => sum + item.earning,
          0
        );

        const totalWaste = verifiedEntries.reduce(
          (sum, item) => sum + item.weight,
          0
        );

        const profileRes = await axios.get(
          `http://localhost:5000/api/auth/profile/${user.phone}`
        );

        const ciPoints =
          profileRes.data.user.ciPoints || Math.floor(totalEarning / 3);

        setUserStats({ totalEarning, totalWaste, ciPoints });
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch history", "error");
      setLoading(false);
    }
  };

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openWasteModal = () => setShowWasteModal(true);
  const closeWasteModal = () => setShowWasteModal(false);

  const getWastePrice = (wasteType) => WASTE_PRICES[wasteType] || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const weight = parseFloat(formData.weight);

    if (!weight || weight <= 0) {
      setError("Weight must be greater than 0 kg");
      return;
    }

    if (!formData.wasteType) {
      setError("Please select a waste type");
      return;
    }

    if (!formData.area) {
      setError("Please enter an area");
      return;
    }

    const pricePerKg = getWastePrice(formData.wasteType);
    const earning = weight * pricePerKg;

    try {
      await axios.post("http://localhost:5000/api/waste/submit", {
        phone: user.phone,
        weight,
        wasteType: formData.wasteType,
        state: user.state,
        district: user.district,
        taluka: user.taluka,
        village: user.village,
        area: formData.area,
        earning,
      });

      setFormData({ weight: "", wasteType: "", area: "" });
      setSuccess(
        "Waste collection submitted successfully! Awaiting verification."
      );
      showToast("Waste collection submitted!", "success");
      setTimeout(() => setSuccess(""), 5000);
      fetchHistory();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to submit. Please try again.";

      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const isWorker = user?.role === "worker";

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-6 text-[#252820] sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-[#DEDCD3] pb-7 sm:mb-10">
          <SectionLabel>Clean-India / Dashboard</SectionLabel>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {isWorker ? "Worker dashboard" : "Your dashboard"}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#696A61]">
                {isWorker
                  ? "Review verified collections and track the waste processed in your area."
                  : "Manage your waste submissions, monitor earnings, and track your environmental contribution."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start border border-[#DEDCD3] bg-white px-4 py-3 sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#626B4F]" />
              <div>
                <p className="text-xs font-medium text-[#252820]">
                  {user?.name || "Account"}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#696A61]">
                  {user?.role || "Citizen"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          aria-label="Dashboard statistics"
          className="mb-8 grid grid-cols-1 gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatCard
            index={1}
            label={isWorker ? "Verifications" : "Total earnings"}
            value={
              isWorker
                ? userStats.ciPoints
                : `₹${Number(userStats.totalEarning || 0).toLocaleString("en-IN")}`
            }
            detail={
              isWorker
                ? "Collections verified by you"
                : "From verified submissions"
            }
            onClick={isWorker ? scrollToHistory : undefined}
          />

          <StatCard
            index={2}
            label={isWorker ? "Waste processed" : "Total waste"}
            value={`${Number(userStats.totalWaste || 0).toLocaleString("en-IN")} kg`}
            detail={
              isWorker
                ? "Tap to see the category breakdown"
                : "Weight from verified collections"
            }
            onClick={isWorker ? openWasteModal : undefined}
          />

          <StatCard
            index={3}
            label={isWorker ? "Citizens verified" : "CI points"}
            value={
              isWorker
                ? userStats.uniqueCitizens ?? 0
                : userStats.ciPoints
            }
            detail={
              isWorker
                ? "Unique citizens verified"
                : "Your Clean-India points"
            }
          />
        </section>

        <div
          className={`grid grid-cols-1 items-start gap-6 ${
            isWorker ? "lg:grid-cols-3" : "lg:grid-cols-3"
          }`}
        >
          {!isWorker ? (
            <section className="border border-[#DEDCD3] bg-white p-5 sm:p-7 lg:col-span-1">
              <SectionLabel>New submission</SectionLabel>

              <h2 className="text-2xl font-semibold tracking-tight">
                Submit waste
              </h2>

              <p className="mb-6 mt-2 text-sm leading-6 text-[#696A61]">
                Enter the collection details to submit them for verification.
              </p>

              {error && <Notice type="error">{error}</Notice>}
              {success && <Notice type="success">{success}</Notice>}

              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <div>
                  <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
                  <input
                    id="weight"
                    name="weight"
                    className={inputClass}
                    placeholder="e.g. 2.5"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="wasteType">Waste category</FieldLabel>
                  <select
                    id="wasteType"
                    name="wasteType"
                    className={inputClass}
                    value={formData.wasteType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select waste type</option>
                    <option value="Dry Waste">Dry Waste (₹5/kg)</option>
                    <option value="Wet Waste">Wet Waste (₹3/kg)</option>
                    <option value="Electronics Waste">
                      Electronics Waste (₹10/kg)
                    </option>
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="area">Area / locality</FieldLabel>
                  <input
                    id="area"
                    name="area"
                    className={inputClass}
                    placeholder="Enter your area"
                    type="text"
                    value={formData.area}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );

                      setFormData({ ...formData, area: value });
                      setError("");
                    }}
                    required
                  />
                </div>

                <div className="border border-[#DEDCD3] bg-[#F8F7F2] p-4">
                  <SectionLabel>Registered location</SectionLabel>
                  <p className="text-sm leading-6 text-[#252820]">
                    {[user?.state, user?.district, user?.taluka, user?.village]
                      .filter(Boolean)
                      .join(", ") || "Location not available"}
                  </p>
                </div>

                <div className="border-t border-[#DEDCD3] pt-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-[#696A61]">
                      Estimated earning
                    </p>
                    <p className="text-xl font-semibold text-[#626B4F]">
                      ₹
                      {(
                        (parseFloat(formData.weight) || 0) *
                        getWastePrice(formData.wasteType)
                      ).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#252820] px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#404638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
                  >
                    Submit for verification
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </button>

                  <p className="mt-3 text-xs leading-5 text-[#858579]">
                    Earnings are recorded after the collection is verified.
                  </p>
                </div>
              </form>
            </section>
          ) : (
            <section className="border border-[#DEDCD3] bg-[#EFEEE6] p-6 lg:col-span-1">
              <SectionLabel>Worker access</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-tight">
                Verification panel
              </h2>
              <div className="my-6 border-y border-[#DEDCD3] py-5">
                <p className="text-sm leading-6 text-[#696A61]">
                  Use your assigned verification workflow to review citizen
                  submissions through their QR codes.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center bg-[#626B4F] text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-[#252820]">
                    Verification only
                  </p>
                  <p className="mt-1 text-xs text-[#696A61]">
                    Worker collections are not paid as citizen earnings.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section
            ref={historyRef}
            className={`min-w-0 border border-[#DEDCD3] bg-white p-5 sm:p-7 ${
              isWorker ? "lg:col-span-2" : "lg:col-span-2"
            }`}
          >
            <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#DEDCD3] pb-5 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Records</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {isWorker ? "Verification history" : "Submission history"}
                </h2>
              </div>
              <p className="text-xs text-[#696A61]">
                {history.length} {history.length === 1 ? "record" : "records"}
              </p>
            </div>

            {loading ? (
              <LoadingState label="Loading your records..." />
            ) : history.length === 0 ? (
              <div className="border border-dashed border-[#DEDCD3] px-5 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#DEDCD3] text-[#626B4F]">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 3v6h5M9 13h6M9 17h6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#252820]">
                  No records yet
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#696A61]">
                  {isWorker
                    ? "Verified collections will appear here."
                    : "Your waste submissions will appear here once you start contributing."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#DEDCD3]">
                {history.map((item) => (
                  <article
                    key={item._id}
                    className="py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="border border-[#DEDCD3] bg-[#EFEEE6] px-2.5 py-1 text-xs font-medium text-[#48533E]">
                            {item.wasteType}
                          </span>
                          <span className="text-xs text-[#696A61]">
                            {new Date(item.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p className="text-xl font-semibold text-[#252820]">
                            {item.weight} kg
                          </p>
                          <span className="text-xs text-[#696A61]">
                            recorded weight
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#696A61]">
                          {[item.state, item.district, item.taluka, item.village]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        {item.area && (
                          <p className="mt-1 text-xs text-[#858579]">
                            Area: {item.area}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-row items-start justify-between gap-4 border-t border-[#EFEEE6] pt-4 sm:min-w-[150px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        {isWorker ? (
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#626B4F]">
                              Verified
                            </p>
                            <p className="mt-1 text-xs text-[#696A61]">
                              By you
                            </p>
                          </div>
                        ) : item.status === "pending" ? (
                          <div className="w-full sm:w-auto sm:text-right">
                            <div className="inline-flex flex-col items-center border border-[#DEDCD3] bg-white p-3">
                              {item.qrCode ? (
                                <QRCodeCanvas
                                  value={item.qrCode}
                                  size={88}
                                  level="M"
                                />
                              ) : (
                                <p className="px-2 py-5 text-xs text-[#696A61]">
                                  QR unavailable
                                </p>
                              )}

                              {item.verificationCode && (
                                <p className="mt-2 text-2xl font-semibold tracking-[0.12em] text-[#252820]">
                                  {item.verificationCode}
                                </p>
                              )}
                            </div>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9A6728]">
                              Pending
                            </p>
                            {item.verificationCode ? (
                              <p className="mt-1 text-xs text-[#696A61]">
                                Show the code to the worker
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-[#858579]">
                                Old entry — no code
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="sm:text-right">
                            <p className="text-2xl font-semibold text-[#626B4F]">
                              ₹
                              {Number(item.earning || 0).toLocaleString("en-IN")}
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-[#696A61]">
                              Earned
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#DEDCD3] pt-5 text-xs text-[#858579] sm:flex-row">
          <p>Clean-India · Waste collection records</p>
          <p>Small actions. Cleaner communities.</p>
        </footer>
      </div>

      {showWasteModal && (
        <WasteBreakdownModal
          onClose={closeWasteModal}
          history={history}
          userStats={userStats}
          wasteBreakdown={wasteBreakdown}
        />
      )}
    </main>
  );
}