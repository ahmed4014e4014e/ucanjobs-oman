import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../components/ActionFeedback";
import { downloadStorageAttachment } from "../lib/adminDownloads";
import {
  fetchAdminOrders,
  fetchAdminPayments,
  PAYMENT_PROOF_BUCKET,
  updateAdminOrderStatus,
} from "../lib/paymentApi";

const orderStatusOptions = ["pending_payment", "payment_submitted", "paid", "cancelled", "refunded"];

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString("en-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(value) {
  return value.replaceAll("_", " ");
}

export default function AdminEnrollments() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending_payment").length,
      paid: orders.filter((order) => order.status === "paid").length,
      submittedPayments: payments.filter((payment) => payment.status === "submitted").length,
    }),
    [orders, payments]
  );

  useEffect(() => {
    let active = true;

    async function loadPaymentAdmin() {
      setLoading(true);
      setError("");

      try {
        const [nextOrders, nextPayments] = await Promise.all([
          fetchAdminOrders(),
          fetchAdminPayments(),
        ]);

        if (active) {
          setOrders(nextOrders);
          setPayments(nextPayments);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError?.message || "Unable to load payment records right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPaymentAdmin();

    return () => {
      active = false;
    };
  }, []);

  const handleStatusUpdate = async (order, status) => {
    setSavingOrderId(order.id);
    setFeedback({ type: "idle", message: "" });

    try {
      const updatedOrder = await updateAdminOrderStatus({ order, status });

      setOrders((currentOrders) =>
        currentOrders.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
      );
      setFeedback({
        type: "success",
        message:
          status === "paid"
            ? `Order ${updatedOrder.orderNumber} marked paid and job seeker enrollment activated.`
            : `Order ${updatedOrder.orderNumber} marked ${formatStatus(status)}.`,
      });
    } catch (updateError) {
      setFeedback({
        type: "error",
        message: updateError?.message || "Unable to update this order right now.",
      });
    } finally {
      setSavingOrderId("");
    }
  };

  const handleProofDownload = async (payment) => {
    setFeedback({ type: "idle", message: "" });

    try {
      await downloadStorageAttachment({
        bucket: PAYMENT_PROOF_BUCKET,
        path: payment.proofUrl,
        fileName: payment.proofUrl?.split("/").pop() || "payment-proof",
      });
    } catch (downloadError) {
      setFeedback({
        type: "error",
        message: downloadError?.message || "Unable to download this payment proof right now.",
      });
    }
  };
  return (
    <main className="oman-page min-h-screen px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-20 sm:pt-28">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] oman-card p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="oman-section-kicker text-xs font-semibold uppercase sm:text-sm">
                Admin Records
              </p>
              <h1 className="oman-title-accent mt-4 text-3xl font-semibold">
                Enrollments And Manual Payments
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-[var(--oman-ink)]/75">
                Review paid-course orders, check submitted manual payment references, and activate
                enrollment after payment confirmation.
              </p>
            </div>
            <Link
              to="/admin-dashboard/"
              className="oman-button-secondary inline-flex shrink-0 items-center justify-center rounded-2xl px-5 py-3 font-semibold transition"
            >
              Back to Admin Dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Orders", stats.total],
              ["Pending", stats.pending],
              ["Paid", stats.paid],
              ["Payment refs", stats.submittedPayments],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl oman-outline-panel p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-bold text-[var(--oman-ink)]">{value}</p>
              </div>
            ))}
          </div>

          <ActionFeedback
            type={feedback.type}
            message={feedback.message}
            title="Payment Admin"
            className="mt-8"
          />

          {loading && (
            <div className="mt-8 rounded-3xl oman-outline-panel p-5 text-[var(--oman-ink)]/75">
              Loading orders and payment references...
            </div>
          )}

          {error && (
            <ActionFeedback type="error" message={error} title="Payment Records" className="mt-8" />
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="mt-8 rounded-3xl oman-outline-panel p-6 text-center">
              <h2 className="text-lg font-semibold text-[var(--oman-ink)]">
                No manual payment orders yet
              </h2>
              <p className="mt-3 leading-7 text-[var(--oman-ink)]/75">
                Paid-course orders will appear here after job seekers request enrollment.
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="mt-8 grid gap-4">
              {orders.map((order) => {
                const orderPayments = payments.filter((payment) => payment.orderId === order.id);

                return (
                  <article key={order.id} className="rounded-3xl oman-outline-panel p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="oman-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                            {formatStatus(order.status)}
                          </span>
                          <span className="rounded-full bg-[rgba(244,232,214,0.54)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta-dark)]">
                            {order.totalLabel}
                          </span>
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-[var(--oman-ink)]">
                          {order.course?.title || "Course order"}
                        </h2>
                        <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--oman-ink)]/75 sm:grid-cols-2">
                          <p>
                            <span className="font-semibold text-[var(--oman-ink)]">Order:</span>{" "}
                            {order.orderNumber}
                          </p>
                          <p>
                            <span className="font-semibold text-[var(--oman-ink)]">Created:</span>{" "}
                            {formatDate(order.createdAt)}
                          </p>
                          <p>
                            <span className="font-semibold text-[var(--oman-ink)]">Job seeker name:</span>{" "}
                            {order.learner?.name || "Not available"}
                          </p>
                          <p>
                            <span className="font-semibold text-[var(--oman-ink)]">Email:</span>{" "}
                            {order.learner?.email || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
                        {orderStatusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={savingOrderId === order.id || order.status === status}
                            onClick={() => handleStatusUpdate(order, status)}
                            className="rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.9)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--oman-ink)] transition hover:border-[var(--oman-brass)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {formatStatus(status)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {orderPayments.length > 0 && (
                      <div className="mt-5 rounded-2xl bg-[rgba(244,232,214,0.34)] p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                          Payment references
                        </p>
                        <div className="mt-3 grid gap-3">
                          {orderPayments.map((payment) => (
                            <div key={payment.id} className="rounded-2xl bg-[rgba(255,250,244,0.72)] p-4 text-sm leading-6 text-[var(--oman-ink)]/80 ring-1 ring-[rgba(111,49,29,0.1)]">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Job seeker name:</span>{" "}
                                  {payment.payerName || order.learner?.name || "Not available"}
                                </p>
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Job seeker email:</span>{" "}
                                  {payment.payerEmail || order.learner?.email || "Not available"}
                                </p>
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Amount sent:</span>{" "}
                                  {payment.amountLabel}
                                </p>
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Payment status:</span>{" "}
                                  {formatStatus(payment.status)}
                                </p>
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Reference:</span>{" "}
                                  {payment.referenceNumber || "Not provided"}
                                </p>
                                <p>
                                  <span className="font-semibold text-[var(--oman-ink)]">Submitted:</span>{" "}
                                  {formatDate(payment.submittedAt)}
                                </p>
                              </div>
                              {payment.proofUrl ? (
                                <button
                                  type="button"
                                  onClick={() => handleProofDownload(payment)}
                                  className="oman-button-secondary mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition"
                                >
                                  Download Proof Of Payment
                                </button>
                              ) : (
                                <p className="mt-4 text-sm text-[var(--oman-ink)]/65">
                                  No proof file attached.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}



