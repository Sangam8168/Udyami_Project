import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import CreditEstimator from "./pages/CreditEstimator";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./pages/Chatbot";
import FraudDetection from "./pages/FraudDetection";
import Schemes from "./pages/Schemes";
import PopulateSchemes from "./pages/PopulateSchemes";
import { SchemePreferencesForm } from "./components/schemes/SchemePreferencesForm";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
// Admin pages
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminConversations from "./pages/admin/Conversations";
import AdminSchemes from "./pages/admin/Schemes";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/games" element={<Games />} />
            <Route path="/credit-estimator" element={<CreditEstimator />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/populate" element={<PopulateSchemes />} />
            <Route path="/schemes/preferences" element={
              <Layout>
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                  <h1 className="text-3xl font-bold mb-8">Set Your Preferences</h1>
                  <SchemePreferencesForm />
                </div>
              </Layout>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            
            {/* Admin Routes */}
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/admin-login" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/conversations" element={<AdminConversations />} />
            <Route path="/admin/schemes" element={<AdminSchemes />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Legacy Admin Routes (for backward compatibility) */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
