import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const wasteStyles = {
  "Dry Waste": {
    background: "#F8EDE8",
    color: "#B84732",
    border: "#E8C9BE",
  },
  "Wet Waste": {
    background: "#F0F1E9",
    color: "#48533E",
    border: "#D5D9C9",
  },
  "Electronics Waste": {
    background: "#EFEEE6",
    color: "#626B4F",
    border: "#DEDCD3",
  },
};

function HistoryIcon({ type }) {
  if (type === "weight") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 3v3m-6 0h12l3 13H3L6 6Zm0 0-2 7h4l-2-7Zm12 0-2 7h4l-2-7Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.phone) {
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
    // Refresh history when the authenticated user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/waste/history/${user.phone}`
      );

      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-[#DEDCD3] pb-7 sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#626B4F]">
            Clean-India / Records
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Collection history
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#696A61]">
                Keep track of your waste collections, recorded weights,
                locations, and earnings.
              </p>
            </div>

            {!loading && history.length > 0 && (
              <div className="border border-[#DEDCD3] bg-white px-4 py-3">
                <p className="text-xs text-[#696A61]">Total records</p>
                <p className="mt-1 text-2xl font-semibold text-[#252820]">
                  {history.length}
                </p>
              </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center border border-[#DEDCD3] bg-white py-20">
            <div className="mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
            <p className="text-sm text-[#696A61]">
              Loading collection records...
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="border border-dashed border-[#DEDCD3] bg-white px-5 py-16 text-center sm:py-20">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
              <svg
                className="h-7 w-7"
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
                  d="M14 3v5h5M9 13h6M9 17h6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-[#252820]">
              No collections yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#696A61]">
              Your waste collection records will appear here once you start
              submitting collections.
            </p>
          </div>
        ) : (
          <div className="border border-[#DEDCD3] bg-white">
            <div className="flex items-center justify-between border-b border-[#DEDCD3] bg-[#EFEEE6] px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#626B4F]">
                Your collections
              </p>
              <p className="text-xs text-[#696A61]">
                {history.length}{" "}
                {history.length === 1 ? "entry" : "entries"}
              </p>
            </div>

            <div className="divide-y divide-[#DEDCD3]">
              {history.map((item) => {
                const wasteStyle =
                  wasteStyles[item.wasteType] || {
                    background: "#EFEEE6",
                    color: "#626B4F",
                    border: "#DEDCD3",
                  };

                return (
                  <article
                    key={item._id}
                    className="p-5 transition-colors hover:bg-[#F8F7F2]/70 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span
                            className="border px-3 py-1.5 text-xs font-semibold"
                            style={{
                              backgroundColor: wasteStyle.background,
                              color: wasteStyle.color,
                              borderColor: wasteStyle.border,
                            }}
                          >
                            {item.wasteType}
                          </span>

                          <span className="text-xs text-[#696A61]">
                            {new Date(item.date).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          <div className="flex items-center gap-2 text-[#626B4F]">
                            <HistoryIcon type="weight" />
                            <div>
                              <p className="text-lg font-semibold text-[#252820]">
                                {item.weight} kg
                              </p>
                              <p className="text-[11px] text-[#696A61]">
                                Recorded weight
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-2 text-[#626B4F]">
                            <div className="mt-1 shrink-0">
                              <HistoryIcon type="location" />
                            </div>
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium text-[#252820]">
                                {[item.city, item.area]
                                  .filter(Boolean)
                                  .join(", ") || "Location not provided"}
                              </p>
                              <p className="mt-1 text-[11px] text-[#696A61]">
                                Collection location
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#DEDCD3] pt-4 sm:min-w-[130px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <p className="text-xs uppercase tracking-[0.12em] text-[#696A61]">
                          Earned
                        </p>
                        <p className="text-2xl font-semibold tracking-tight text-[#626B4F]">
                          ₹
                          {Number(item.earning || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        <footer className="mt-6 border-t border-[#DEDCD3] pt-4">
          <p className="text-xs leading-5 text-[#858579]">
            Clean-India · Collection records and earnings
          </p>
        </footer>
      </section>
    </main>
  );
}