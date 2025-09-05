"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { getUserNavigation } from "@/utils/navigation.utils";
import { NavigationCategory } from "./NavigationCategory";
import { useModulePreferences } from "@/hooks/useModulePreferences";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { user, primaryRole } = useAuth();
  const { enabledModules } = useModulePreferences();

  if (!user || !primaryRole) {
    return null;
  }

  const navigation = getUserNavigation(primaryRole, enabledModules);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                {/* Logo/Brand */}
                <div className="flex items-center flex-shrink-0 px-4 mb-5">
                  <h1 className="text-indigo-600 text-lg font-semibold">
                    Chapel Stack
                  </h1>
                </div>

                {/* User Info */}
                <div className="px-4 mb-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-900">
                        {user.name || user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {primaryRole.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="px-4">
                  {navigation.map((category) => (
                    <NavigationCategory
                      key={category.category}
                      category={category}
                      isMobile={true}
                      onItemClick={onClose}
                    />
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  {user.branch?.name && (
                    <p className="mb-1">Branch: {user.branch.name}</p>
                  )}
                  <p>Chapel Stack v2.0</p>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
