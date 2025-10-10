"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { UPDATE_USER_PASSWORD } from "@/graphql/subscription-management";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  organizationName: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  userId,
  userName,
  organizationName,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [updatePassword, { loading }] = useMutation(UPDATE_USER_PASSWORD, {
    onCompleted: (data) => {
      if (data.updateUserPassword.success) {
        toast.success("Password Updated", {
          description: `Password for ${userName} has been updated successfully.`,
        });
        handleClose();
      }
    },
    onError: (error) => {
      toast.error("Password Update Failed", {
        description: error.message || "Failed to update password. Please try again.",
      });
    },
  });

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (value) {
      setValidationErrors(validatePassword(value));
    } else {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      toast.error("Validation Error", {
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Validation Error", {
        description: "Passwords do not match.",
      });
      return;
    }

    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      toast.error("Validation Error", {
        description: errors[0],
      });
      return;
    }

    // Execute mutation
    await updatePassword({
      variables: {
        userId,
        newPassword,
      },
    });
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setValidationErrors([]);
    onClose();
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: "", color: "", width: "0%" };
    
    const errors = validatePassword(password);
    const score = 5 - errors.length;
    
    if (score <= 1) return { strength: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 2) return { strength: "Fair", color: "bg-orange-500", width: "50%" };
    if (score === 3) return { strength: "Good", color: "bg-yellow-500", width: "75%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <LockClosedIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Change Password</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Update password for <span className="font-semibold">{userName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Organization Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">Organization</p>
          <p className="text-sm font-medium text-gray-900">{organizationName}</p>
        </div>

        <div className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength === "Strong" ? "text-green-600" :
                    passwordStrength.strength === "Good" ? "text-yellow-600" :
                    passwordStrength.strength === "Fair" ? "text-orange-600" :
                    "text-red-600"
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-1">Password Requirements:</p>
                    <ul className="text-xs text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {newPassword && validationErrors.length === 0 && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Password meets all requirements</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className={`flex items-center space-x-2 text-sm ${
                newPassword === confirmPassword ? "text-green-600" : "text-red-600"
              }`}>
                {newPassword === confirmPassword ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <span>Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || validationErrors.length > 0 || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
