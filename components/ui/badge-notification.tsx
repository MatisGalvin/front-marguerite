import { ClassName } from "@/types/components";
import { cx } from "class-variance-authority";

export function BadgeNotification(p: { count: number } & ClassName) {
  return (
    <span
      className={cx(
        "rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white",
        p.className,
      )}
    >
      {p.count}
    </span>
  );
}
