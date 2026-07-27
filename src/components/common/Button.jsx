import clsx from "clsx";

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      className={clsx(variant === "primary" ? "btn-primary" : "btn-ghost", className)}
      {...props}
    >
      {children}
    </button>
  );
}
