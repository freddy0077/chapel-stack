'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Toggle2,
    AlertCircle,
    CheckCircle,
    Zap,
    Users,
    Calendar,
    DollarSign,
    MessageSquare,
    BarChart3,
    Plus,
    Search,
    Filter,
    ArrowRight,
    Shield,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Module {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    icon: React.ReactNode;
    category: string;
    dependencies: string[];
    features: string[];
    settings: Record<string, any>;
    color: string;
}

export default function ModuleSettingsPage() {
    const [modules, setModules] = useState<Module[]>([
        {
            id: 'members',
            name: 'Members Management',
            description: 'Manage church members and their information',
            enabled: true,
            icon: <Users className="h-6 w-6" />,
            category: 'Core',
            dependencies: [],
            features: ['Add/Edit/Delete members', 'Import members', 'Export data', 'Member profiles'],
            settings: { allowImport: true, allowExport: true, requireApproval: false },
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: 'events',
            name: 'Events Management',
            description: 'Create and manage church events',
            enabled: true,
            icon: <Calendar className="h-6 w-6" />,
            category: 'Core',
            dependencies: ['members'],
            features: ['Create events', 'Event registration', 'Attendance tracking'],
            settings: { allowRegistration: true, requireApproval: false, maxAttendees: 500 },
            color: 'from-purple-500 to-purple-600',
        },
        {
            id: 'finances',
            name: 'Finance Management',
            description: 'Manage finances and giving',
            enabled: true,
            icon: <DollarSign className="h-6 w-6" />,
            category: 'Core',
            dependencies: ['members'],
            features: ['Record donations', 'Online giving', 'Financial reports'],
            settings: { allowOnlineGiving: true, requireApproval: true, currency: 'USD' },
            color: 'from-green-500 to-green-600',
        },
        {
            id: 'communications',
            name: 'Communications',
            description: 'Send messages and announcements',
            enabled: true,
            icon: <MessageSquare className="h-6 w-6" />,
            category: 'Core',
            dependencies: ['members'],
            features: ['Send emails', 'SMS messages', 'Push notifications'],
            settings: { allowEmail: true, allowSMS: false, allowPush: true },
            color: 'from-pink-500 to-pink-600',
        },
        {
            id: 'automations',
            name: 'Automations',
            description: 'Create automated workflows',
            enabled: true,
            icon: <Zap className="h-6 w-6" />,
            category: 'Advanced',
            dependencies: ['members', 'communications'],
            features: ['Create workflows', 'Trigger actions', 'Custom logic'],
            settings: { allowCustom: true, maxWorkflows: 100 },
            color: 'from-yellow-500 to-yellow-600',
        },
    ]);

    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [filter, setFilter] = useState<'all' | 'core' | 'advanced'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredModules = modules.filter((m) => {
        const matchesCategory = filter === 'all' || m.category.toLowerCase() === filter;
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleToggleModule = (moduleId: string, enabled: boolean) => {
        const module = modules.find((m) => m.id === moduleId);
        if (!module) return;

        // Check dependencies
        if (!enabled) {
            const dependents = modules.filter((m) =>
                m.dependencies.includes(moduleId) && m.enabled
            );
            if (dependents.length > 0) {
                toast.error(
                    `Cannot disable ${module.name}. It's required by: ${dependents.map((m) => m.name).join(', ')}`
                );
                return;
            }
        }

        setModules(modules.map((m) =>
            m.id === moduleId ? { ...m, enabled } : m
        ));

        toast.success(
            `${module.name} ${enabled ? 'enabled' : 'disabled'}`,
            {
                icon: enabled ? '✅' : '⏹️',
                style: {
                    borderRadius: '10px',
                    background: enabled ? '#10B981' : '#EF4444',
                    color: '#fff',
                },
            }
        );
    };

    const coreModules = filteredModules.filter((m) => m.category === 'Core');
    const advancedModules = filteredModules.filter((m) => m.category === 'Advanced');

    const stats = [
        { label: 'Total Modules', value: modules.length, icon: Settings, color: 'from-slate-500 to-slate-600' },
        { label: 'Enabled', value: modules.filter((m) => m.enabled).length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'Core Modules', value: modules.filter((m) => m.category === 'Core').length, icon: Shield, color: 'from-blue-500 to-blue-600' },
        { label: 'Advanced', value: modules.filter((m) => m.category === 'Advanced').length, icon: Sparkles, color: 'from-purple-500 to-purple-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 shadow-2xl mb-8"
                >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                                <Settings className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Module Settings</h1>
                                <p className="text-white/90 text-lg">Configure and manage system modules</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'core', 'advanced'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        filter === cat
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Core Modules */}
                {coreModules.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-600" />
                            Core Modules
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coreModules.map((module) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                    onClick={() => setSelectedModule(module)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} text-white`}>
                                            {module.icon}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleModule(module.id, !module.enabled);
                                            }}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                                module.enabled ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        >
                      <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              module.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                                    <div className="space-y-2 mb-4">
                                        {module.features.slice(0, 2).map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {module.dependencies.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            Requires: {module.dependencies.join(', ')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Advanced Modules */}
                {advancedModules.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-purple-600" />
                            Advanced Modules
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {advancedModules.map((module) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                    onClick={() => setSelectedModule(module)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} text-white`}>
                                            {module.icon}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleModule(module.id, !module.enabled);
                                            }}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                                module.enabled ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        >
                      <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              module.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                                    <div className="space-y-2 mb-4">
                                        {module.features.slice(0, 2).map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {module.dependencies.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 p-2 bg-gray-50 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            Requires: {module.dependencies.join(', ')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Module Details Modal */}
                <AnimatePresence>
                    {selectedModule && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedModule(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedModule.color} text-white`}>
                                        {selectedModule.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedModule.name}</h2>
                                        <p className="text-sm text-gray-600">{selectedModule.category}</p>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-6">{selectedModule.description}</p>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                                    <div className="space-y-2">
                                        {selectedModule.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedModule.dependencies.length > 0 && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-blue-600" />
                                            Dependencies
                                        </h3>
                                        <p className="text-sm text-gray-700">{selectedModule.dependencies.join(', ')}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setSelectedModule(null)}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleToggleModule(selectedModule.id, !selectedModule.enabled);
                                            setSelectedModule(null);
                                        }}
                                        className={`flex-1 ${
                                            selectedModule.enabled
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
                                    >
                                        {selectedModule.enabled ? 'Disable' : 'Enable'}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
