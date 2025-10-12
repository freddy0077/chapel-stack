'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ChapelStack
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#modules" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Modules</a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-8">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-indigo-600">
                Trusted by 500+ Churches Across Africa
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Modern Church</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              All-in-one platform to manage members, finances, events, and communication. 
              Built specifically for African churches with local currency support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Start Free Trial →
                </button>
              </Link>
              <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '500+', label: 'Active Churches', color: 'from-blue-600 to-cyan-600' },
                { value: '100K+', label: 'Members', color: 'from-purple-600 to-pink-600' },
                { value: '15+', label: 'Countries', color: 'from-green-600 to-emerald-600' },
                { value: '99.9%', label: 'Uptime', color: 'from-orange-600 to-red-600' },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">POWERFUL FEATURES</h2>
            <h3 className="text-5xl font-bold text-gray-900 mb-4">
              Everything Your Church Needs
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to streamline operations and enhance ministry effectiveness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Member Management', desc: 'Complete profiles, families, attendance & analytics', icon: '👥', gradient: 'from-blue-500 to-cyan-500' },
              { title: 'Financial Tracking', desc: 'Donations, budgets & reports in Ghana Cedis (GH₵)', icon: '💰', gradient: 'from-green-500 to-emerald-500' },
              { title: 'Asset Management', desc: 'Track assets, depreciation & disposal records', icon: '📦', gradient: 'from-purple-500 to-pink-500' },
              { title: 'Communication Hub', desc: 'SMS, Email & WhatsApp messaging with templates', icon: '💬', gradient: 'from-orange-500 to-red-500' },
              { title: 'Events & Calendar', desc: 'Schedule events, registrations & attendance', icon: '📅', gradient: 'from-indigo-500 to-purple-500' },
              { title: 'Advanced Reports', desc: 'Custom reports with filters & Excel export', icon: '📊', gradient: 'from-yellow-500 to-orange-500' },
              { title: 'Pastoral Care', desc: 'Track visits, prayers & counseling sessions', icon: '❤️', gradient: 'from-red-500 to-pink-500' },
              { title: 'Sacraments', desc: 'Manage baptisms, confirmations & marriages', icon: '✝️', gradient: 'from-teal-500 to-cyan-500' },
              { title: 'Multi-Branch', desc: 'Centralized control for multiple locations', icon: '🏢', gradient: 'from-violet-500 to-purple-500' },
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
                <div className={`text-5xl mb-4 transform group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div className={`mt-4 h-1 w-12 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">INTEGRATED MODULES</h2>
            <h3 className="text-5xl font-bold text-gray-900 mb-4">
              Complete System Integration
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All modules work seamlessly together for a unified experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'Community', items: ['Members', 'Families', 'Groups', 'Attendance'], color: 'blue' },
              { category: 'Financial', items: ['Finances', 'Branch Finances', 'Assets', 'Reports'], color: 'green' },
              { category: 'Ministry', items: ['Pastoral Care', 'Sacraments', 'Birth Registry', 'Death Register'], color: 'purple' },
              { category: 'Operations', items: ['Communication', 'Events', 'Sermons', 'Workflows'], color: 'orange' },
            ].map((module, i) => (
              <div key={i} className={`p-6 bg-gradient-to-br from-${module.color}-50 to-white rounded-2xl border-2 border-${module.color}-100 shadow-lg hover:shadow-xl transition-all`}>
                <h4 className={`text-xl font-bold text-${module.color}-600 mb-6`}>{module.category}</h4>
                <div className="space-y-3">
                  {module.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className={`w-2 h-2 bg-${module.color}-500 rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Church?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join hundreds of churches already using ChapelStack to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
                Start Free Trial →
              </button>
            </Link>
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">ChapelStack</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering churches across Africa with modern technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 ChapelStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
