import { Navigation, Map, TrendingUp, Download, Mic } from "lucide-react";
import { useState, useRef } from "react";

export default function InputBar({ onSend, onExport }) {  // Added onExport prop
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      console.log("Speech recognition started");
    };
    recognition.onend = () => {
      setListening(false);
      console.log("Speech recognition ended");
    };
    recognition.onerror = (event) => {
      setListening(false);
      console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = (event) => {
      console.log("Speech recognition result:", event);
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev ? prev + " " + transcript : transcript);
    };

    recognition.start();
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleShowMap = () => {
    window.open("https://incois.gov.in/OON/index.jsp", "_blank");
  };

  const handleExport = () => {
    if (onExport) {
      onExport();  // Trigger the export callback
    }
  };

  return (
    <div className="p-4 border-t border-neutral-800">
      <div className="bg-neutral-900 rounded-2xl p-3 flex items-center">
        <input
          type="text"
          placeholder="Ask me about ocean data, temperature profiles, float locations..."
          className="flex-1 bg-transparent outline-none text-gray-300 px-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          maxLength={1000}
        />
        <span className="text-xs text-gray-500 mr-2">{text.length}/1000</span>
        <button
          onClick={handleMicClick}
          className={`p-3 rounded-full mr-2 ${listening ? "bg-green-500" : "bg-neutral-800"}`}
          aria-label="Start voice input"
        >
          <Mic className="w-5 h-5" />
        </button>
        {listening && (
          <button
            onClick={handleStop}
            className="p-3 rounded-full mr-2 bg-red-500"
            aria-label="Stop voice input"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-green-400 to-teal-500 p-3 rounded-full"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-3">
        <ActionButton 
          icon={<Map />} 
          label="Show Map" 
          onClick={handleShowMap}
        />
        <ActionButton icon={<TrendingUp />} label="Depth Profile" />
        <ActionButton 
          icon={<Download />} 
          label="Export Data" 
          onClick={handleExport}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button 
      className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-xl"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}