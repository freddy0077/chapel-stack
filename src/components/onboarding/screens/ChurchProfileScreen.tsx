"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@tremor/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { ChurchProfile } from "../ModulePreferences";
import { useCreateOrganisation } from "@/graphql/hooks/useOrganisation";
import { saveOnboardingStepData } from "../utils/onboardingStorage";
import { DateTime } from "luxon";
import { markScreenCompleted } from "../utils/completedScreens";
import { humanizeError } from "@/utils/humanizeError";

interface ChurchProfileScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  churchProfile: ChurchProfile;
  setChurchProfile: (profile: ChurchProfile) => void;
}

/**
 * Church profile setup component for the onboarding flow
 * Collects information about the church organization
 */
const ChurchProfileScreen = ({
  onNext,
  onBack,
  onSkip,
  isLoading,
  churchProfile,
  setChurchProfile,
}: ChurchProfileScreenProps) => {
  // Use all Organisation model fields for the form
  const [localOrganisation, setLocalOrganisation] = useState(() => ({
    name: churchProfile?.name || "",
    email: churchProfile?.email || "",
    phoneNumber: churchProfile?.phoneNumber || "",
    website: churchProfile?.website || "",
    address: churchProfile?.address || "",
    city: churchProfile?.city || "",
    state: churchProfile?.state || "",
    country: churchProfile?.country || "",
    zipCode: churchProfile?.zipCode || "",
    missionStatement: churchProfile?.missionStatement || "",
    description: churchProfile?.description || "",
    tertiaryColor: churchProfile?.tertiaryColor || "",
  }));

  // Log the initial state for debugging
  useEffect(() => {}, [churchProfile, localOrganisation]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Log the field change for debugging

    // Update local state
    const updatedOrganisation = {
      ...localOrganisation,
      [name]: value,
    };

    setLocalOrganisation(updatedOrganisation);

    // Immediately update parent state as well for each change
    // This ensures parent always has the latest values
    setChurchProfile(updatedOrganisation);
  };

  const { createOrganisation, loading: mutationLoading } =
    useCreateOrganisation();
  const [isSaving, setIsSaving] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // When preparing the payload for submission, ensure empty strings are omitted for optional fields
  const normaliseProfile = (profile) => {
    const result = { ...profile };
    if (!result.email || result.email.trim() === "") {
      delete result.email;
    }
    if (!result.website || result.website.trim() === "") {
      delete result.website;
    }
    return result;
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    // Validate required fields
    if (!localOrganisation.name) {
      alert("Please fill all required fields (Church Name)");
      return;
    }

    // E.164 phone validation and normalization
    let phoneNumber = localOrganisation.phoneNumber?.trim() || "";
    if (phoneNumber && !phoneNumber.startsWith("+")) {
      // Attempt to prepend country code if country is Ghana
      if (
        localOrganisation.country === "Ghana" &&
        /^\d{9,10}$/.test(phoneNumber)
      ) {
        phoneNumber = "+233" + phoneNumber.replace(/^0/, "");
      } else {
        alert(
          "Phone number must be in international E.164 format (e.g., +1234567890).",
        );
        return;
      }
    }
    const phoneRegex = /^\+\d{7,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      alert(
        "Phone number must be in international E.164 format (e.g., +1234567890).",
      );
      return;
    }
    // Assign normalized phone number back
    localOrganisation.phoneNumber = phoneNumber;

    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)?(\/)?$/;
    if (
      localOrganisation.website &&
      !urlRegex.test(localOrganisation.website)
    ) {
      alert("Please enter a valid website URL");
      return;
    }

    setIsSaving(true);
    setBackendError(null);
    try {
      // Prepare input: remove tertiaryColor, leave size as string
      const orgInput = normaliseProfile({ ...localOrganisation });
      delete orgInput.tertiaryColor;
      // Call mutation
      const response = await createOrganisation({
        variables: {
          input: orgInput, // Use cleaned input
        },
      });
      const orgId = response?.data?.createOrganisation?.id;
      if (orgId) {
        localStorage.setItem("organisation_id", orgId);
      }
      saveOnboardingStepData("ChurchProfile", {
        churchName: localOrganisation.name,
        address: localOrganisation.address,
        phone: localOrganisation.phoneNumber,
        email: localOrganisation.email,
      });
      // FIX: Mark screen completed before calling onNext to ensure onboarding state is up to date
      markScreenCompleted("ChurchProfile");
      setTimeout(() => {
        setIsSaving(false);
        setSuccess(true);
        if (onNext) onNext();
      }, 100);
    } catch (error) {
      // Show backend error if available
      let gqlError = "An error occurred";
      if (
        error &&
        typeof error === "object" &&
        "graphQLErrors" in error &&
        Array.isArray((error as any).graphQLErrors)
      ) {
        gqlError =
          (error as any).graphQLErrors[0]?.message ||
          (error as any).message ||
          "An error occurred";
      } else if (error instanceof Error) {
        gqlError = error.message;
      }
      setBackendError(humanizeError(gqlError));
      setIsSaving(false);
    }
  };

  // Mark completed on success
  useEffect(() => {
    if (success) {
      markScreenCompleted("ChurchProfile");
    }
  }, [success]);

  // Country select options (can be moved to a separate util or constants file)
  const countryOptions = [
    "",
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Ghana",
    "Nigeria",
    "South Africa",
    "Kenya",
    "Germany",
    "France",
    "India",
    "China",
    "Japan",
    "Brazil",
    "Mexico",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Switzerland",
    "New Zealand",
    "Ireland",
    "Singapore",
    "Malaysia",
    "Philippines",
    "South Korea",
    "Indonesia",
    "Turkey",
    "Egypt",
    "Morocco",
    "UAE",
    "Saudi Arabia",
    "Israel",
    "Pakistan",
    "Bangladesh",
    "Poland",
    "Russia",
    "Ukraine",
    "Argentina",
    "Chile",
    "Colombia",
    "Peru",
    "Venezuela",
    "Thailand",
    "Vietnam",
    "Other",
  ];

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {backendError && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 max-w-md w-full text-center border border-red-300">
          {backendError.replace("'", "&apos;")}
        </div>
      )}
      <div className="mb-8 text-center w-full max-w-screen-md">
        <div className="flex flex-col items-center justify-center mb-3">
          <span className="bg-indigo-100 rounded-full p-4 mb-2 flex items-center justify-center">
            <HomeModernIcon
              className="h-10 w-10 text-indigo-600"
              aria-hidden="true"
            />
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {" "}
            Let&apos;s Set Up Your Organisation
          </h2>
          <p className="text-gray-600 text-base max-w-xl">
            Help us get to know your church. This information personalizes your
            experience and helps you get the most out of the platform.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-screen-md mx-auto">
        <div className="transition-all duration-300 shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-100 to-white relative">
          <div className="bg-gradient-to-r from-indigo-500/80 to-indigo-400/80 text-white rounded-t-2xl px-6 py-4 flex items-center gap-3">
            <span className="font-bold text-lg">Organisation Set Up</span>
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">
                    Church Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={localOrganisation.name || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Church Name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={localOrganisation.phoneNumber || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="e.g. +233501234567"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={localOrganisation.website || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Website (optional)"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={localOrganisation.address || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={localOrganisation.description || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Brief description of your church"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">
                    Mission Statement
                  </label>
                  <textarea
                    name="missionStatement"
                    value={localOrganisation.missionStatement || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Mission Statement"
                    rows={3}
                  />
                </div>
              </div>
              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={localOrganisation.city || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region</label>
                  <select
                    name="state"
                    value={localOrganisation.state || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    required
                  >
                    <option value="">Select region</option>
                    <option value="Ahafo">Ahafo</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Bono">Bono</option>
                    <option value="Bono East">Bono East</option>
                    <option value="Central">Central</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="North East">North East</option>
                    <option value="Northern">Northern</option>
                    <option value="Oti">Oti</option>
                    <option value="Savannah">Savannah</option>
                    <option value="Upper East">Upper East</option>
                    <option value="Upper West">Upper West</option>
                    <option value="Volta">Volta</option>
                    <option value="Western">Western</option>
                    <option value="Western North">Western North</option>
                  </select>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 gap-2">
                <Button
                  color="gray"
                  icon={ArrowLeftIcon}
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
                {onSkip && (
                  <Button color="gray" onClick={onSkip} disabled={isLoading}>
                    Skip
                  </Button>
                )}
                <Button
                  type="submit"
                  color="indigo"
                  loading={isSaving || mutationLoading}
                  disabled={isSaving || mutationLoading}
                  icon={ArrowRightIcon}
                >
                  Save & Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchProfileScreen;
