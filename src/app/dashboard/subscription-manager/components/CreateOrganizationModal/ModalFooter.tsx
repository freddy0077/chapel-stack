import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { WizardStep } from "./types";

interface ModalFooterProps {
  currentStep: number;
  wizardSteps: WizardStep[];
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  currentStep,
  wizardSteps,
  isLoading,
  onBack,
  onNext,
}) => {
  return (
    <motion.div 
      className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm px-8 py-6 flex items-center justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center gap-3 text-sm font-medium text-gray-600"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-xl backdrop-blur-sm border border-gray-200/50">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Step {currentStep + 1} of {wizardSteps.length}</span>
        </div>
        <span className="text-gray-400">•</span>
        <span className="text-gray-700 font-semibold">{wizardSteps[currentStep].title}</span>
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-gray-300/50 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:border-gray-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </motion.div>
        
        {currentStep === wizardSteps.length - 1 ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <motion.div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Create Organization
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Next Step
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
