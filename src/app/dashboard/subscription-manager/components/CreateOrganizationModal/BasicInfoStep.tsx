import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { StepProps } from "./types";
import { COUNTRY_CODES } from "./countryCodes";

export const BasicInfoStep: React.FC<StepProps> = ({
  organizationData,
  errors,
  updateField,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <div className="relative">
            <Label htmlFor="name" className="text-sm font-bold text-gray-800 flex items-center gap-3 mb-3">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <BuildingOfficeIcon className="w-4 h-4" />
              </motion.div>
              Organization Name *
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="name"
                value={organizationData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your organization name"
                className={`h-12 px-4 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  errors.name 
                    ? "border-red-400 focus:border-red-500 bg-red-50/50" 
                    : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                }`}
              />
            </motion.div>
            {errors.name && (
              <motion.p 
                className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.name}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="relative">
            <Label htmlFor="email" className="text-sm font-bold text-gray-800 flex items-center gap-3 mb-3">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <EnvelopeIcon className="w-4 h-4" />
              </motion.div>
              Email Address *
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="email"
                type="email"
                value={organizationData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="contact@organization.com"
                className={`h-12 px-4 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                  errors.email 
                    ? "border-red-400 focus:border-red-500 bg-red-50/50" 
                    : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                }`}
              />
            </motion.div>
            {errors.email && (
              <motion.p 
                className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.email}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="relative">
            <Label htmlFor="phone" className="text-sm font-bold text-gray-800 flex items-center gap-3 mb-3">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PhoneIcon className="w-4 h-4" />
              </motion.div>
              Phone Number
            </Label>
            <div className="flex gap-3">
              <motion.div
                className="w-32"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  value={organizationData.phoneCountryCode}
                  onValueChange={(value) => updateField("phoneCountryCode", value)}
                >
                  <SelectTrigger className={`h-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                    errors.phoneNumber 
                      ? "border-red-400 focus:border-red-500 bg-red-50/50" 
                      : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                  }`}>
                    <SelectValue>
                      {COUNTRY_CODES.find(c => c.dialCode === organizationData.phoneCountryCode)?.flag} {organizationData.phoneCountryCode}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.dialCode}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.dialCode}</span>
                          <span className="text-sm text-gray-500">{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                className="flex-1"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  id="phone"
                  value={organizationData.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  placeholder="24 123 4567"
                  className={`h-12 px-4 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                    errors.phoneNumber 
                      ? "border-red-400 focus:border-red-500 bg-red-50/50" 
                      : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                  }`}
                />
              </motion.div>
            </div>
            {errors.phoneNumber && (
              <motion.p 
                className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                {errors.phoneNumber}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div className="md:col-span-2" variants={itemVariants}>
          <div className="relative">
            <Label htmlFor="website" className="text-sm font-bold text-gray-800 flex items-center gap-3 mb-3">
              <motion.div 
                className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <GlobeAltIcon className="w-4 h-4" />
              </motion.div>
              Website
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="website"
                value={organizationData.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://www.organization.com"
                className="h-12 px-4 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 hover:border-blue-300 transition-all duration-200"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
