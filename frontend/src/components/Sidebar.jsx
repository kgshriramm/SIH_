// Updated Sidebar.jsx
import React from "react";
import { useTranslation } from 'react-i18next';
import { MessageSquare, Map, BarChart2, Database, X, AlertTriangle } from "lucide-react";

// Language options (these are not translated as they include native names; if needed, add t() for each)
const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "Hindi (हिन्दी)", code: "hi" },
  { name: "Kannada (ಕನ್ನಡ)", code: "kn" },
];

function LanguageSelector({ selected, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="mt-8">
      <h2 className="text-sm text-gray-400 mb-2">{t('selectLanguage')}</h2>
      <select
        className="w-full p-2 rounded bg-gray-900 text-gray-100"
        value={selected}
        onChange={onChange}  // Pass the function directly to handle the event
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
}

export default function Sidebar({ 
  onQuickAction, 
  isOpen, 
  onToggle, 
  selectedLanguage, 
  onLanguageChange, 
  isCollapsed, 
  onToggleCollapse,
  onNavigate // New prop for navigation
}) {
  const { t } = useTranslation();

  const handleQuickAction = (action) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  const handleNavigation = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 h-full bg-gray-950 p-4
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-400">
            Float<span className="text-white">Chat</span>
          </h1>
          {/* This close button will now only be visible on mobile */}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4">
          <button 
            className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
            onClick={() => handleNavigation('chat')}
          >
            <MessageSquare size={18}/> {t('chat')}
          </button>
          <button 
            className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
            onClick={() => handleNavigation('map')}
          >
            <Map size={18}/> {t('floatMap')}
          </button>
          <button 
            className="flex items-center gap-2 hover:text-red-400 w-full text-left transition-colors"
            onClick={() => handleNavigation('emergency')}
          >
            <AlertTriangle size={18}/> Emergency
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <BarChart2 size={18}/> {t('analytics')}
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <Database size={18}/> {t('dataExport')}
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-sm text-gray-400 mb-2">{t('quickActions')}</h2>
          <div className="flex flex-col gap-2">
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction(t('showMeOceanFloatMap'))}
            >
              <Map size={16}/> {t('showMap')}
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction(t('generateDepthProfileAnalysis'))}
            >
              <BarChart2 size={16}/> {t('depthProfile')}
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction(t('compareDifferentOceanRegions'))}
            >
              {t('compareRegions')}
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction(t('showMeFloatProfiles'))}
            >
              {t('floatProfiles')}
            </button>
            <button 
              className="flex items-center gap-2 hover:text-red-400 w-full text-left transition-colors"
              onClick={() => handleNavigation('emergency')}
            >
              <AlertTriangle size={16}/> Quick Emergency
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <LanguageSelector selected={selectedLanguage} onChange={onLanguageChange} />
      </aside>
    </>
  );
}