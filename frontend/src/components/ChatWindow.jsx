import React from "react";
import { Menu } from "lucide-react";

export default function ChatWindow({ messages, loading, sidebarOpen, onToggleSidebar }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header with hamburger menu - Only show when sidebar is closed */}
      {!sidebarOpen && (
        <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900 relative z-20">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors mr-3 text-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-100">FloatChat Assistant</h2>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}