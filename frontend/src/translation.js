export const translations = {
  en: {
    // App.jsx & ChatWindow.jsx
    initialBotMessage: "Hello! I'm FloatChat, your AI assistant for exploring ARGO ocean float data. I can help you analyze temperature profiles, salinity data, float locations, and compare oceanographic conditions across regions. What would you like to explore?",
    backendError: "Error: could not connect to backend.",
    graphMessage: "Here is your graph:",
    debugMessage: (count) => `(Debug Info: Received ${count} data points from backend.)`,
    // Sidebar.jsx
    sidebarTitle: "Float",
    sidebarTitleSpan: "Chat",
    chat: "Chat",
    floatMap: "Float Map",
    analytics: "Analytics",
    dataExport: "Data Export",
    quickActions: "QUICK ACTIONS",
    // InputBar.jsx (Placeholder)
    inputPlaceholder: "Ask me about ocean data, temperature profiles, float locations..."
  },
  es: {
    // App.jsx & ChatWindow.jsx
    initialBotMessage: "¡Hola! Soy FloatChat, tu asistente de IA para explorar datos de flotas oceánicas ARGO. Puedo ayudarte a analizar perfiles de temperatura, datos de salinidad, ubicaciones de flotas y comparar condiciones oceanográficas entre regiones. ¿Qué te gustaría explorar?",
    backendError: "Error: no se pudo conectar al backend.",
    graphMessage: "Aquí está tu gráfico:",
    debugMessage: (count) => `(Info de depuración: Se recibieron ${count} puntos de datos del backend.)`,
    // Sidebar.jsx
    sidebarTitle: "Float",
    sidebarTitleSpan: "Chat",
    chat: "Chat",
    floatMap: "Mapa de Flotas",
    analytics: "Analítica",
    dataExport: "Exportar Datos",
    quickActions: "ACCIONES RÁPIDAS",
    // InputBar.jsx (Placeholder)
    inputPlaceholder: "Pregúntame sobre datos oceánicos, perfiles de temperatura, ubicaciones..."
  },
  // Add other languages here, like French (fr), Hindi (hi), etc.
  hi: {
    initialBotMessage: "नमस्ते! मैं फ्लोटचैट हूं, आर्गो ओशन फ्लोट डेटा की खोज के लिए आपका एआई सहायक। मैं आपको तापमान प्रोफाइल, लवणता डेटा, फ्लोट स्थानों का विश्लेषण करने और क्षेत्रों के बीच समुद्र संबंधी स्थितियों की तुलना करने में मदद कर सकता हूं। आप क्या खोजना चाहेंगे?",
    backendError: "त्रुटि: बैकएंड से कनेक्ट नहीं हो सका।",
    graphMessage: "यह रहा आपका ग्राफ:",
    debugMessage: (count) => `(डीबग जानकारी: बैकएंड से ${count} डेटा पॉइंट प्राप्त हुए।)`,
    sidebarTitle: "फ्लोट",
    sidebarTitleSpan: "चैट",
    chat: "चैट",
    floatMap: "फ्लोट मानचित्र",
    analytics: "विश्लेषिकी",
    dataExport: "डेटा निर्यात",
    quickActions: "त्वरित कार्रवाई",
    inputPlaceholder: "मुझसे समुद्री डेटा, तापमान प्रोफाइल, फ्लोट स्थानों के बारे में पूछें..."
  }
};
