import React from "react";
import { MessageSquare, Map, BarChart2, Database, X } from "lucide-react";

export default function Sidebar({ onQuickAction, isOpen, onToggle }) {
  const handleQuickAction = (action) => {
    if (onQuickAction) {
      onQuickAction(action);
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
      {/* Key Changes:
        - Now `fixed` on all screens to prevent scrolling with content.
        - `h-full` ensures it spans the full viewport height.
        - `lg:translate-x-0` keeps it visible on desktop screens, overriding the mobile toggle behavior.
      */}
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
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <MessageSquare size={18}/> Chat
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <Map size={18}/> Float Map
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <BarChart2 size={18}/> Analytics
          </button>
          <button className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors">
            <Database size={18}/> Data Export
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="mt-6">
          <h2 className="text-sm text-gray-400 mb-2">QUICK ACTIONS</h2>
          <div className="flex flex-col gap-2">
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction("Show me the ocean float map")}
            >
              <Map size={16}/> Show Map
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction("Generate a depth profile analysis")}
            >
              <BarChart2 size={16}/> Depth Profile
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction("Compare different ocean regions")}
            >
              Compare Regions
            </button>
            <button 
              className="flex items-center gap-2 hover:text-green-400 w-full text-left transition-colors"
              onClick={() => handleQuickAction("Show me float profiles")}
            >
              Float Profiles
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}