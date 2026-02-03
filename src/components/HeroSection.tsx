import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.png";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-12">
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-primary font-medium mb-3 animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              Hello, I'm
            </p>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              Md. Abdullah Bari
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              Aspiring software developer and medical student with a passion for creating impactful digital solutions. Building bridges between technology and healthcare.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
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

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-muted-foreground animate-fade-in-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
              <a
                href="mailto:abdullah.bari.2028@gmail.com"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">abdullah.bari.2028@gmail.com</span>
                <span className="sm:hidden">Email</span>
              </a>
              <a
                href="https://wa.me/8801538310838"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Dhaka, Bangladesh
              </span>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="relative animate-fade-in-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 animate-float" />
              
              {/* Photo container */}
              <div className="absolute inset-3 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <img
                  src={profilePhoto}
                  alt="Md. Abdullah Bari"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary opacity-60" />
              <div className="absolute -top-4 right-8 w-4 h-4 rounded-full bg-accent opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
