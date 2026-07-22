import { requireSession } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/actions/user.actions";
import { AppHeader } from "@/components/layout/app-header";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await requireSession();
  const user = session.user as typeof session.user & { timezone?: string; theme?: string };

  const profile = await getUserProfile(user.id);

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="Settings"
        userName={user.name ?? undefined}
        userEmail={user.email}
        timezone={user.timezone ?? "UTC"}
      />
      <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8">
        <SettingsForm
          user={{
            id: user.id,
            name: user.name ?? "",
            email: user.email,
            timezone: profile?.timezone ?? user.timezone ?? "UTC",
            theme: profile?.theme ?? user.theme ?? "system",
          }}
        />
      </div>
    </div>
  );
}
