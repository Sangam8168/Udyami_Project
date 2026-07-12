import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Book, Calculator, Gamepad2, Shield, User, MessageCircle, LogOut, Settings, Scan, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useInterfaceType } from "@/hooks/useInterfaceType";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import { NotificationCenter } from "@/components/NotificationCenter";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();
  const { interfaceType, isAdminInterface, userRole, isAdmin } = useInterfaceType();

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {isAdminInterface ? <Settings className="w-5 h-5" /> : "U"}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-foreground">
                    {isAdmin ? "Admin Panel" : "Udyami"}
                  </h1>
                  {isAdmin && (
                    <Badge variant="destructive" className="text-xs">
                      ADMIN
                    </Badge>
                  )}
                  {!isAdmin && user && (
                    <Badge variant="secondary" className="text-xs">
                      USER
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? "Administrative Dashboard" : "Financial Empowerment"}
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAdmin ? (
                // Admin Navigation
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/admin/dashboard") 
                        ? "bg-red-600 text-white" 
                        : "text-foreground hover:bg-slate-100 hover:text-accent-foreground"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/admin/users") 
                        ? "bg-red-600 text-white" 
                        : "text-foreground hover:bg-slate-100 hover:text-accent-foreground"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                  <Link
                    to="/admin/conversations"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/admin/conversations") 
                        ? "bg-red-600 text-white" 
                        : "text-foreground hover:bg-slate-100 hover:text-accent-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Conversations</span>
                  </Link>
                  <Link
                    to="/admin/schemes"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/admin/schemes") 
                        ? "bg-red-600 text-white" 
                        : "text-foreground hover:bg-slate-100 hover:text-accent-foreground"
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Schemes</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/admin/settings") 
                        ? "bg-red-600 text-white" 
                        : "text-foreground hover:bg-slate-100 hover:text-accent-foreground"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </>
              ) : (
                // User Navigation
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/") 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/chatbot"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/chatbot") 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chatbot</span>
                  </Link>
                  <Link
                    to="/schemes"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/schemes") 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Schemes</span>
                  </Link>
                  <Link
                    to="/about"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/about") 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Book className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                </>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <NotificationCenter />
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                      isActive("/profile") 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:block">Profile</span>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-card border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-center space-x-1">
            {isAdmin ? (
              // Admin Mobile Navigation
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/admin/dashboard") 
                      ? "bg-red-600 text-white" 
                      : "text-foreground hover:bg-slate-100"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs">Dashboard</span>
                </Link>
                <Link
                  to="/admin/users"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/admin/users") 
                      ? "bg-red-600 text-white" 
                      : "text-foreground hover:bg-slate-100"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs">Users</span>
                </Link>
                <Link
                  to="/admin/conversations"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/admin/conversations") 
                      ? "bg-red-600 text-white" 
                      : "text-foreground hover:bg-slate-100"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Chat</span>
                </Link>
                <Link
                  to="/admin/schemes"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/admin/schemes") 
                      ? "bg-red-600 text-white" 
                      : "text-foreground hover:bg-slate-100"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span className="text-xs">Schemes</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/admin/settings") 
                      ? "bg-red-600 text-white" 
                      : "text-foreground hover:bg-slate-100"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Settings</span>
                </Link>
              </>
            ) : (
              // User Mobile Navigation
              <>
                <Link
                  to="/"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs">Dashboard</span>
                </Link>
                <Link
                  to="/chatbot"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/chatbot") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Chat</span>
                </Link>
                <Link
                  to="/schemes"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/schemes") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span className="text-xs">Schemes</span>
                </Link>
                <Link
                  to="/about"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-smooth ${
                    isActive("/about") 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Book className="w-4 h-4" />
                  <span className="text-xs">About</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">U</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Udyami</span>
            </div>
            <p className="text-muted-foreground">
              Empowering rural women through financial literacy and digital inclusion
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For rural Indian women
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
