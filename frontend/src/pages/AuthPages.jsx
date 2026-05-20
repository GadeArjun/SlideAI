import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Layers, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../lib/utils";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Min 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Lowercase, numbers, underscores only"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-violet-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        {/* Floating elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-2xl bg-white/10 border border-white/20"
            style={{
              width: 80 + i * 30,
              height: 56 + i * 20,
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        <div className="relative z-10 text-center text-white space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-6">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">SlideAI</h2>
          <p className="text-blue-100 text-lg max-w-xs">
            Create stunning presentations with the power of AI in seconds.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>10,000+ presentations generated</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)]">
              SlideAI
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {subtitle}
            </p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export function LoginPage() {
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your SlideAI account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="input-field"
          />
          <FieldError msg={errors.email?.message} />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <FieldError msg={errors.password?.message} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-[var(--text-secondary)]">
        No account?{" "}
        <Link
          to="/auth/register"
          className="text-[var(--brand)] font-semibold hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start generating AI presentations today"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className="input-field"
            />
            <FieldError msg={errors.name?.message} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="john_doe"
              className="input-field"
            />
            <FieldError msg={errors.username?.message} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="input-field"
          />
          <FieldError msg={errors.email?.message} />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <FieldError msg={errors.password?.message} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>
      <p className="text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-[var(--brand)] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
