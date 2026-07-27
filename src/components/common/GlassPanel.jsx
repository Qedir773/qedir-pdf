import clsx from "clsx";

export function GlassPanel({ className, children, ...props }) {
  return (
    <div className={clsx("glass-panel", className)} {...props}>
      {children}
    </div>
  );
}
