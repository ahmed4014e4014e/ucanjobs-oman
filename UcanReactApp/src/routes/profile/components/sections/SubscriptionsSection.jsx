import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui";
import { fetchLearnerEnrollments } from "../../../../lib/courseApi";
import { fetchLearnerOrders } from "../../../../lib/paymentApi";
import { formatDateTime, formatStatusLabel } from "../../profileDisplay";
import SectionFrame from "../SectionFrame";

export default function SubscriptionsSection({ user, meta }) {
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user?.id) {
        setEnrollments([]);
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFeedback(null);

      try {
        const [nextEnrollments, nextOrders] = await Promise.all([
          fetchLearnerEnrollments(user.id),
          fetchLearnerOrders(user.id),
        ]);

        if (!active) return;
        setEnrollments(nextEnrollments);
        setOrders(nextOrders);
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          title: "Could not load access",
          message: error?.message || "Try again in a moment.",
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

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      {loading ? (
        <p className="text-[var(--oman-ink)]/75">Loading your course access…</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Enrolled courses</h3>
            {enrollments.length === 0 ? (
              <div className="mt-4 rounded-3xl oman-outline-panel p-5">
                <p className="text-[var(--oman-ink)]/80">You are not enrolled in any courses yet.</p>
                <Button to="/courses/" className="mt-4">
                  Browse courses
                </Button>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {enrollments.map((enrollment) => {
                  const course = enrollment.course || {};
                  const slug = course.slug;
                  return (
                    <li
                      key={enrollment.id}
                      className="rounded-3xl oman-outline-panel p-5"
                    >
                      <p className="text-lg font-semibold text-[var(--oman-ink)]">
                        {course.title || "Course"}
                      </p>
                      <p className="mt-2 text-sm capitalize text-[var(--oman-ink)]/70">
                        Status: {formatStatusLabel(enrollment.status)}
                      </p>
                      {slug ? (
                        <Link
                          to={`/learn/${slug}/`}
                          className="mt-3 inline-flex text-sm font-semibold text-[var(--oman-terracotta-dark)] hover:underline"
                        >
                          Continue learning
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Access / payment requests</h3>
            {orders.length === 0 ? (
              <p className="mt-4 text-[var(--oman-ink)]/75">No payment requests on file.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-3xl oman-outline-panel p-5">
                    <p className="font-semibold text-[var(--oman-ink)]">
                      {order.course?.title || order.orderNumber || "Order"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--oman-ink)]/70">
                      {formatStatusLabel(order.status)} · {formatDateTime(order.createdAt)}
                    </p>
                    {order.totalOmr != null ? (
                      <p className="mt-1 text-sm text-[var(--oman-ink)]/70">
                        Total: {order.totalLabel || `${order.totalOmr} OMR`}
                      </p>
                    ) : null}
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
