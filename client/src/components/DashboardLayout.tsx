import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, BookOpen, CalendarRange, LockKeyhole, LogOut, PanelLeft, TreePine } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { icon: CalendarRange, label: "Reservations", path: "/admin/bookings" },
  { icon: BookOpen, label: "Public journeys", path: "/tours" },
];

const SIDEBAR_WIDTH_KEY = "hushwood-admin-sidebar-width";
const DEFAULT_WIDTH = 284;
const MIN_WIDTH = 228;
const MAX_WIDTH = 380;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()), [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-5 text-foreground">
        <div className="w-full max-w-lg rounded-[3rem] bg-[#10281f] p-4 text-center text-[#f6f2e8]">
          <div className="rounded-[2.5rem] border border-white/10 px-7 py-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d5b489] text-[#17372a]"><LockKeyhole className="h-6 w-6" /></span>
            <p className="mt-7 eyebrow justify-center text-[#d5b489]">Journey desk</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none">Sign in to continue.</h1>
            <p className="mt-5 text-sm leading-7 text-white/56">This workspace is reserved for the Hushwood journey team.</p>
            <button type="button" onClick={() => startLogin()} className="mt-7 rounded-full bg-[#d5b489] px-6 py-4 text-sm font-semibold text-[#17372a]">Sign in securely</button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-5 text-center text-foreground">
        <div className="max-w-xl">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/8 text-primary"><TreePine className="h-6 w-6" /></span>
          <p className="mt-7 eyebrow justify-center text-[#795337]">Private workspace</p>
          <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.9]">This path is for the journey team.</h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">Your traveler account is active, but it does not have access to reservation management.</p>
          <Link href="/account/bookings" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Return to my journeys</Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const activeMenuItem = menuItems.find(item => location.startsWith(item.path));

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const stop = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", stop);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div ref={sidebarRef} className="relative">
        <Sidebar collapsible="icon" className="overflow-hidden rounded-r-[2.5rem] border-r-0 bg-[#10281f] text-[#f6f2e8]" disableTransition={isResizing}>
          <SidebarHeader className="h-24 justify-center border-b border-white/8 px-3">
            <div className="flex w-full items-center gap-3">
              <button type="button" onClick={toggleSidebar} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/68 hover:bg-white/12" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>
              {!isCollapsed && <div className="min-w-0"><p className="font-display text-xl font-semibold leading-none">Hushwood</p><p className="mt-1 text-[0.62rem] uppercase tracking-[0.13em] text-[#d5b489]">Journey desk</p></div>}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 px-2 py-5">
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => {
                const active = location.startsWith(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton isActive={active} onClick={() => setLocation(item.path)} tooltip={item.label} className={`h-12 rounded-full px-3 font-medium text-white/62 hover:bg-white/8 hover:text-white data-[active=true]:bg-[#d5b489] data-[active=true]:text-[#17372a]`}>
                      <item.icon className="h-4 w-4" /><span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/8 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-full p-1 text-left hover:bg-white/7 group-data-[collapsible=icon]:justify-center">
                  <Avatar className="h-10 w-10 shrink-0 border-0 bg-[#d5b489] text-[#17372a]"><AvatarFallback className="bg-[#d5b489] text-xs font-semibold text-[#17372a]">{user?.name?.charAt(0).toUpperCase() || "H"}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-medium">{user?.name || "Journey admin"}</p><p className="mt-1 truncate text-xs text-white/40">{user?.email || "Hushwood team"}</p></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-[1.25rem] p-2">
                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-full text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#d5b489]/30 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => !isCollapsed && setIsResizing(true)} style={{ zIndex: 50 }} />
      </div>

      <SidebarInset className="bg-background">
        {isMobile && <div className="sticky top-0 z-40 flex h-16 items-center gap-3 rounded-b-[1.5rem] border-b border-border/60 bg-background/92 px-3 backdrop-blur-xl"><SidebarTrigger className="h-10 w-10 rounded-full bg-primary text-primary-foreground" /><span className="font-display text-xl font-semibold">{activeMenuItem?.label ?? "Journey desk"}</span></div>}
        <main id="main-content" className="min-h-screen flex-1 p-4 sm:p-6 xl:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
