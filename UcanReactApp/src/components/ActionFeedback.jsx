import Alert from "./ui/Alert";

/**
 * Backward-compatible feedback banner.
 * New UI should import Alert from components/ui.
 */
export default function ActionFeedback({
  type = "info",
  message,
  title,
  className = "",
}) {
  return <Alert type={type} message={message} title={title} className={className} />;
}
