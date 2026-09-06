"use client";

import { ProfileProvider } from "@/components/providers/ProfileProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
