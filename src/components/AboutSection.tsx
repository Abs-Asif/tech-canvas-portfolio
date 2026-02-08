import { useEffect } from "react";
import { Section } from "./Section";
import { Sparkles, BookOpen, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const strengths = [
  "Hard working",
  "Positive attitude",
  "Work under pressure",
  "Always Alert",
  "Good communication skills",
  "Problem Solving",
  "Team Collaboration",
  "Quick Learner",
  "Attention to Detail",
  "Adaptability"
];
const interests = [
  "Reading Books",
  "Doing Research",
  "Mentoring",
  "Open Source",
  "Medical Tech",
  "Blogging",
  "Traveling",
  "Learning Languages"
];

export const AboutSection = () => {
  const [strengthsEmblaRef, strengthsEmblaApi] = useEmblaCarousel({
    loop: true,
    direction: 'rtl',
    dragFree: true,
    containScroll: 'trimSnaps'
  });
  const [interestsEmblaRef, interestsEmblaApi] = useEmblaCarousel({
    loop: true,
    direction: 'rtl',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  useEffect(() => {
    if (strengthsEmblaApi) {
      const intervalId = setInterval(() => {
        strengthsEmblaApi.scrollNext();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [strengthsEmblaApi]);

  useEffect(() => {
    if (interestsEmblaApi) {
      const intervalId = setInterval(() => {
        interestsEmblaApi.scrollNext();
      }, 3500);
      return () => clearInterval(intervalId);
    }
  }, [interestsEmblaApi]);

  return (
    <Section id="about" title="About Me" index="01">
      <div className="grid lg:grid-cols-1 gap-12 items-start">
        {/* Strengths & Interests */}
        <div className="space-y-12">
          {/* Strengths Carousel */}
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-primary" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">strengths.json</h3>
            </div>

            <div className="overflow-hidden" ref={strengthsEmblaRef}>
              <div className="flex gap-4">
                {strengths.map((strength) => (
                  <div
                    key={strength}
                    className="flex-none w-64 flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all group"
                  >
                    <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests Carousel */}
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-accent" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">interests.log</h3>
            </div>

            <div className="overflow-hidden" ref={interestsEmblaRef}>
              <div className="flex gap-3">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    className="flex-none px-8 py-4 rounded-xl text-sm font-mono bg-accent/5 border border-accent/20 text-accent/80 hover:bg-accent/10 hover:text-accent transition-all cursor-default text-center min-w-[160px]"
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
