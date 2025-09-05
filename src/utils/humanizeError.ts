// Utility to humanize backend error messages for CreateSuperAdminUser and related mutations
export function humanizeError(error: string): string {
  if (!error) return "An unexpected error occurred.";

  // GraphQL input validation errors (field missing, wrong type, etc)
  if (
    error.match(/Field \"(.*?)\" of required type \"(.*?)\" was not provided\./)
  ) {
    const match = error.match(
      /Field \"(.*?)\" of required type \"(.*?)\" was not provided\./,
    );
    if (match) {
      const field = match[1];
      return `The field "${field}" is required.`;
    }
  }
  if (error.match(/Field \"(.*?)\" is not defined by type/)) {
    const match = error.match(/Field \"(.*?)\" is not defined by type/);
    if (match) {
      const field = match[1];
      return `The field "${field}" is not valid for this operation.`;
    }
  }

  // Common backend errors
  if (error.includes("Unique constraint failed") && error.includes("email")) {
    return "A user with this email already exists.";
  }
  if (error.toLowerCase().includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (error.toLowerCase().includes("password")) {
    return "Password does not meet requirements.";
  }
  if (error.toLowerCase().includes("network")) {
    return "Network error. Please check your internet connection.";
  }
  if (error.toLowerCase().includes("organisation")) {
    return "There was a problem with your organisation details.";
  }
  // Add additional cases for member creation errors if needed
  // Example: if (error.toLowerCase().includes('duplicate phone')) return 'A user with this phone number already exists.';
  // Default fallback
  return error.replace("GraphQL error: ", "").replace("Error: ", "");
}
