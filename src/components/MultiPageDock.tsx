import React from 'react';
import { PageRoute } from '../types';
import { Sparkles, Flame, Lock, HelpCircle, Shield, LogOut, User, Compass } from 'lucide-react';

interface MultiPageDockProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  isAdmin: boolean;
  currentUser: { name: string; email: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const MultiPageDock: React.FC<MultiPageDockProps> = ({
  currentRoute,
  onNavigate,
  isAdmin,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const pages: { id: PageRoute; label: string; number: string; icon: React.ElementType; badge?: string }[] = [
    { id: '/', label: 'HOME', number: 'P1', icon: Compass },
    { id: '/flavours', label: 'FLAVOURS (3D)', number: 'P2', icon: Flame, badge: '3D' },
    { id: '/mystery', label: 'THE MYSTERY', number: 'P3', icon: Lock },
    { id: '/faq', label: 'FAQ', number: 'P4', icon: HelpCircle },
    ...(isAdmin
      ? [{ id: '/admin-first-50' as PageRoute, label: 'CREATOR VIP', number: 'P5', icon: Shield, badge: 'FIRST 50' }]
      : []),
  ];

  return (
    <aside
      aria-label="Quick Multi-Page Navigation and Session Control"
      className="fixed top-16 sm:top-[70px] left-1/2 -translate-x-1/2 z-40 max-w-[96vw] w-auto animate-fadeIn transition-all duration-300"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#090C16]/95 backdrop-blur-xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-white text-xs font-tech">
        {/* Label */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-widest text-white/50 uppercase border-r border-white/10 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>PAGES:</span>
        </div>

        {/* Page Switch Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isActive = currentRoute === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={`group relative px-2.5 sm:px-3 py-1.5 rounded-xl font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 ring-1 ring-blue-400'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to Page: ${p.label}`}
              >
                <span className={`text-[10px] ${isActive ? 'text-blue-200' : 'text-white/40'}`}>
                  {p.number}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`} />
                <span className="text-[11px] tracking-wider whitespace-nowrap hidden sm:inline">
                  {p.label}
                </span>
                {p.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase ${
                      p.badge === 'FIRST 50'
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-white/15 mx-0.5" />

        {/* Session / LOG OUT Control */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 pl-1">
            <span className="hidden xl:inline text-[11px] text-white/60 truncate max-w-[100px]" title={currentUser.email}>
              {currentUser.name}
            </span>
            <button
              onClick={onLogout}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600/25 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 hover:border-red-400 font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-red-950/40"
              title="Log out and switch account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wider font-display font-bold">LOG OUT</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-400/40 font-bold transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
          >
            <User className="w-3.5 h-3.5" />
            <span>SIGN IN</span>
          </button>
        )}
      </div>
    </aside>
  );
};
