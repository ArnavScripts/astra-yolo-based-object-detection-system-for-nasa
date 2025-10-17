export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation
  detection: string;
  advanced: string;
  analytics: string;
  setup: string;
  about: string;
  
  // Header
  title: string;
  subtitle: string;
  teamName: string;
  
  // Detection Upload
  uploadTitle: string;
  uploadDescription: string;
  dragDropText: string;
  browseFiles: string;
  supportedFormats: string;
  uploadNew: string;
  clear: string;
  processing: string;
  analyzing: string;
  
  // Detection Results
  resultsTitle: string;
  noResults: string;
  objectsDetected: string;
  confidence: string;
  class: string;
  
  // Camera
  cameraTitle: string;
  startCamera: string;
  stopCamera: string;
  capturePhoto: string;
  retry: string;
  live: string;
  
  // Model Config
  modelConfigTitle: string;
  modelType: string;
  roboflow: string;
  huggingface: string;
  custom: string;
  endpointUrl: string;
  apiKey: string;
  saveConfiguration: string;
  testConnection: string;
  
  // Stats
  detectionCount: string;
  totalObjects: string;
  historyCount: string;
  avgConfidence: string;
  
  // Buttons
  export: string;
  reset: string;
  compare: string;
  process: string;
  
  // Messages
  welcomeMessage: string;
  configureModelMessage: string;
  configureModelNow: string;
  noObjectsDetected: string;
  detectionSuccess: string;
  detectionFailed: string;
  
  // Chatbot
  chatbotTitle: string;
  chatbotPlaceholder: string;
  chatbotWelcome: string;
  askQuestion: string;
  
  // Language
  language: string;
  selectLanguage: string;
  
  // Safety Objects
  fireExtinguisher: string;
  oxygenTank: string;
  nitrogenTank: string;
  firstAidBox: string;
  fireAlarm: string;
  safetySwitchPanel: string;
  emergencyPhone: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    detection: 'Detection',
    advanced: 'Advanced',
    analytics: 'Analytics',
    setup: 'Setup',
    about: 'About',
    
    // Header
    title: 'ASTRA',
    subtitle: 'Automated Space Tracking and Recognition Algorithm',
    teamName: 'Caption',
    
    // Detection Upload
    uploadTitle: 'Upload Image for Detection',
    uploadDescription: 'Upload an image to detect safety objects with YOLOv8',
    dragDropText: 'Drag and drop an image here, or',
    browseFiles: 'Browse Files',
    supportedFormats: 'Supports JPG, PNG, WEBP (Max 10MB)',
    uploadNew: 'Upload New',
    clear: 'Clear',
    processing: 'Processing with YOLOv8...',
    analyzing: 'Analyzing image',
    
    // Detection Results
    resultsTitle: 'Detection Results',
    noResults: 'Upload an image to see detection results',
    objectsDetected: 'Objects Detected',
    confidence: 'Confidence',
    class: 'Class',
    
    // Camera
    cameraTitle: 'Camera Capture',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    capturePhoto: 'Capture Photo',
    retry: 'Retry',
    live: 'LIVE',
    
    // Model Config
    modelConfigTitle: 'Model Configuration',
    modelType: 'Model Type',
    roboflow: 'Roboflow',
    huggingface: 'Hugging Face',
    custom: 'Custom',
    endpointUrl: 'Endpoint URL',
    apiKey: 'API Key',
    saveConfiguration: 'Save Configuration',
    testConnection: 'Test Connection',
    
    // Stats
    detectionCount: 'Detection Count',
    totalObjects: 'Total Objects',
    historyCount: 'History',
    avgConfidence: 'Avg Confidence',
    
    // Buttons
    export: 'Export',
    reset: 'Reset',
    compare: 'Compare',
    process: 'Process',
    
    // Messages
    welcomeMessage: 'Welcome to ASTRA! 🚀',
    configureModelMessage: 'To start detecting safety objects, you need to configure your YOLO model endpoint first.',
    configureModelNow: 'Configure Model Now',
    noObjectsDetected: 'No objects detected in this image.',
    detectionSuccess: 'Detection complete!',
    detectionFailed: 'Detection failed. Please try again.',
    
    // Chatbot
    chatbotTitle: 'AI Assistant',
    chatbotPlaceholder: 'Ask me anything about ASTRA...',
    chatbotWelcome: 'Hello! I\'m your ASTRA AI assistant. How can I help you today?',
    askQuestion: 'Ask a question',
    
    // Language
    language: 'Language',
    selectLanguage: 'Select Language',
    
    // Safety Objects
    fireExtinguisher: 'Fire Extinguisher',
    oxygenTank: 'Oxygen Tank',
    nitrogenTank: 'Nitrogen Tank',
    firstAidBox: 'First Aid Box',
    fireAlarm: 'Fire Alarm',
    safetySwitchPanel: 'Safety Switch Panel',
    emergencyPhone: 'Emergency Phone',
  },
  
  hi: {
    // Navigation
    detection: 'पहचान',
    advanced: 'उन्नत',
    analytics: 'विश्लेषण',
    setup: 'सेटअप',
    about: 'परिचय',
    
    // Header
    title: 'ASTRA',
    subtitle: 'स्वचालित अंतरिक्ष ट्रैकिंग और पहचान एल्गोरिथम',
    teamName: 'Caption',
    
    // Detection Upload
    uploadTitle: 'पहचान के लिए छवि अपलोड करें',
    uploadDescription: 'YOLOv8 के साथ सुरक्षा वस्तुओं का पता लगाने के लिए एक छवि अपलोड करें',
    dragDropText: 'यहां एक छवि खींचें और छोड़ें, या',
    browseFiles: 'फ़ाइलें ब्राउज़ करें',
    supportedFormats: 'JPG, PNG, WEBP समर्थित (अधिकतम 10MB)',
    uploadNew: 'नया अपलोड करें',
    clear: 'साफ़ करें',
    processing: 'YOLOv8 के साथ प्रसंस्करण...',
    analyzing: 'छवि का विश्लेषण',
    
    // Detection Results
    resultsTitle: 'पहचान परिणाम',
    noResults: 'पहचान परिणाम देखने के लिए एक छवि अपलोड करें',
    objectsDetected: 'वस्तुएं पहचानी गईं',
    confidence: 'विश्वास',
    class: 'वर्ग',
    
    // Camera
    cameraTitle: 'कैमरा कैप्चर',
    startCamera: 'कैमरा शुरू करें',
    stopCamera: 'कैमरा बंद करें',
    capturePhoto: 'फोटो कैप्चर करें',
    retry: 'पुनः प्रयास करें',
    live: 'लाइव',
    
    // Model Config
    modelConfigTitle: 'मॉडल कॉन्फ़िगरेशन',
    modelType: 'मॉडल प्रकार',
    roboflow: 'Roboflow',
    huggingface: 'Hugging Face',
    custom: 'कस्टम',
    endpointUrl: 'एंडपॉइंट URL',
    apiKey: 'API कुंजी',
    saveConfiguration: 'कॉन्फ़िगरेशन सहेजें',
    testConnection: 'कनेक्शन परीक्षण करें',
    
    // Stats
    detectionCount: 'पहचान गणना',
    totalObjects: 'कुल वस्तुएं',
    historyCount: 'इतिहास',
    avgConfidence: 'औसत विश्वास',
    
    // Buttons
    export: 'निर्यात',
    reset: 'रीसेट',
    compare: 'तुलना',
    process: 'प्रक्रिया',
    
    // Messages
    welcomeMessage: 'ASTRA में आपका स्वागत है! 🚀',
    configureModelMessage: 'सुरक्षा वस्तुओं का पता लगाना शुरू करने के लिए, आपको पहले अपने YOLO मॉडल एंडपॉइंट को कॉन्फ़िगर करना होगा।',
    configureModelNow: 'अभी मॉडल कॉन्फ़िगर करें',
    noObjectsDetected: 'इस छवि में कोई वस्तु नहीं मिली।',
    detectionSuccess: 'पहचान पूर्ण!',
    detectionFailed: 'पहचान विफल। कृपया पुनः प्रयास करें।',
    
    // Chatbot
    chatbotTitle: 'AI सहायक',
    chatbotPlaceholder: 'ASTRA के बारे में मुझसे कुछ भी पूछें...',
    chatbotWelcome: 'नमस्ते! मैं आपका ASTRA AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    askQuestion: 'प्रश्न पूछें',
    
    // Language
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    
    // Safety Objects
    fireExtinguisher: 'अग्निशामक यंत्र',
    oxygenTank: 'ऑक्सीजन टैंक',
    nitrogenTank: 'नाइट्रोजन टैंक',
    firstAidBox: 'प्राथमिक चिकित्सा बॉक्स',
    fireAlarm: 'आग अलार्म',
    safetySwitchPanel: 'सुरक्षा स्विच पैनल',
    emergencyPhone: 'आपातकालीन फोन',
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en;
}
