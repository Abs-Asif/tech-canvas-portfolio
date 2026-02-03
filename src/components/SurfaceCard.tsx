import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: CSSProperties;
}

export const SurfaceCard = ({ children, className, hoverable = true, style }: SurfaceCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-3xl border border-border p-6 shadow-surface transition-all duration-300",
        hoverable && "hover:shadow-surface-hover hover:-translate-y-0.5",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
