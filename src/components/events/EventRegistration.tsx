"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useEventRegistrationMutations } from "@/graphql/hooks/useEventRegistrationRSVP";
import { Event, CreateEventRegistrationInput } from "@/graphql/types/event";
import EventTypeIcon from "./EventTypeIcon";
import { format } from "date-fns";
import { paystackService } from "@/services/paystack.service";
import { useMutation, useQuery } from "@apollo/client";
import { VERIFY_AND_REGISTER_FOR_EVENT, REGISTER_FOR_FREE_EVENT } from "@/graphql/mutations/eventMutations";
import { GET_PAYMENT_SETTINGS } from "@/graphql/settings/paymentSettings";

interface EventRegistrationProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  event: Event | null;
  isPublicPage?: boolean;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  open,
  onClose,
  onSuccess,
  event,
  isPublicPage = false,
}) => {
  const { state } = useAuth();
  const user = state.user;
  const { createRegistration, loading } = useEventRegistrationMutations();
  
  // GraphQL mutations for payment verification
  const [verifyAndRegister] = useMutation(VERIFY_AND_REGISTER_FOR_EVENT);
  const [registerForFree] = useMutation(REGISTER_FOR_FREE_EVENT);

  // Fetch payment settings for the branch
  const { data: paymentSettingsData, loading: paymentSettingsLoading } = useQuery(GET_PAYMENT_SETTINGS, {
    skip: !user?.branchId,
  });
  const paymentSettings = paymentSettingsData?.paymentSettings;

  // For public pages, always treat as guest. For internal, check if user is logged in
  const [isGuest, setIsGuest] = useState(isPublicPage ? true : !user);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfGuests: 1,
    specialRequests: "",
    notes: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CARD');
  const [error, setError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load Paystack script for paid events
  useEffect(() => {
    if (!event?.isFree && event?.ticketPrice) {
      console.log(`📦 [EVENT REGISTRATION] Loading Paystack script for paid event: ${event.title}`);
      console.log(`💰 [EVENT REGISTRATION] Ticket price: ${event.currency || 'GHS'} ${event.ticketPrice}`);
      
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        console.log(`✅ [EVENT REGISTRATION] Paystack script loaded successfully`);
      };
      script.onerror = () => {
        console.error(`❌ [EVENT REGISTRATION] Failed to load Paystack script`);
      };
      document.head.appendChild(script);
    } else {
      console.log(`🆓 [EVENT REGISTRATION] Free event - no payment required`);
    }
  }, [event]);

  if (!open || !event) return null;

  const isDeadlinePassed =
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);
  const isCapacityFull =
    event.capacity && (event.eventRegistrations?.length || 0) >= event.capacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!event.registrationRequired) {
      setError("This event does not require registration");
      return;
    }

    if (isDeadlinePassed) {
      setError("Registration deadline has passed");
      return;
    }

    if (isCapacityFull) {
      setError("Event is at full capacity");
      return;
    }

    // Validate guest information
    if (isGuest && (!formData.guestName || !formData.guestEmail)) {
      setError("Guest name and email are required");
      return;
    }

    // For paid events, process payment first
    if (!event.isFree && event.ticketPrice) {
      handlePaymentAndRegistration();
    } else {
      // Free event - register directly
      await completeRegistrationFree();
    }
  };

  const handlePaymentAndRegistration = () => {
    setPaymentProcessing(true);
    
    // Validate payment settings
    if (!paymentSettings) {
      setError("Payment settings not configured. Please contact administrator.");
      setPaymentProcessing(false);
      return;
    }

    const enabledMethods = paymentSettings.enabledMethods || [];
    if (enabledMethods.length === 0) {
      setError("No payment methods configured. Please contact administrator.");
      setPaymentProcessing(false);
      return;
    }

    // Validate selected payment method is enabled
    if (!enabledMethods.includes(selectedPaymentMethod)) {
      setError(`Payment method ${selectedPaymentMethod} is not enabled.`);
      setPaymentProcessing(false);
      return;
    }
    
    const email = isGuest ? formData.guestEmail : (user?.email || "");
    const totalAmount = (event.ticketPrice || 0) * formData.numberOfGuests;
    const currency = paymentSettings.currency || "GHS";

    console.log(`🎫 [EVENT REGISTRATION] Initiating payment for event registration`);
    console.log(`📧 [EVENT REGISTRATION] User email: ${email}`);
    console.log(`💰 [EVENT REGISTRATION] Total amount: ${currency} ${totalAmount} (${formData.numberOfGuests} x ${event.ticketPrice})`);
    console.log(`💳 [EVENT REGISTRATION] Payment method: ${selectedPaymentMethod}`);
    console.log(`🌍 [EVENT REGISTRATION] Country: ${paymentSettings.country}, Currency: ${currency}`);

    try {
      paystackService.openPaystackPopup(
        {
          email,
          amount: totalAmount,
          currency: currency,
          reference: `event-${event.id}-${Date.now()}`,
          metadata: {
            eventId: event.id,
            eventTitle: event.title,
            numberOfGuests: formData.numberOfGuests,
            registrationType: isGuest ? "guest" : "member",
            paymentMethod: selectedPaymentMethod,
          },
        },
        async (response: any) => {
          // Payment successful - verify with backend
          console.log(`✅ [EVENT REGISTRATION] Payment successful!`);
          console.log(`🔗 [EVENT REGISTRATION] Payment reference: ${response.reference}`);
          
          try {
            // Verify payment and create registration on backend
            const result = await verifyAndRegister({
              variables: {
                paymentReference: response.reference,
                eventId: event.id,
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
                numberOfGuests: formData.numberOfGuests,
                specialRequests: formData.specialRequests,
              },
            });

            if (result.data?.verifyAndRegisterForEvent) {
              console.log(`✅ [EVENT REGISTRATION] Registration created successfully`);
              toast.success("Registration confirmed! Check your email for details.");
              onSuccess?.();
              onClose();
            }
          } catch (error: any) {
            console.error(`❌ [EVENT REGISTRATION] Verification failed:`, error);
            toast.error(`Registration failed: ${error.message}`);
          }
          
          setPaymentProcessing(false);
        },
        () => {
          // Payment cancelled
          console.log(`❌ [EVENT REGISTRATION] Payment cancelled by user`);
          toast.error("Payment cancelled");
          setPaymentProcessing(false);
        }
      );
    } catch (err: any) {
      setError(err.message || "Payment initialization failed");
      toast.error(err.message || "Payment initialization failed");
      setPaymentProcessing(false);
    }
  };

  /**
   * Register for free event using new backend endpoint
   */
  const completeRegistrationFree = async () => {
    try {
      console.log(`🆓 [EVENT REGISTRATION] Registering for free event`);
      
      const result = await registerForFree({
        variables: {
          eventId: event.id,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          numberOfGuests: formData.numberOfGuests,
          specialRequests: formData.specialRequests,
        },
      });

      if (result.data?.registerForFreeEvent) {
        console.log(`✅ [EVENT REGISTRATION] Free event registration successful`);
        toast.success("Registration successful! Check your email for details.");
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      console.error(`❌ [EVENT REGISTRATION] Free registration failed:`, err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Legacy registration function (kept for backward compatibility)
   */
  const completeRegistration = async (paymentReference?: string, amountPaid?: number) => {
    try {
      const registrationInput: CreateEventRegistrationInput = {
        eventId: event.id,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests || undefined,
        notes: formData.notes || undefined,
        registrationSource: isPublicPage ? "public_web" : "web",
        transactionId: paymentReference,
        amountPaid: amountPaid,
        paymentStatus: paymentReference ? "completed" : undefined,
        paymentMethod: paymentReference ? "paystack" : undefined,
      };

      if (isGuest) {
        registrationInput.guestName = formData.guestName;
        registrationInput.guestEmail = formData.guestEmail;
        registrationInput.guestPhone = formData.guestPhone || undefined;
      } else {
        if (!user?.id) {
          setError("You must be logged in to register");
          return;
        }
        registrationInput.memberId = user.id;
      }

      await createRegistration(registrationInput);
      toast.success("Registration successful!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // For public pages, render without modal wrapper
  const content = (
    <>
      {/* Header - only show in modal mode */}
      {!isPublicPage && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <EventTypeIcon
              eventType={event.eventType}
              size="lg"
              className="text-blue-600"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Event Registration
              </h2>
              <p className="text-sm text-gray-600">{event.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      )}

      {isPublicPage && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-600">
            Fill out the form below to register for this event.
          </p>
        </div>
      )}

          {/* Event Details - only show in modal mode */}
          {!isPublicPage && (
            <div className="bg-white/60 rounded-xl p-4 mb-6 border border-white/30">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Time:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "h:mm a")} -{" "}
                  {format(new Date(event.endDate || event.startDate), "h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{event.location}</span>
                </div>
              )}
              {event.capacity && (
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="font-medium">Capacity:</span>
                  <span className="ml-2">
                    {event.eventRegistrations?.length || 0} / {event.capacity}{" "}
                    registered
                  </span>
                </div>
              )}
              {!event.isFree && event.ticketPrice && (
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">Price:</span>
                  <span className="ml-2">
                    {event.currency || "$"}
                    {event.ticketPrice}
                  </span>
                </div>
              )}
              {event.registrationDeadline && (
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium">Registration Deadline:</span>
                  <span className="ml-2">
                    {format(
                      new Date(event.registrationDeadline),
                      "MMMM d, yyyy h:mm a",
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Registration Status Checks */}
          {isDeadlinePassed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-medium">
                Registration deadline has passed
              </p>
            </div>
          )}

          {isCapacityFull && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm font-medium">
                Event is at full capacity
              </p>
            </div>
          )}

          {!event.registrationRequired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-medium">
                This event does not require registration
              </p>
            </div>
          )}

          {/* Registration Form */}
          {event.registrationRequired &&
            !isDeadlinePassed &&
            !isCapacityFull && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Member/Guest Toggle - Only show for logged-in users on internal pages */}
                {user && !isPublicPage && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        checked={!isGuest}
                        onChange={() => setIsGuest(false)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Register as Member
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        checked={isGuest}
                        onChange={() => setIsGuest(true)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Register as Guest
                      </span>
                    </label>
                  </div>
                )}

                {/* Guest Information */}
                {isGuest && (
                  <div className="bg-white/60 rounded-xl p-4 border border-white/30 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Guest Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.guestName}
                          onChange={(e) =>
                            handleInputChange("guestName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            value={formData.guestEmail}
                            onChange={(e) =>
                              handleInputChange("guestEmail", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            value={formData.guestPhone}
                            onChange={(e) =>
                              handleInputChange("guestPhone", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserGroupIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Number of Attendees (including yourself)
                  </label>
                  <select
                    value={formData.numberOfGuests}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfGuests",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleInputChange("specialRequests", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dietary restrictions, accessibility needs, etc..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Payment Method Selection for Paid Events */}
                {!event.isFree && event.ticketPrice && paymentSettings && (
                  <div className="bg-white/60 rounded-xl p-4 border border-white/30 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {paymentSettings.enabledMethods?.includes('CARD') && (
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('CARD')}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedPaymentMethod === 'CARD'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">💳</div>
                          <p className="font-medium text-gray-900">Credit/Debit Card</p>
                          <p className="text-xs text-gray-500 mt-1">Visa, Mastercard</p>
                        </button>
                      )}
                      {paymentSettings.enabledMethods?.includes('MOBILE_MONEY') && (
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('MOBILE_MONEY')}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedPaymentMethod === 'MOBILE_MONEY'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">📱</div>
                          <p className="font-medium text-gray-900">Mobile Money</p>
                          <p className="text-xs text-gray-500 mt-1">MTN, Vodafone, AirtelTigo</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Summary for Paid Events */}
                {!event.isFree && event.ticketPrice && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Amount</p>
                        <p className="text-xs text-gray-500">
                          {formData.numberOfGuests} × {paymentSettings?.currency || "GHS"} {event.ticketPrice}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {paymentSettings?.currency || "GHS"} {((event.ticketPrice || 0) * formData.numberOfGuests).toFixed(2)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                      Payment will be processed securely via Paystack
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  {!isPublicPage && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || paymentProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading || paymentProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {paymentProcessing ? "Processing Payment..." : "Registering..."}
                      </>
                    ) : (
                      <>
                        {!event.isFree && event.ticketPrice ? (
                          <>
                            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                            Pay & Register
                          </>
                        ) : (
                          "Complete Registration"
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
    </>
  );

  // Wrap in modal for non-public pages
  if (isPublicPage) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl"></div>
        <div className="relative p-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
