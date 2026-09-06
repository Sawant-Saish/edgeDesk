"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadProfile, saveProfile } from "@/lib/storage";
import { DEFAULT_PROFILE, type FreelancerProfile } from "@/lib/types";

type Listener = () => void;

let listeners: Listener[] = [];
let cachedProfile: FreelancerProfile | null = null;

function getSnapshot(): FreelancerProfile {
  if (cachedProfile === null) {
    cachedProfile = loadProfile();
  }
  return cachedProfile;
}

function getServerSnapshot(): FreelancerProfile {
  return DEFAULT_PROFILE;
}

function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setProfileState(next: FreelancerProfile): void {
  cachedProfile = next;
  saveProfile(next);
  emitChange();
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useFreelancerProfile() {
  const profile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateProfile = useCallback((patch: Partial<FreelancerProfile>) => {
    setProfileState({ ...getSnapshot(), ...patch });
  }, []);

  const resetProfile = useCallback(() => {
    setProfileState(DEFAULT_PROFILE);
  }, []);

  return {
    profile,
    hydrated: true,
    updateProfile,
    resetProfile,
  };
}
