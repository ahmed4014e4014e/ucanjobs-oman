import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supportedLanguages, translations } from "../lib/translations";

const LanguageContext = createContext(null);
const LANGUAGE_STORAGE_KEY = "ucan_language";
const DEFAULT_LANGUAGE = "en";

function getStoredLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedLanguages[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
  } catch (_error) {
    return DEFAULT_LANGUAGE;
  }
}

function resolveTranslation(language, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[language]);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);
  const languageMeta = supportedLanguages[language] || supportedLanguages[DEFAULT_LANGUAGE];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageMeta.dir;
  }, [language, languageMeta.dir]);

  const setLanguage = (nextLanguage) => {
    if (!supportedLanguages[nextLanguage]) {
      return;
    }

    setLanguageState(nextLanguage);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (_error) {
      // Ignore storage issues. The language still updates for the current session.
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const value = useMemo(
    () => ({
      direction: languageMeta.dir,
      isArabic: language === "ar",
      language,
      languageMeta,
      setLanguage,
      toggleLanguage,
      t: (key) => resolveTranslation(language, key) || key,
    }),
    [language, languageMeta]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
