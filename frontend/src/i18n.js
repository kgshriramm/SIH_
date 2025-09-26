// src/i18n.js (Create this file if not exists)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      helloImFloatChat: "Hello! I'm FloatChat, your AI assistant for exploring ARGO ocean float data. I can help you analyze temperature profiles, salinity data, float locations, and compare oceanographic conditions across regions. What would you like to explore?",
      selectLanguage: "Select Language",
      quickActions: "QUICK ACTIONS",
      showMap: "Show Map",
      depthProfile: "Depth Profile",
      compareRegions: "Compare Regions",
      floatProfiles: "Float Profiles",
      chat: "Chat",
      floatMap: "Float Map",
      analytics: "Analytics",
      dataExport: "Data Export",
      showMeOceanFloatMap: "Show me the ocean float map",
      generateDepthProfileAnalysis: "Generate a depth profile analysis",
      compareDifferentOceanRegions: "Compare different ocean regions",
      showMeFloatProfiles: "Show me float profiles",
      // Add more keys as needed for other components, e.g., placeholder: "Ask me about ocean data..."
    }
  },
  es: {
    translation: {
      helloImFloatChat: "¡Hola! Soy FloatChat, tu asistente de IA para explorar datos de flotadores oceánicos ARGO. Puedo ayudarte a analizar perfiles de temperatura, datos de salinidad, ubicaciones de flotadores y comparar condiciones oceanográficas en regiones. ¿Qué te gustaría explorar?",
      selectLanguage: "Seleccionar idioma",
      quickActions: "ACCIONES RÁPIDAS",
      showMap: "Mostrar mapa",
      depthProfile: "Perfil de profundidad",
      compareRegions: "Comparar regiones",
      floatProfiles: "Perfiles de flotadores",
      chat: "Chat",
      floatMap: "Mapa de flotadores",
      analytics: "Análisis",
      dataExport: "Exportar datos",
      showMeOceanFloatMap: "Muéstrame el mapa de flotadores oceánicos",
      generateDepthProfileAnalysis: "Generar un análisis de perfil de profundidad",
      compareDifferentOceanRegions: "Comparar diferentes regiones oceánicas",
      showMeFloatProfiles: "Muéstrame perfiles de flotadores",
    }
  },
  fr: {
    translation: {
      helloImFloatChat: "Bonjour ! Je suis FloatChat, votre assistant IA pour explorer les données des flotteurs océaniques ARGO. Je peux vous aider à analyser les profils de température, les données de salinité, les emplacements des flotteurs et à comparer les conditions océanographiques dans les régions. Que souhaitez-vous explorer ?",
      selectLanguage: "Sélectionner la langue",
      quickActions: "ACTIONS RAPIDES",
      showMap: "Afficher la carte",
      depthProfile: "Profil de profondeur",
      compareRegions: "Comparer les régions",
      floatProfiles: "Profils de flotteurs",
      chat: "Chat",
      floatMap: "Carte des flotteurs",
      analytics: "Analyses",
      dataExport: "Exporter les données",
      showMeOceanFloatMap: "Montrez-moi la carte des flotteurs océaniques",
      generateDepthProfileAnalysis: "Générer une analyse de profil de profondeur",
      compareDifferentOceanRegions: "Comparer différentes régions océaniques",
      showMeFloatProfiles: "Montrez-moi les profils de flotteurs",
    }
  },
  hi: {
    translation: {
      helloImFloatChat: "नमस्ते! मैं फ्लोटचैट हूं, ARGO महासागर फ्लोट डेटा का अन्वेषण करने के लिए आपका AI सहायक। मैं आपको तापमान प्रोफाइल, लवणता डेटा, फ्लोट स्थान और क्षेत्रों में महासागरीय स्थितियों की तुलना करने में मदद कर सकता हूं। आप क्या अन्वेषण करना चाहेंगे?",
      selectLanguage: "भाषा चुनें",
      quickActions: "त्वरित कार्रवाइयाँ",
      showMap: "मानचित्र दिखाएं",
      depthProfile: "गहराई प्रोफाइल",
      compareRegions: "क्षेत्रों की तुलना करें",
      floatProfiles: "फ्लोट प्रोफाइल",
      chat: "चैट",
      floatMap: "फ्लोट मानचित्र",
      analytics: "विश्लेषण",
      dataExport: "डेटा निर्यात",
      showMeOceanFloatMap: "मुझे महासागर फ्लोट मानचित्र दिखाएं",
      generateDepthProfileAnalysis: "गहराई प्रोफाइल विश्लेषण उत्पन्न करें",
      compareDifferentOceanRegions: "विभिन्न महासागर क्षेत्रों की तुलना करें",
      showMeFloatProfiles: "मुझे फ्लोट प्रोफाइल दिखाएं",
    }
  },
  kn: {
    translation: {
      helloImFloatChat: "ನಮಸ್ಕಾರ! ನಾನು ಫ್ಲೋಟ್‌ಚ್ಯಾಟ್, ARGO ಸಮುದ್ರ ಫ್ಲೋಟ್ ಡೇಟಾವನ್ನು ಅನ್ವೇಷಿಸಲು ನಿಮ್ಮ AI ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ತಾಪಮಾನ ಪ್ರೊಫೈಲ್‌ಗಳು, ಉಪ್ಪುನೀರಿನ ಡೇಟಾ, ಫ್ಲೋಟ್ ಸ್ಥಳಗಳು ಮತ್ತು ಪ್ರದೇಶಗಳಲ್ಲಿ ಸಮುದ್ರೀಯ ಸ್ಥಿತಿಗಳನ್ನು ಹೋಲಿಸಲು ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ಏನು ಅನ್ವೇಷಿಸಲು ಬಯಸುತ್ತೀರಿ?",
      selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      showMap: "ನಕ್ಷೆಯನ್ನು ತೋರಿಸಿ",
      depthProfile: "ಆಳದ ಪ್ರೊಫೈಲ್",
      compareRegions: "ಪ್ರದೇಶಗಳನ್ನು ಹೋಲಿಸಿ",
      floatProfiles: "ಫ್ಲೋಟ್ ಪ್ರೊಫೈಲ್‌ಗಳು",
      chat: "ಚಾಟ್",
      floatMap: "ಫ್ಲೋಟ್ ನಕ್ಷೆ",
      analytics: "ವಿಶ್ಲೇಷಣೆ",
      dataExport: "ಡೇಟಾ ರಫ್ತು",
      showMeOceanFloatMap: "ನನಗೆ ಸಮುದ್ರ ಫ್ಲೋಟ್ ನಕ್ಷೆಯನ್ನು ತೋರಿಸಿ",
      generateDepthProfileAnalysis: "ಆಳದ ಪ್ರೊಫೈಲ್ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಉತ್ಪಾದಿಸಿ",
      compareDifferentOceanRegions: "ವಿವಿಧ ಸಮುದ್ರ ಪ್ರದೇಶಗಳನ್ನು ಹೋಲಿಸಿ",
      showMeFloatProfiles: "ನನಗೆ ಫ್ಲೋಟ್ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ತೋರಿಸಿ",
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;