import { Section } from "./Section";
import { SurfaceCard } from "./SurfaceCard";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "abdullah.bari.2028@gmail.com",
    href: "mailto:abdullah.bari.2028@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1738-745285",
    href: "tel:+8801738745285",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "808 East Shewrapara, Mirpur, Dhaka-1216",
    href: null,
  },
];

export const ContactSection = () => {
  return (
    <Section id="contact" title="Get in Touch">
      <div className="grid md:grid-cols-3 gap-4">
        {contactInfo.map((info, index) => (
          <SurfaceCard
            key={info.label}
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
          >
            {info.href ? (
              <a
                href={info.href}
                className="flex items-start gap-4 group"
              >
                <div className="p-3 rounded-2xl bg-accent transition-colors group-hover:bg-primary">
                  <info.icon size={20} className="text-accent-foreground transition-colors group-hover:text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{info.label}</p>
                  <p className="text-sm font-medium text-foreground break-words group-hover:text-primary transition-colors">
                    {info.value}
                  </p>
                </div>
              </a>
            ) : (
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-accent">
                  <info.icon size={20} className="text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{info.label}</p>
                  <p className="text-sm font-medium text-foreground break-words">{info.value}</p>
                </div>
              </div>
            )}
          </SurfaceCard>
        ))}
      </div>

      <SurfaceCard className="mt-8 text-center py-10 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <h3 className="text-2xl font-semibold text-foreground mb-3">Let's Work Together</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
        </p>
        <a
          href="mailto:abdullah.bari.2028@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:shadow-surface-hover active:scale-[0.98]"
        >
          <Send size={16} />
          Send a Message
        </a>
      </SurfaceCard>
    </Section>
  );
};
