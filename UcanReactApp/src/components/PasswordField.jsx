import { useId, useState } from "react";

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  inputClassName = "",
}) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <label className={`flex flex-col gap-2 ${className}`.trim()}>
      <span className="text-sm font-semibold text-[var(--oman-terracotta-dark)]">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={[
            "min-h-12 w-full rounded-2xl border border-[rgba(111,49,29,0.14)] bg-[rgba(255,250,244,0.92)] px-4 py-3 pr-20 text-[var(--oman-ink)] outline-none transition focus:border-[var(--oman-brass)] focus:bg-white",
            inputClassName,
          ]
            .join(" ")
            .trim()}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-[rgba(111,49,29,0.12)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--oman-terracotta-dark)] transition hover:bg-[rgba(244,232,214,0.5)]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
