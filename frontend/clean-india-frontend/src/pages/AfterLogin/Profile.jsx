import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const statusStyles = {
  "on-work": {
    label: "On work",
    color: "#48533E",
    background: "#F0F1E9",
    border: "#D5D9C9",
    dot: "#626B4F",
  },
  leave: {
    label: "On leave",
    color: "#9A6728",
    background: "#F6F0E4",
    border: "#E6D6B9",
    dot: "#B58A4C",
  },
  "not-in-work": {
    label: "Not in work",
    color: "#696A61",
    background: "#EFEEE6",
    border: "#DEDCD3",
    dot: "#858579",
  },
};

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
      {children}
    </p>
  );
}

function StatCard({ label, value, detail, number }) {
  return (
    <div className="border border-[#DEDCD3] bg-white p-5 sm:p-6">
      <div className="mb-7 flex items-start justify-between gap-3">
        <p className="text-sm text-[#696A61]">{label}</p>
        <span className="text-xs text-[#858579]">0{number}</span>
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

function Field({ label, name, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#252820]"
      >
        {label}
      </label>
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-none border border-[#DEDCD3] bg-[#F8F7F2] px-4 py-3 text-sm text-[#252820] outline-none transition-colors placeholder:text-[#858579] focus:border-[#626B4F] focus:ring-2 focus:ring-[#626B4F]/15"
      />
    </div>
  );
}

function ProfileModal({
  editFormData,
  handleEditChange,
  handleEditSubmit,
  updating,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#252820]/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !updating) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#DEDCD3] bg-[#F8F7F2] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#DEDCD3] p-5 sm:p-7">
          <div>
            <SectionLabel>Account settings</SectionLabel>
            <h2
              id="edit-profile-title"
              className="text-2xl font-semibold tracking-tight text-[#252820]"
            >
              Edit profile
            </h2>
            <p className="mt-2 text-sm text-[#696A61]">
              Update your personal and location details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            aria-label="Close profile editor"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#DEDCD3] text-[#696A61] transition-colors hover:bg-[#EFEEE6] hover:text-[#252820] disabled:opacity-50"
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

        <form onSubmit={handleEditSubmit} className="space-y-5 p-5 sm:p-7">
          <Field
            label="Full name"
            name="name"
            value={editFormData.name}
            onChange={handleEditChange}
          />
          <Field
            label="City"
            name="city"
            value={editFormData.city}
            onChange={handleEditChange}
          />
          <Field
            label="Village"
            name="village"
            value={editFormData.village}
            onChange={handleEditChange}
          />
          <Field
            label="Taluka"
            name="taluka"
            value={editFormData.taluka}
            onChange={handleEditChange}
          />

          <div className="flex flex-col-reverse gap-3 border-t border-[#DEDCD3] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="border border-[#DEDCD3] px-5 py-3 text-sm font-medium text-[#252820] transition-colors hover:bg-[#EFEEE6] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="bg-[#252820] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#404638] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workStatus, setWorkStatus] = useState(
    user?.workStatus || "not-in-work"
  );
  const [updating, setUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    city: user?.city || "",
    village: user?.village || "",
    taluka: user?.taluka || "",
  });

  useEffect(() => {
    if (user?.phone) {
      fetchStats();
    }

    if (user?.workStatus) {
      setWorkStatus(user.workStatus);
    }

    // Synchronize profile fields when the authenticated user changes.
    setEditFormData({
      name: user?.name || "",
      city: user?.city || "",
      village: user?.village || "",
      taluka: user?.taluka || "",
    });

    // fetchStats is intentionally triggered by user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      if (user?.role === "worker") {
        const res = await axios.get(
          `http://localhost:5000/api/waste/worker-stats/${user.phone}`
        );
        setStats(res.data.stats);
      } else if (user?.role === "owner") {
        const res = await axios.get(
          `http://localhost:5000/api/coupons/owner/${user.phone}`
        );
        setStats({
          totalCoupons: res.data.coupons.length,
          activeCoupons: res.data.coupons.filter((c) => c.isActive).length,
        });
      } else {
        const res = await axios.get(
          `http://localhost:5000/api/waste/history/${user.phone}`
        );

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

        setStats({
          totalEarning,
          totalWaste,
          totalSubmissions: res.data.history.length,
        });
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleWorkStatusChange = async (newStatus) => {
    setUpdating(true);

    try {
      await axios.patch("http://localhost:5000/api/auth/work-status", {
        phone: user.phone,
        workStatus: newStatus,
      });

      setWorkStatus(newStatus);

      const updatedUser = { ...user, workStatus: newStatus };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert("Failed to update work status");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axios.put(
        `http://localhost:5000/api/auth/profile/${user.phone}`,
        editFormData
      );

      const updatedUser = { ...user, ...editFormData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "on-work":
        return "On work";
      case "not-in-work":
        return "Not in work";
      case "leave":
        return "On leave";
      default:
        return status;
    }
  };

  const currentStatus = statusStyles[workStatus] || statusStyles["not-in-work"];

  const roleLabel =
    user?.role === "worker"
      ? "Collection worker"
      : user?.role === "owner"
        ? "Business owner"
        : "Citizen";

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Profile header */}
        <header className="mb-9 flex flex-col gap-6 border-b border-[#DEDCD3] pb-8 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#D5D9C9] bg-[#EFEEE6] text-2xl font-semibold uppercase text-[#626B4F] sm:h-20 sm:w-20 sm:text-3xl">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div className="min-w-0">
              <SectionLabel>Your account</SectionLabel>
              <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
                {user?.name || "Profile"}
              </h1>
              <p className="mt-2 text-sm text-[#696A61]">{roleLabel}</p>
              <span className="mt-3 inline-flex border border-[#DEDCD3] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#626B4F]">
                {user?.role || "citizen"} account
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="inline-flex items-center justify-center gap-2 self-start border border-[#DEDCD3] bg-white px-5 py-3 text-sm font-medium text-[#252820] transition-colors hover:bg-[#EFEEE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#626B4F] sm:self-auto"
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
                d="m15 5 4 4M4 20l4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit profile
          </button>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Personal information */}
          <section className="border border-[#DEDCD3] bg-white p-5 sm:p-7">
            <div className="mb-6 border-b border-[#DEDCD3] pb-5">
              <SectionLabel>Account details</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight">
                Personal information
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-1 text-xs text-[#696A61]">Full name</p>
                <p className="break-words text-sm font-medium text-[#252820]">
                  {user?.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-[#696A61]">Phone number</p>
                <p className="break-words font-mono text-sm font-medium text-[#252820]">
                  {user?.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-[#696A61]">Account role</p>
                <p className="text-sm font-medium capitalize text-[#252820]">
                  {user?.role || "Citizen"}
                </p>
              </div>

              {(user?.city || user?.village || user?.taluka) && (
                <div>
                  <p className="mb-1 text-xs text-[#696A61]">Location</p>
                  <p className="break-words text-sm leading-6 text-[#252820]">
                    {[user?.city, user?.village, user?.taluka]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {user?.role === "worker" && (
              <div className="mt-7 border-t border-[#DEDCD3] pt-6">
                <SectionLabel>Availability</SectionLabel>
                <h3 className="mb-4 text-lg font-semibold">Work status</h3>

                <div
                  className="mb-4 flex items-center gap-3 border p-3"
                  style={{
                    backgroundColor: currentStatus.background,
                    borderColor: currentStatus.border,
                    color: currentStatus.color,
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: currentStatus.dot }}
                  />
                  <span className="text-sm font-medium">
                    {getStatusLabel(workStatus)}
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { value: "on-work", label: "On work" },
                    { value: "not-in-work", label: "Not in work" },
                    { value: "leave", label: "On leave" },
                  ].map((status) => {
                    const active = workStatus === status.value;

                    return (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleWorkStatusChange(status.value)}
                        disabled={updating || active}
                        className={`w-full border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                          active
                            ? "border-[#626B4F] bg-[#F0F1E9] font-semibold text-[#48533E]"
                            : "border-[#DEDCD3] bg-white text-[#696A61] hover:bg-[#EFEEE6] hover:text-[#252820]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          {status.label}
                          {active && (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                d="m5 12 4 4L19 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {updating && (
                  <p className="mt-3 text-xs text-[#696A61]">
                    Updating work status...
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Role-specific statistics */}
          <section className="border border-[#DEDCD3] bg-white p-5 sm:p-7 lg:col-span-2">
            <div className="mb-6 border-b border-[#DEDCD3] pb-5">
              <SectionLabel>Account overview</SectionLabel>
              <h2 className="text-xl font-semibold tracking-tight">
                {user?.role === "worker"
                  ? "Work statistics"
                  : user?.role === "owner"
                    ? "Business statistics"
                    : "My statistics"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#696A61]">
                A summary of your activity on Clean-India.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#DEDCD3] border-t-[#626B4F]" />
                <p className="text-sm text-[#696A61]">
                  Loading statistics...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2">
                {user?.role === "worker" ? (
                  <>
                    <StatCard
                      number={1}
                      label="Total verifications"
                      value={stats?.totalVerifications || 0}
                      detail="Collections verified"
                    />
                    <StatCard
                      number={2}
                      label="Waste processed"
                      value={`${stats?.totalWasteProcessed || 0} kg`}
                      detail="Total recorded weight"
                    />
                    <div className="border border-[#DEDCD3] bg-[#EFEEE6] p-5 sm:col-span-2 sm:p-6">
                      <p className="mb-5 text-sm text-[#696A61]">
                        Work score
                      </p>
                      <p className="text-4xl font-semibold tracking-tight text-[#626B4F] sm:text-5xl">
                        {Math.floor(
                          (stats?.totalWasteProcessed || 0) / 10
                        )}
                      </p>
                      <p className="mt-3 text-xs text-[#696A61]">
                        Based on the total waste processed.
                      </p>
                    </div>
                  </>
                ) : user?.role === "owner" ? (
                  <>
                    <StatCard
                      number={1}
                      label="Total coupons"
                      value={stats?.totalCoupons || 0}
                      detail="Coupons created"
                    />
                    <StatCard
                      number={2}
                      label="Active coupons"
                      value={stats?.activeCoupons || 0}
                      detail="Currently marked active"
                    />
                    <div className="border border-[#DEDCD3] bg-[#EFEEE6] p-5 sm:col-span-2 sm:p-6">
                      <SectionLabel>Partner account</SectionLabel>
                      <h3 className="text-xl font-semibold text-[#252820]">
                        Local business partner
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#696A61]">
                        Manage your coupons and support community
                        participation through local offers.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <StatCard
                      number={1}
                      label="Wallet balance"
                      value={`₹${Number(user?.walletBalance || 0).toLocaleString("en-IN")}`}
                      detail="Current account balance"
                    />
                    <StatCard
                      number={2}
                      label="Total earnings"
                      value={`₹${Number(stats?.totalEarning || 0).toLocaleString("en-IN")}`}
                      detail="From verified collections"
                    />
                    <StatCard
                      number={3}
                      label="Waste submitted"
                      value={`${stats?.totalWaste || 0} kg`}
                      detail="Verified collection weight"
                    />
                    <StatCard
                      number={4}
                      label="CI points"
                      value={user?.rewards || 0}
                      detail="Your Clean-India rewards"
                    />
                  </>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Logout */}
        <footer className="mt-8 flex flex-col justify-between gap-4 border-t border-[#DEDCD3] pt-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#252820]">
              Need to switch accounts?
            </p>
            <p className="mt-1 text-xs text-[#696A61]">
              Sign out of your current Clean-India account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 border border-[#E8C9BE] px-5 py-3 text-sm font-medium text-[#B84732] transition-colors hover:bg-[#F8EDE8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65B35]"
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
                d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Log out
          </button>
        </footer>
      </div>

      {isEditingProfile && (
        <ProfileModal
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          updating={updating}
          onClose={() => setIsEditingProfile(false)}
        />
      )}
    </main>
  );
}