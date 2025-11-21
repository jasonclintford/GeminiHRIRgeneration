import React from 'react';

interface AnalysisViewProps {
  imagePreviewUrl: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ imagePreviewUrl }) => {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
      {/* Image Preview */}
      <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
        <img 
          src={imagePreviewUrl} 
          alt="Uploaded Ear" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 overflow-hidden">
           <div className="w-full h-1 bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,1)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Status Text */}
      <div className="flex flex-col space-y-6 p-6">
        <div className="space-y-2">
           <div className="flex items-center space-x-3">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <h3 className="text-xl font-semibold text-white">Gemini 3 Pro is thinking...</h3>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed">
             The model is currently analyzing the biometric features of the ear. This process involves deep reasoning to map physical shapes to acoustic filter properties (HRTF). 
             <br/><br/>
             <span className="text-indigo-400/80 text-xs uppercase tracking-widest font-bold">Allocated Thinking Budget: 32k Tokens</span>
           </p>
        </div>

        <div className="space-y-3">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>ANALYZING GEOMETRY</span>
            <span>CALCULATING DELAYS</span>
            <span>SYNTHESIZING IR</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
