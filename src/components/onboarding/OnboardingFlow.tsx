'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
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
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Title, Text } from '@tremor/react';

// Define the onboarding steps based on README categories
const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your Church Management System',
    description: 'A comprehensive platform designed to streamline administrative tasks, improve member engagement, and enhance ministry operations across multiple church branches.',
    image: '/images/onboarding/welcome.svg',
    icon: HomeIcon,
    color: 'blue'
  },
  // Core System Features
  {
    id: 'multi-branch',
    title: 'Multi-Branch Management',
    description: 'Manage multiple church locations from a single platform with branch-specific dashboards, permissions, and navigation.',
    features: [
      'Branch-specific dashboards',
      'Easy navigation between locations',
      'Customized branch permissions'
    ],
    image: '/images/onboarding/branches.svg',
    icon: HomeIcon,
    color: 'blue',
    category: 'Core System Features'
  },
  {
    id: 'member-directory',
    title: 'Member Directory',
    description: 'Comprehensive member profiles with family mapping, communication preferences, and custom fields.',
    features: [
      'Create and edit member profiles',
      'Map family relationships',
      'Set communication preferences',
      'Custom member data fields'
    ],
    image: '/images/onboarding/members.svg',
    icon: UsersIcon,
    color: 'green',
    category: 'Core System Features'
  },
  {
    id: 'attendance',
    title: 'Attendance Tracking',
    description: 'Track attendance for services and events with powerful reporting tools and check-in systems.',
    features: [
      'Service and event attendance recording',
      'Child check-in/out system',
      'Attendance reports and trends'
    ],
    image: '/images/onboarding/attendance.svg',
    icon: CalendarIcon,
    color: 'amber',
    category: 'Core System Features'
  },
  {
    id: 'groups',
    title: 'Group Management',
    description: 'Create and manage small groups, assign leaders, and track attendance and communication.',
    features: [
      'Small group creation and management',
      'Leader assignment tools',
      'Group attendance tracking',
      'Group communication system'
    ],
    image: '/images/onboarding/groups.svg',
    icon: UserGroupIcon,
    color: 'indigo',
    category: 'Core System Features'
  },
  // Media & Communication
  {
    id: 'sermons',
    title: 'Sermon Archive',
    description: 'Upload, manage, and deliver sermon content including video, audio, and notes.',
    features: [
      'Sermon media upload and categorization',
      'Series and speaker organization',
      'Streaming and download options'
    ],
    image: '/images/onboarding/sermons.svg',
    icon: MusicalNoteIcon,
    color: 'rose',
    category: 'Media & Communication'
  },
  {
    id: 'media-library',
    title: 'Media Asset Library',
    description: 'Centralized media management with automatic transcoding and organization features.',
    features: [
      'Centralized media storage',
      'Automatic media transcoding',
      'Asset tagging and organization',
      'Branch-specific media access'
    ],
    image: '/images/onboarding/media-library.svg',
    icon: PhotoIcon,
    color: 'purple',
    category: 'Media & Communication'
  },
  {
    id: 'communication',
    title: 'Communication Tools',
    description: 'Multi-channel messaging with targeting, templates, and automated follow-ups.',
    features: [
      'Email, SMS, and app messaging',
      'Audience targeting',
      'Communication templates',
      'Automated follow-up sequences'
    ],
    image: '/images/onboarding/communication.svg',
    icon: ChatBubbleLeftRightIcon,
    color: 'cyan',
    category: 'Media & Communication'
  },
  // Administration
  {
    id: 'events',
    title: 'Calendar & Events',
    description: 'Create, manage, and track events with registration, room booking, and attendance features.',
    features: [
      'Event creation and registration',
      'Room and resource booking',
      'Event check-in and attendance'
    ],
    image: '/images/onboarding/events.svg',
    icon: CalendarIcon,
    color: 'blue',
    category: 'Administration'
  },
  {
    id: 'volunteers',
    title: 'Volunteer Management',
    description: 'Recruit, schedule, and track volunteers with skill matching and background checks.',
    features: [
      'Volunteer scheduling',
      'Skill and interest matching',
      'Background check tracking',
      'Service hour tracking'
    ],
    image: '/images/onboarding/volunteers.svg',
    icon: UsersIcon,
    color: 'green',
    category: 'Administration'
  },
  {
    id: 'finances',
    title: 'Finances',
    description: 'Track donations, manage budgets, generate reports, and create donor statements.',
    features: [
      'Donation tracking',
      'Budget management',
      'Financial reporting',
      'Donor statements'
    ],
    image: '/images/onboarding/finances.svg',
    icon: CurrencyDollarIcon,
    color: 'emerald',
    category: 'Administration'
  },
  {
    id: 'security',
    title: 'Security & Access Control',
    description: 'Protect your data with role-based permissions, multi-tiered authentication, and audit logging.',
    features: [
      'Role-based permissions',
      'Multi-tiered authentication',
      'Branch-specific access controls',
      'Audit logging'
    ],
    image: '/images/onboarding/security.svg',
    icon: ShieldCheckIcon,
    color: 'red',
    category: 'Administration'
  },
  // Integration Features
  {
    id: 'mobile',
    title: 'Mobile App Integration',
    description: 'Access your church system on mobile with personalized content, notifications, and giving tools.',
    features: [
      'Member app access',
      'Mobile content delivery',
      'Push notifications',
      'Mobile giving'
    ],
    image: '/images/onboarding/mobile.svg',
    icon: DevicePhoneMobileIcon,
    color: 'indigo',
    category: 'Integration Features'
  },
  {
    id: 'website',
    title: 'Website Integration',
    description: 'Synchronize your church website with content, events, sermons, and online forms.',
    features: [
      'Content synchronization',
      'Event publishing',
      'Sermon publishing',
      'Online forms'
    ],
    image: '/images/onboarding/website.svg',
    icon: GlobeAltIcon,
    color: 'violet',
    category: 'Integration Features'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'re now ready to start using your Church Management System. Remember that help is always available if you need it.',
    image: '/images/onboarding/complete.svg',
    icon: HomeIcon,
    color: 'green'
  }
];

// Get unique categories for the progress tracker
const categories = [...new Set(onboardingSteps.filter(step => step.category).map(step => step.category))];

interface OnboardingFlowProps {
  onComplete: () => void;
  initialStep?: number;
}

export default function OnboardingFlow({ onComplete, initialStep = 0 }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const step = onboardingSteps[currentStep];
  
  // Mark current step as completed
  useEffect(() => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    // Save progress to localStorage
    localStorage.setItem('onboardingProgress', JSON.stringify(completedSteps));
  }, [currentStep, completedSteps]);
  
  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboardingProgress');
    if (savedProgress) {
      setCompletedSteps(JSON.parse(savedProgress));
    }
  }, []);
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    // Skip to the next category or complete if at the end
    const currentCategory = step.category;
    const nextCategoryStep = onboardingSteps.findIndex((step, index) => 
      index > currentStep && step.category !== currentCategory
    );
    
    if (nextCategoryStep === -1) {
      // Go to completion step
      setCurrentStep(onboardingSteps.length - 1);
    } else {
      setCurrentStep(nextCategoryStep);
    }
  };
  
  const handleComplete = () => {
    // Save completion status
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Call the onComplete callback
    onComplete();
    
    // Redirect to dashboard
    router.push('/dashboard');
  };
  
  // Calculate progress percentage
  const progress = Math.round((completedSteps.length / (onboardingSteps.length - 1)) * 100);
  
  // Render the progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="mb-8">
        {/* Overall progress */}
        <div className="flex items-center justify-between mb-2">
          <Text className="text-sm font-medium text-gray-500">Overall Progress</Text>
          <Text className="text-sm font-medium text-gray-500">{progress}%</Text>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Category indicators */}
        <div className="flex justify-between mb-2">
          {categories.map((category, index) => {
            // Find the first step in this category
            const firstStepInCategory = onboardingSteps.findIndex(step => step.category === category);
            // Is this category completed or active?
            const isActive = step.category === category;
            const isCompleted = currentStep > onboardingSteps.findLastIndex(step => step.category === category);
            
            return (
              <div 
                key={index} 
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setCurrentStep(firstStepInCategory)}
                style={{ cursor: 'pointer' }}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Progress indicator */}
        {renderProgressIndicator()}
        
        {/* Content card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Image side */}
            <div className="md:w-2/5 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Placeholder for image - in a real implementation, you'd use actual images */}
                <div className={`bg-${step.color}-100 w-64 h-64 rounded-full flex items-center justify-center`}>
                  <step.icon className={`h-32 w-32 text-${step.color}-500`} />
                </div>
              </div>
            </div>
            
            {/* Content side */}
            <div className="md:w-3/5">
              {step.category && (
                <Text className="text-sm font-medium text-indigo-600 mb-2">
                  {step.category}
                </Text>
              )}
              <Title className="text-2xl font-bold mb-4">
                {step.title}
              </Title>
              <Text className="mb-4">
                {step.description}
              </Text>
              
              {/* Feature list if available */}
              {step.features && (
                <ul className="space-y-2 mb-6">
                  {step.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button
                variant="secondary"
                icon={ArrowLeftIcon}
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStep < onboardingSteps.length - 1 && step.category && (
              <Button
                variant="light"
                onClick={handleSkip}
              >
                Skip to Next Section
              </Button>
            )}
            
            <Button
              color="indigo"
              icon={ArrowRightIcon}
              iconPosition="right"
              onClick={handleNext}
            >
              {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
