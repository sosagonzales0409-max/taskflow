import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";

const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language.startsWith("en") ? "en" : "es";

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: savedLang ?? browserLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export function setLanguage(lang: "es" | "en") {
  localStorage.setItem("lang", lang);
  i18n.changeLanguage(lang);
}

export default i18n;
