import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../contexts/language/useLanguage";
import { NAV_LINKS, SITE_NAME } from "../../data/siteData";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import "./Header.scss";

const Header = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner container">
        <a className="header__logo" href="#" onClick={(e) => e.preventDefault()}>
          {SITE_NAME}
        </a>

        <nav className="header__nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className="header__nav-link"
              onClick={() => handleNavClick(link.id)}
              type="button"
            >
              {t(link.translationKey)}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />
          <button
            className="header__burger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`header__mobile-menu${menuOpen ? " header__mobile-menu--open" : ""}`}>
        <nav className="header__mobile-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className="header__mobile-link"
              onClick={() => handleNavClick(link.id)}
              type="button"
            >
              {t(link.translationKey)}
            </button>
          ))}
        </nav>
        <div className="header__mobile-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
