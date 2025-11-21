import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 mb-4">
        EarHRIR Generator
      </h1>
      <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
        Create personalized HeSuVi virtualization files by analyzing your unique ear shape with <span className="text-indigo-400 font-semibold">Gemini 3 Pro</span>.
      </p>
    </div>
  );
};
