import { Mail, Phone, MapPin } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-primary font-medium mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            Hello, I'm
          </p>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Md. Abdullah Bari
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Aspiring software developer and medical student with a passion for creating impactful digital solutions. Building bridges between technology and healthcare.
          </p>

          <div className="flex flex-wrap gap-4 mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:shadow-surface-hover active:scale-[0.98]"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-secondary text-secondary-foreground transition-all duration-200 hover:bg-accent active:scale-[0.98]"
            >
              View Projects
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground animate-fade-in-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            <a
              href="mailto:abdullah.bari.2028@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail size={16} />
              abdullah.bari.2028@gmail.com
            </a>
            <a
              href="tel:+8801738745285"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone size={16} />
              +880 1738-745285
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Dhaka, Bangladesh
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
