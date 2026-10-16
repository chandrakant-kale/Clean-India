import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function WorkerReport() {
  const { workerId } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [stats, setStats] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerDetails();
    // Fetch again when the worker ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerId]);

  const fetchWorkerDetails = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/workers/${workerId}`
      );

      setWorker(res.data.worker);
      setStats(res.data.stats);
      setCollections(res.data.recentCollections || []);
    } catch (err) {
      console.error("Error fetching worker details:", err);
      setWorker(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "on-work":
        return "Working";
      case "leave":
        return "On Leave";
      case "not-in-work":
        return "Not Working";
      default:
        return status || "Not Set";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "on-work":
        return "bg-[#E7EBDD] text-[#48533E]";
      case "leave":
        return "bg-[#F4EBDD] text-[#966A32]";
      case "not-in-work":
        return "bg-[#F5E5DF] text-[#A34A31]";
      default:
        return "bg-[#EFEEE6] text-[#696A61]";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "on-work":
        return "bg-[#626B4F]";
      case "leave":
        return "bg-[#B88643]";
      case "not-in-work":
        return "bg-[#C65B35]";
      default:
        return "bg-[#858579]";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-[#F8F7F2] px-4 py-16 text-[#252820] sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-24">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
          <p className="mt-5 text-sm text-[#696A61]">
            Loading worker report...
          </p>
        </div>
      </section>
    );
  }

  if (!worker) {
    return (
      <section className="min-h-[60vh] bg-[#F8F7F2] px-4 py-16 text-[#252820] sm:px-6">
        <div className="mx-auto max-w-xl border border-[#DEDCD3] bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E5DF] text-[#A34A31]">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M12 9v4m0 4h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#A34A31]">
            Report unavailable
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Worker not found
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#696A61]">
            We couldn't retrieve this worker's details. Return to the previous
            page and try again.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-7 inline-flex items-center gap-2 bg-[#30382B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#48533E] focus:outline-none focus:ring-2 focus:ring-[#626B4F] focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="m15 18-6-6 6-6"
              />
            </svg>
            Go back
          </button>
        </div>
      </section>
    );
  }

  const statisticCards = [
    {
      label: "Total collections",
      value: stats?.totalCollections || 0,
      description: "Collections recorded",
      numberColor: "text-[#252820]",
      accent: "bg-[#626B4F]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.7}
            d="m5 12 4 4L19 6"
          />
        </svg>
      ),
    },
    {
      label: "Total weight",
      value: stats?.totalWeight || 0,
      suffix: "kg",
      description: "Waste collected",
      numberColor: "text-[#48533E]",
      accent: "bg-[#858D70]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.7}
            d="M12 3v18m-5-2h10M5 7h14l-2 12H7L5 7Zm3-4h8"
          />
        </svg>
      ),
    },
    {
      label: "Verified",
      value: stats?.verifiedCollections || 0,
      description: "Verified collections",
      numberColor: "text-[#48533E]",
      accent: "bg-[#626B4F]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.7}
            d="M9 12.5 11 14.5 15.5 10m5-1.5v4.2a2 2 0 0 1-.6 1.4l-6.5 6.5a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1 0-2.8l6.5-6.5a2 2 0 0 1 1.4-.6H17a3.5 3.5 0 0 1 3.5 3.5Z"
          />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats?.pendingCollections || 0,
      description: "Awaiting verification",
      numberColor: "text-[#A34A31]",
      accent: "bg-[#C65B35]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            strokeWidth={1.7}
          />
          <path
            d="M12 7v5l3 2"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-[#F8F7F2] px-4 py-7 text-[#252820] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <header className="mb-8 border-b border-[#DEDCD3] pb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#696A61] transition-colors hover:text-[#252820] focus:outline-none focus:underline"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="m15 18-6-6 6-6"
              />
            </svg>
            Back
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
                Clean-India / Workforce
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Worker report
              </h1>
              <p className="mt-2 text-sm text-[#696A61]">
                Worker profile, collection performance and recent activity.
              </p>
            </div>

            <p className="text-xs text-[#858579]">
              Report ID: {workerId}
            </p>
          </div>
        </header>

        {/* Worker profile */}
        <section className="mb-8 border border-[#DEDCD3] bg-white">
          <div className="h-1 bg-[#626B4F]" />

          <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#EFEEE6] text-2xl font-semibold text-[#48533E] sm:h-20 sm:w-20 sm:text-3xl">
                {worker.name?.charAt(0)?.toUpperCase() || "W"}
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#858579]">
                  Worker profile
                </p>

                <h2 className="break-words text-xl font-semibold tracking-tight sm:text-2xl">
                  {worker.name || "Unnamed worker"}
                </h2>

                <p className="mt-1 break-all text-sm text-[#696A61]">
                  {worker.phone || "No phone number"}
                </p>

                <p className="mt-2 text-sm text-[#696A61]">
                  {[worker.city || worker.village, worker.taluka]
                    .filter(Boolean)
                    .join(", ") || "Location not available"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 border-t border-[#DEDCD3] pt-5 sm:gap-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-[#858579]">
                  Current status
                </p>

                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${getStatusStyle(
                    worker.workStatus
                  )}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusDotColor(
                      worker.workStatus
                    )}`}
                  />
                  {getStatusLabel(worker.workStatus)}
                </span>
              </div>

              <div className="min-w-[100px]">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-[#858579]">
                  Work score
                </p>
                <p className="text-3xl font-semibold tracking-tight text-[#C65B35]">
                  {worker.workScore || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#626B4F]">
                Performance overview
              </p>
              <h2 className="text-xl font-semibold tracking-tight">
                Collection statistics
              </h2>
            </div>

            <span className="hidden text-xs text-[#858579] sm:block">
              All recorded activity
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statisticCards.map((item) => (
              <article
                key={item.label}
                className="relative overflow-hidden border border-[#DEDCD3] bg-white p-5 transition-colors hover:border-[#B8BBAA] sm:p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#696A61]">
                    {item.label}
                  </span>

                  <span
                    className={`flex h-9 w-9 items-center justify-center ${item.accent} text-white`}
                  >
                    {item.icon}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-3xl font-semibold tracking-tight ${item.numberColor}`}
                  >
                    {item.value}
                  </p>

                  {item.suffix && (
                    <span className="text-sm text-[#696A61]">
                      {item.suffix}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#858579]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Recent collections */}
        <section className="border border-[#DEDCD3] bg-white">
          <div className="flex flex-col gap-2 border-b border-[#DEDCD3] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#626B4F]">
                Activity log
              </p>
              <h2 className="text-xl font-semibold tracking-tight">
                Recent collections
              </h2>
            </div>

            <p className="text-sm text-[#696A61]">
              {collections.length}{" "}
              {collections.length === 1 ? "record" : "records"}
            </p>
          </div>

          {collections.length === 0 ? (
            <div className="px-5 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#EFEEE6] text-[#626B4F]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13ZM8 8h8m-8 4h8m-8 4h5"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-semibold">
                No collections recorded
              </h3>

              <p className="mt-2 text-sm text-[#696A61]">
                Collection activity will appear here when available.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile collection cards */}
              <div className="divide-y divide-[#E8E6DE] md:hidden">
                {collections.map((collection) => (
                  <article key={collection._id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">
                          {collection.wasteType || "N/A"}
                        </h3>
                        <p className="mt-1 text-xs text-[#858579]">
                          {formatDate(collection.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-2 px-2.5 py-1.5 text-xs font-semibold ${
                          collection.verified
                            ? "bg-[#E7EBDD] text-[#48533E]"
                            : "bg-[#F4EBDD] text-[#966A32]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            collection.verified
                              ? "bg-[#626B4F]"
                              : "bg-[#B88643]"
                          }`}
                        />
                        {collection.verified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#858579]">Weight</p>
                        <p className="mt-1 text-sm font-medium">
                          {collection.weight || 0} kg
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#858579]">Area</p>
                        <p className="mt-1 break-words text-sm font-medium">
                          {collection.area || "N/A"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop collection table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8F7F2]">
                      {[
                        "Date",
                        "Waste type",
                        "Weight",
                        "Area",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#696A61] ${
                            heading === "Weight" || heading === "Status"
                              ? "text-center"
                              : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {collections.map((collection) => (
                      <tr
                        key={collection._id}
                        className="border-t border-[#E8E6DE] transition-colors hover:bg-[#FBFAF6]"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#696A61]">
                          {formatDate(collection.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-[#252820]">
                          {collection.wasteType || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-center text-sm text-[#252820]">
                          {collection.weight || 0} kg
                        </td>

                        <td className="px-6 py-4 text-sm text-[#696A61]">
                          {collection.area || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-1.5 text-xs font-semibold ${
                              collection.verified
                                ? "bg-[#E7EBDD] text-[#48533E]"
                                : "bg-[#F4EBDD] text-[#966A32]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                collection.verified
                                  ? "bg-[#626B4F]"
                                  : "bg-[#B88643]"
                              }`}
                            />
                            {collection.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="border-t border-[#DEDCD3] bg-[#F8F7F2] px-5 py-3 sm:px-7">
            <p className="text-xs leading-5 text-[#858579]">
              Collection records and verification status are shown as returned
              by the Clean-India system.
            </p>
          </div>
        </section>

        <footer className="py-6 text-center">
          <p className="text-xs text-[#858579]">
            Clean-India · Worker performance report
          </p>
        </footer>
      </div>
    </section>
  );
}