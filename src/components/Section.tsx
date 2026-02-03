import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({ id, title, children, className }: SectionProps) => {
  return (
    <section id={id} className={cn("py-16 md:py-20", className)}>
      <div className="container">
        {title && (
          <h2 className="section-title animate-fade-in-up">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
};
