const variantClass = {
  default: "oman-card",
  soft: "oman-card-soft",
  outline: "oman-outline-panel",
  dark: "oman-dark-panel text-white",
};

const paddingClass = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "px-6 py-10 sm:px-8 sm:py-12",
};

const roundedClass = {
  md: "rounded-2xl",
  lg: "rounded-3xl",
  xl: "rounded-[1.75rem]",
};

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Surface container with Oman brand variants.
 */
export default function Card({
  as: Component = "div",
  variant = "default",
  padding = "md",
  rounded = "lg",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={joinClasses(
        variantClass[variant] || variantClass.default,
        paddingClass[padding] ?? paddingClass.md,
        roundedClass[rounded] || roundedClass.lg,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
