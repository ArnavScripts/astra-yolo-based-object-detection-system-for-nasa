import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../utils/languageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: t.chatbotWelcome,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, t.chatbotWelcome]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Knowledge base for ASTRA
    const responses: Record<string, string> = {
      // English responses
      setup:
        'To configure your model:\n1. Go to the Setup tab\n2. Choose your model type (Roboflow, Hugging Face, or Custom)\n3. Enter your endpoint URL and API key\n4. Click "Save Configuration"\n5. Test your connection',
      camera:
        'To use the camera:\n1. Click "Start Camera"\n2. Allow camera permissions in your browser\n3. Position the safety equipment in view\n4. Click "Capture Photo"\n\nIf you see permission errors, check your browser settings.',
      error:
        'Common issues:\n\n1. "Model not configured" - Go to Setup tab and configure your model\n2. "Permission denied" (camera) - Allow camera access in browser settings\n3. "No objects detected" - Ensure image contains safety equipment\n\nCheck the documentation for detailed help!',
      objects:
        "ASTRA can detect 7 safety objects:\n🔥 Fire Extinguisher\n💨 Oxygen Tank\n🫧 Nitrogen Tank\n🩹 First Aid Box\n🚨 Fire Alarm\n🔌 Safety Switch Panel\n📞 Emergency Phone",
      help: "I can help you with:\n• Setting up your model\n• Using the camera\n• Troubleshooting errors\n• Understanding detection results\n• Batch processing\n• Exporting data\n\nWhat would you like to know?",

      // Hindi responses
      सेटअप:
        'अपने मॉडल को कॉन्फ़िगर करने के लिए:\n1. सेटअप टैब पर जाएं\n2. अपना मॉडल प्रकार चुनें\n3. अपना एंडपॉइंट URL और API कुंजी दर्ज करें\n4. "कॉन्फ़िगरेशन सहेजें" पर क्लिक करें\n5. अपने कनेक्शन का परीक्षण करें',
      कैमरा:
        'कैमरे का उपयोग करने के लिए:\n1. "कैमरा शुरू करें" पर क्लिक करें\n2. अपने ब्राउज़र में कैमरा अनुमतियां दें\n3. दृश्य में सुरक्षा उपकरण रखें\n4. "फोटो कैप्चर करें" पर क्लिक करें',
      त्रुटि:
        'सामान्य समस्याएं:\n1. "मॉडल कॉन्फ़िगर नहीं" - सेटअप टैब पर जाएं\n2. "अनुमति अस्वीकृत" - ब्राउज़र सेटिंग्स जांचें\n3. "कोई वस्तु नहीं मिली" - सुनिश्चित करें कि छवि में सुरक्षा उपकरण है',
      मदद: "मैं आपकी मदद कर सकता हूं:\n• मॉडल सेटअप करना\n• कैमरा उपयोग करना\n• त्रुटियां ठीक करना\n• परिणाम समझना\n\nआप क्या जानना चाहेंगे?",
    };

    // Check for keywords
    if (
      lowerMessage.includes("setup") ||
      lowerMessage.includes("config") ||
      lowerMessage.includes("सेटअप")
    ) {
      return responses[language === "hi" ? "सेटअप" : "setup"];
    }
    if (
      lowerMessage.includes("camera") ||
      lowerMessage.includes("photo") ||
      lowerMessage.includes("कैमरा")
    ) {
      return responses[language === "hi" ? "कैमरा" : "camera"];
    }
    if (
      lowerMessage.includes("error") ||
      lowerMessage.includes("problem") ||
      lowerMessage.includes("त्रुटि")
    ) {
      return responses[language === "hi" ? "त्रुटि" : "error"];
    }
    if (
      lowerMessage.includes("object") ||
      lowerMessage.includes("detect") ||
      lowerMessage.includes("what")
    ) {
      return responses["objects"];
    }
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("मदद")
    ) {
      return responses[language === "hi" ? "मदद" : "help"];
    }
    if (lowerMessage.includes("batch")) {
      return 'Batch processing allows you to detect objects in multiple images at once:\n1. Go to Advanced tab\n2. Upload multiple images\n3. Click "Process Batch"\n4. View results for all images';
    }
    if (lowerMessage.includes("export")) {
      return 'You can export detection results:\n1. After detection, go to the Export panel\n2. Choose format (JSON or CSV)\n3. Click "Export Results"\n4. Your file will download automatically';
    }
    if (
      lowerMessage.includes("confidence") ||
      lowerMessage.includes("threshold")
    ) {
      return "Confidence threshold controls detection sensitivity:\n• Lower threshold (0.1-0.3): More detections, may include false positives\n• Medium (0.4-0.6): Balanced results\n• Higher (0.7-0.9): Only high-confidence detections\n\nAdjust in the Advanced tab!";
    }

    // Default response
    if (language === "hi") {
      return "मुझे खेद है, मैं आपकी मदद करना चाहता हूं! आप मुझसे पूछ सकते हैं:\n• सेटअप कैसे करें\n• कैमरा कैसे उपयोग करें\n• त्रुटियां कैसे ठीक करें\n• कौन सी वस्तुएं पहचानी जा सकती हैं";
    }
    return "I'd love to help! You can ask me about:\n• How to setup ASTRA\n• How to use the camera\n• How to fix errors\n• What objects can be detected\n• Batch processing\n• Exporting results";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="bg-slate-900/95 border-blue-500/30 shadow-2xl backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-blue-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                      <Bot className="w-5 h-5" />
                    </div>
                    {t.chatbotTitle}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      {isMinimized ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <Minimize2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0">
                  {/* Messages */}
                  <ScrollArea className="h-96 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${
                            message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-blue-600"
                                : "bg-gradient-to-r from-blue-600 to-purple-600"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={`flex-1 ${
                              message.role === "user"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            <div
                              className={`inline-block rounded-lg px-4 py-2 ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-800 text-slate-100"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-slate-800 rounded-lg px-4 py-2">
                            <div className="flex gap-1">
                              <div
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t border-blue-500/20">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t.chatbotPlaceholder}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
