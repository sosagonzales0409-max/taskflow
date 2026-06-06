import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";

const firebaseErrors: Record<string, string> = {
  "auth/user-not-found": "auth.error.userNotFound",
  "auth/wrong-password": "auth.error.wrongPassword",
  "auth/invalid-credential": "auth.error.invalidCredential",
  "auth/invalid-email": "auth.error.invalidEmail",
  "auth/email-already-in-use": "auth.error.emailAlreadyInUse",
  "auth/weak-password": "auth.error.weakPassword",
  "auth/too-many-requests": "auth.error.tooManyRequests",
  "auth/user-disabled": "auth.error.userDisabled",
};

function parseFirebaseError(message: string, t: (key: string) => string): string {
  const match = message.match(/\((\w+\/\w+)\)/);
  if (match) {
    const code = match[1];
    const key = firebaseErrors[code];
    return key ? t(key) : `Error: ${code}`;
  }
  return t("auth.error.default");
}

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(parseFirebaseError(err.message, t));
      } else {
        setError(t("auth.error.default"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {t("app.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isRegister ? t("auth.registerTitle") : t("auth.loginTitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
              placeholder={t("auth.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition font-medium cursor-pointer shadow-sm"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isRegister ? t("auth.register") : t("auth.login")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {isRegister ? t("auth.hasAccount") : t("auth.noAccount")}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer bg-transparent border-none"
          >
            {isRegister ? t("auth.loginLink") : t("auth.registerLink")}
          </button>
        </p>
      </div>
    </div>
  );
}
