import React, { useState, Suspense, useEffect, useRef } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import PlotPanel from "./components/PlotPanel";
import MapComponent from "./components/MapComponent";
import EmergencyComponent from "./components/EmergencyComponent";
import { Download, Share2, X } from "lucide-react";

const BACKEND_URL = "https://sih-jkf2.onrender.com/";
const ROUTE_INFO_URL = "http://127.0.0.1:5000/api/route_info";
const SHARE_BACKEND_URL = "http://127.0.0.1:5001/api/share";  // Adjust port/route if needed

// Helper function to get shared ID from URL
const getSharedIdFromUrl = () => {
  // Check for URL parameters first (?share=id)
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('share') || urlParams.get('id');
  if (paramId) return paramId;
  
  // Check for path parameters (/share/id)
  const pathMatch = window.location.pathname.match(/\/share\/([^\/]+)/);
  return pathMatch ? pathMatch[1] : null;
};

function AppContent() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: i18n.t("helloImFloatChat"),
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [plotData, setPlotData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");
  const [exportableData, setExportableData] = useState([]);  // Accumulate exportable items
  const [showExportModal, setShowExportModal] = useState(false);  // Modal state
  const [selectedExportOption, setSelectedExportOption] = useState('current');  // Track selection like Grok model picker
  const [showShareModal, setShowShareModal] = useState(false);  // Share modal state
  const [qrImage, setQrImage] = useState(null);  // QR image blob URL
  const [shareLoading, setShareLoading] = useState(false);  // Share spinner state
  const [currentView, setCurrentView] = useState('chat');  // New state for view management
  const chatRef = useRef(null);  // Ref for scrolling to bottom

  // Load shared chat function
  const loadSharedChat = async (shareId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/share/${shareId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to load shared chat: ${response.status}`);
      }

      const sharedData = await response.json();
      
      // Load the shared messages into state
      if (sharedData.history && Array.isArray(sharedData.history)) {
        setMessages(sharedData.history);
        
        // Also load any exportable data if it exists
        const exportData = [];
        sharedData.history.forEach(msg => {
          if (msg.sender === 'bot' && msg.text) {
            exportData.push({
              type: 'summary',
              data: msg.text,
              timestamp: new Date().toISOString(),
              query: 'Shared chat'
            });
          }
          if (msg.plotData) {
            exportData.push({
              type: 'plot',
              data: msg.plotData,
              timestamp: new Date().toISOString(),
              query: 'Shared chat'
            });
          }
        });
        setExportableData(exportData);
      }
    } catch (error) {
      console.error("Error loading shared chat:", error);
      // Show error message to user
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Error loading shared chat. The link may be invalid or expired.",
        time: new Date().toLocaleTimeString(),
      }]);
    }
  };

  // Check for shared chat on app load
  useEffect(() => {
    const sharedId = getSharedIdFromUrl();
    if (sharedId) {
      loadSharedChat(sharedId);
    }
  }, []); // Run once on component mount

  // Update initial bot message when language changes
  useEffect(() => {
    setMessages((prev) => prev.map((msg, index) => 
      index === 0 ? { ...msg, text: i18n.t("helloImFloatChat") } : msg
    ));
  }, [selectedLanguage]);

  // Scroll to bottom on messages or plotData change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, plotData]);

  // Cleanup QR blob URL
  useEffect(() => {
    return () => {
      if (qrImage) {
        URL.revokeObjectURL(qrImage);
      }
    };
  }, [qrImage]);

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    setInputText("");
    const lowerText = text.toLowerCase();
    const showGraphMsg =
      lowerText.includes("graph") ||
      lowerText.includes("plot") ||
      lowerText.includes("chart");

    const userMsg = { sender: "user", text, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, language: selectedLanguage }),
      });
      const responseData = await res.json();

      console.log("Plot data:", responseData.data);

      const hasPlotData = Array.isArray(responseData.data) && 
                          responseData.data.length > 0 &&
                          'temperature' in responseData.data[0] &&
                          'pressure' in responseData.data[0];

      // Set global plotData for rendering
      if (hasPlotData) {
        setPlotData(responseData.data);
      }

      const botMsg = {
        sender: "bot",
        text: responseData.summary || i18n.t("noResponseSummary"),
        time: new Date().toLocaleTimeString(),
        // Store plot data directly with this message
        plotData: hasPlotData ? responseData.data : null
      };

      let infoMsg = null;
      if (showGraphMsg && botMsg.plotData) {
        infoMsg = {
          sender: "bot",
          text: i18n.t("hereIsYourGraph"),
          time: new Date().toLocaleTimeString(),
          type: 'info',
        };
      } else if (
        Array.isArray(responseData.data) &&
        responseData.data.length > 0
      ) {
        infoMsg = {
          sender: "bot",
          text: i18n.t("debugInfoReceived", { count: responseData.data.length }),
          time: new Date().toLocaleTimeString(),
          type: 'info',
        };
      }

      if (infoMsg) {
        setMessages((prev) => [...prev, botMsg, infoMsg]);
      } else {
        setMessages((prev) => [...prev, botMsg]);
      }

      // Accumulate for export
      if (responseData.summary) {
        setExportableData(prev => [...prev, {
          type: 'summary',
          data: responseData.summary,
          timestamp: new Date().toISOString(),
          query: text
        }]);
      }

      if (botMsg.plotData) {
        setExportableData(prev => [...prev, {
          type: 'plot',
          data: botMsg.plotData,
          timestamp: new Date().toISOString(),
          query: text
        }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: i18n.t("errorCouldNotConnect"), time: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText) => {
    setInputText(actionText || "");
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view !== 'chat') {
      setSidebarOpen(false); // Close sidebar on mobile when navigating
    }
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const performExport = () => {
    const exportAll = selectedExportOption === 'all';
    if (exportableData.length === 0) {
      alert('No data to export yet. Try a query first!');
      setShowExportModal(false);
      return;
    }

    const targetData = exportAll ? [exportableData[exportableData.length - 1]] : exportableData;

    // Export as CSV if any plot data is present in the target range
    if (targetData.some(item => item.type === 'plot')) {
      let csvContent = ['Query,Timestamp,Pressure (dbar),Temperature (°C)'];  // Headers
      targetData.forEach(item => {
        if (item.type === 'plot') {
          item.data.forEach(row => {
            csvContent.push([item.query || '', item.timestamp, row.pressure, row.temperature].join(','));
          });
        } else if (item.type === 'summary') {
          // Include summary as a row with empty pressure/temperature
          csvContent.push([item.query || '', item.timestamp, '', item.data]);
        }
      });
      const csvString = csvContent.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `argo_export_${exportAll ? 'current' : 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export as TXT only if no plot data is present
      const txtContent = targetData.map(item => 
        `Query: ${item.query || ''}\nTimestamp: ${item.timestamp}\n${item.type === 'summary' ? 'Summary' : 'Data'}: ${item.data}\n\n---\n`
      ).join('');
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `argo_summaries_${exportAll ? 'current' : 'all'}_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowExportModal(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
    setSelectedExportOption('current');  // Default to current
  };

  // QR Share Logic
  const handleGenerateQR = async () => {
    const hasInteraction = messages.some(msg => msg.sender === 'user');
    if (!hasInteraction) {
      alert("Cannot generate QR code: No chat history to share. Please ask a question first.");
      return;
    }

    setShareLoading(true);
    setQrImage(null);

    try {
      const response = await fetch(SHARE_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages }),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorDetail}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrImage(imageUrl);
    } catch (error) {
      console.error("QR generation error:", error);
      alert(`Error generating QR code: ${error.message}`);
    } finally {
      setShareLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!isSidebarCollapsed);

  // Function to render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'map':
        return <MapComponent routeInfoUrl={ROUTE_INFO_URL} />;
      case 'emergency':
        return <EmergencyComponent routeInfoUrl={ROUTE_INFO_URL} />;
      case 'chat':
      default:
        return (
          <>
            <div ref={chatRef} className="flex-1 overflow-y-auto bg-gray-900">
              <ChatWindow
                messages={messages}
                loading={loading}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
              />
            </div>
            
            <InputBar 
              inputText={inputText} 
              setInputText={setInputText}
              onSend={sendMessage}
              onExport={handleExport}
            />
          </>
        );
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'map':
        return 'Route Calculator';
      case 'emergency':
        return 'Emergency Navigation';
      case 'chat':
      default:
        return 'FloatChat';
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar 
        onQuickAction={handleQuickAction}
        onNavigate={handleNavigation}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}
        `}
      >
        {/* Header with Share button */}
        <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-800"
          >
            <X size={20} />
          </button>
          <h1 className="text-xl font-bold text-green-400">{getViewTitle()}</h1>
          {currentView === 'chat' && (
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="p-2 rounded-md hover:bg-gray-800" title="Export Data">
                <Download size={20} />
              </button>
              <button onClick={() => setShowShareModal(true)} className="p-2 rounded-md hover:bg-gray-800" title="Share Chat">
                <Share2 size={20} />
              </button>
            </div>
          )}
          {currentView !== 'chat' && (
            <button
              onClick={() => handleNavigation('chat')}
              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Back to Chat
            </button>
          )}
        </header>

        {/* Dynamic Content Area */}
        {renderCurrentView()}
      </main>

      {/* Export Modal - Styled like Grok model selection: Simple centered window with radio options */}
      {showExportModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          />
          {/* Modal Content - Compact like Grok selector */}
          <div className="fixed bottom-0 left-0 right-0 z-50 md:inset-0 md:flex md:items-center md:justify-center p-4 md:p-0">
            <div className="bg-gray-900 rounded-t-lg md:rounded-lg p-4 md:p-6 w-full md:w-96 max-w-sm border border-gray-700 md:mx-auto md:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Export Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Select export option:</p>
              <div className="space-y-2 mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="exportOption"
                    value="current"
                    checked={selectedExportOption === 'current'}
                    onChange={(e) => setSelectedExportOption(e.target.value)}
                    className="rounded border-gray-600 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">All Data (History Data)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="exportOption"
                    value="all"
                    checked={selectedExportOption === 'all'}
                    onChange={(e) => setSelectedExportOption(e.target.value)}
                    className="rounded border-gray-600 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">Current Data (Latest Query)</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={performExport}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 md:inset-0 md:flex md:items-center md:justify-center p-4 md:p-0">
            <div className="bg-gray-900 rounded-t-lg md:rounded-lg p-4 md:p-6 w-full md:w-96 max-w-sm border border-gray-700 md:mx-auto md:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Share Chat</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Generate a QR code to share this chat history:</p>
              <button
                onClick={handleGenerateQR}
                disabled={shareLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors mb-4"
              >
                {shareLoading ? "Generating..." : "Generate Share QR Code"}
              </button>
              {qrImage && (
                <div className="text-center">
                  <img src={qrImage} alt="Share QR Code" className="mx-auto max-w-xs" />
                  <p className="text-sm text-gray-400 mt-2">Scan this to share chat history.</p>
                </div>
              )}
              {shareLoading && <p className="text-sm text-gray-400 text-center">Generating unique share link...</p>}
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppContent />
      </Suspense>
    </I18nextProvider>
  );
}
