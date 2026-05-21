import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto shadow-brand">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-8xl font-extrabold gradient-text mb-3">404</p>
          <h1 className="text-xl font-bold text-(--text-primary) mb-2">
            Page not found
          </h1>
          <p className="text-sm text-(--text-secondary)">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
          <button onClick={() => navigate("/")} className="btn-primary">
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
