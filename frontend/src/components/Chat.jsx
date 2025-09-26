import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");

  // Function to handle quick actions
  const handleQuickAction = (text) => {
    setInput(text); // 👈 sets the input box value
  };
  <div className="flex space-x-2 p-2 bg-gray-900">
  <button
    onClick={() => handleQuickAction("Show Map")}
    className="px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
  >
    Show Map
  </button>
  <button
    onClick={() => handleQuickAction("Depth Profile")}
    className="px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
  >
    Depth Profile
  </button>
  <button
    onClick={() => handleQuickAction("Export Data")}
    className="px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
  >
    Export Data
  </button>
</div>


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Window */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* messages here */}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        {/* Quick Action Buttons */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleQuickAction("Show Map")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Show Map
          </button>
          <button
            onClick={() => handleQuickAction("Depth Profile")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Depth Profile
          </button>
          <button
            onClick={() => handleQuickAction("Export Data")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Export Data
          </button>
        </div>

        {/* Input bar */}
        <div className="flex items-center bg-gray-800 rounded-lg px-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about ocean data..."
            className="flex-1 bg-transparent outline-none py-2 text-white"
          />
          <button className="ml-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
