import { Section } from "./Section";
import { GraduationCap, Award, Calendar } from "lucide-react";

const education = [
  {
    degree: "Diploma in Medical Faculty (DMF)",
    course: "MATS (3rd year ongoing)",
    institute: "Trauma Center Medical Institutes",
    board: "State Medical Faculty of Bangladesh",
    status: "Ongoing",
    type: "Medical"
  },
  {
    degree: "Secondary School Certificate (SSC)",
    group: "Science",
    institute: "Deobhog Hazi Uzir Ali High School",
    board: "Dhaka",
    result: "GPA 4.00",
    year: "2021",
    type: "General"
  },
];

export const EducationSection = () => {
  return (
    <Section id="education" title="Education" index="02">
      <div className="relative pl-8 md:pl-12 space-y-12 max-w-4xl">
        {/* Timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
        
        {education.map((edu, index) => (
          <div
            key={edu.degree}
            className="relative animate-fade-in-up opacity-0 group"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            {/* Timeline dot */}
            <div className="absolute left-[-1.5rem] md:left-[-2.5rem] w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <GraduationCap size={16} className="text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {edu.type}
                    </span>
                    {"status" in edu && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent/70 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
                        {edu.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{edu.degree}</h3>
                  <p className="text-muted-foreground font-medium">{edu.institute}</p>
                </div>
                
                {"result" in edu && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                    <Award size={14} className="text-yellow-500" />
                    <span className="text-sm font-mono font-bold">{edu.result}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                {"course" in edu && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="text-primary">➜</span>
                    <span className="text-foreground/70">{edu.course}</span>
                  </div>
                )}
                {"group" in edu && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="text-primary">➜</span>
                    <span>Group: <span className="text-foreground/70">{edu.group}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="text-primary">➜</span>
                  <span>Board: <span className="text-foreground/70">{edu.board}</span></span>
                </div>
                {"year" in edu && (
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Calendar size={12} className="text-primary" />
                    <span className="text-foreground/70">{edu.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
