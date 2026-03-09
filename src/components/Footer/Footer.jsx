import { Instagram, Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { useLanguage } from "../../contexts/language/useLanguage";
import { NAV_LINKS, SOCIAL_LINKS, SITE_NAME } from "../../data/siteData";
import "./Footer.scss";

const ICON_MAP = {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
};

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__content">
          <div className="footer__brand">
            <span className="footer__logo">{SITE_NAME}</span>
          </div>

          <nav className="footer__nav">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="footer__nav-link"
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {t(link.translationKey)}
              </a>
            ))}
          </nav>

          <div className="footer__socials">
            {SOCIAL_LINKS.map((link) => {
              const Icon = ICON_MAP[link.name];
              if (!Icon) return null;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer__separator" />

        <p className="footer__copyright">
          &copy; {currentYear} {SITE_NAME}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
