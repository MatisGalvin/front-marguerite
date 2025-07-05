import { Badge } from "@/components/ui/badge";
import { cx } from "class-variance-authority";
import { Check, Loader } from "lucide-react";

const COLOR_STYLES = {
  green: "bg-green-100 hover:bg-green-100 text-green-700",
  red: "bg-red-100 hover:bg-red-100 text-red-700",
  yellow: "bg-yellow-100 hover:bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 hover:bg-blue-100 text-blue-700",
  gray: "bg-gray-100 hover:bg-gray-100 text-gray-700",
} as const;

type BadgeColor = keyof typeof COLOR_STYLES;

type BadgeStatusProps = {
  children: React.ReactNode;
  color: BadgeColor;
  className?: string;
};

export function BadgeStatus({ children, color, className }: BadgeStatusProps) {
  const Icon = color === "yellow" ? Loader : Check;

  return (
    <Badge className={cx(COLOR_STYLES[color], className)}>
      <div className="flex items-center gap-1">
        <Icon size={16} />
        {children}
      </div>
    </Badge>
  );
}
