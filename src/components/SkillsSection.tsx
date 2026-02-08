import { Section } from "./Section";
import { Languages, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const languageData = [
  {
    name: "Bangla",
    level: "Native",
    steps: [
      { title: "Listening", status: "complete" as const },
      { title: "Speaking", status: "complete" as const },
      { title: "Reading", status: "complete" as const },
      { title: "Writing", status: "complete" as const },
    ]
  },
  {
    name: "English",
    level: "Fluent",
    steps: [
      { title: "Listening", status: "complete" as const },
      { title: "Speaking", status: "complete" as const },
      { title: "Reading", status: "complete" as const },
      { title: "Writing", status: "complete" as const },
    ]
  },
  {
    name: "Hindi/Urdu",
    level: "Conversational",
    steps: [
      { title: "Listening", status: "complete" as const },
      { title: "Speaking", status: "complete" as const },
      { title: "Reading", status: "upcoming" as const },
      { title: "Writing", status: "upcoming" as const },
    ]
  }
];

const Step = ({ title, status, index, isLast }: { title: string, status: 'complete' | 'upcoming', index: number, isLast: boolean }) => {
  return (
    <div className="flex gap-4 min-h-[70px]">
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          status === 'complete'
            ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            : "border-border bg-background/50 text-muted-foreground"
        )}>
          {status === 'complete' ? (
            <Check size={18} strokeWidth={3} />
          ) : (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 flex-1 my-1 transition-colors duration-1000",
            status === 'complete' ? "bg-primary/50" : "bg-border"
          )} />
        )}
      </div>
      <div className="pt-1 pb-4">
        <p className={cn(
          "text-[10px] font-mono uppercase tracking-widest mb-1",
          status === 'upcoming' ? "text-muted-foreground/50" : "text-primary/60"
        )}>
          STEP {index + 1}
        </p>
        <h5 className={cn(
          "font-bold text-base tracking-tight",
          status === 'upcoming' ? "text-muted-foreground" : "text-foreground"
        )}>
          {title}
        </h5>
      </div>
    </div>
  );
};

export const SkillsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <Section id="skills" title="Skills" index="01">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Languages Carousel */}
        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Languages size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-foreground">languages.py</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollNext}
                className="p-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {languageData.map((lang, langIdx) => (
                <div
                  key={lang.name}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <div className="h-full p-8 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/20 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{lang.name}</h4>
                      <span className="text-[10px] font-mono bg-primary/10 px-2 py-1 rounded border border-primary/20 text-primary uppercase tracking-tighter">
                        {lang.level}
                      </span>
                    </div>

                    <div className="space-y-0">
                      {lang.steps.map((step, stepIdx) => (
                        <Step
                          key={step.title}
                          title={step.title}
                          status={step.status}
                          index={stepIdx}
                          isLast={stepIdx === lang.steps.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
