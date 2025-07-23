'use client';

import { useState, useEffect } from 'react';
import { 
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  UserGroupIcon,
  MusicalNoteIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Button, Card, Title, Text, Badge } from '@tremor/react';

// List of available modules with their metadata
export const availableModules = [
  {
    id: 'core',
    title: 'Core System',
    description: 'Essential features for church management',
    icon: HomeIcon,
    color: 'indigo',
    required: true, // Core modules can't be disabled
    subModules: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Main overview of your church data',
        icon: HomeIcon,
        required: true
      },
      {
        id: 'multi-branch',
        title: 'Multi-Branch Management',
        description: 'Manage multiple church locations from a central platform',
        icon: HomeIcon,
        required: false
      },
      {
        id: 'members',
        title: 'Member Directory',
        description: 'Comprehensive member profiles and directory',
        icon: UsersIcon,
        required: false
      }
    ]
  },
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Tools to engage and manage church community',
    icon: UserGroupIcon,
    color: 'blue',
    required: false,
    subModules: [
      {
        id: 'attendance',
        title: 'Attendance Tracking',
        description: 'Track attendance for services and events',
        icon: CalendarIcon,
        required: false
      },
      {
        id: 'groups',
        title: 'Group Management',
        description: 'Create and manage small groups and ministries',
        icon: UserGroupIcon,
        required: false
      },
      {
        id: 'pastoral-care',
        title: 'Pastoral Care',
        description: 'Manage pastoral care and support for members',
        icon: HeartIcon,
        required: false
      }
    ]
  },
  {
    id: 'media',
    title: 'Media & Communication',
    description: 'Content management and communication tools',
    icon: ChatBubbleLeftRightIcon,
    color: 'violet',
    required: false,
    subModules: [
      {
        id: 'sermons',
        title: 'Sermon Archive',
        description: 'Upload and manage sermon content',
        icon: MusicalNoteIcon,
        required: false
      },
      {
        id: 'media-library',
        title: 'Media Asset Library',
        description: 'Centralized media management with transcoding',
        icon: PhotoIcon,
        required: false
      },
      {
        id: 'communication',
        title: 'Communication Tools',
        description: 'Multi-channel messaging and follow-ups',
        icon: ChatBubbleLeftRightIcon,
        required: false
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    description: 'Administrative tools for church operations',
    icon: CurrencyDollarIcon,
    color: 'emerald',
    required: false,
    subModules: [
      {
        id: 'events',
        title: 'Calendar & Events',
        description: 'Event management with room booking',
        icon: CalendarIcon,
        required: false
      },
      {
        id: 'volunteers',
        title: 'Volunteer Management',
        description: 'Volunteer recruiting, scheduling, and tracking',
        icon: UsersIcon,
        required: false
      },
      {
        id: 'finances',
        title: 'Finances',
        description: 'Donation tracking and financial management',
        icon: CurrencyDollarIcon,
        required: false
      },
      {
        id: 'branch-finances',
        title: 'Branch Finances',
        description: 'Branch-level bookkeeping for collections, tithes, pledges, and more.',
        icon: CurrencyDollarIcon,
        required: false
      },
      {
        id: 'security',
        title: 'Security & Access Control',
        description: 'Role-based permissions and audit logging',
        icon: ShieldCheckIcon,
        required: false
      },
      {
        id: 'workflows',
        title: 'Workflow Automation',
        description: 'Automate church management tasks with intelligent workflows',
        icon: BoltIcon,
        required: false
      }
    ]
  },
  {
    id: 'integration',
    title: 'Integration',
    description: 'Connect with mobile and web platforms',
    icon: DevicePhoneMobileIcon,
    color: 'cyan',
    required: false,
    subModules: [
      {
        id: 'mobile',
        title: 'Mobile App Integration',
        description: 'Access your system via mobile devices',
        icon: DevicePhoneMobileIcon,
        required: false
      },
      {
        id: 'website',
        title: 'Website Integration',
        description: 'Sync content with your church website',
        icon: GlobeAltIcon,
        required: false
      }
    ]
  }
];

// Type definitions for module selection
interface SubModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  required: boolean;
  subModules: SubModule[];
}

interface ModuleSelectionProps {
  onModulesSelected: (modules: string[]) => void;
  initialSelectedModules?: string[];
}

export default function ModuleSelection({ onModulesSelected, initialSelectedModules = [] }: ModuleSelectionProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>(initialSelectedModules);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // Initialize with required modules
  useEffect(() => {
    const initialModules: string[] = [];
    
    availableModules.forEach(module => {
      if (module.required) {
        initialModules.push(module.id);
        
        module.subModules.forEach(subModule => {
          if (subModule.required) {
            initialModules.push(subModule.id);
          }
        });
      }
    });
    
    setSelectedModules(initialModules);
  }, []);
  
  // Toggle a module selection
  const toggleModule = (moduleId: string, required: boolean = false) => {
    if (required) return; // Can't toggle required modules
    
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };
  
  // Check if a module is selected
  const isModuleSelected = (moduleId: string) => {
    return selectedModules.includes(moduleId);
  };
  
  // Toggle expanded module for viewing submodules
  const toggleExpandModule = (moduleId: string) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };
  
  // Toggle all submodules of a module
  const toggleAllSubModules = (module: Module) => {
    const nonRequiredSubModules = module.subModules
      .filter(subModule => !subModule.required)
      .map(subModule => subModule.id);
    
    // Check if all submodules are already selected
    const allSelected = nonRequiredSubModules.every(id => selectedModules.includes(id));
    
    if (allSelected) {
      // Remove all non-required submodules
      setSelectedModules(selectedModules.filter(id => 
        !nonRequiredSubModules.includes(id)
      ));
    } else {
      // Add all non-required submodules
      const newSelectedModules = [...selectedModules];
      
      nonRequiredSubModules.forEach(id => {
        if (!newSelectedModules.includes(id)) {
          newSelectedModules.push(id);
        }
      });
      
      setSelectedModules(newSelectedModules);
    }
  };
  
  // Calculate how many submodules are selected in a module
  const getSelectedSubModuleCount = (module: Module) => {
    return module.subModules.filter(subModule => 
      selectedModules.includes(subModule.id)
    ).length;
  };
  
  // This function is now called directly from the parent component
  useEffect(() => {
    // Update the parent component whenever selection changes
    onModulesSelected(selectedModules);
  }, [selectedModules, onModulesSelected]);
  
  // Initialize component with selected modules
  useEffect(() => {
    if (initialSelectedModules.length > 0) {
      setSelectedModules(initialSelectedModules);
    }
  }, [initialSelectedModules]);
  
  // Select all modules
  const selectAllModules = () => {
    const allModuleIds: string[] = [];
    
    availableModules.forEach(module => {
      allModuleIds.push(module.id);
      
      module.subModules.forEach(subModule => {
        allModuleIds.push(subModule.id);
      });
    });
    
    setSelectedModules(allModuleIds);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Title className="text-3xl font-bold text-gray-900 mb-2">
          Customize Your Church Management System
        </Title>
        <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the modules and features you need for your church. You can always update your selections later.
        </Text>
      </div>
      
      <div className="flex justify-end mb-4 space-x-2">
        <Button
          variant="light"
          onClick={selectAllModules}
        >
          Select All Features
        </Button>
      </div>
      
      <div className="space-y-4">
        {availableModules.map((module) => (
          <Card key={module.id} className={`overflow-hidden border-l-4 border-${module.color}-500 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpandModule(module.id)}>
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-${module.color}-100`}>
                  <module.icon className={`h-6 w-6 text-${module.color}-600`} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Title className="text-xl font-semibold">{module.title}</Title>
                    {module.required && (
                      <Badge color="green" size="sm">Required</Badge>
                    )}
                  </div>
                  <Text className="text-gray-600">{module.description}</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {getSelectedSubModuleCount(module)}/{module.subModules.length} Features
                </div>
                <ChevronRightIcon 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedModule === module.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>
            </div>
            
            {expandedModule === module.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-3">
                  <Text className="text-sm font-medium text-gray-500">Select features to enable</Text>
                  <Button 
                    variant="light" 
                    size="xs"
                    onClick={() => toggleAllSubModules(module)}
                  >
                    {module.subModules.every(subModule => 
                      isModuleSelected(subModule.id) || subModule.required
                    ) 
                      ? 'Deselect All' 
                      : 'Select All'
                    }
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.subModules.map((subModule) => (
                    <div 
                      key={subModule.id}
                      className={`p-3 rounded-lg border ${
                        isModuleSelected(subModule.id) 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'bg-gray-50 border-gray-200'
                      } cursor-pointer hover:bg-indigo-50 transition-colors`}
                      onClick={() => toggleModule(subModule.id, subModule.required)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <subModule.icon className={`h-5 w-5 ${
                            isModuleSelected(subModule.id) ? 'text-indigo-600' : 'text-gray-500'
                          }`} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <Text className="font-medium">{subModule.title}</Text>
                              {subModule.required && (
                                <Badge color="green" size="xs">Required</Badge>
                              )}
                            </div>
                            <Text className="text-xs text-gray-600">{subModule.description}</Text>
                          </div>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isModuleSelected(subModule.id) 
                            ? 'text-indigo-600' 
                            : 'text-gray-300'
                        }`}>
                          {isModuleSelected(subModule.id) ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      {/* Button removed - functionality moved to parent component */}
    </div>
  );
}
