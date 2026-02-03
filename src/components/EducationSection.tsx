import { Section } from "./Section";
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
      <div className="relative pl-8 md:pl-10 space-y-8">
        {/* Timeline line */}
        <div className="timeline-line" />
        
        {education.map((edu, index) => (
          <div
            key={edu.degree}
            className="relative animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            {/* Timeline dot */}
            <div className="timeline-dot" />
            
            <div className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institute}</p>
                </div>
                
                {"status" in edu ? (
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {edu.status}
                  </span>
                ) : "result" in edu ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Award size={16} />
                    <span className="font-semibold">{edu.result}</span>
                  </div>
                ) : null}
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {"course" in edu && <span>{edu.course}</span>}
                {"group" in edu && <span>Group: {edu.group}</span>}
                <span>Board: {edu.board}</span>
                {"year" in edu && <span>Year: {edu.year}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
