import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, User, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";
import { setLanguage } from "../i18n";
import { ConfirmDialog } from "./ConfirmDialog";

export function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();
  const { t, i18n } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const toggleLang = () => {
    const next = i18n.language === "es" ? "en" : "es";
    setLanguage(next);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              to="/"
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              {t("app.title")}
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleLang}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer uppercase tracking-wide"
                title={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
              >
                {i18n.language === "es" ? "EN" : "ES"}
              </button>

              <button
                onClick={toggle}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                title={dark ? t("nav.lightMode") : t("nav.darkMode")}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </Link>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title={t("nav.logoutConfirm")}
        description={t("nav.logoutConfirmDesc")}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
