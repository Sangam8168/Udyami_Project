import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const supported = typeof window !== "undefined" && "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance === "function";

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (!supported || !isEnabled || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set language based on input
    if (lang.includes('hi') || /[\u0900-\u097F]/.test(text)) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    // Configure speech properties
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      utteranceRef.current = null;
      
      toast({
        title: "Audio Error",
        description: "Could not play audio response. Please check your browser settings.",
        variant: "destructive",
      });
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      utteranceRef.current = null;
      toast({
        title: "Audio Error",
        description: "Could not play audio response. Please check your browser settings.",
        variant: "destructive",
      });
    }
  }, [supported, isEnabled, toast]);

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [supported]);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  return {
    isSpeaking,
    isEnabled: supported && isEnabled,
    speak,
    stop,
    toggleEnabled,
  };
};
