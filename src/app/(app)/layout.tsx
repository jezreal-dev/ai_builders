import { requireSession } from "@/lib/auth/session";
import { ensureUserProfile } from "@/lib/actions/user.actions";
import { getUserLists } from "@/lib/repositories/list.repository";
import { Sidebar } from "@/components/lists/sidebar";
import { AppHeader } from "@/components/layout/app-header";

interface AppLayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}

// Each page passes its own title via a slot — we derive it from pathname instead
async function getTitleFromPathname(pathname: string, lists: Awaited<ReturnType<typeof getUserLists>>) {
  return "TaskFlow";
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string; theme?: string };

  // Ensure profile + default list exist
  await ensureUserProfile(user.id);

  const lists = await getUserLists(user.id);
  const timezone = user.timezone ?? "UTC";

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-neutral-950">
      <Sidebar lists={lists} userName={user.name ?? user.email} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Children render their own header via the AppLayoutShell */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
