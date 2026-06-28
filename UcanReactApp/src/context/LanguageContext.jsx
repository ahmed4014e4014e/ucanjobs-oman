import { createContext, useContext, useEffect, useMemo } from "react";
import { supportedLanguages, translations } from "../lib/translations";

const LanguageContext = createContext(null);
const DEFAULT_LANGUAGE = "en";

function resolveTranslation(key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[DEFAULT_LANGUAGE]);
}

export function LanguageProvider({ children }) {
  const language = DEFAULT_LANGUAGE;
  const languageMeta = supportedLanguages[DEFAULT_LANGUAGE];

  useEffect(() => {
    document.documentElement.lang = DEFAULT_LANGUAGE;
    document.documentElement.dir = languageMeta.dir;
  }, [languageMeta.dir]);

  const value = useMemo(
    () => ({
      direction: languageMeta.dir,
      language,
      languageMeta,
      t: (key) => resolveTranslation(key) || key,
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
