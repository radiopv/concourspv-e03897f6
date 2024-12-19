import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ContestsList from "./pages/ContestsList";
import Contest from "./pages/Contest";
import ContestStats from "./pages/ContestStats";
import Winners from "./pages/Winners";
import AdminRoutes from "./components/admin/AdminRoutes";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contests" element={<ContestsList />} />
            <Route path="contest/:id" element={<Contest />} />
            <Route path="contest/:id/stats" element={<ContestStats />} />
            <Route path="winners" element={<Winners />} />
            <Route path="admin/*" element={<AdminRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;