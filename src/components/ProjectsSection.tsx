import { Section } from "./Section";
import { Smartphone, Globe, ExternalLink, Code2 } from "lucide-react";
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
    tech: ["Android", "Java", "Firebase"]
  },
  {
    title: "Greenhutbd Inventory Management",
    type: "Web Application",
    icon: Globe,
    logo: greenhutLogo,
    description: "A comprehensive web-based inventory management system for streamlining business operations and stock tracking.",
    isBangla: false,
    tech: ["React", "Node.js", "MongoDB"]
  },
];

export const ProjectsSection = () => {
  return (
    <Section id="projects" title="Latest Work" index="04">
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="group relative terminal-window animate-fade-in-up opacity-0 flex flex-col"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            {/* Terminal Header as Tab */}
            <div className="terminal-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={12} className="text-primary" />
                <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                  {project.title.toLowerCase().replace(/\s+/g, '_')}.js
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start gap-5 mb-6">
                {/* Project Logo */}
                <div className="w-16 h-16 rounded-xl bg-surface-1 border border-border p-2.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors shadow-inner">
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className={`text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors ${project.isBangla ? 'font-bangla' : ''}`}>
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-primary/70">
                    <project.icon size={12} />
                    <span>{project.type}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="space-y-4 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Repository Status: Public</span>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-white transition-colors group/link"
                  >
                    view_details
                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
