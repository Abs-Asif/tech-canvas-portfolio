import { Section } from "./Section";
import { SurfaceCard } from "./SurfaceCard";
import { Languages, Briefcase } from "lucide-react";

const languages = [
  { name: "Bangla", level: "Native", proficiency: ["Speaking", "Listening", "Writing", "Reading"] },
  { name: "English", level: "Fluent", proficiency: ["Speaking", "Listening", "Writing", "Reading"] },
];

const experience = {
  institute: "Spicific Pharmacy (Shewrapara)",
  role: "Salesman",
  duration: "1 month",
};

export const SkillsSection = () => {
  return (
    <Section id="skills" title="Skills & Experience">
      <div className="grid md:grid-cols-2 gap-6">
        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <Languages size={20} className="text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Languages</h3>
          </div>
          <div className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{lang.name}</span>
                  <span className="text-sm text-primary">{lang.level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lang.proficiency.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent">
              <Briefcase size={20} className="text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Experience</h3>
          </div>
          <div className="p-4 rounded-2xl bg-surface-2">
            <h4 className="font-medium text-foreground">{experience.role}</h4>
            <p className="text-muted-foreground text-sm">{experience.institute}</p>
            <p className="text-xs text-muted-foreground mt-2">Duration: {experience.duration}</p>
          </div>
        </SurfaceCard>
      </div>
    </Section>
  );
};
