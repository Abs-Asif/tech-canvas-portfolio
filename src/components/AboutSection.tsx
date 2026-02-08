import { Section } from "./Section";
import { Sparkles, BookOpen, ChevronRight } from "lucide-react";

const personalDetails = [
  { label: "full_name", value: "Md. Abdullah Bari" },
  { label: "date_of_birth", value: "28 August 2005" },
  { label: "nationality", value: "Bangladeshi" },
  { label: "blood_group", value: "O+" },
];

const strengths = ["Hard working", "Positive attitude", "Work under pressure", "Always Alert", "Good communication skills"];
const interests = ["Reading Books", "Doing Research", "Mentoring"];

export const AboutSection = () => {
  return (
    <Section id="about" title="About Me" index="01">
      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Left Column - Objective & Details */}
        <div className="lg:col-span-3 space-y-12">
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <div className="flex gap-4 items-start">
              <div className="text-primary font-mono text-lg mt-1">&gt;</div>
              <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed italic">
                "To begin my career in a dynamic organization where I can learn, grow, and contribute to its success with dedication and hard work."
              </p>
            </div>
          </div>

          <div
            className="terminal-window animate-fade-in-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            <div className="terminal-header">
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
            </div>
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="text-muted-foreground">// Personal Configuration</div>
              <div className="space-y-2">
                {personalDetails.map((detail) => (
                  <div key={detail.label} className="flex flex-wrap items-center gap-x-4 py-1 border-b border-border/50 last:border-0 group">
                    <span className="text-accent w-32 shrink-0">{detail.label}:</span>
                    <span className="text-primary group-hover:text-foreground transition-colors">"{detail.value}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Strengths & Interests */}
        <div className="lg:col-span-2 space-y-8">
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-primary" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">strengths.json</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {strengths.map((strength) => (
                <div
                  key={strength}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all group"
                >
                  <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-accent" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">interests.log</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 rounded-md text-xs font-mono bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
