import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Mic, MicOff, Loader2, Shield, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [language, setLanguage] = useState<'hindi' | 'english' | 'both'>('both');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Set welcome message based on language
    const welcomeMessages = {
      hindi: "नमस्ते! मैं Udyami की AI असिस्टेंट हूं। मैं आपकी वित्तीय शिक्षा में मदद कर सकती हूं।",
      english: "Hello! I am Udyami's AI assistant. I can help with your financial education.",
      both: "नमस्ते! मैं Udyami की AI असिस्टेंट हूं। मैं आपकी वित्तीय शिक्षा में मदद कर सकती हूं। (Hello! I am Udyami's AI assistant. I can help with your financial education.)"
    };

    setMessages([{
      id: "welcome",
      text: welcomeMessages[language],
      isUser: false,
      timestamp: new Date(),
    }]);
  }, [language]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVoiceInput = async () => {
    if (isRecording) {
      try {
        const transcribedText = await stopRecording();
        if (transcribedText.trim()) {
          setInputMessage(transcribedText);
        }
      } catch (error) {
        console.error('Voice input error:', error);
      }
    } else {
      await startRecording();
    }
  };

  const detectMLFraud = async (message: string): Promise<{ isSuspicious: boolean; reason?: string; severity: 'low' | 'medium' | 'high'; confidence?: number; category?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('ml-fraud-detection', {
        body: { message, language },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        console.error('ML fraud detection error:', error);
        return detectFraudFallback(message);
      }

      return {
        isSuspicious: data.isSuspicious,
        reason: data.reason,
        severity: data.severity,
        confidence: data.confidence,
        category: data.category
      };
    } catch (error) {
      console.error('ML fraud detection failed:', error);
      return detectFraudFallback(message);
    }
  };

  const detectFraudFallback = (message: string): { isSuspicious: boolean; reason?: string; severity: 'low' | 'medium' | 'high' } => {
    const lowerMessage = message.toLowerCase();
    
    // High severity fraud indicators
    const highRiskKeywords = [
      'send money now', 'urgent payment', 'bank account details', 'share otp', 'share pin',
      'lottery winner', 'congratulations you won', 'claim prize', 'government grant',
      'तुरंत पैसे भेजें', 'बैंक अकाउंट डिटेल', 'ओटीपी शेयर', 'पिन शेयर', 'लॉटरी जीती'
    ];
    
    // Medium severity suspicious patterns
    const mediumRiskKeywords = [
      'quick money', 'easy profit', 'guaranteed returns', 'no risk investment',
      'आसान पैसा', 'गारंटी रिटर्न', 'जल्दी पैसा', 'रिस्क फ्री'
    ];
    
    // Pattern detection
    const suspiciousPatterns = [
      /\b\d{10,16}\b/, // Potential phone numbers or account numbers
      /https?:\/\/[^\s]+/i, // URLs
      /\b\d{4}\b.*\b\d{4}\b/, // OTP-like patterns
      /call.*\d{10}/, // Phone number with call instruction
      /click.*link/, // Suspicious link requests
    ];
    
    // Check high risk keywords
    for (const keyword of highRiskKeywords) {
      if (lowerMessage.includes(keyword)) {
        return { 
          isSuspicious: true, 
          reason: `Contains high-risk fraud indicator: "${keyword}"`,
          severity: 'high'
        };
      }
    }
    
    // Check medium risk keywords
    for (const keyword of mediumRiskKeywords) {
      if (lowerMessage.includes(keyword)) {
        return { 
          isSuspicious: true, 
          reason: `Contains medium-risk suspicious content: "${keyword}"`,
          severity: 'medium'
        };
      }
    }
    
    // Check suspicious patterns
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message)) {
        return { 
          isSuspicious: true, 
          reason: "Contains suspicious patterns (phone numbers, URLs, or sensitive data)",
          severity: 'medium'
        };
      }
    }
    
    return { isSuspicious: false, severity: 'low' };
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || loading) return;

    // ML-powered fraud detection with fallback
    const fraudCheck = await detectMLFraud(textToSend);
    if (fraudCheck.isSuspicious) {
      const severityIcons = {
        low: "⚠️",
        medium: "🛡️", 
        high: "🚨"
      };
      
      const severityMessages = {
        low: "Advisory",
        medium: "Security Warning",
        high: "High Risk Alert"
      };

      const confidenceText = fraudCheck.confidence ? ` (Confidence: ${fraudCheck.confidence}%)` : '';
      const categoryText = fraudCheck.category ? ` Category: ${fraudCheck.category}` : '';
      
      toast({
        title: `${severityIcons[fraudCheck.severity]} ${severityMessages[fraudCheck.severity]}`,
        description: `${fraudCheck.reason}${confidenceText}${categoryText}`,
        variant: fraudCheck.severity === 'high' ? "destructive" : "default",
      });
      
      // For high severity, block the message completely
      if (fraudCheck.severity === 'high') {
        return;
      }
      
      // For medium/low severity, show warning but allow message after 2 seconds
      if (fraudCheck.severity === 'medium') {
        setTimeout(() => {
          toast({
            title: "Proceeding with caution",
            description: "Message will be processed but flagged for review.",
            variant: "default",
          });
        }, 2000);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('financial-chatbot', {
        body: { message: textToSend, language },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = "Failed to send message. Please try again.";
      
      // Add more specific error handling
      if (error instanceof Error) {
        console.error('Detailed error:', error.message, error.stack);
        if (error.message.includes('Edge Function returned a non-2xx status code')) {
          errorMessage = "Chat service is temporarily unavailable. Please try again in a moment.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[600px] flex flex-col shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-primary" />
                <span>Udyami Financial Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4" />
                <Select value={language} onValueChange={(value: 'hindi' | 'english' | 'both') => setLanguage(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">हिंदी</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4 max-h-96" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg break-words ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {message.isUser && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder={
                    language === 'hindi' ? "अपना सवाल यहाँ लिखें..." :
                    language === 'english' ? "Type your question here..." :
                    "अपना सवाल यहाँ लिखें... (Type your question here...)"
                  }
                  value={inputMessage}
                  onChange={(e) => {
                    console.log('Input changed:', e.target.value);
                    setInputMessage(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading || isProcessing}
                  className="flex-1"
                />
                <Button 
                  onClick={handleVoiceInput}
                  disabled={loading || isProcessing}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={loading || !inputMessage.trim() || isProcessing}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isRecording && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-muted-foreground animate-pulse">
                    🎤 Recording... Click mic to stop
                  </span>
                </div>
              )}
              {isProcessing && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-muted-foreground">
                    Processing speech...
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chatbot;