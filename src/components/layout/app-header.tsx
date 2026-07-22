"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Monitor, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchModal } from "@/components/search/search-modal";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userEmail?: string;
  timezone?: string;
}

function ThemeIcon({ theme }: { theme: string | undefined }) {
  if (theme === "light") return <Sun className="h-4 w-4" />;
  if (theme === "dark") return <Moon className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
}

export function AppHeader({ title, subtitle, userName, userEmail, timezone }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  function cycleTheme() {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    toast.success("Signed out");
  }

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0 lg:pl-6">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h1>
          {subtitle && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 h-8 px-3 text-sm text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Search (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Search</span>
            <kbd className="hidden sm:inline text-xs border border-neutral-200 dark:border-neutral-700 rounded px-1 ml-1">⌘K</kbd>
          </button>

          <button
            onClick={cycleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            <ThemeIcon theme={theme} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  {userName && <p className="text-sm font-medium">{userName}</p>}
                  {userEmail && <p className="text-xs text-neutral-400 truncate">{userEmail}</p>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} timezone={timezone} />
    </>
  );
}
