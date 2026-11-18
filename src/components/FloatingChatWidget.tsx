import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Globe, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { requestChatReply, type ChatLanguage } from "@/lib/financialChat";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>("english");
  const [sendError, setSendError] = useState("");
  const pendingSend = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = scrollAreaRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [isOpen, messages, isLoading]);
  const { user } = useAuth();
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { isSpeaking, isEnabled: ttsEnabled, speak, toggleEnabled: toggleTTS } = useTextToSpeech();

  const handleVoiceInput = async () => {
    if (!isRecording) {
      await startRecording();
      return;
    }

    try {
      const transcription = await stopRecording();
      if (transcription) setInput(transcription);
    } catch {
      // The recording hook displays the transcription error.
    }
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || !user || pendingSend.current) return;

    pendingSend.current = true;
    setIsLoading(true);
    setSendError("");
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    let reply: string;
    try {
      reply = await requestChatReply(message, language);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: reply,
        isUser: false,
        timestamp: new Date(),
      }]);
      setInput("");
    } catch (error) {
      setMessages(prev => prev.filter(entry => entry.id !== userMessage.id));
      setSendError(error instanceof Error ? error.message : "Could not send your message. Please try again.");
      return;
    } finally {
      pendingSend.current = false;
      setIsLoading(false);
    }

    if (ttsEnabled) speak(reply, language === "hindi" ? "hi-IN" : "en-US");
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <>
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
        {isOpen && (
          <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[300px] shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Financial Assistant</h3>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Please log in to use the chatbot</p>
                <Button onClick={() => window.location.href = '/auth'}>
                  Log In
                </Button>
              </div>
            </div>
          </Card>
        )}
      </>
    );
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Financial Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTTS}
                className={isSpeaking ? "text-primary" : ""}
                title={ttsEnabled ? "Disable audio responses" : "Enable audio responses"}
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-2 border-b">
            <Select value={language} onValueChange={(value: ChatLanguage) => setLanguage(value)}>
              <SelectTrigger className="w-full">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages */}
          <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm">
                <p>Welcome! Ask me anything about finance.</p>
                <p className="mt-2">स्वागत है! वित्त के बारे में कुछ भी पूछें।</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm break-words flex-1">{message.text}</p>
                    {!message.isUser && ttsEnabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 flex-shrink-0"
                        onClick={() => speak(message.text, language === 'hindi' ? 'hi-IN' : 'en-US')}
                        title="Replay audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            {sendError && <p role="alert" className="mb-3 text-sm text-destructive">{sendError}</p>}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading || isProcessing}
              />
              <Button
                onClick={handleVoiceInput}
                disabled={isLoading || isProcessing}
                variant="outline"
                size="icon"
                className={isRecording ? "bg-destructive text-destructive-foreground" : ""}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={sendMessage} size="icon" aria-label="Send message" disabled={isLoading || isProcessing || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default FloatingChatWidget;
