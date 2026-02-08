import { Section } from "./Section";
import { Mail, Phone, MapPin, Send, MessageCircle, Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const phoneNumbers = [
  { value: "+880 1738-745285", href: "tel:+8801738745285" },
  { value: "+880 1538-310838", href: "tel:+8801538310838" },
  { value: "+880 9638-250306", href: "tel:+8809638250306" },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "abdullah.bari.2028@gmail.com",
    href: "mailto:abdullah.bari.2028@gmail.com",
    color: "text-blue-400"
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+880 1538-310838",
    href: "https://wa.me/8801538310838",
    color: "text-green-400"
  },
  {
    icon: MapPin,
    label: "Address",
    value: "808 East Shewrapara, Mirpur, Dhaka-1216",
    href: null,
    color: "text-red-400"
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
    <Section id="contact" title="Get in Touch" index="04">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-8">
            <div
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Terminal size={18} className="text-primary" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">communication_channels</h3>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.label}
                    className="group"
                  >
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all"
                      >
                        <div className={cn("p-2 rounded-lg bg-surface-1 border border-border group-hover:border-primary/30 transition-colors", info.color)}>
                          <info.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{info.label}</p>
                          <p className="text-sm font-mono text-foreground break-all group-hover:text-primary transition-colors">
                            {info.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                        <div className={cn("p-2 rounded-lg bg-surface-1 border border-border", info.color)}>
                          <info.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{info.label}</p>
                          <p className="text-sm font-mono text-foreground">{info.value}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/abdullahbariasif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-surface-1 border border-border group-hover:border-primary/30 text-blue-500 transition-colors">
                    <FacebookIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Facebook</p>
                    <p className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                      connect_on_social()
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Phone Numbers & CTA */}
          <div className="space-y-8">
            <div
              className="terminal-window animate-fade-in-up opacity-0"
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              <div className="terminal-header">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">voice_lines.cfg</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {phoneNumbers.map((phone) => (
                    <a
                      key={phone.value}
                      href={phone.href}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-surface-1/50 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-primary" />
                        <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">{phone.value}</span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="p-8 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden animate-fade-in-up opacity-0"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Send size={80} className="text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">init_collaboration()</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                I'm always open to discussing new projects, medical tech innovations, or opportunities to be part of your vision. Let's build something impactful.
              </p>

              <a
                href="https://wa.me/8801538310838"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-mono font-bold bg-primary text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:scale-[0.98]"
              >
                <MessageCircle size={16} />
                send_message
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
