import { useState, useMemo, useCallback } from "react";
import { LanguageContext } from "./LanguageContext";
import uk from "../../locales/uk.json";
import en from "../../locales/en.json";

const translations = { uk, en };
const availableLanguages = Object.keys(translations);

const getInitialLanguage = () => {
  try {
    const saved = localStorage.getItem("language");
    if (saved && availableLanguages.includes(saved)) return saved;
  } catch {}
  return availableLanguages[0];
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    if (availableLanguages.includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem("language", lang);
      } catch {}
    }
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let result = translations[language];
      for (const k of keys) {
        if (result == null || typeof result !== "object") return key;
        result = result[k];
      }
      return result ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, availableLanguages }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
