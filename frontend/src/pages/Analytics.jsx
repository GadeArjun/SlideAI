import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clock3,
  FileText,
  Layers3,
  LayoutTemplate,
  Activity,
  CheckCircle2,
  Flame,
  Sparkles,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Presentation,
  Wand2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

function AnalyticsCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-(--border) bg-(--surface) p-5">
      <div className={`absolute inset-0 opacity-10 ${gradient}`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-(--text-secondary)">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-(--text-primary)">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-xs text-(--text-muted)">{subtitle}</p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--bg-tertiary)">
          <Icon className="h-5 w-5 text-(--brand)" />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-(--brand)" />
          <h2 className="text-lg font-bold text-(--text-primary)">{title}</h2>
        </div>

        {subtitle && (
          <p className="mt-1 text-sm text-(--text-secondary)">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const user = useAuth((s) => s.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await api.get("/project/analytics");
      return res.data.analytics;
    },
    staleTime: 1000 * 60 * 5,
  });

  const overview = data?.overview;

  const stats = overview?.stats?.[0];

  const statusData = useMemo(() => {
    return (
      overview?.statusDistribution?.map((i) => ({
        name: i._id,
        value: i.count,
      })) || []
    );
  }, [overview]);

  const categoryData = useMemo(() => {
    return (
      overview?.categoryDistribution?.map((i) => ({
        name: i._id,
        value: i.count,
      })) || []
    );
  }, [overview]);

  const templateUsage = useMemo(() => {
    return (
      overview?.templateUsage?.slice(0, 10)?.map((i) => ({
        name: i._id.replaceAll("content_", "").replaceAll("_", " "),
        value: i.count,
      })) || []
    );
  }, [overview]);

  const dailyProjects = useMemo(() => {
    return (
      overview?.dailyProjects?.map((i) => ({
        date: i._id,
        projects: i.count,
      })) || []
    );
  }, [overview]);

  const logData = useMemo(() => {
    return (
      data?.logs?.map((i) => ({
        name: i._id.replaceAll("_", " "),
        value: i.count,
      })) || []
    );
  }, [data]);

  const editsData = useMemo(() => {
    return (
      data?.edits?.map((i) => ({
        name: i._id.replaceAll("_", " "),
        value: i.count,
      })) || []
    );
  }, [data]);

  const COLORS = [
    "var(--brand)",
    "var(--accent)",
    "var(--success)",
    "var(--warning)",
    "var(--danger)",
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-3xl bg-(--bg-tertiary) animate-pulse" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-3xl bg-(--bg-tertiary) animate-pulse"
            />
          ))}
        </div>

        <div className="h-125 rounded-3xl bg-(--bg-tertiary) animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-16 w-16 text-red-500" />

        <h2 className="text-2xl font-bold text-(--text-primary)">
          Failed to load analytics
        </h2>

        <p className="text-(--text-secondary)">
          Something went wrong while fetching analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl border border-(--border) bg-(--surface) p-8"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-(--brand) opacity-10 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-(--accent) opacity-10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-4 py-2 text-xs font-semibold text-(--text-secondary)">
              <Sparkles className="h-3.5 w-3.5 text-(--brand)" />
              AI Presentation Analytics
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-(--text-primary)">
              Deep Insights Into Your Presentation Generation System
            </h1>

            <p className="mt-4 text-base leading-7 text-(--text-secondary)">
              Track projects, templates, generation activity, edits, themes,
              slide patterns, and platform usage metrics across all generated
              presentations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-5">
              <p className="text-xs text-(--text-muted)">Total Projects</p>

              <h2 className="mt-2 text-3xl font-black text-(--text-primary)">
                {stats?.totalProjects || 0}
              </h2>
            </div>

            <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-5">
              <p className="text-xs text-(--text-muted)">Total Slides</p>

              <h2 className="mt-2 text-3xl font-black text-(--text-primary)">
                {stats?.totalSlides || 0}
              </h2>
            </div>

            <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-5">
              <p className="text-xs text-(--text-muted)">Avg Slides / Deck</p>

              <h2 className="mt-2 text-3xl font-black text-(--text-primary)">
                {stats?.avgSlidesPerProject?.toFixed(1) || 0}
              </h2>
            </div>

            <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-5">
              <p className="text-xs text-(--text-muted)">Total Logs</p>

              <h2 className="mt-2 text-3xl font-black text-(--text-primary)">
                {stats?.totalLogs || 0}
              </h2>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          title="Completed Projects"
          value={stats?.completedProjects || 0}
          subtitle="Successfully generated decks"
          icon={CheckCircle2}
          gradient="bg-emerald-500"
        />

        <AnalyticsCard
          title="Failed Projects"
          value={stats?.failedProjects || 0}
          subtitle="Generation failures detected"
          icon={Flame}
          gradient="bg-red-500"
        />

        <AnalyticsCard
          title="Templates Used"
          value={overview?.templateUsage?.length || 0}
          subtitle="Unique templates utilized"
          icon={LayoutTemplate}
          gradient="bg-violet-500"
        />

        <AnalyticsCard
          title="Presentation Logs"
          value={stats?.totalLogs || 0}
          subtitle="Pipeline & editing logs"
          icon={Activity}
          gradient="bg-blue-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-(--border) bg-(--surface) p-6"
        >
          <SectionTitle
            icon={BarChart3}
            title="Top Template Usage"
            subtitle="Most frequently generated templates"
          />

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templateUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 11 }}
                />

                <YAxis stroke="var(--text-secondary)" />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  fill="var(--brand)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-(--border) bg-(--surface) p-6"
        >
          <SectionTitle
            icon={PieChart}
            title="Slide Category Distribution"
            subtitle="Hero, content and closing slides"
          />

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-(--border) bg-(--surface) p-6"
        >
          <SectionTitle
            icon={TrendingUp}
            title="Daily Project Activity"
            subtitle="Projects created over time"
          />

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyProjects}>
                <defs>
                  <linearGradient
                    id="gradientProjects"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--brand)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--brand)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis dataKey="date" stroke="var(--text-secondary)" />

                <YAxis stroke="var(--text-secondary)" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="projects"
                  stroke="var(--brand)"
                  fill="url(#gradientProjects)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-(--border) bg-(--surface) p-6"
        >
          <SectionTitle
            icon={Activity}
            title="Pipeline Logs Analysis"
            subtitle="Most common processing events"
          />

          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 11 }}
                />

                <YAxis stroke="var(--text-secondary)" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent)"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* GENERATION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-(--warning)" />

            <h3 className="font-bold text-(--text-primary)">
              Avg Generation Time
            </h3>
          </div>

          <h2 className="mt-5 text-4xl font-black text-(--text-primary)">
            {Math.round(
              (data?.generation?.avgGenerationTime || 0) / (1000 * 60)
            ).toFixed(2)}{" "}
            Min
          </h2>
        </div>

        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-(--brand)" />

            <h3 className="font-bold text-(--text-primary)">
              Max Generation Time
            </h3>
          </div>

          <h2 className="mt-5 text-4xl font-black text-(--text-primary)">
            {Math.round(
              (data?.generation?.maxGenerationTime || 0) / (1000 * 60)
            ).toFixed(2)}{" "}
            Min
          </h2>
        </div>

        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5 text-(--accent)" />

            <h3 className="font-bold text-(--text-primary)">
              Min Generation Time
            </h3>
          </div>

          <h2 className="mt-5 text-4xl font-black text-(--text-primary)">
            {Math.round(
              (data?.generation?.minGenerationTime || 0) / (1000 * 60)
            ).toFixed(2)}{" "}
            Min
          </h2>
        </div>
      </div>

      {/* EDITS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
          <SectionTitle
            icon={Sparkles}
            title="Slide Editing Analytics"
            subtitle="AI editing operations"
          />

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={editsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis dataKey="name" stroke="var(--text-secondary)" />

                <YAxis stroke="var(--text-secondary)" />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="var(--accent)"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
          <SectionTitle
            icon={Presentation}
            title="Most Edited Projects"
            subtitle="Projects with maximum edits"
          />

          <div className="space-y-4">
            {data?.mostEditedProjects?.slice(0, 8)?.map((project, index) => (
              <div
                key={project._id}
                className="flex items-center justify-between rounded-2xl border border-(--border) bg-(--bg-secondary) px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--brand-light) text-sm font-bold text-(--brand)">
                    #{index + 1}
                  </div>

                  <div>
                    <h4 className="max-w-70 truncate font-semibold text-(--text-primary)">
                      {project.title}
                    </h4>

                    <p className="text-xs text-(--text-secondary)">
                      Project ID: {project._id}
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-(--accent-light) px-4 py-2 text-sm font-bold text-(--accent)">
                  {project.editCount} edits
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="rounded-3xl border border-(--border) bg-(--surface) p-6">
        <SectionTitle
          icon={FileText}
          title="Recent Presentations"
          subtitle="Latest generated projects"
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-(--border)">
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-(--text-muted)">
                  Presentation
                </th>

                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-(--text-muted)">
                  Status
                </th>

                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-(--text-muted)">
                  Slides
                </th>

                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-(--text-muted)">
                  Logs
                </th>

                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-(--text-muted)">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {overview?.recentProjects?.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-(--border) transition-colors hover:bg-(--bg-secondary)"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-(--text-primary)">
                        {project.title}
                      </p>

                      <p className="mt-1 text-xs text-(--text-muted)">
                        {project._id}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                      {project.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-(--text-primary)">
                    {project.slidesCount}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-(--text-primary)">
                    {project.logsCount}
                  </td>

                  <td className="px-4 py-4 text-sm text-(--text-secondary)">
                    {new Date(project.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-(--text-muted)">
        Analytics generated from presentation activity and project metadata.
      </p>
    </div>
  );
}
