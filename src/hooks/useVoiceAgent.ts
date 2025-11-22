import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak your instructions to adjust the bubble",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];
            
            // TODO: Call backend edge function when Lovable Cloud is enabled
            // const response = await fetch('/functions/v1/voice-agent', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ audio: base64Audio }),
            // });
            
            // For now, show a placeholder message
            toast({
              title: "Processing...",
              description: "Voice agent backend needs to be set up with Lovable Cloud",
            });
            
            setIsProcessing(false);
            resolve(null);
          } catch (error) {
            console.error('Error processing audio:', error);
            toast({
              title: "Processing Error",
              description: "Failed to process your voice input",
              variant: "destructive",
            });
            setIsProcessing(false);
            reject(error);
          }
        };
      });
    } catch (error) {
      console.error('Error in processAudio:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    isListening,
    isProcessing,
    startRecording,
    stopRecording,
  };
};
