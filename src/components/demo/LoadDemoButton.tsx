"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { getDemoProfile } from "@/lib/demo";

interface LoadDemoButtonProps {
  redirectTo?: "/radar" | "/simulator";
  variant?: "primary" | "secondary";
  className?: string;
}

export function LoadDemoButton({
  redirectTo = "/radar",
  variant = "primary",
  className = "",
}: LoadDemoButtonProps) {
  const router = useRouter();
  const { updateProfile } = useFreelancerProfile();
  const [loaded, setLoaded] = useState(false);

  function handleLoadDemo() {
    updateProfile(getDemoProfile());
    setLoaded(true);
    router.push(redirectTo);
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleLoadDemo}
    >
      {loaded ? "Demo loaded →" : "Load demo profile →"}
    </Button>
  );
}
