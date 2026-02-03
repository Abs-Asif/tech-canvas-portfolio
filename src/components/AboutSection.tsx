import { Section } from "./Section";
import { User, Calendar, Globe, Heart, Sparkles, BookOpen, Users } from "lucide-react";

const personalDetails = [
  { icon: User, label: "Full Name", value: "Md. Abdullah Bari" },
  { icon: Calendar, label: "Date of Birth", value: "28 August 2005" },
  { icon: Globe, label: "Nationality", value: "Bangladeshi" },
  { icon: Heart, label: "Blood Group", value: "O+" },
];

const strengths = ["Hard working", "Positive attitude", "Work under pressure", "Always Alert", "Good communication skills"];
const interests = ["Reading Books", "Doing Research", "Mentoring"];

export const AboutSection = () => {
  return (
    <Section id="about" title="About Me">
      {/* Career Objective - Full Width */}
      <div 
        className="mb-12 animate-fade-in-up opacity-0" 
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
          To begin my career in a dynamic organization where I can learn, grow, and contribute to its success with dedication and hard work.
        </p>
      </div>

      {/* Personal Details - Inline Row */}
      <div 
        className="flex flex-wrap gap-6 md:gap-10 mb-12 animate-fade-in-up opacity-0"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        {personalDetails.map((detail) => (
          <div key={detail.label} className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/50">
              <detail.icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium text-foreground">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Interests - Two Columns */}
      <div className="grid md:grid-cols-2 gap-8">
        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength) => (
              <span
                key={strength}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary text-secondary-foreground"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-accent text-accent-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
