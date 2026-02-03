import { Section } from "./Section";
import { Smartphone, Globe, ExternalLink } from "lucide-react";
import gramroktiLogo from "@/assets/gramrokti-logo.png";
import greenhutLogo from "@/assets/greenhut-logo.png";

const projects = [
  {
    title: "গ্রামরক্তি",
    type: "Android Application",
    icon: Smartphone,
    logo: gramroktiLogo,
    description: "A mobile application designed to connect blood donors with recipients in rural areas of Bangladesh.",
    isBangla: true,
  },
  {
    title: "Greenhutbd Inventory Management",
    type: "Web Application",
    icon: Globe,
    logo: greenhutLogo,
    description: "A comprehensive web-based inventory management system for streamlining business operations and stock tracking.",
    isBangla: false,
  },
];

export const ProjectsSection = () => {
  return (
    <Section id="projects" title="Latest Work">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-border p-6 transition-all duration-300 hover:bg-secondary/50 hover:shadow-lg animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Project Logo */}
              <div className="w-14 h-14 rounded-2xl bg-background border border-border p-2 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={project.logo} 
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold text-foreground mb-0.5 ${project.isBangla ? 'font-bangla' : ''}`}>
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <project.icon size={14} />
                  <span>{project.type}</span>
                </div>
              </div>
              
              <ExternalLink size={18} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
