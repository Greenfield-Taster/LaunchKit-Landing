import { useLanguage } from "../../contexts/language/useLanguage";
import "./LanguageSwitcher.scss";

const LanguageSwitcher = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handleToggle = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    setLanguage(availableLanguages[nextIndex]);
  };

  return (
    <button
      className="language-switcher"
      onClick={handleToggle}
      aria-label="Switch language"
      type="button"
    >
      {language.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;
