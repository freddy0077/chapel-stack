"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  ArrowLeftIcon, 
  ChevronRightIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

// Define the team member type based on the existing structure
interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: string[];
  email: string;
  phone: string;
  availability: string;
  status: string;
  scheduledServices: number;
  profileImage?: string;
  notes?: string;
}

const roleOptions = [
  "Worship Leader",
  "Vocals",
  "Acoustic Guitar",
  "Electric Guitar",
  "Bass",
  "Drums",
  "Keys",
  "Piano",
  "Violin",
  "Cello",
  "Flute",
  "Saxophone",
  "Trumpet",
  "Trombone",
  "Sound Engineer",
  "Visual Tech",
  "Lighting Tech",
  "Producer"
];

const skillOptions = [
  "Vocals",
  "Acoustic Guitar",
  "Electric Guitar",
  "Bass",
  "Drums",
  "Percussion",
  "Piano",
  "Keyboard",
  "Organ",
  "Violin",
  "Viola",
  "Cello",
  "Flute",
  "Saxophone",
  "Trumpet",
  "Trombone",
  "Horn",
  "Conducting",
  "Choir Direction",
  "Sound Engineering",
  "Visual Production",
  "Lighting Design",
  "Arrangement",
  "Composition",
  "Music Reading",
  "Improvisation"
];

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<TeamMember, 'id' | 'scheduledServices'>>({
    name: '',
    role: '',
    skills: [],
    email: '',
    phone: '',
    availability: '',
    status: 'Active',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSkill, setCustomSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const currentSkills = [...prev.skills];
      if (currentSkills.includes(skill)) {
        return {
          ...prev,
          skills: currentSkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skills: [...currentSkills, skill]
        };
      }
    });
  };
  
  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.availability.trim()) {
      newErrors.availability = "Availability information is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would make an API call here
      // For now, we'll simulate a successful submission
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to team members list
      router.push('/dashboard/worship/members');
    } catch (error) {
      console.error("Error adding team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goToNextStep = () => {
    if (formStep === 1) {
      const step1Fields = ['name', 'role', 'email'];
      const step1Errors: Record<string, string> = {};
      
      step1Fields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          step1Errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (field === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
          step1Errors.email = "Please enter a valid email address";
        }
      });
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
    }
    
    setFormStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    setFormStep(prev => prev - 1);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard/worship/members')}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Back to Team Members
        </button>
        
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
              Add Team Member
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new worship team member profile
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <UserGroupIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center flex-1">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center
              ${formStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${formStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          </div>
          
          <div className="flex items-center flex-1">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center
              ${formStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${formStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          </div>
          
          <div className="flex items-center flex-1">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center
              ${formStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="text-center">Basic Information</div>
          <div className="text-center">Skills & Expertise</div>
          <div className="text-center">Availability & Notes</div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          {formStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-3">Basic Information</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300
                        ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Primary Role
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md
                        ${errors.role ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      <option value="">Select primary role</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {formStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-3">Skills & Expertise</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                  <span className="text-red-500">*</span>
                </label>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        <span className="sr-only">Remove {skill}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">Select from common skills:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <input
                        id={`skill-${skill}`}
                        name={`skill-${skill}`}
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`skill-${skill}`} className="ml-2 block text-sm text-gray-700">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
                
                {errors.skills && (
                  <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
                )}
              </div>
            </div>
          )}
          
          {formStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-3">Availability & Notes</h2>
              
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="availability"
                    name="availability"
                    rows={3}
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                      ${errors.availability ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="e.g., Sunday mornings, Wednesday evenings, etc."
                  />
                  {errors.availability && (
                    <p className="mt-2 text-sm text-red-600">{errors.availability}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Specify when this team member is typically available to serve.
                </p>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                    placeholder="Any additional information about this team member..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Optional notes about special considerations, preferences, or other information.
                </p>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            {formStep > 1 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {formStep < 3 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                  ${isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Team Member
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
