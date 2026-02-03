import { Section } from "./Section";
import { SurfaceCard } from "./SurfaceCard";
import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    degree: "Diploma in Medical Faculty (DMF)",
    course: "MATS (3rd year ongoing)",
    institute: "Trauma Center Medical Institutes",
    board: "State Medical Faculty of Bangladesh",
    status: "Ongoing",
  },
  {
    degree: "Secondary School Certificate (SSC)",
    group: "Science",
    institute: "Deobhog Hazi Uzir Ali High School",
    board: "Dhaka",
    result: "GPA 4.00",
    year: "2021",
  },
];

export const EducationSection = () => {
  return (
    <Section id="education" title="Education">
      <div className="space-y-4">
        {education.map((edu, index) => (
          <SurfaceCard
            key={edu.degree}
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-accent shrink-0">
                <GraduationCap size={24} className="text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institute}</p>
                    {"course" in edu && (
                      <p className="text-sm text-muted-foreground mt-1">{edu.course}</p>
                    )}
                    {"group" in edu && (
                      <p className="text-sm text-muted-foreground mt-1">Group: {edu.group}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {"status" in edu && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {edu.status}
                      </span>
                    )}
                    {"result" in edu && (
                      <div className="flex items-center gap-2 text-primary">
                        <Award size={16} />
                        <span className="font-semibold">{edu.result}</span>
                      </div>
                    )}
                    {"year" in edu && (
                      <p className="text-sm text-muted-foreground mt-1">{edu.year}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Board: {edu.board}</p>
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </Section>
  );
};
