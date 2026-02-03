import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "outline";
}

export const Chip = ({ children, className, variant = "default" }: ChipProps) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-accent text-accent-foreground",
    outline: "border border-border bg-transparent text-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
