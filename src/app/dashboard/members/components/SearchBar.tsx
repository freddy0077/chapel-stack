'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  recentSearches?: string[];
  onRecentSearchSelect?: (search: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search members...",
  loading = false,
  recentSearches = [],
  onRecentSearchSelect,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (recentSearches.length > 0 && !value) {
      setShowSuggestions(true);
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (search: string) => {
    onChange(search);
    onRecentSearchSelect?.(search);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 ${
          isFocused 
            ? 'ring-2 ring-blue-500 shadow-xl' 
            : 'hover:shadow-xl'
        }`}
        layout
      >
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <motion.div
            animate={{ 
              scale: loading ? [1, 1.2, 1] : 1,
              rotate: loading ? 360 : 0
            }}
            transition={{ 
              scale: { repeat: loading ? Infinity : 0, duration: 1 },
              rotate: { repeat: loading ? Infinity : 0, duration: 2, ease: "linear" }
            }}
          >
            <MagnifyingGlassIcon className={`h-5 w-5 ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            } transition-colors duration-200`} />
          </motion.div>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-0 text-lg"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </motion.div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Recent Searches</span>
              </div>
              
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <motion.button
                    key={search}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 group"
                  >
                    <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {search}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      <AnimatePresence>
        {isFocused && !value && recentSearches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4"
          >
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Search Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Search by name, email, or phone number</li>
                <li>• Use quotes for exact matches: "John Smith"</li>
                <li>• Combine with filters for better results</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
