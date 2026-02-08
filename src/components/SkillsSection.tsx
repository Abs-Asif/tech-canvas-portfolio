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
  description: "Gained valuable experience in customer service and pharmaceutical retail operations."
};

export const SkillsSection = () => {
  return (
    <Section id="skills" title="Skills & Experience" index="03">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Languages */}
        <div 
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Languages size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-foreground">languages.py</h3>
          </div>
          
          <div className="space-y-8">
            {languages.map((lang) => (
              <div key={lang.name} className="relative pl-4 border-l-2 border-border/50 hover:border-primary/50 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-foreground">{lang.name}</span>
                  <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded border border-border text-primary uppercase">{lang.level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lang.proficiency.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-md text-[10px] font-mono border border-border bg-card text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-all"
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
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Briefcase size={20} className="text-accent" />
            </div>
            <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-foreground">experience.sh</h3>
          </div>
          
          <div className="terminal-window group">
            <div className="terminal-header">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
              </div>
              <div className="ml-auto text-[10px] font-mono text-muted-foreground">bash — 80x24</div>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="flex gap-2 mb-2">
                <span className="text-primary">$</span>
                <span className="text-foreground">cat role_description.txt</span>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-accent mb-1">{experience.role}</h4>
                  <p className="text-foreground/80">{experience.institute}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">duration:</span>
                  <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold">
                    {experience.duration}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <span className="text-primary">$</span>
                <span className="w-2 h-5 bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
