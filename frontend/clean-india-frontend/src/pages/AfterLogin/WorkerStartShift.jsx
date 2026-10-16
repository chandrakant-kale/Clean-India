import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import axios from "axios";

export default function WorkerStartShift() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [shiftActive, setShiftActive] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [loading, setLoading] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  // Restore saved shift state when the component loads.
  useEffect(() => {
    if (user?.phone) {
      try {
        const savedShiftState = localStorage.getItem(
          `shift_${user.phone}`
        );

        if (savedShiftState) {
          const { isActive, startTime } = JSON.parse(savedShiftState);

          if (isActive && startTime) {
            setShiftActive(true);
            setShiftStartTime(startTime);
          }
        }
      } catch (error) {
        console.error("Error restoring shift state:", error);
      }

      setTotalHours(Number(user.totalShiftHours) || 0);
    }
  }, [user]);

  // Keep elapsed time accurate, including after returning to the tab.
  useEffect(() => {
    let interval;

    if (shiftActive && shiftStartTime) {
      const updateElapsedTime = () => {
        const now = new Date();
        const diff = Math.max(0, now - new Date(shiftStartTime));

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      };

      updateElapsedTime();
      interval = setInterval(updateElapsedTime, 1000);
    }

    return () => clearInterval(interval);
  }, [shiftActive, shiftStartTime]);

  // Persist the active shift locally.
  useEffect(() => {
    if (!user?.phone) return;

    if (shiftActive && shiftStartTime) {
      localStorage.setItem(
        `shift_${user.phone}`,
        JSON.stringify({
          isActive: true,
          startTime: shiftStartTime,
        })
      );
    } else {
      localStorage.removeItem(`shift_${user.phone}`);
    }
  }, [shiftActive, shiftStartTime, user?.phone]);

  const startShift = async () => {
    if (!user?.phone) {
      showToast("Phone number not found. Please login again.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/shift/start",
        {
          phone: user.phone,
        }
      );

      setShiftActive(true);
      setShiftStartTime(res.data.shiftStartTime);
      setElapsedTime("00:00:00");

      showToast("Shift started successfully!", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to start shift";

      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const endShift = async () => {
    if (!user?.phone) {
      showToast("Phone number not found. Please login again.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/shift/end",
        {
          phone: user.phone,
        }
      );

      setShiftActive(false);
      setShiftStartTime(null);
      setElapsedTime("00:00:00");
      setTotalHours(parseFloat(res.data.totalShiftHours));

      showToast(
        `Shift ended! Duration: ${res.data.shiftDuration} hours`,
        "success"
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to end shift";

      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <header className="mb-8 border-b border-[#DEDCD3] pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
            Clean-India / Workforce
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Start your shift
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#696A61]">
            Record your working hours and keep your attendance up to date.
          </p>
        </header>

        {/* Main shift panel */}
        <section className="overflow-hidden border border-[#DEDCD3] bg-white">
          <div
            className={`h-1 ${
              shiftActive ? "bg-[#626B4F]" : "bg-[#C65B35]"
            }`}
          />

          <div className="p-5 sm:p-8">
            {/* Current status */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center ${
                    shiftActive
                      ? "bg-[#E7EBDD] text-[#48533E]"
                      : "bg-[#EFEEE6] text-[#696A61]"
                  }`}
                >
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth={1.6}
                    />
                    <path
                      d="M12 7v5l3 2"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#858579]">
                    Current status
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    {shiftActive ? "Shift in progress" : "Shift not started"}
                  </h2>

                  <p className="mt-1 text-sm text-[#696A61]">
                    {shiftActive
                      ? "Your working time is being tracked."
                      : "Start tracking when you begin work."}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 px-3 py-2 text-xs font-semibold ${
                  shiftActive
                    ? "bg-[#E7EBDD] text-[#48533E]"
                    : "bg-[#EFEEE6] text-[#696A61]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    shiftActive ? "bg-[#626B4F]" : "bg-[#858579]"
                  }`}
                />
                {shiftActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            {/* Live timer */}
            {shiftActive && (
              <div className="mt-8 border border-[#D8DDCE] bg-[#F5F6F0] p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#626B4F]">
                  Elapsed working time
                </p>

                <p className="mt-4 font-mono text-4xl font-semibold tracking-tight text-[#30382B] sm:text-5xl">
                  {elapsedTime}
                </p>

                <div className="mt-5 flex flex-col gap-2 border-t border-[#D8DDCE] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#696A61]">
                    Started at{" "}
                    <span className="font-medium text-[#252820]">
                      {shiftStartTime
                        ? new Date(shiftStartTime).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                        : "N/A"}
                    </span>
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs text-[#626B4F]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#626B4F]" />
                    Timer running
                  </span>
                </div>
              </div>
            )}

            {/* Shift details */}
            <div className="mt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.17em] text-[#858579]">
                Your shift details
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border border-[#DEDCD3] p-5">
                  <div className="flex items-center gap-2 text-[#858579]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.6}
                        d="M3 5h18v14H3zM7 9h.01M11 9h6M7 13h10M7 16h6"
                      />
                    </svg>

                    <p className="text-xs font-medium uppercase tracking-wider">
                      Phone number
                    </p>
                  </div>

                  <p className="mt-3 break-all font-mono text-base font-medium text-[#252820]">
                    {user?.phone || "Not set"}
                  </p>
                </div>

                <div className="border border-[#DEDCD3] p-5">
                  <div className="flex items-center gap-2 text-[#858579]">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        strokeWidth={1.6}
                      />
                      <path
                        d="M12 7v5l3 2"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <p className="text-xs font-medium uppercase tracking-wider">
                      Total hours
                    </p>
                  </div>

                  <p className="mt-3 text-2xl font-semibold tracking-tight text-[#48533E]">
                    {Number(totalHours).toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-[#696A61]">
                      hrs
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-8 border-t border-[#DEDCD3] pt-6">
              <button
                type="button"
                onClick={shiftActive ? endShift : startShift}
                disabled={loading}
                className={`flex w-full items-center justify-center gap-3 px-5 py-4 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  shiftActive
                    ? "bg-[#A34A31] hover:bg-[#893C28] focus:ring-[#C65B35]"
                    : "bg-[#30382B] hover:bg-[#48533E] focus:ring-[#626B4F]"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8V1a11 11 0 0 0-11 11h3Z"
                      />
                    </svg>
                    {shiftActive ? "Ending shift..." : "Starting shift..."}
                  </>
                ) : shiftActive ? (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        rx="1"
                        strokeWidth={1.8}
                      />
                    </svg>
                    End shift
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 5v14l11-7L8 5Z"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Start shift
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-[#858579]">
                {shiftActive
                  ? "End your shift after completing your working hours."
                  : "Only start your shift when you are ready to begin work."}
              </p>
            </div>
          </div>
        </section>

        {/* Guidance */}
        <aside className="mt-5 flex items-start gap-3 border border-[#DEDCD3] bg-[#EFEEE6] p-4 sm:p-5">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-[#626B4F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              strokeWidth={1.6}
            />
            <path
              d="M12 11v5m0-8h.01"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </svg>

          <div>
            <h3 className="text-sm font-semibold text-[#30382B]">
              Keep your attendance accurate
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#696A61]">
              Your active shift is saved in this browser so the timer can
              continue after you return to the page. Your backend remains
              responsible for recording the official shift duration.
            </p>
          </div>
        </aside>

        <footer className="py-6 text-center">
          <p className="text-xs text-[#858579]">
            Clean-India · Workforce management
          </p>
        </footer>
      </div>
    </section>
  );
}