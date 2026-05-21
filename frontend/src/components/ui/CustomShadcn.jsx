import React from "react";
import { motion } from "framer-motion";

export const GlassCard = ({
  children,
  className = "",
  hoverEffect = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        hoverEffect ? { y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" } : {}
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CustomButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 px-5 py-2.5 text-sm select-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:bg-blue-500 dark:hover:bg-blue-600",
    accent:
      "bg-linear-to-r from-blue-600 to-violet-600 text-white hover:opacity-95 shadow-md",
    secondary:
      "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100",
    outline:
      "border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900",
    ghost:
      "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const CustomInput = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-white dark:bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 ${
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";

export const ShimmerLoader = ({ className = "" }) => {
  return (
    <div
      className={`relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className}`}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
};
