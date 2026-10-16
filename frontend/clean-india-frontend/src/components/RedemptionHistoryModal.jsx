import { useState, useEffect } from "react";
import axios from "axios";

export default function RedemptionHistoryModal({
  isOpen,
  onClose,
  userPhone,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isOpen && userPhone) {
      fetchRedemptionHistory();
    }
  }, [isOpen, userPhone]);

  const fetchRedemptionHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/coupons/history/${userPhone}`
      );
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredHistory = () => {
    if (filter === "all") return history;
    return history.filter((item) => item.type === filter);
  };

  const filteredHistory = getFilteredHistory();
  const totalRedeemed = filteredHistory.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-[#252820]/55"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="redemption-history-title"
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-[#DEDCD3] bg-[#F8F7F2] shadow-2xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#DEDCD3] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#C65B35]" />
                <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#626B4F]">
                  Account activity
                </span>
              </div>

              <h2
                id="redemption-history-title"
                className="text-xl font-semibold tracking-[-0.8px] text-[#252820] sm:text-2xl"
              >
                Redemption history
              </h2>

              <p className="mt-1 text-xs text-[#77786E] sm:text-sm">
                Review your cash and coupon redemptions.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close redemption history"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#696A61] transition-colors hover:border-[#C65B35] hover:text-[#C65B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
            {/* Summary */}
            <div className="mb-8 grid grid-cols-1 border-l border-t border-[#DEDCD3] sm:grid-cols-3">
              <div className="border-b border-r border-[#DEDCD3] p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#858579]">
                  Redemptions
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-1px] text-[#252820]">
                  {filteredHistory.length}
                </p>
                <p className="mt-1 text-xs text-[#77786E]">
                  Matching records
                </p>
              </div>

              <div className="border-b border-r border-[#DEDCD3] bg-[#EFEEE6] p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#626B4F]">
                  Total amount
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-1px] text-[#626B4F]">
                  ₹{totalRedeemed}
                </p>
                <p className="mt-1 text-xs text-[#77786E]">
                  Matching records
                </p>
              </div>

              <div className="border-b border-r border-[#DEDCD3] p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#858579]">
                  Average amount
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[-1px] text-[#252820]">
                  ₹
                  {filteredHistory.length > 0
                    ? Math.round(totalRedeemed / filteredHistory.length)
                    : 0}
                </p>
                <p className="mt-1 text-xs text-[#77786E]">
                  Per redemption
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#252820]">
                Transactions
              </h3>

              <div
                className="flex flex-wrap gap-1 border border-[#DEDCD3] p-1"
                aria-label="Filter redemptions"
              >
                {[
                  { value: "all", label: "All" },
                  { value: "cash", label: "Cash" },
                  { value: "coupon", label: "Coupons" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    aria-pressed={filter === option.value}
                    className={`px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${
                      filter === option.value
                        ? "bg-[#30382B] text-white"
                        : "text-[#696A61] hover:bg-[#EFEEE6] hover:text-[#252820]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div
                className="flex min-h-48 flex-col items-center justify-center"
                role="status"
                aria-live="polite"
              >
                <div className="mb-4 h-7 w-7 animate-spin border-2 border-[#DEDCD3] border-t-[#626B4F]" />
                <p className="text-sm font-medium text-[#45463F]">
                  Loading redemption history
                </p>
                <p className="mt-1 text-xs text-[#858579]">
                  Please wait a moment.
                </p>
              </div>
            ) : filteredHistory.length > 0 ? (
              /* History list */
              <div className="border-l border-t border-[#DEDCD3]">
                {filteredHistory.map((item, index) => (
                  <article
                    key={item._id || item.id || index}
                    className="border-b border-r border-[#DEDCD3] p-4 transition-colors hover:bg-[#EFEEE6] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-xs font-bold text-[#626B4F]">
                          {item.type === "cash" ? "₹" : "CP"}
                        </div>

                        <div className="min-w-0">
                          <h4 className="break-words text-sm font-semibold text-[#252820] sm:text-base">
                            {item.item}
                          </h4>

                          <p className="mt-1.5 text-xs text-[#77786E]">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>

                          {item.couponCode && (
                            <div className="mt-3 inline-flex flex-col border border-[#DEDCD3] bg-[#EFEEE6] px-3 py-2">
                              <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#858579]">
                                Coupon code
                              </span>
                              <span className="mt-1 break-all font-mono text-sm font-semibold text-[#626B4F]">
                                {item.couponCode}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E5E2D9] pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <p className="text-xl font-semibold tracking-tight text-[#252820] sm:text-2xl">
                          ₹{item.amount}
                        </p>

                        <span
                          className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] ${
                            item.status === "completed"
                              ? "border-[#C9D0BE] bg-[#E9EADD] text-[#48533E]"
                              : item.status === "pending"
                              ? "border-[#E4D2AA] bg-[#F5EDDC] text-[#8B682C]"
                              : "border-[#E5C9C2] bg-[#F5E7E3] text-[#A34432]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 ${
                              item.status === "completed"
                                ? "bg-[#626B4F]"
                                : item.status === "pending"
                                ? "bg-[#B38A3D]"
                                : "bg-[#C65B35]"
                            }`}
                          />
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex min-h-56 flex-col items-center justify-center border border-dashed border-[#D6D4CA] px-6 py-10 text-center">
                <svg
                  className="mb-5 h-10 w-10 text-[#929284]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.4}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

                <p className="text-sm font-semibold text-[#252820]">
                  No redemptions found
                </p>

                <p className="mt-2 max-w-xs text-xs leading-6 text-[#77786E]">
                  {filter === "all"
                    ? "Your cash and coupon redemption records will appear here."
                    : `There are no ${filter} redemptions in this history.`}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#DEDCD3] bg-[#EFEEE6] px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={fetchRedemptionHistory}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#626B4F] transition-colors hover:text-[#C65B35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-10 bg-[#30382B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}