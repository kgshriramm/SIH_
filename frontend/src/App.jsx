import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import PlotPanel from "./components/PlotPanel";
const BACKEND_URL = "http://127.0.0.1:5000/api/query";

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm FloatChat, your AI assistant for exploring ARGO ocean float data. I can help you analyze temperature profiles, salinity data, float locations, and compare oceanographic conditions across regions. What would you like to explore?",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [plotData, setPlotData] = useState(null);

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    setInputText("");
    const lowerText = text.toLowerCase();
    const showGraphMsg =
      lowerText.includes("graph") ||
      lowerText.includes("plot") ||
      lowerText.includes("chart");
    if (showGraphMsg) {
      setPlotData(null); // Clear only if new graph is requested
    }

    const userMsg = { sender: "user", text, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const responseData = await res.json();

      console.log("Plot data:", responseData.data);

      const botMsg = {
        sender: "bot",
        text: responseData.summary || "No response summary.",
        time: new Date().toLocaleTimeString(),
      };

      // Keyword check for graph/plot/chart
      const lowerText = text.toLowerCase();
      const showGraphMsg =
        lowerText.includes("graph") ||
        lowerText.includes("plot") ||
        lowerText.includes("chart");

      let infoMsg = null;
      if (showGraphMsg) {
        infoMsg = {
          sender: "bot",
          text: "Here is your graph:",
          time: new Date().toLocaleTimeString(),
          type: 'info',
        };
      } else if (
        Array.isArray(responseData.data) &&
        responseData.data.length > 0
      ) {
        infoMsg = {
          sender: "bot",
          text: `(Debug Info: Received ${responseData.data.length} data points from backend.)`,
          time: new Date().toLocaleTimeString(),
          type: 'info',
        };
      }

      // Only add infoMsg if it exists
      if (infoMsg) {
        setMessages((prev) => [...prev, botMsg, infoMsg]);
      } else {
        setMessages((prev) => [...prev, botMsg]);
      }

      if (
        Array.isArray(responseData.data) &&
        responseData.data.length > 0 &&
        'temperature' in responseData.data[0] &&
        'pressure' in responseData.data[0]
      ) {
        setPlotData(responseData.data);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "plot",
            data: responseData.data,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: could not connect to backend.", time: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText) => {
    setInputText(actionText || "");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar 
        onQuickAction={handleQuickAction}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      <main
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}
        `}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <ChatWindow
            messages={messages}
            loading={loading}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          {plotData && <PlotPanel data={plotData} />}
        </div>
        <InputBar 
          inputText={inputText} 
          setInputText={setInputText}
          onSend={sendMessage}
        />
      </main>
    </div>
  );
}

