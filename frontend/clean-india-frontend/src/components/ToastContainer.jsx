import { useToast } from "../context/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const styles = {
    success: {
      accent: "#626B4F",
      background: "#F0F1E9",
      border: "#D5D9C9",
      label: "Success",
      icon: (
        <path
          d="m5 12 4 4L19 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    error: {
      accent: "#B84732",
      background: "#F8EDE8",
      border: "#E8C9BE",
      label: "Error",
      icon: (
        <path
          d="m8 8 8 8M16 8l-8 8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    warning: {
      accent: "#9A6728",
      background: "#F6F0E4",
      border: "#E6D6B9",
      label: "Warning",
      icon: (
        <path
          d="M12 8v5m0 3h.01M10.3 4.9 2.9 18a1.4 1.4 0 0 0 1.2 2.1h15.8a1.4 1.4 0 0 0 1.2-2.1L13.7 4.9a1.95 1.95 0 0 0-3.4 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    info: {
      accent: "#626B4F",
      background: "#EFEEE6",
      border: "#DEDCD3",
      label: "Information",
      icon: (
        <path
          d="M12 11v5m0-9h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  };

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const current = styles[toast.type] || styles.info;

        return (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className="pointer-events-auto flex items-start gap-3 border p-4 shadow-[0_8px_28px_rgba(37,40,32,0.08)] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              backgroundColor: current.background,
              borderColor: current.border,
              borderRadius: "4px",
            }}
          >
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center"
              style={{
                color: current.accent,
                backgroundColor: "#F8F7F2",
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {current.icon}
              </svg>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: current.accent }}
              >
                {current.label}
              </p>

              <p className="break-words text-sm leading-5 text-[#252820]">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label={`Dismiss ${current.label.toLowerCase()} notification`}
              className="shrink-0 p-1 text-[#696A61] transition-colors hover:text-[#252820] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F]"
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
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}