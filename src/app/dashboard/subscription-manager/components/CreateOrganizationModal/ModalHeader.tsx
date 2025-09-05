import React from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { WizardStep } from "./types";

interface ModalHeaderProps {
  currentStep: number;
  wizardSteps: WizardStep[];
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  currentStep,
  wizardSteps,
  onClose,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-xl text-white px-8 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <motion.div
                className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <SparklesIcon className="w-7 h-7" />
              </motion.div>
              Create New Organization
            </h2>
            <motion.p 
              className="text-blue-100 mt-2 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {wizardSteps[currentStep].description}
            </motion.p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl p-3 backdrop-blur-sm"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
        
        {/* Modern Progress Bar */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-100">
              Step {currentStep + 1} of {wizardSteps.length}
            </span>
            <span className="text-sm font-medium text-blue-100">
              {Math.round(((currentStep + 1) / wizardSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-white to-blue-100 rounded-full h-3 shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
        
        {/* Modern Step Indicators */}
        <motion.div 
          className="flex justify-between mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {wizardSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-white/90 text-blue-600 shadow-md'
                      : 'bg-white/20 text-white/70 border border-white/30'
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircleIcon className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                  isActive ? 'text-white' : isCompleted ? 'text-blue-200' : 'text-blue-300'
                }`}>
                  {step.title.split(' ')[0]}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
