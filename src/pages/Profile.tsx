import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { User, Camera, Save, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      await updateProfile(user, {
        displayName: displayName || null,
        photoURL: photoURL || null,
      });
      setMessage({ type: "success", text: t("profile.success") });
    } catch {
      setMessage({ type: "error", text: t("profile.error") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("profile.back")}
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={() => setPhotoURL("")}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("profile.title")}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.name")}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("profile.photoUrl")}
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder={t("profile.photoUrlPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
              />
            </div>

            {message && (
              <p
                className={`text-sm px-3 py-2 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer text-sm font-medium shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? t("profile.saving") : t("profile.save")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
