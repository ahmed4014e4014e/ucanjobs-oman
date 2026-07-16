import { useEffect, useState } from "react";
import { Button, Field } from "../../../../components/ui";
import {
  BANK_MUSCAT_PAYMENT_METHOD,
  BANK_MUSCAT_PAYMENT_PHONE,
} from "../../../../lib/paymentConfig";
import { fetchLearnerOrders } from "../../../../lib/paymentApi";
import {
  fetchProfilePreferences,
  upsertProfilePreferences,
} from "../../../../lib/profileSettingsApi";
import { formatDateTime, formatStatusLabel } from "../../profileDisplay";
import SectionFrame from "../SectionFrame";

export default function PaymentMethodsSection({ user, meta }) {
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [nextPrefs, nextOrders] = await Promise.all([
          fetchProfilePreferences(user.id),
          fetchLearnerOrders(user.id),
        ]);
        if (!active) return;
        setPrefs(nextPrefs);
        setPayerName(nextPrefs.preferred_payer_name || "");
        setPayerPhone(nextPrefs.preferred_payer_phone || "");
        setOrders(nextOrders);
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          title: "Load failed",
          message: error?.message || "Could not load payment settings.",
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const base = prefs || (await fetchProfilePreferences(user.id));
      const saved = await upsertProfilePreferences(user.id, {
        ...base,
        preferred_payer_name: payerName,
        preferred_payer_phone: payerPhone,
      });
      setPrefs(saved);
      setFeedback({
        type: "success",
        title: "Saved",
        message: "Your preferred payer details were updated.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Save failed",
        message: error?.message || "Could not save payment preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      {loading ? (
        <p className="text-[var(--oman-ink)]/75">Loading payment settings…</p>
      ) : (
        <div className="space-y-8">
          <div className="rounded-3xl oman-outline-panel p-5">
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
              Manual bank transfer (Oman)
            </h3>
            <p className="mt-3 leading-7 text-[var(--oman-ink)]/80">
              UcanJobs currently uses {BANK_MUSCAT_PAYMENT_METHOD}. Transfer to{" "}
              <span className="font-semibold text-[var(--oman-ink)]">
                {BANK_MUSCAT_PAYMENT_PHONE}
              </span>{" "}
              and submit proof from the course checkout flow.
            </p>
            <p className="mt-3 text-sm text-[var(--oman-ink)]/70">
              Card gateways are not stored here. Prefer payer details below are only used to speed up
              your next bank-transfer submission.
            </p>
          </div>

          <form className="space-y-4 rounded-3xl oman-outline-panel p-5" onSubmit={handleSave}>
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">
              Preferred payer contact
            </h3>
            <Field
              label="Payer name"
              name="preferred_payer_name"
              value={payerName}
              onChange={(event) => setPayerName(event.target.value)}
            />
            <Field
              label="Payer phone"
              name="preferred_payer_phone"
              type="tel"
              value={payerPhone}
              onChange={(event) => setPayerPhone(event.target.value)}
            />
            <Button type="submit" loading={saving} disabled={saving}>
              Save payer details
            </Button>
          </form>

          <div>
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Recent payment history</h3>
            {orders.length === 0 ? (
              <p className="mt-4 text-[var(--oman-ink)]/75">No payments yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.slice(0, 8).map((order) => (
                  <li key={order.id} className="rounded-3xl oman-outline-panel p-5">
                    <p className="font-semibold text-[var(--oman-ink)]">
                      {order.course?.title || order.orderNumber || "Order"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
                      {formatStatusLabel(order.status)} · {formatDateTime(order.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </SectionFrame>
  );
}
