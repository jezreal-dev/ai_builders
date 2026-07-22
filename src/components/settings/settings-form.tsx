"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, LogOut, User, Clock, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { signOut } from "@/lib/auth/client";
import { COMMON_TIMEZONES } from "@/lib/utils/timezone";

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    timezone: string;
    theme: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone);
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.append("displayName", displayName);
      fd.append("timezone", timezone);
      fd.append("theme", theme ?? "system");
      const result = await updateUserProfile(fd);
      if ("error" in result && result.error) {
        toast.error("Failed to save settings");
        return;
      }
      toast.success("Settings saved");
      router.refresh();
    });
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500" />
              <p className="text-xs text-neutral-400">Email cannot be changed</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Timezone */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Timezone</h2>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-neutral-400">Used to show tasks on the correct calendar day</p>
          </div>
        </section>

        <Separator />

        {/* Theme */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Appearance</h2>
          </div>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`flex-1 py-2 text-sm rounded-lg border capitalize transition-colors ${
                  (theme ?? "system") === t
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
        </Button>
      </form>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Account</h2>
        <Button
          type="button"
          variant="outline"
          className="w-full text-red-500 hover:text-red-600 hover:border-red-300"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </section>
    </div>
  );
}
