import { Section } from "./Section";
import { Mail, Phone, MapPin, MessageCircle, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "abdullah.bari.2028@gmail.com",
    href: "mailto:abdullah.bari.2028@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+880 1538-310838",
    href: "https://wa.me/8801538310838",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Shewrapara, Mirpur 10, Dhaka",
    href: null,
  },
];

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const ContactSection = () => {
  return (
    <Section id="contact" title="Get in Touch" index="02">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h3 className="text-4xl font-bold text-foreground mb-4">Lets Collaborate</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            I'm always open to discussing new projects, medical tech innovations, or opportunities to be part of your vision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactLinks.map((link, index) => (
            <div
              key={link.label}
              className="animate-fade-in-up opacity-0 flex flex-col items-center text-center group"
              style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
            >
              {link.href ? (
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? "_blank" : undefined}
                  rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    <link.icon size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{link.label}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.value}</span>
                </a>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                    <link.icon size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{link.label}</span>
                  <span className="text-sm font-medium text-foreground">{link.value}</span>
                </div>
              )}
            </div>
          ))}

          {/* Facebook */}
          <div
            className="animate-fade-in-up opacity-0 flex flex-col items-center text-center group"
            style={{ animationDelay: "400ms", animationFillMode: 'forwards' }}
          >
            <a
              href="https://www.facebook.com/abdullahbariasif"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-all">
                <FacebookIcon size={20} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Facebook</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">My Facebook Profile</span>
            </a>
          </div>
        </div>

        <div className="text-center animate-fade-in-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: 'forwards' }}>
          <a
            href="https://wa.me/8801538310838"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-12 py-4 rounded-full text-sm font-mono font-bold bg-primary text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:scale-[0.98]"
          >
            <MessageCircle size={18} />
            send_message
          </a>
        </div>
      </div>
    </Section>
  );
};
