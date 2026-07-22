import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CheckSquare } from "lucide-react";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session?.user) redirect("/today");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">TaskFlow</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Fast. Calm. Cross-device.</p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
