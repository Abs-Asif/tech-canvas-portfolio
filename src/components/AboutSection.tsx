import { Section } from "./Section";
import { SurfaceCard } from "./SurfaceCard";
import { User, Calendar, Heart, Globe } from "lucide-react";

const personalDetails = [
  { icon: User, label: "Full Name", value: "Md. Abdullah Bari" },
  { icon: Calendar, label: "Date of Birth", value: "28 August 2005" },
  { icon: Globe, label: "Nationality", value: "Bangladeshi" },
  { icon: Heart, label: "Blood Group", value: "O+" },
];

const interests = ["Reading Books", "Doing Research", "Mentoring"];

export const AboutSection = () => {
  return (
    <Section id="about" title="About Me">
      <div className="grid md:grid-cols-2 gap-6">
        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Career Objective</h3>
          <p className="text-muted-foreground leading-relaxed">
            To begin my career in a dynamic organization where I can learn, grow, and contribute to its success with dedication and hard work.
          </p>
        </SurfaceCard>

        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {personalDetails.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent">
                  <detail.icon size={16} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="text-sm font-medium text-foreground">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Strengths</h3>
          <ul className="space-y-2">
            {["Hard working", "Positive attitude", "Work under pressure", "Always Alert", "Good communication skills"].map((strength) => (
              <li key={strength} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {strength}
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Section>
  );
};
