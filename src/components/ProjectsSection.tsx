import { Section } from "./Section";
import { SurfaceCard } from "./SurfaceCard";
import { Smartphone, Globe, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "গ্রামরক্তি",
    type: "Android Application",
    icon: Smartphone,
    description: "A mobile application designed to connect blood donors with recipients in rural areas of Bangladesh.",
  },
  {
    title: "Greenhutbd Inventory Management Software",
    type: "Web Application",
    icon: Globe,
    description: "A comprehensive web-based inventory management system for streamlining business operations and stock tracking.",
  },
];

export const ProjectsSection = () => {
  return (
    <Section id="projects" title="Latest Work">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <SurfaceCard
            key={project.title}
            className="group animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-accent transition-colors group-hover:bg-primary">
                <project.icon size={24} className="text-accent-foreground transition-colors group-hover:text-primary-foreground" />
              </div>
              <ExternalLink size={18} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{project.title}</h3>
            <p className="text-sm text-primary mb-3">{project.type}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
          </SurfaceCard>
        ))}
      </div>
    </Section>
  );
};
