"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import es from "@/messages/es.json";
import en from "@/messages/en.json";

type Lang = "es" | "en";
type Messages = typeof es;

const translations: Record<Lang, Messages> = { es, en };

interface I18nContextType {
  lang: Lang;
  t: Messages;
  setLang: (l: Lang) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "es",
  t: es,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
