import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every 1 second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      console.log('Voice recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsProcessing(true);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              
              console.log('Sending audio to speech-to-text service...');
              
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio },
                headers: {
                  Authorization: `Bearer ${session?.access_token}`,
                },
              });

              if (error) {
                throw error;
              }

              console.log('Transcription result:', data.text);
              setIsProcessing(false);
              resolve(data.text);
            } catch (error) {
              console.error('Error processing audio:', error);
              setIsProcessing(false);
              
              let errorMessage = "Failed to process audio. Please try again.";
              if (error.message?.includes('Too Many Requests')) {
                errorMessage = "API rate limit reached. Please wait a moment and try again.";
              }
              
              toast({
                title: "Processing Error",
                description: errorMessage,
                variant: "destructive",
              });
              reject(error);
            }
          };
          
          reader.onerror = () => {
            setIsProcessing(false);
            reject(new Error('Failed to read audio file'));
          };
          
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          setIsProcessing(false);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      console.log('Voice recording stopped');
    });
  }, [isRecording, session, toast]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};