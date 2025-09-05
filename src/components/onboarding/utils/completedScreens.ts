// Utility for onboarding completed screens tracking
export const COMPLETED_SCREENS_KEY = "onboarding_completed_screens";
export function getCompletedScreens(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_SCREENS_KEY) || "[]");
  } catch {
    return [];
  }
}
export function markScreenCompleted(screen: string) {
  const screens = getCompletedScreens();
  if (!screens.includes(screen)) {
    screens.push(screen);
    localStorage.setItem(COMPLETED_SCREENS_KEY, JSON.stringify(screens));
  }
}
