// Module preferences manager to store and retrieve selected modules
// This will be used to customize the menu based on user selections

export interface ChurchProfile {
  // Core fields (required)
  name: string;
  branches: number;
  size: string;

  // Branch setup fields (match InitialBranchSetupInput)
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string; // Changed from phone to phoneNumber to match API
  email?: string;
  website?: string;
  timezone?: string;
  currency?: string;

  // Church-specific fields
  denomination?: string;
  foundingYear?: number;

  // Initial settings fields (match InitialSettingsInput)
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  fontFamily?: string;

  // Vision and mission
  missionStatement?: string;
  vision?: string;
}

// Save module preferences to localStorage
export const saveModulePreferences = (
  selectedModules: string[],
  churchProfile: ChurchProfile,
) => {
  try {
    // Store selected modules
    localStorage.setItem("selectedModules", JSON.stringify(selectedModules));

    // Store church profile
    localStorage.setItem("churchProfile", JSON.stringify(churchProfile));

    // Mark onboarding as completed
    localStorage.setItem("onboardingCompleted", "true");

    return true;
  } catch (error) {
    console.error("Error saving module preferences:", error);
    return false;
  }
};

// Load module preferences from localStorage
export const loadModulePreferences = () => {
  try {
    // Get selected modules
    const modulesJson = localStorage.getItem("selectedModules");
    const selectedModules = modulesJson ? JSON.parse(modulesJson) : [];

    // Get church profile
    const profileJson = localStorage.getItem("churchProfile");
    const churchProfile = profileJson ? JSON.parse(profileJson) : null;

    return {
      selectedModules,
      churchProfile,
      isOnboardingCompleted:
        localStorage.getItem("onboardingCompleted") === "true",
    };
  } catch (error) {
    console.error("Error loading module preferences:", error);
    return {
      selectedModules: [],
      churchProfile: null,
      isOnboardingCompleted: false,
    };
  }
};

// Reset module preferences (for testing or admin purposes)
export const resetModulePreferences = () => {
  try {
    localStorage.removeItem("selectedModules");
    localStorage.removeItem("churchProfile");
    localStorage.removeItem("onboardingCompleted");
    return true;
  } catch (error) {
    console.error("Error resetting module preferences:", error);
    return false;
  }
};

// Check if a specific module is enabled
export const isModuleEnabled = (moduleId: string): boolean => {
  // The core dashboard is always enabled, regardless of selection.
  if (moduleId === "dashboard") {
    return true;
  }

  try {
    // Load the user's actual selections from localStorage.
    const { selectedModules } = loadModulePreferences();
    const isEnabled = selectedModules.includes(moduleId);

    // Return true if the moduleId is in the array of selected modules.
    return isEnabled;
  } catch (error) {
    console.error(`Error checking if module '${moduleId}' is enabled:`, error);
    // Default to false in case of an error.
    return false;
  }
};
