import { Section } from "./Section";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

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
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+880 1538-310838",
    href: "https://wa.me/8801538310838",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "808 East Shewrapara, Mirpur, Dhaka-1216",
    href: null,
  },
];

// Facebook icon component
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
    <Section id="contact" title="Get in Touch">
      <div className="max-w-3xl mx-auto">
        {/* Phone Numbers */}
        <div 
          className="mb-8 animate-fade-in-up opacity-0"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Phone Numbers</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {phoneNumbers.map((phone) => (
              <a
                key={phone.value}
                href={phone.href}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {phone.value}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {contactInfo.map((info, index) => (
            <div
              key={info.label}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(index + 2) * 100}ms`, animationFillMode: "forwards" }}
            >
              {info.href ? (
                <a
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border transition-all hover:bg-secondary/50 group"
                >
                  <div className="p-2 rounded-xl bg-accent/50 transition-colors group-hover:bg-primary">
                    <info.icon size={18} className="text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{info.label}</p>
                    <p className="text-sm font-medium text-foreground break-words group-hover:text-primary transition-colors">
                      {info.value}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                  <div className="p-2 rounded-xl bg-accent/50">
                    <info.icon size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{info.label}</p>
                    <p className="text-sm font-medium text-foreground break-words">{info.value}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Facebook */}
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
          >
            <a
              href="https://www.facebook.com/share/1KVojpMNrw/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border transition-all hover:bg-secondary/50 group"
            >
              <div className="p-2 rounded-xl bg-accent/50 transition-colors group-hover:bg-primary">
                <FacebookIcon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Facebook</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Connect on Facebook
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div 
          className="text-center pt-8 border-t border-border animate-fade-in-up opacity-0" 
          style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">Let's Work Together</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          <a
            href="mailto:abdullah.bari.2028@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <Send size={16} />
            Send a Message
          </a>
        </div>
      </div>
    </Section>
  );
};
