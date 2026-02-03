import { Section } from "./Section";
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
      <div className="grid md:grid-cols-2 gap-12">
        {/* Languages */}
        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Languages size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Languages</h3>
          </div>
          
          <div className="space-y-6">
            {languages.map((lang) => (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{lang.name}</span>
                  <span className="text-sm text-primary font-medium">{lang.level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lang.proficiency.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Experience</h3>
          </div>
          
          <div className="p-5 rounded-2xl bg-secondary/50 border border-border">
            <h4 className="font-semibold text-foreground mb-1">{experience.role}</h4>
            <p className="text-muted-foreground">{experience.institute}</p>
            <p className="text-sm text-muted-foreground mt-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-accent/50 text-accent-foreground text-xs">
                {experience.duration}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};
