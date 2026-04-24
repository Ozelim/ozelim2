"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCog,
  Plane,
  MapPin,
  Heart,
  MessageSquare,
  Package,
  Users,
  Link2,
  Building2,
  LogOut,
  Mountain,
  ChevronRight,
  Menu,
  X,
  Zap,
  Wallet,
  Share2,
} from "lucide-react";

import { MOCK_USER, PACKAGE_FEATURES } from "../../lib/mockData";
import { Avatar, Badge, Button, cn } from "../../components/profile/ui";
import { Dashboard } from "../../components/profile/Dashboard";
import { EditProfile } from "../../components/profile/EditProfile";
import {
  TripHistory,
  VisitedPlaces,
  Favorites,
} from "../../components/profile/TripsFavsVisited";
import {
  Reviews,
  PackagesSection,
} from "../../components/profile/ReviewsPackages";
import {
  FamilySection,
  AgentSection,
  CorporateSection,
} from "../../components/profile/PackageSections";
import { BalanceSection } from "../../components/profile/BalanceSection";
import { ReferralsSection } from "../../components/profile/ReferralsSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// ─── Nav config ───────────────────────────────────────────────────────────────
function buildNav(pkg) {
  const base = [
    { id: "dashboard", label: "Главная", icon: LayoutDashboard },
    // { id: "edit", label: "Редактирование", icon: UserCog },
    { id: "balance", label: "Баланс", icon: Wallet },
    { id: "trips", label: "История поездок", icon: Plane },
    { id: "visited", label: "Посещённые места", icon: MapPin },
    { id: "favorites", label: "Избранное", icon: Heart },
    { id: "reviews", label: "Отзывы", icon: MessageSquare },
    { id: "referrals", label: "Рефералы", icon: Share2 },
    { id: "packages", label: "Пакеты", icon: Package },
  ];

  const pkgItems = {
    family: { id: "family", label: "Семья", icon: Users },
    agent: { id: "agent", label: "Агентство", icon: Link2 },
    corporate: { id: "corporate", label: "Сотрудники", icon: Building2 },
  };

  if (pkg === "agent") {
    // Agent package includes both tabs.
    // Order matters: show "Агентство" first, then "Семья" under it.
    return [base[0], pkgItems.agent, pkgItems.family, ...base.slice(1)];
  }

  if (pkg && pkgItems[pkg]) {
    // Place the extra menu item directly after "dashboard" (1st), as the 2nd item.
    return [base[0], pkgItems[pkg], ...base.slice(1)];
  }
  return base;
}
// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({ item, active, onClick, badge }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={cn(
        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group",
        active
          ? "bg-(--profile-accent-soft) text-(--profile-accent) border border-(--profile-accent-border)"
          : "text-app-subtle hover:text-app-fg hover:bg-app-fg/5 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/5 border border-transparent",
      )}
    >
      <item.icon
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          active
            ? "text-(--profile-accent)"
            : "text-app-faint group-hover:text-app-muted dark:text-white/30 dark:group-hover:text-white/60",
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {badge && (
        <Badge variant="gold" className="text-[9px] px-1.5 py-0">
          {badge}
        </Badge>
      )}
      {active && (
        <ChevronRight className="w-3.5 h-3.5 text-(--profile-accent)/50 shrink-0" />
      )}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ user, nav, active, onNavigate, collapsed, onLogout }) {
  const pkg = user.activePackage;
  const pkgInfo = pkg ? PACKAGE_FEATURES[pkg] : null;

  return (
    <aside
      className={cn(
        "flex flex-col h-full border border-app-border backdrop-blur-md shrink-0 transition-all duration-300",
        collapsed ? "w-0 overflow-hidden" : "w-64",
      )}
    >
      {/* User summary */}
      <div className="px-4 pt-5 pb-4 border-b border-app-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-app-surface-deep" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-app-fg font-semibold text-sm truncate">
              {user.name}
            </div>
            <div className="text-app-subtle text-xs truncate">{user.email}</div>
          </div>
        </div>

        {/* Balance & bonuses */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 rounded-lg bg-app-fg/4 dark:bg-white/5 border border-app-border px-2.5 py-2">
            <div className="text-[9px] uppercase tracking-wide text-app-faint dark:text-white/35 mb-0.5">Баланс</div>
            <div className="text-app-fg dark:text-white text-xs font-semibold">
              {user.balance?.toLocaleString("ru-RU")} ₸
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 px-2.5 py-2">
            <div className="text-[9px] uppercase tracking-wide text-amber-500/70 dark:text-amber-400/60 mb-0.5">Бонусы</div>
            <div className="text-amber-600 dark:text-amber-400 text-xs font-semibold">
              {user.bonus?.toLocaleString("ru-RU")} Б
            </div>
          </div>
        </div>

        {/* Package badge */}
        {pkgInfo ? (
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-(--profile-accent-soft) border border-(--profile-accent-border)">
            <span className="text-base leading-none">{pkgInfo.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-(--profile-accent) text-[10px] font-semibold uppercase tracking-wide">
                {pkgInfo.name} пакет
              </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
        ) : (
          <button
            onClick={() => onNavigate("packages")}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-(--profile-accent-border) text-(--profile-accent)/55 hover:text-(--profile-accent) hover:border-(--profile-accent)/50 transition-all text-xs"
          >
            <Zap className="w-3 h-3" />
            Улучшить аккаунт
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {nav.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={active === item.id}
            onClick={onNavigate}
            badge={item.id === "packages" && !pkg ? "NEW" : null}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t border-app-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-app-faint hover:text-red-400 hover:bg-red-400/5 dark:text-white/35 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile header ────────────────────────────────────────────────────────────
function MobileHeader({ user, currentLabel, onMenuToggle, menuOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-app-border bg-app-surface-deep/95 backdrop-blur-md sticky top-0 z-30 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-linear-to-br from-(--profile-gradient-from) to-(--profile-gradient-to) flex items-center justify-center shrink-0">
          <Mountain className="w-3.5 h-3.5 text-(--profile-on-accent)" />
        </div>
        <div>
          <div
            className="text-app-fg text-sm font-semibold leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            OzElim
          </div>
          <div className="text-app-faint text-[10px] uppercase tracking-wider dark:text-white/35">
            {currentLabel}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl border border-app-border flex items-center justify-center text-app-muted hover:text-app-fg dark:border-[#1a6b1a]/30 dark:text-white/50 dark:hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────
function ActiveSection({ section, user, onNavigate, setUser }) {
  switch (section) {
    case "dashboard":
      return <Dashboard user={user} onNavigate={onNavigate} />;
    case "edit":
      return <EditProfile user={user} onBack={() => onNavigate("dashboard")} />;
    case "balance":
      return <BalanceSection user={user} setUser={setUser} />;
    case "trips":
      return <TripHistory />;
    case "visited":
      return <VisitedPlaces />;
    case "favorites":
      return <Favorites />;
    case "reviews":
      return <Reviews />;
    case "referrals":
      return <ReferralsSection />;
    case "packages":
      return (
        <PackagesSection
          activePackage={user.activePackage}
          onSelectPackage={(pkg) =>
            setUser((u) => ({ ...u, activePackage: pkg }))
          }
        />
      );
    case "family":
      return <FamilySection />;
    case "agent":
      return <AgentSection />;
    case "corporate":
      return <CorporateSection />;
    default:
      return <Dashboard user={user} onNavigate={onNavigate} />;
  }
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function ProfilePage({ dbUser }) {
  const router = useRouter();
  const [user, setUser] = useState({
    ...MOCK_USER,
    ...dbUser,
    balance: dbUser?.balance ?? 0,
    bonus: dbUser?.bonus ?? 0,
  });
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = buildNav(user.activePackage);
  const currentNavItem = nav.find((n) => n.id === activeSection);

  function navigate(sectionId) {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div
      className="min-h-screen bg-app-bg text-app-fg"
      style={{ fontFamily: "DM Sans, system-ui, sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a6b1a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--profile-accent, #166534); }
      `}</style>

      {/* Mobile header */}
      <MobileHeader
        user={user}
        currentLabel={currentNavItem?.label || "Профиль"}
        onMenuToggle={() => setMobileMenuOpen((o) => !o)}
        menuOpen={mobileMenuOpen}
      />

      <div className="flex h-screen lg:h-screen overflow-hidden">
        {/* ── Desktop sidebar ── */}
        {/* <div className="hidden lg:flex">
          <Sidebar
            user={user}
            nav={nav}
            active={activeSection}
            onNavigate={navigate}
            collapsed={false}
          />
        </div> */}

        {/* ── Mobile slide-out menu ── */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 dark:bg-black/50 bg-white/60 backdrop-blur-sm z-10 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="fixed top-14 left-0 bottom-0 z-20 w-72 lg:hidden flex flex-col">
              <Sidebar
                user={user}
                nav={nav}
                active={activeSection}
                onNavigate={navigate}
                collapsed={false}
                onMenuToggle={() => setMobileMenuOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          </>
        )}

        {/* ── Content area ── */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {/* Desktop page header */}
          <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-app-border bg-app-bg/80 backdrop-blur-sm sticky top-0 z-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-(--profile-gradient-from) to-(--profile-gradient-to) flex items-center justify-center">
                <Mountain className="w-3.5 h-3.5 text-(--profile-on-accent)" />
              </div>
              <Link
                href="/"
                className="text-app-muted text-sm font-medium"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Oz<span className="text-(--profile-accent)">Elim</span>
              </Link>
            </div>
            <ThemeToggle />
          </div>

          {/* Section content */}
          <div className="p-4 mt-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[70%_auto] gap-6">
              <ActiveSection
                section={activeSection}
                user={user}
                onNavigate={navigate}
                setUser={setUser}
              />
              <div className="hidden lg:block">
                <Sidebar
                  user={user}
                  nav={nav}
                  active={activeSection}
                  onNavigate={navigate}
                  collapsed={false}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
