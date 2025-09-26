import React from "react";

export default function MessageBubble({ msg }) {
  const isUser = msg.sender === "user" || msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-2xl p-4 rounded-2xl ${isUser ? "bg-green-600 text-white" : "bg-neutral-800 text-gray-200"}`}>
        <div dangerouslySetInnerHTML={{__html: msg.text || msg.content }} />
        <div className="text-xs text-gray-400 mt-2">{msg.time || msg._time}</div>
      </div>
    </div>
  );
}
