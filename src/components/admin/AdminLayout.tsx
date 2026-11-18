import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, ChevronRight, Gift, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", description: "Overview and analytics" },
  { path: "/admin/users", icon: Users, label: "User Management", description: "Manage users and roles" },
  { path: "/admin/conversations", icon: MessageSquare, label: "Conversations", description: "Monitor chatbot activity" },
  { path: "/admin/schemes", icon: Gift, label: "Scheme Manager", description: "Manage government schemes" },
  { path: "/admin/settings", icon: Settings, label: "Settings", description: "Configure the platform" },
];

function AdminNavigation({ email, onNavigate }: { email?: string; onNavigate?: () => void }) {
  return (
    <>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ path, icon: Icon, label, description }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "border-primary/25 bg-accent/60 text-accent-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg bg-secondary/60 p-3 text-secondary-foreground">
          <Shield className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Admin account</p>
            {email && <p className="truncate text-xs text-muted-foreground" title={email}>{email}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children?: ReactNode }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu">
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[min(22rem,88vw)] flex-col gap-0 bg-card p-0 lg:hidden" aria-describedby={undefined}>
                <SheetHeader className="border-b px-4 py-5 text-left">
                  <SheetTitle>Udyami Admin</SheetTitle>
                </SheetHeader>
                <AdminNavigation email={user?.email} onNavigate={() => setMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground" aria-hidden="true">U</span>
              <span className="flex flex-col">
                <span className="font-semibold">Udyami Admin</span>
                <span className="text-xs text-muted-foreground">प्रशासन</span>
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">Admin</Badge>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft aria-hidden="true" />
                Back to Main Site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
              <LogOut aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-screen-2xl flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
          <AdminNavigation email={user?.email} />
        </aside>
        <main className="min-w-0 flex-1 bg-gradient-to-b from-accent/20 to-transparent px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
