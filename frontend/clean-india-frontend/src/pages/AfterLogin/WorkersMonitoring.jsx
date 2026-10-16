import { useState, useEffect } from "react";
import axios from "axios";

export default function WorkersMonitoring() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    working: 0,
    onLeave: 0,
    notWorking: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerDetails, setWorkerDetails] = useState(null);
  const [workerLoading, setWorkerLoading] = useState(false);

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterWorkers(selectedFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers, selectedFilter]);

  useEffect(() => {
    if (!selectedWorker) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedWorker(null);
        setWorkerDetails(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedWorker]);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/workers"
      );

      setWorkers(res.data.workers);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching workers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkers = (status) => {
    setFilteredWorkers(
      !status
        ? workers
        : workers.filter((worker) => worker.workStatus === status)
    );
  };

  const handleFilterClick = (status) => {
    setSelectedFilter(selectedFilter === status ? null : status);
  };

  const handleWorkerClick = async (worker) => {
    setSelectedWorker(worker);
    setWorkerDetails(null);
    setWorkerLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/workers/${worker._id}`
      );

      setWorkerDetails(res.data);
    } catch (err) {
      console.error("Error fetching worker details:", err);
    } finally {
      setWorkerLoading(false);
    }
  };

  const closeWorkerReport = () => {
    setSelectedWorker(null);
    setWorkerDetails(null);
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

  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const locationLabel = (worker) =>
    [
      worker?.city || worker?.village,
      worker?.taluka,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";

  const statusFilters = [
    {
      label: "All workers",
      value: null,
      count: stats.total,
      description: "Registered workforce",
      accent: "#626B4F",
    },
    {
      label: "Working",
      value: "on-work",
      count: stats.working,
      description: "Currently on duty",
      accent: "#626B4F",
    },
    {
      label: "On leave",
      value: "leave",
      count: stats.onLeave,
      description: "Temporarily unavailable",
      accent: "#B88643",
    },
    {
      label: "Not working",
      value: "not-in-work",
      count: stats.notWorking,
      description: "Currently off duty",
      accent: "#C65B35",
    },
  ];

  return (
    <section className="min-h-screen bg-[#F8F7F2] px-4 py-7 text-[#252820] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-8 border-b border-[#DEDCD3] pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
            Clean-India / Administration
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Workers monitoring
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#696A61]">
                Monitor workforce availability, review collection activity,
                and inspect individual performance.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#696A61]">
              <span className="h-2 w-2 rounded-full bg-[#626B4F]" />
              Workforce overview
            </div>
          </div>
        </header>

        {/* Workforce statistics */}
        <section className="mb-10">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#858579]">
              At a glance
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Workforce status
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statusFilters.map((item) => {
              const active = selectedFilter === item.value;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleFilterClick(item.value)}
                  aria-pressed={active}
                  className={`relative border bg-white p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#626B4F] focus:ring-offset-2 sm:p-6 ${
                    active
                      ? "border-[#626B4F] ring-1 ring-[#626B4F]"
                      : "border-[#DEDCD3] hover:border-[#B8BBAA]"
                  }`}
                >
                  <span
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: item.accent }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-[#696A61]">
                      {item.label}
                    </span>

                    {active && (
                      <span className="text-xs font-semibold text-[#626B4F]">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-4xl font-semibold tracking-tight">
                    {item.count ?? 0}
                  </p>

                  <p className="mt-2 text-xs text-[#858579]">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Workers list */}
        <section className="border border-[#DEDCD3] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#DEDCD3] p-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.17em] text-[#626B4F]">
                Directory
              </p>

              <h2 className="text-xl font-semibold tracking-tight">
                Registered workers
              </h2>

              <p className="mt-1 text-sm text-[#696A61]">
                {loading
                  ? "Retrieving worker records..."
                  : `${filteredWorkers.length} ${
                      filteredWorkers.length === 1 ? "worker" : "workers"
                    } shown`}
              </p>
            </div>

            {selectedFilter && (
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${getStatusStyle(
                    selectedFilter
                  )}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(
                      selectedFilter
                    )}`}
                  />
                  {getStatusLabel(selectedFilter)}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedFilter(null)}
                  className="text-sm font-medium text-[#696A61] underline underline-offset-4 transition-colors hover:text-[#252820]"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
              <p className="mt-4 text-sm text-[#696A61]">
                Loading worker records...
              </p>
            </div>
          ) : filteredWorkers.length === 0 ? (
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
                    d="M16 19h6v-2a3 3 0 0 0-4.5-2.6M16 19H8m8 0v-2a4 4 0 0 0-8 0v2m0 0H2v-2a3 3 0 0 1 4.5-2.6M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-semibold">
                {selectedFilter
                  ? `No ${getStatusLabel(selectedFilter).toLowerCase()} workers`
                  : "No workers registered"}
              </h3>

              <p className="mt-2 text-sm text-[#696A61]">
                {selectedFilter
                  ? "Try selecting another status to see more workers."
                  : "Worker records will appear here once they register."}
              </p>

              {selectedFilter && (
                <button
                  type="button"
                  onClick={() => setSelectedFilter(null)}
                  className="mt-5 text-sm font-semibold text-[#48533E] underline underline-offset-4 hover:text-[#252820]"
                >
                  Show all workers
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile layout */}
              <div className="divide-y divide-[#E8E6DE] md:hidden">
                {filteredWorkers.map((worker) => (
                  <button
                    key={worker._id}
                    type="button"
                    onClick={() => handleWorkerClick(worker)}
                    className="block w-full p-5 text-left transition-colors hover:bg-[#FBFAF6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#626B4F]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#EFEEE6] text-sm font-semibold text-[#48533E]">
                          {worker.name?.charAt(0)?.toUpperCase() || "W"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {worker.name || "Unnamed worker"}
                          </p>
                          <p className="mt-1 break-all text-xs text-[#696A61]">
                            {worker.phone}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1.5 text-xs font-semibold ${getStatusStyle(
                          worker.workStatus
                        )}`}
                      >
                        {getStatusLabel(worker.workStatus)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#E8E6DE] pt-3">
                      <div>
                        <p className="text-xs text-[#858579]">Location</p>
                        <p className="mt-1 text-sm text-[#252820]">
                          {locationLabel(worker)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#858579]">Work score</p>
                        <p className="mt-1 text-sm font-semibold text-[#48533E]">
                          {worker.workScore || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 text-xs font-semibold text-[#626B4F]">
                      View worker report
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
                          d="M7 17 17 7M7 7h10v10"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8F7F2]">
                      {[
                        "Worker",
                        "Phone",
                        "Location",
                        "Work score",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#696A61] ${
                            heading === "Work score" || heading === "Status"
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
                    {filteredWorkers.map((worker) => {
                      const score = Math.min(
                        100,
                        Math.max(0, Number(worker.workScore) || 0)
                      );

                      return (
                        <tr
                          key={worker._id}
                          onClick={() => handleWorkerClick(worker)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleWorkerClick(worker);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View report for ${worker.name || "worker"}`}
                          className="cursor-pointer border-t border-[#E8E6DE] transition-colors hover:bg-[#FBFAF6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#626B4F]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#EFEEE6] text-sm font-semibold text-[#48533E]">
                                {worker.name?.charAt(0)?.toUpperCase() || "W"}
                              </div>

                              <span className="font-medium text-[#252820]">
                                {worker.name || "Unnamed worker"}
                              </span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-[#696A61]">
                            {worker.phone || "N/A"}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#696A61]">
                            {locationLabel(worker)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="mx-auto flex w-24 items-center gap-3">
                              <div className="h-1.5 flex-1 overflow-hidden bg-[#EFEEE6]">
                                <div
                                  className="h-full bg-[#626B4F]"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="w-7 text-right text-sm font-semibold text-[#48533E]">
                                {worker.workScore || 0}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                worker.workStatus
                              )}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(
                                  worker.workStatus
                                )}`}
                              />
                              {getStatusLabel(worker.workStatus)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="border-t border-[#DEDCD3] bg-[#F8F7F2] px-5 py-3 sm:px-7">
            <p className="text-xs leading-5 text-[#858579]">
              Select a worker to view shift information, collection statistics,
              and recent activity.
            </p>
          </div>
        </section>

        <footer className="py-6 text-center">
          <p className="text-xs text-[#858579]">
            Clean-India · Workforce administration
          </p>
        </footer>
      </div>

      {/* Worker report modal */}
      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#252820]/60 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeWorkerReport();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="worker-report-title"
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-[#DEDCD3] bg-[#F8F7F2] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#DEDCD3] bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.17em] text-[#626B4F]">
                  Workforce / Report
                </p>
                <h2
                  id="worker-report-title"
                  className="text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  Worker details
                </h2>
                <p className="mt-1 text-sm text-[#696A61]">
                  {selectedWorker.name || "Worker"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeWorkerReport}
                aria-label="Close worker report"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#696A61] transition-colors hover:bg-[#EFEEE6] hover:text-[#252820] focus:outline-none focus:ring-2 focus:ring-[#626B4F]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-7">
              {workerLoading ? (
                <div className="flex min-h-64 flex-col items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
                  <p className="mt-4 text-sm text-[#696A61]">
                    Loading worker report...
                  </p>
                </div>
              ) : workerDetails ? (
                <div className="space-y-5">
                  {/* Worker information */}
                  <section className="border border-[#DEDCD3] bg-white p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#E7EBDD] text-xl font-semibold text-[#48533E]">
                        {selectedWorker.name?.charAt(0)?.toUpperCase() || "W"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-xl font-semibold">
                          {selectedWorker.name || "Unnamed worker"}
                        </h3>
                        <p className="mt-1 break-all font-mono text-sm text-[#696A61]">
                          {selectedWorker.phone || "N/A"}
                        </p>
                      </div>

                      <span
                        className={`w-fit px-3 py-2 text-xs font-semibold sm:ml-auto ${getStatusStyle(
                          selectedWorker.workStatus
                        )}`}
                      >
                        {getStatusLabel(selectedWorker.workStatus)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E8E6DE] pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#858579]">Location</p>
                        <p className="mt-1 text-sm font-medium">
                          {locationLabel(selectedWorker)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#858579]">Work score</p>
                        <p className="mt-1 text-sm font-semibold text-[#48533E]">
                          {selectedWorker.workScore || 0}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Shift information */}
                  <section className="border border-[#DEDCD3] bg-white p-5 sm:p-6">
                    <SectionHeading
                      eyebrow="Attendance"
                      title="Shift information"
                    />

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DetailItem
                        label="Shift start"
                        value={formatTime(workerDetails.worker?.shiftStartTime)}
                        note={formatDate(workerDetails.worker?.shiftStartTime)}
                      />

                      <DetailItem
                        label="Shift end"
                        value={formatTime(workerDetails.worker?.shiftEndTime)}
                        note={formatDate(workerDetails.worker?.shiftEndTime)}
                      />
                    </div>

                    <div className="mt-4 border-t border-[#E8E6DE] pt-4">
                      <p className="text-xs text-[#858579]">
                        Total recorded shift hours
                      </p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight text-[#48533E]">
                        {(
                          Number(workerDetails.worker?.totalShiftHours) || 0
                        ).toFixed(2)}
                        <span className="ml-2 text-sm font-normal text-[#696A61]">
                          hours
                        </span>
                      </p>
                    </div>
                  </section>

                  {/* Last month working hours */}
                  <section className="border border-[#DEDCD3] bg-white p-5 sm:p-6">
                    <SectionHeading
                      eyebrow="Monthly overview"
                      title="Last month working hours"
                    />

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <DetailItem
                        label="Total hours"
                        value={(
                          Number(
                            workerDetails.stats?.lastMonthTotalHours
                          ) || 0
                        ).toFixed(1)}
                        note="Hours"
                      />

                      <DetailItem
                        label="Working days"
                        value={
                          workerDetails.stats?.lastMonthWorkingDays || 0
                        }
                        note="Days"
                      />

                      <DetailItem
                        label="Daily average"
                        value={(
                          Number(
                            workerDetails.stats?.lastMonthAvgDailyHours
                          ) || 0
                        ).toFixed(1)}
                        note="Hours per day"
                      />
                    </div>
                  </section>

                  {/* Collection statistics */}
                  <section>
                    <SectionHeading
                      eyebrow="Collection activity"
                      title="Performance statistics"
                    />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Total collections",
                          value:
                            workerDetails.stats?.totalCollections || 0,
                        },
                        {
                          label: "Total weight",
                          value: `${
                            workerDetails.stats?.totalWeight || 0
                          } kg`,
                        },
                        {
                          label: "Verified",
                          value:
                            workerDetails.stats?.verifiedCollections || 0,
                        },
                        {
                          label: "Pending",
                          value:
                            workerDetails.stats?.pendingCollections || 0,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="border border-[#DEDCD3] bg-white p-4 sm:p-5"
                        >
                          <p className="text-xs text-[#696A61]">
                            {item.label}
                          </p>
                          <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#30382B] sm:text-3xl">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Recent collections */}
                  <section className="border border-[#DEDCD3] bg-white">
                    <div className="border-b border-[#DEDCD3] px-5 py-4">
                      <SectionHeading
                        eyebrow="Activity log"
                        title="Recent collections"
                      />
                    </div>

                    {workerDetails.recentCollections?.length > 0 ? (
                      <div className="divide-y divide-[#E8E6DE]">
                        {workerDetails.recentCollections.map((collection) => (
                          <div
                            key={collection._id}
                            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                {collection.wasteType || "N/A"}
                              </p>
                              <p className="mt-1 text-xs text-[#858579]">
                                {formatDate(collection.date)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                              <p className="text-sm font-semibold text-[#48533E]">
                                {collection.weight || 0} kg
                              </p>

                              <span
                                className={`px-2.5 py-1.5 text-xs font-semibold ${
                                  collection.status === "verified"
                                    ? "bg-[#E7EBDD] text-[#48533E]"
                                    : "bg-[#F4EBDD] text-[#966A32]"
                                }`}
                              >
                                {collection.status === "verified"
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <p className="text-sm font-medium">
                          No collections yet
                        </p>
                        <p className="mt-1 text-xs text-[#858579]">
                          No recent collection records are available.
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <p className="font-semibold">Unable to load report</p>
                  <p className="mt-2 text-sm text-[#696A61]">
                    Please close this window and try again.
                  </p>
                </div>
              )}
            </div>

            <footer className="flex justify-end border-t border-[#DEDCD3] bg-white px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={closeWorkerReport}
                className="bg-[#30382B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#48533E] focus:outline-none focus:ring-2 focus:ring-[#626B4F] focus:ring-offset-2"
              >
                Close report
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#252820]">
        {title}
      </h3>
    </div>
  );
}

function DetailItem({ label, value, note }) {
  return (
    <div className="border border-[#E8E6DE] bg-[#FBFAF6] p-4">
      <p className="text-xs text-[#858579]">{label}</p>
      <p className="mt-2 break-words text-xl font-semibold tracking-tight text-[#30382B]">
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-[#858579]">{note}</p>}
    </div>
  );
}