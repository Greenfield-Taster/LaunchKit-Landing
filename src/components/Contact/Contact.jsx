import { Mail, Phone, MapPin } from "lucide-react";
import AnimatedSection from "../AnimatedSection/AnimatedSection";
import { useLanguage } from "../../contexts/language/useLanguage";
import { SOCIAL_LINKS, ICON_MAP } from "../../data/siteData";
import "./Contact.scss";

const CONTACT_ITEMS = [
  { icon: Mail, labelKey: "Email", valueKey: "contact.email" },
  { icon: Phone, labelKey: "Phone", valueKey: "contact.phone" },
  { icon: MapPin, labelKey: "Address", valueKey: "contact.address" },
];

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact">
      <div className="contact__container container">
        <AnimatedSection>
          <h2 className="contact__title">{t("contact.title")}</h2>
        </AnimatedSection>

        <div className="contact__cards">
          {CONTACT_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedSection
                key={item.labelKey}
                className="contact__card"
                delay={0.1 * (index + 1)}
              >
                <div className="contact__card-icon">
                  <Icon size={24} />
                </div>
                <span className="contact__card-label">{item.labelKey}</span>
                <span className="contact__card-value">{t(item.valueKey)}</span>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="contact__socials">
          {SOCIAL_LINKS.map((link, index) => {
            const Icon = ICON_MAP[link.name];
            if (!Icon) return null;
            return (
              <AnimatedSection
                key={link.name}
                className="contact__social-wrapper"
                delay={0.1 * (index + 1)}
                direction="up"
              >
                <a
                  href={link.url}
                  className="contact__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <Icon size={20} />
                </a>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
