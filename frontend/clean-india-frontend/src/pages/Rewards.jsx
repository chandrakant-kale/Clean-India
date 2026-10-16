import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RedemptionHistoryModal from "../components/RedemptionHistoryModal";
import axios from "axios";

function Icon({ children, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#626B4F]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#252820] sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#696A61]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Rewards() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [wallet, setWallet] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [purchasedCouponIds, setPurchasedCouponIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [purchasingId, setPurchasingId] = useState(null);
  const [redeemingAmount, setRedeemingAmount] = useState(null);

  useEffect(() => {
    if (user?.phone) {
      fetchWalletData();
      fetchActiveCoupons();
      fetchPurchasedCoupons();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${user.phone}`
      );

      setWallet(res.data.user.walletBalance || 0);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch wallet data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCoupons = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/coupons/active"
      );

      setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch coupons", "error");
    }
  };

  const fetchPurchasedCoupons = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/coupons/purchased/${user.phone}`
      );

      setPurchasedCouponIds(res.data.couponIds);
    } catch (err) {
      console.error(err);
    }
  };

  function redeem(item, value, category) {
    if (wallet < value) {
      showToast("Insufficient balance!", "error");
      return;
    }

    recordCashRedemption(item, value, category);
  }

  const recordCashRedemption = async (item, amount, category) => {
    try {
      setRedeemingAmount(amount);

      await axios.post(
        "http://localhost:5000/api/coupons/redeem-cash",
        {
          citizenPhone: user.phone,
          amount,
          item,
        }
      );

      await fetchWalletData();

      showToast(
        `Successfully redeemed ${item} for ₹${amount}!`,
        "success"
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to record redemption";

      showToast(errorMsg, "error");
      console.error(err);
    } finally {
      setRedeemingAmount(null);
    }
  };

  const handlePurchaseCoupon = async (coupon) => {
    if (wallet < coupon.price) {
      showToast("Insufficient wallet balance!", "error");
      return;
    }

    try {
      setPurchasingId(coupon._id);

      await axios.post(
        "http://localhost:5000/api/coupons/purchase",
        {
          citizenPhone: user.phone,
          couponId: coupon._id,
        }
      );

      await fetchWalletData();

      setPurchasedCouponIds((previous) =>
        previous.includes(coupon._id)
          ? previous
          : [...previous, coupon._id]
      );

      showToast("Coupon unlocked successfully!", "success");

      await fetchPurchasedCoupons();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to purchase coupon";

      showToast(errorMsg, "error");
    } finally {
      setPurchasingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <RedemptionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        userPhone={user?.phone}
      />

      <main className="min-h-screen bg-[#F8F7F2] px-4 py-8 text-[#252820] sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <header className="mb-9 border-b border-[#DEDCD3] pb-7 sm:mb-12 sm:pb-9">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
                  Clean-India / Citizen rewards
                </p>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Your rewards wallet
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#696A61] sm:text-base">
                  Redeem your balance, unlock local business offers,
                  and keep track of your redemption history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="flex w-fit items-center gap-3 border border-[#DEDCD3] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#626B4F] hover:bg-[#EFEEE6]"
              >
                <Icon className="h-5 w-5 text-[#626B4F]">
                  <path d="M8 6h13M8 12h13M8 18h13" />
                  <path d="M3 6h.01M3 12h.01M3 18h.01" />
                </Icon>
                Redemption history
              </button>
            </div>
          </header>

          {/* Wallet */}
          <section className="mb-10 grid gap-px border border-[#DEDCD3] bg-[#DEDCD3] md:grid-cols-[1.3fr_0.7fr]">
            <div className="bg-[#30382B] p-6 text-[#F8F7F2] sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Available balance
                  </p>

                  {loading ? (
                    <div className="mt-4 h-11 w-40 animate-pulse bg-white/10" />
                  ) : (
                    <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                      ₹{Number(wallet).toLocaleString("en-IN")}
                    </h2>
                  )}

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                    Your current wallet balance for eligible cash
                    redemptions and available coupons.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/20 text-[#D5A66D]">
                  <Icon className="h-6 w-6">
                    <rect x="2" y="5" width="20" height="15" rx="2" />
                    <path d="M2 10h20" />
                    <path d="M6 15h4" />
                  </Icon>
                </div>
              </div>

              <div className="mt-8 border-t border-white/15 pt-4">
                <p className="text-xs tracking-wide text-white/50">
                  CLEAN-INDIA WALLET
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#858579]">
                  Your next step
                </p>

                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Make your rewards count.
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#696A61]">
                  Explore discounts from participating local businesses
                  or redeem your balance.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#626B4F]">
                <Icon className="h-5 w-5">
                  <path d="m5 12 4 4L19 6" />
                </Icon>
                Rewards at a glance
              </div>
            </div>
          </section>

          {/* Cash redemption */}
          <section className="mb-12">
            <SectionHeading
              eyebrow="01 / Cash redemption"
              title="Redeem your balance"
              description="Choose an available redemption amount. Your balance is checked before the request is submitted."
            />

            <div className="grid gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2">
              {[100, 200].map((amount) => {
                const insufficientBalance = wallet < amount;
                const isRedeeming = redeemingAmount === amount;

                return (
                  <article
                    key={amount}
                    className="flex flex-col justify-between bg-white p-6 sm:p-8"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#858579]">
                        UPI transfer
                      </p>

                      <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                        ₹{amount}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#696A61]">
                        Redeem this amount from your available wallet
                        balance.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        loading ||
                        insufficientBalance ||
                        redeemingAmount !== null
                      }
                      onClick={() =>
                        redeem("UPI Transfer", amount, "Cash Redeem")
                      }
                      className="mt-6 flex w-full items-center justify-between gap-3 border border-[#626B4F] px-4 py-3 text-sm font-semibold text-[#626B4F] transition hover:bg-[#626B4F] hover:text-white disabled:cursor-not-allowed disabled:border-[#DEDCD3] disabled:bg-[#F8F7F2] disabled:text-[#858579]"
                    >
                      <span>
                        {isRedeeming
                          ? "Processing..."
                          : insufficientBalance
                            ? "Insufficient balance"
                            : `Redeem ₹${amount}`}
                      </span>

                      {!isRedeeming && !insufficientBalance && (
                        <Icon className="h-4 w-4">
                          <path d="M5 12h14m-6-6 6 6-6 6" />
                        </Icon>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>

            <p className="mt-3 text-xs leading-5 text-[#858579]">
              Redemption options and actual payout availability depend
              on your configured backend and payment process.
            </p>
          </section>

          {/* Coupons */}
          <section>
            <SectionHeading
              eyebrow="02 / Local business offers"
              title="Available discount coupons"
              description="Explore offers from participating businesses. Unlock a coupon to reveal its code."
            />

            {loading ? (
              <div className="grid gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse bg-white p-6"
                  >
                    <div className="h-3 w-24 bg-[#EFEEE6]" />
                    <div className="mt-5 h-6 w-3/4 bg-[#EFEEE6]" />
                    <div className="mt-4 h-4 w-full bg-[#EFEEE6]" />
                    <div className="mt-2 h-4 w-2/3 bg-[#EFEEE6]" />
                    <div className="mt-8 h-11 bg-[#EFEEE6]" />
                  </div>
                ))}
              </div>
            ) : coupons.length > 0 ? (
              <div className="grid gap-px border border-[#DEDCD3] bg-[#DEDCD3] sm:grid-cols-2 lg:grid-cols-3">
                {coupons.map((coupon) => {
                  const isPurchased = purchasedCouponIds.includes(
                    coupon._id
                  );
                  const isPurchasing = purchasingId === coupon._id;
                  const insufficientBalance = wallet < coupon.price;

                  return (
                    <article
                      key={coupon._id}
                      className="flex min-w-0 flex-col bg-white p-5 transition-colors hover:bg-[#FBFAF6] sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#858579]">
                            OFFER BY
                          </p>

                          <p className="mt-1 truncate text-xs text-[#696A61]">
                            {coupon.ownerName}
                          </p>
                        </div>

                        <span className="shrink-0 bg-[#EEF0E8] px-3 py-1.5 text-sm font-semibold text-[#48533E]">
                          {coupon.discount}% off
                        </span>
                      </div>

                      <h3 className="mt-5 break-words text-xl font-semibold tracking-tight">
                        {coupon.title}
                      </h3>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-[#696A61]">
                        {coupon.description}
                      </p>

                      <div className="my-5 border-y border-dashed border-[#DEDCD3] py-4">
                        <p className="text-xs text-[#858579]">
                          {isPurchased
                            ? "Your coupon code"
                            : "Coupon code"}
                        </p>

                        {isPurchased ? (
                          <p className="mt-2 break-all font-mono text-xl font-semibold tracking-wider text-[#626B4F]">
                            {coupon.couponCode}
                          </p>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-[#858579]">
                            <Icon className="h-4 w-4">
                              <rect x="3" y="10" width="18" height="11" rx="1" />
                              <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                            </Icon>
                            <span className="font-mono text-sm tracking-[0.18em]">
                              ••••••••
                            </span>
                            <span className="text-xs">Locked</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#696A61]">
                          Valid until {formatDate(coupon.validUntil)}
                        </span>

                        <span className="flex items-center gap-1.5 font-medium text-[#626B4F]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#626B4F]" />
                          Active
                        </span>
                      </div>

                      {!isPurchased && (
                        <button
                          type="button"
                          disabled={
                            loading ||
                            insufficientBalance ||
                            purchasingId !== null
                          }
                          onClick={() => handlePurchaseCoupon(coupon)}
                          className="mt-5 flex w-full items-center justify-between gap-3 bg-[#626B4F] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#48533E] disabled:cursor-not-allowed disabled:bg-[#EFEEE6] disabled:text-[#858579]"
                        >
                          <span>
                            {isPurchasing
                              ? "Unlocking..."
                              : insufficientBalance
                                ? "Insufficient balance"
                                : `Unlock for ₹${coupon.price}`}
                          </span>

                          {!isPurchasing && (
                            <Icon className="h-4 w-4">
                              <path d="M5 12h14m-6-6 6 6-6 6" />
                            </Icon>
                          )}
                        </button>
                      )}

                      {isPurchased && (
                        <div className="mt-5 flex items-center gap-2 border border-[#D5DDCB] bg-[#EEF0E8] px-4 py-3.5 text-sm font-medium text-[#48533E]">
                          <Icon className="h-4 w-4">
                            <path d="m5 12 4 4L19 6" />
                          </Icon>
                          Coupon unlocked
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="border border-[#DEDCD3] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6] text-[#626B4F]">
                  <Icon className="h-6 w-6">
                    <rect x="3" y="5" width="18" height="14" rx="1" />
                    <path d="M3 10h18" />
                  </Icon>
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No active coupons
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#696A61]">
                  There are no active discount coupons available right
                  now. Check back later for new offers.
                </p>
              </div>
            )}
          </section>

          <footer className="mt-12 border-t border-[#DEDCD3] pt-5">
            <p className="text-xs leading-5 text-[#858579]">
              Clean-India rewards are subject to wallet balance,
              coupon availability, and the terms configured by each
              participating business.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}