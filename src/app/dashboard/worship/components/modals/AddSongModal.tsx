"use client";

import { Fragment, useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  MusicalNoteIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  CheckCircleIcon,
  PlusIcon,
  DocumentTextIcon,
  MusicalNoteIcon as MusicNoteOutline,
  LinkIcon
} from '@heroicons/react/24/outline';
import type { Song } from '../SongLibrary';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Omit<Song, 'id'>) => void;
}

type FormStep = 'basics' | 'musical' | 'content' | 'review';

export default function AddSongModal({ isOpen, onClose, onAddSong }: AddSongModalProps) {
  // Constants for dropdown options
  const keys = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
  const tempos = ['Slow', 'Medium-Slow', 'Medium', 'Medium-Fast', 'Fast'];
  const timeSignatures = ['2/4', '3/4', '4/4', '5/4', '6/8', '9/8', '12/8'];
  
  // Common themes for quick selection
  const commonThemes = [
    'Worship', 'Praise', 'Adoration', 'Love', 'Grace', 'Faith', 'Hope', 
    'Forgiveness', 'Salvation', 'Surrender', 'Thanksgiving', 'Easter', 
    'Christmas', 'Victory', 'Gospel', 'Communion', 'Prayer', 'Holy Spirit'
  ];

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<FormStep>('basics');
  
  // Form data state with improved theme handling
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    defaultKey: 'G',
    tempo: 'Medium',
    timeSignature: '4/4',
    ccli: '',
    themes: [] as string[],  // Changed to array from string
    lyrics: '',
    chordChart: '',
    audioUrl: '',
    videoUrl: '',
    customTheme: ''  // For adding custom themes
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form completion status for each step
  const stepCompletion = useMemo(() => ({
    basics: formData.title.trim() !== '' && formData.author.trim() !== '',
    musical: true, // Musical info has default values
    content: true, // Content is optional
    review: true // Just for reviewing
  }), [formData.title, formData.author]);

  // Navigate between form steps
  const goToNextStep = () => {
    if (currentStep === 'basics') {
      if (!validateBasicInfo()) return;
      setCurrentStep('musical');
    } else if (currentStep === 'musical') {
      setCurrentStep('content');
    } else if (currentStep === 'content') {
      setCurrentStep('review');
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 'musical') {
      setCurrentStep('basics');
    } else if (currentStep === 'content') {
      setCurrentStep('musical');
    } else if (currentStep === 'review') {
      setCurrentStep('content');
    }
  };

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle theme selection (add/remove from array)
  const handleThemeToggle = (theme: string) => {
    setFormData(prev => {
      const themes = [...prev.themes];
      const themeIndex = themes.indexOf(theme);
      
      if (themeIndex >= 0) {
        // Remove theme if already selected
        themes.splice(themeIndex, 1);
      } else {
        // Add theme if not already selected
        themes.push(theme);
      }
      
      return { ...prev, themes };
    });
  };
  
  // Add custom theme from input
  const handleAddCustomTheme = () => {
    if (!formData.customTheme.trim()) return;
    
    setFormData(prev => {
      // Only add if not already in the list
      if (!prev.themes.includes(prev.customTheme.trim())) {
        return {
          ...prev,
          themes: [...prev.themes, prev.customTheme.trim()],
          customTheme: ''
        };
      }
      return { ...prev, customTheme: '' };
    });
  };

  // Validate just the basic info (first step)
  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate the entire form before submission
  const validateForm = () => {
    // Start with basic validation
    if (!validateBasicInfo()) return false;
    
    // Add any additional validations for other steps if needed
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create the new song object
    const newSong: Omit<Song, 'id'> = {
      title: formData.title,
      author: formData.author,
      defaultKey: formData.defaultKey,
      tempo: formData.tempo,
      timeSignature: formData.timeSignature,
      ccli: formData.ccli || '',
      themes: formData.themes, // Already an array in our updated form
      lastUsed: new Date().toISOString().split('T')[0],
      lyrics: formData.lyrics || undefined,
      chordChart: formData.chordChart || undefined,
      audioUrl: formData.audioUrl || undefined,
      videoUrl: formData.videoUrl || undefined,
      usageCount: 0,
      lastReported: new Date().toISOString().split('T')[0]
    };
    
    // Add a slight delay to show loading state (simulates API call)
    setTimeout(() => {
      onAddSong(newSong);
      setIsSubmitting(false);
      onClose();
      
      // Reset form after submission
      setFormData({
        title: '',
        author: '',
        defaultKey: 'G',
        tempo: 'Medium',
        timeSignature: '4/4',
        ccli: '',
        themes: [],
        lyrics: '',
        chordChart: '',
        audioUrl: '',
        videoUrl: '',
        customTheme: ''
      });
      setCurrentStep('basics');
    }, 500);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                {/* Close button */}
                <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
                  <button
                    type="button"
                    className="rounded-full bg-white/80 backdrop-blur-sm p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Header with progress steps */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-6 sm:px-8">
                  <div className="flex items-center mb-2">
                    <MusicalNoteIcon className="h-7 w-7 text-white" aria-hidden="true" />
                    <Dialog.Title as="h3" className="ml-2 text-xl font-bold text-white">
                      Add New Song
                    </Dialog.Title>
                  </div>
                  
                  {/* Progress steps */}
                  <nav aria-label="Progress" className="mt-3">
                    <ol role="list" className="flex items-center">
                      {[{ id: 'basics', name: 'Song Info' }, { id: 'musical', name: 'Musical Details' }, { id: 'content', name: 'Content & Media' }, { id: 'review', name: 'Review' }].map((step, stepIdx) => {
                        const isCurrent = currentStep === step.id;
                        const isComplete = stepCompletion[step.id as FormStep];
                        const previousStepsComplete = stepIdx === 0 || [{ id: 'basics' }, { id: 'musical' }, { id: 'content' }, { id: 'review' }].slice(0, stepIdx).every(s => stepCompletion[s.id as FormStep]);
                        
                        return (
                          <li key={step.id} className={`relative ${stepIdx !== 0 ? 'ml-6' : ''} flex-1`}>
                            {stepIdx !== 0 && (
                              <div className="absolute inset-0 -left-7 top-3.5 h-0.5 w-6 bg-white/30" aria-hidden="true" />
                            )}
                            <button
                              type="button"
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${isCurrent ? 'border-white bg-white/20 text-white' : isComplete ? 'border-white bg-white text-indigo-600' : 'border-white/40 bg-transparent text-white/60'} ${!previousStepsComplete ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/10'}`}
                              disabled={!previousStepsComplete}
                              onClick={() => previousStepsComplete && setCurrentStep(step.id as FormStep)}
                              aria-current={isCurrent ? 'step' : undefined}
                            >
                              {isComplete ? (
                                <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <span>{stepIdx + 1}</span>
                              )}
                              <span className="sr-only">{step.name}</span>
                            </button>
                            <div className="mt-1.5 text-center">
                              <span className={`text-xs font-medium ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                                {step.name}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Song Information */}
                  {currentStep === 'basics' && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Basic Song Information</h4>
                        <p className="text-sm text-gray-500">Enter the essential details about the song.</p>
                      </div>
                      
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Song Title*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              id="title"
                              value={formData.title}
                              onChange={handleChange}
                              className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.title ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                              placeholder="Enter song title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="author" className="block text-sm font-medium leading-6 text-gray-900">
                            Author/Artist*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="author"
                              id="author"
                              value={formData.author}
                              onChange={handleChange}
                              className={`block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.author ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                              placeholder="Enter song author or artist"
                            />
                            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="ccli" className="block text-sm font-medium leading-6 text-gray-900">
                            CCLI# (optional)
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="ccli"
                              id="ccli"
                              value={formData.ccli}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="CCLI license number"
                            />
                            <p className="mt-1 text-xs text-gray-500">Copyright licensing information for the song</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Step 2: Musical Details */}
                  {currentStep === 'musical' && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Musical Details</h4>
                        <p className="text-sm text-gray-500">Add musical information to help worship team members.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div>
                          <label htmlFor="defaultKey" className="block text-sm font-medium leading-6 text-gray-900">
                            Default Key
                          </label>
                          <div className="mt-2">
                            <select
                              id="defaultKey"
                              name="defaultKey"
                              value={formData.defaultKey}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              {keys.map(key => (
                                <option key={key} value={key.split('/')[0]}>
                                  {key}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="tempo" className="block text-sm font-medium leading-6 text-gray-900">
                            Tempo
                          </label>
                          <div className="mt-2">
                            <select
                              id="tempo"
                              name="tempo"
                              value={formData.tempo}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              {tempos.map(tempo => (
                                <option key={tempo} value={tempo}>
                                  {tempo}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="timeSignature" className="block text-sm font-medium leading-6 text-gray-900">
                            Time Signature
                          </label>
                          <div className="mt-2">
                            <select
                              id="timeSignature"
                              name="timeSignature"
                              value={formData.timeSignature}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              {timeSignatures.map(sig => (
                                <option key={sig} value={sig}>
                                  {sig}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
                          Themes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {commonThemes.map(theme => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => handleThemeToggle(theme)}
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${formData.themes.includes(theme) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-800'} hover:bg-indigo-50 transition-colors`}
                            >
                              {formData.themes.includes(theme) ? (
                                <CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                              ) : null}
                              {theme}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex">
                          <input
                            type="text"
                            name="customTheme"
                            id="customTheme"
                            value={formData.customTheme}
                            onChange={handleChange}
                            className="block w-full rounded-lg rounded-r-none border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Add custom theme"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomTheme}
                            className="inline-flex items-center rounded-lg rounded-l-none border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                          >
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        
                        {formData.themes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Selected themes:</p>
                            <div className="flex flex-wrap gap-1">
                              {formData.themes.map(theme => (
                                <span key={theme} className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                                  {theme}
                                  <button
                                    type="button"
                                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                                    onClick={() => handleThemeToggle(theme)}
                                  >
                                    <span className="sr-only">Remove {theme}</span>
                                    <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Step 3: Content & Media */}
                  {currentStep === 'content' && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Song Content and Media</h4>
                        <p className="text-sm text-gray-500">Add lyrics, chord charts, and media links to help the team learn the song.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <label htmlFor="lyrics" className="block text-sm font-medium leading-6 text-gray-900">
                              Lyrics
                            </label>
                          </div>
                          <div className="mt-2">
                            <textarea
                              id="lyrics"
                              name="lyrics"
                              rows={6}
                              value={formData.lyrics}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Enter song lyrics here"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <MusicNoteOutline className="h-5 w-5 text-gray-400 mr-2" />
                            <label htmlFor="chordChart" className="block text-sm font-medium leading-6 text-gray-900">
                              Chord Chart
                            </label>
                          </div>
                          <div className="mt-2">
                            <textarea
                              id="chordChart"
                              name="chordChart"
                              rows={6}
                              value={formData.chordChart}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono"
                              placeholder="Enter chord chart with chord symbols above lyrics"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Format: Place chords above lyrics (e.g. &quot;G       D        Em        C&quot;). Using a monospaced font helps with alignment.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-4 border-t border-gray-200">
                          <div>
                            <div className="flex items-center">
                              <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <label htmlFor="audioUrl" className="block text-sm font-medium leading-6 text-gray-900">
                                Audio URL
                              </label>
                            </div>
                            <div className="mt-2">
                              <input
                                type="url"
                                name="audioUrl"
                                id="audioUrl"
                                value={formData.audioUrl}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="https://example.com/audio.mp3"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center">
                              <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <label htmlFor="videoUrl" className="block text-sm font-medium leading-6 text-gray-900">
                                Video URL
                              </label>
                            </div>
                            <div className="mt-2">
                              <input
                                type="url"
                                name="videoUrl"
                                id="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="https://example.com/video.mp4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 4: Review */}
                  {currentStep === 'review' && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Review Song Details</h4>
                        <p className="text-sm text-gray-500">Review the song information before adding it to the library.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2">Basic Information</h5>
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Title</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formData.title || '(Not provided)'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Author/Artist</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formData.author || '(Not provided)'}</dd>
                            </div>
                            {formData.ccli && (
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">CCLI #</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formData.ccli}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2">Musical Details</h5>
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Key</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formData.defaultKey}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Tempo</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formData.tempo}</dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Time Signature</dt>
                              <dd className="mt-1 text-sm text-gray-900">{formData.timeSignature}</dd>
                            </div>
                          </dl>
                          
                          {formData.themes.length > 0 && (
                            <div className="mt-3">
                              <dt className="text-sm font-medium text-gray-500 mb-1">Themes</dt>
                              <dd className="mt-1">
                                <div className="flex flex-wrap gap-1">
                                  {formData.themes.map(theme => (
                                    <span key={theme} className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </dd>
                            </div>
                          )}
                        </div>
                        
                        {(formData.lyrics || formData.chordChart) && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Content</h5>
                            {formData.lyrics && (
                              <div className="mb-4">
                                <dt className="text-sm font-medium text-gray-500 mb-1">Lyrics</dt>
                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line max-h-32 overflow-y-auto p-2 bg-white rounded border border-gray-200">
                                  {formData.lyrics}
                                </dd>
                              </div>
                            )}
                            {formData.chordChart && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">Chord Chart</dt>
                                <dd className="mt-1 text-sm text-gray-900 font-mono whitespace-pre max-h-32 overflow-y-auto p-2 bg-white rounded border border-gray-200">
                                  {formData.chordChart}
                                </dd>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {(formData.audioUrl || formData.videoUrl) && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Media Links</h5>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                              {formData.audioUrl && (
                                <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-gray-500">Audio URL</dt>
                                  <dd className="mt-1 text-sm text-blue-600 truncate">
                                    <a href={formData.audioUrl} target="_blank" rel="noopener noreferrer">
                                      {formData.audioUrl}
                                    </a>
                                  </dd>
                                </div>
                              )}
                              {formData.videoUrl && (
                                <div className="sm:col-span-1">
                                  <dt className="text-sm font-medium text-gray-500">Video URL</dt>
                                  <dd className="mt-1 text-sm text-blue-600 truncate">
                                    <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer">
                                      {formData.videoUrl}
                                    </a>
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Form navigation buttons */}
                  <div className="px-6 py-4 sm:px-8 border-t border-gray-200 bg-gray-50 flex justify-between rounded-b-xl">
                    <div>
                      {currentStep !== 'basics' && (
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <ChevronLeftIcon className="-ml-0.5 mr-1 h-5 w-5" aria-hidden="true" />
                          Back
                        </button>
                      )}
                    </div>
                    <div>
                      {currentStep !== 'review' ? (
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Next
                          <ChevronRightIcon className="ml-1 -mr-0.5 h-5 w-5" aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                        >
                          {isSubmitting ? 'Adding Song...' : 'Add Song'}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
