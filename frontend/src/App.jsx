// import "./App.css";
// import ClosingTester from "./components/ClosingTester";
// import ContentTester from "./components/ContentTester";
// import FullDeckTester from "./components/FullDeskTester";
// import HeroTester from "./components/HeroTester";

// function App() {
//   return (
//     <>
//       <FullDeckTester />
//       <HeroTester />
//       <ContentTester />
//       <ClosingTester />
//     </>
//   );
// }

// export default App;

// import React, { useEffect } from "react";
// import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "sonner";
// import { useThemeStore } from "./store/themeStore";
// import "./styles/index.css";
// import { AppRoutes } from "./routes/AppRoutes";

// // Instantiate the high-performance query caching engine
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//     },
//   },
// });

// function App() {
//   const theme = useThemeStore((state) => state.theme);

//   // Synchronize HTML element class parameters dynamically for Dark/Light theme switching
//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }
//   }, [theme]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         {/* Render premium global messaging snackbar system alerts */}
//         <Toaster position="top-right" richColors closeButton theme={theme} />
//         <AppRoutes />
//       </BrowserRouter>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute, PublicRoute } from "./routes/Guards";

import { DashboardLayout } from "./layouts/DashboardLayout";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { CreateProjectPage } from "./pages/CreateProjectPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProfilePage, SettingsPage } from "./pages/SettingsPages";
import { NotFoundPage } from "./pages/NotFoundPage";
import TemplateDeckExplorer from "./pages/TemplateDeckExplorer";
import AnalyticsPage from "./pages/Analytics";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplateDeckExplorer />} />

            {/* Auth routes - redirect to dashboard if logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>

            {/* Protected dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/projects" element={<ProjectsPage />} />
                <Route
                  path="/dashboard/create"
                  element={<CreateProjectPage />}
                />
                <Route
                  path="/dashboard/projects/:projectId"
                  element={<ProjectDetailPage />}
                />
                <Route
                  path="/dashboard/analytics"
                  element={<AnalyticsPage />}
                />

                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="bottom-right" richColors closeButton expand />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
