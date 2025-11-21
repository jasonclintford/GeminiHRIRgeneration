import React, { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisView } from './components/AnalysisView';
import { ResultView } from './components/ResultView';
import { generateHRIRFromImage } from './services/geminiService';
import { HRIRData, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    image: null,
    imagePreviewUrl: null,
    hrirData: null,
    error: null,
    thinkingLog: []
  });

  const handleImageSelect = useCallback(async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      status: 'analyzing',
      image: file,
      imagePreviewUrl: previewUrl,
      error: null
    }));

    try {
      // Call Gemini Service
      const data = await generateHRIRFromImage(file);
      
      setState(prev => ({
        ...prev,
        status: 'complete',
        hrirData: data
      }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || "Failed to analyze image. Please try again."
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    if (state.imagePreviewUrl) {
      URL.revokeObjectURL(state.imagePreviewUrl);
    }
    setState({
      status: 'idle',
      image: null,
      imagePreviewUrl: null,
      hrirData: null,
      error: null,
      thinkingLog: []
    });
  }, [state.imagePreviewUrl]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      
      {/* Navigation/Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">EarHRIR</span>
            </div>
            <div className="flex items-center space-x-4">
               <a href="#" className="text-sm text-slate-400 hover:text-white transition">Docs</a>
               <a href="#" className="text-sm text-slate-400 hover:text-white transition">About</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {state.status === 'idle' && (
          <div className="animate-fade-in space-y-12">
            <Hero />
            <ImageUpload onImageSelect={handleImageSelect} />
            
            {/* Info Section */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              <FeatureCard 
                title="Gemini 3 Thinking" 
                desc="Utilizes the 32k thinking budget to simulate complex acoustic physics based on geometry."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              />
              <FeatureCard 
                title="HeSuVi Ready" 
                desc="Export standard .wav impulse response files compatible with HeSuVi and Equalizer APO."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
              />
               <FeatureCard 
                title="Biometric Analysis" 
                desc="Extracts pinna notch frequencies and concha resonance from 2D images."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              />
            </div>
          </div>
        )}

        {state.status === 'analyzing' && state.imagePreviewUrl && (
          <AnalysisView imagePreviewUrl={state.imagePreviewUrl} />
        )}

        {state.status === 'complete' && state.hrirData && (
          <ResultView data={state.hrirData} onReset={handleReset} />
        )}

        {state.status === 'error' && (
           <div className="max-w-md mx-auto text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
              <p className="text-slate-300 mb-6">{state.error}</p>
              <button onClick={handleReset} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">Try Again</button>
           </div>
        )}

      </main>
    </div>
  );
};

const FeatureCard: React.FC<{title: string, desc: string, icon: React.ReactNode}> = ({ title, desc, icon }) => (
  <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition duration-300 group">
    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all duration-300 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;
