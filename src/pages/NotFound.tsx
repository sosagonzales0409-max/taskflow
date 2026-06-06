import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">Página no encontrada</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
        La página que buscas no existe o fue movida
      </p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
      >
        <Home className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  );
}
