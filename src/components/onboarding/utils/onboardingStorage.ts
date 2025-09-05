// Utility for onboarding data tracking

export function saveOnboardingStepData(step: string, data: unknown) {
  try {
    localStorage.setItem(`onboardingStepData_${step}`, JSON.stringify(data));
  } catch {}
}

export function loadOnboardingStepData(step: string) {
  try {
    const raw = localStorage.getItem(`onboardingStepData_${step}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadAllOnboardingStepData(steps: string[]) {
  const result: Record<string, unknown> = {};
  steps.forEach((step) => {
    result[step] = loadOnboardingStepData(step);
  });
  return result;
}

export function clearAllOnboardingStepData(steps: string[]) {
  steps.forEach((step) => {
    localStorage.removeItem(`onboardingStepData_${step}`);
  });
}
