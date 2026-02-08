import { Section } from "./Section";
import { Languages } from "lucide-react";

const languages = [
  { name: "Bangla", level: "Native", proficiency: ["Speaking", "Listening", "Writing", "Reading"] },
  { name: "English", level: "Fluent", proficiency: ["Speaking", "Listening", "Writing", "Reading"] },
  { name: "Hindi/Urdu", level: "Conversational", proficiency: ["Listening", "Speaking"] },
];

export const SkillsSection = () => {
  return (
    <Section id="skills" title="Skills" index="02">
      <div className="max-w-4xl mx-auto">
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
          
          <div className="space-y-16">
            {languages.map((lang, langIdx) => (
              <div
                key={lang.name}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${(langIdx + 1) * 200}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <h4 className="text-3xl font-bold text-foreground tracking-tight">{lang.name}</h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  <span className="text-[10px] font-mono bg-secondary px-3 py-1 rounded-full border border-border text-primary uppercase tracking-widest">{lang.level}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {lang.proficiency.map((skill, skillIdx) => (
                    <div key={skill} className="relative group">
                      <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                        {/* Background loading effect */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-primary/5 animate-[fill-up_2s_ease-out_forwards]"
                          style={{ animationDelay: `${(langIdx * 4 + skillIdx) * 150}ms` }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono text-primary/60">0{skillIdx + 1}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          </div>
                          <h5 className="font-mono font-bold text-foreground group-hover:text-primary transition-colors">{skill}</h5>
                          <div className="mt-4 h-1 w-full bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary animate-[fill-width_1.5s_ease-out_forwards]"
                              style={{
                                animationDelay: `${(langIdx * 4 + skillIdx) * 150 + 500}ms`,
                                width: '0%'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fill-up {
              from { height: 0; }
              to { height: 100%; }
            }
            @keyframes fill-width {
              from { width: 0; }
              to { width: 100%; }
            }
          `}} />
        </div>
      </div>
    </Section>
  );
};
