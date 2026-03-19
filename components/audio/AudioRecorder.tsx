
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, Loader2, Sparkles } from 'lucide-react';
import { gemini } from '../../lib/ai/gemini';

const AudioRecorder: React.FC<{ onTranscription: (text: string) => void }> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerInterval = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/mp3' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      timerInterval.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Erreur micro:", err);
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  };

  const handleProcess = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await gemini.transcribeAudio(base64);
        onTranscription(result || "Transcription échouée.");
        setIsProcessing(false);
        setAudioBlob(null);
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl w-full shadow-2xl">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          isRecording ? 'bg-red-500/10 border-4 border-red-500 animate-pulse scale-110' : 'bg-slate-800 border-4 border-slate-700'
        }`}>
          <Mic size={40} className={isRecording ? 'text-red-500' : 'text-slate-400'} />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">
            {isRecording ? "Enregistrement en cours..." : audioBlob ? "Enregistrement terminé" : "Studio d'enregistrement Sovereign"}
          </h2>
          <p className="text-slate-500 text-sm">
            {isRecording ? "Votre voix est capturée en temps réel" : "Capturez vos réunions et laissez l'IA faire le reste."}
          </p>
        </div>

        <div className="text-4xl font-mono font-bold text-slate-100 tabular-nums">
          {formatTime(duration)}
        </div>

        <div className="flex items-center space-x-4 w-full justify-center">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-bold flex items-center shadow-lg shadow-brand-primary/20 transition-all"
            >
              <Mic size={20} className="mr-2" />
              Démarrer l'enregistrement
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center shadow-lg shadow-red-500/20 transition-all"
            >
              <Square size={20} className="mr-2" />
              Arrêter
            </button>
          )}

          {audioBlob && !isProcessing && (
            <>
              <button
                onClick={() => { setAudioBlob(null); setDuration(0); }}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={handleProcess}
                className="flex-1 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Sparkles size={20} className="mr-2" />
                Analyser avec IA
              </button>
            </>
          )}

          {isProcessing && (
            <div className="flex items-center text-slate-400 font-medium">
              <Loader2 size={20} className="mr-3 animate-spin text-brand-primary" />
              Traitement par Gemini en cours...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
