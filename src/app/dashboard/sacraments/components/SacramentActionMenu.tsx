"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  HandRaisedIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface SacramentActionMenuProps {
  onBaptismClick: () => void;
  onCommunionClick: () => void;
  onConfirmationClick: () => void;
  onMarriageClick: () => void;
  onReconciliationClick: () => void;
  onAnointingClick: () => void;
  onDiaconateClick: () => void;
  onPriesthoodClick: () => void;
  onRciaClick: () => void;
}

const sacramentOptions = [
  {
    name: "Baptism",
    icon: SparklesIcon,
    color: "blue",
    description: "Sacrament of initiation",
    handler: "onBaptismClick",
  },
  {
    name: "First Communion",
    icon: GiftIcon,
    color: "amber",
    description: "First reception of Eucharist",
    handler: "onCommunionClick",
  },
  {
    name: "Confirmation",
    icon: HeartIcon,
    color: "purple",
    description: "Strengthening of faith",
    handler: "onConfirmationClick",
  },
  {
    name: "Marriage",
    icon: UserGroupIcon,
    color: "rose",
    description: "Sacrament of matrimony",
    handler: "onMarriageClick",
  },
  {
    name: "First Reconciliation",
    icon: ShieldCheckIcon,
    color: "green",
    description: "Sacrament of penance",
    handler: "onReconciliationClick",
  },
  {
    name: "Anointing of the Sick",
    icon: HandRaisedIcon,
    color: "indigo",
    description: "Healing sacrament",
    handler: "onAnointingClick",
  },
  {
    name: "Diaconate Ordination",
    icon: AcademicCapIcon,
    color: "violet",
    description: "Ordination to diaconate",
    handler: "onDiaconateClick",
  },
  {
    name: "Priesthood Ordination",
    icon: AcademicCapIcon,
    color: "violet",
    description: "Ordination to priesthood",
    handler: "onPriesthoodClick",
  },
  {
    name: "RCIA Initiation",
    icon: BookOpenIcon,
    color: "teal",
    description: "Adult initiation program",
    handler: "onRciaClick",
  },
];

export default function SacramentActionMenu({
  onBaptismClick,
  onCommunionClick,
  onConfirmationClick,
  onMarriageClick,
  onReconciliationClick,
  onAnointingClick,
  onDiaconateClick,
  onPriesthoodClick,
  onRciaClick,
}: SacramentActionMenuProps) {
  const handlerMap = {
    onBaptismClick,
    onCommunionClick,
    onConfirmationClick,
    onMarriageClick,
    onReconciliationClick,
    onAnointingClick,
    onDiaconateClick,
    onPriesthoodClick,
    onRciaClick,
  };

  return (
    <div className="mt-6 sm:mt-0 flex flex-wrap gap-3 justify-start sm:justify-end">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200 transition-all duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Sacrament Record
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Create New Record
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Select a sacrament type to create a new record
                </p>
              </div>

              {/* Core Sacraments */}
              <div className="px-2 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                  Core Sacraments
                </div>
                {sacramentOptions.slice(0, 4).map((sacrament) => {
                  const Icon = sacrament.icon;
                  const handler =
                    handlerMap[sacrament.handler as keyof typeof handlerMap];

                  return (
                    <Menu.Item key={sacrament.name}>
                      {({ active }) => (
                        <button
                          onClick={handler}
                          className={`${
                            active
                              ? `bg-${sacrament.color}-50 text-${sacrament.color}-900`
                              : "text-gray-700"
                          } flex items-center px-3 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <Icon
                            className={`h-5 w-5 mr-3 text-${sacrament.color}-600`}
                          />
                          <div>
                            <div className="font-medium">{sacrament.name}</div>
                            <div className="text-xs text-gray-500">
                              {sacrament.description}
                            </div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>

              {/* Additional Sacraments */}
              <div className="px-2 py-2 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1">
                  Additional Sacraments
                </div>
                {sacramentOptions.slice(4).map((sacrament) => {
                  const Icon = sacrament.icon;
                  const handler =
                    handlerMap[sacrament.handler as keyof typeof handlerMap];

                  return (
                    <Menu.Item key={sacrament.name}>
                      {({ active }) => (
                        <button
                          onClick={handler}
                          className={`${
                            active
                              ? `bg-${sacrament.color}-50 text-${sacrament.color}-900`
                              : "text-gray-700"
                          } flex items-center px-3 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <Icon
                            className={`h-5 w-5 mr-3 text-${sacrament.color}-600`}
                          />
                          <div>
                            <div className="font-medium">{sacrament.name}</div>
                            <div className="text-xs text-gray-500">
                              {sacrament.description}
                            </div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
