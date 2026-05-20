import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export function truncate(str, len = 60) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
}

export function isCompletedStatus(status) {
  return status === "completed";
}

export function isActiveStatus(status) {
  return ["draft", "intent_processing", "slides_generating"].includes(status);
}

export function isFailedStatus(status) {
  return status === "failed";
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function generateAvatarColor(name = "") {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-violet-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}
