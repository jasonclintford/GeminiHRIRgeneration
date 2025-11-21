import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HRIRData } from '../types';
import { createWavBlob } from '../utils/wavGenerator';

interface ResultViewProps {
  data: HRIRData;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ data, onReset }) => {
  
  const chartData = data.impulseResponse.map((val, idx) => ({
    time: idx,
    amplitude: val
  }));

  const handleDownload = () => {
    const blob = createWavBlob(data.impulseResponse, data.sampleRate);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom_hrir_${data.channel}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
          <p className="text-slate-400">Generated personalized HRIR profile based on biometric scan.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition text-sm font-medium"
          >
            Analyze Another
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/20 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download WAV (HeSuVi)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Measurements Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Biometric Estimates
          </h3>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <div className="space-y-6">
              {data.measurements.map((item, i) => (
                <div key={i} className="border-l-2 border-indigo-500/30 pl-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{item.feature}</div>
                  <div className="text-white font-medium text-lg">{item.value}</div>
                  <p className="text-sm text-slate-400 mt-1">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center">
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            Impulse Response (Time Domain)
          </h3>
          <div className="h-[400px] bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  tick={{fontSize: 10}} 
                  tickFormatter={(val) => `${(val / data.sampleRate * 1000).toFixed(2)}ms`}
                />
                <YAxis stroke="#475569" tick={{fontSize: 10}} domain={[-1, 1]} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9'}}
                  itemStyle={{color: '#818cf8'}}
                  labelFormatter={(label) => `Sample: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="amplitude" 
                  stroke="#818cf8" 
                  strokeWidth={2} 
                  dot={false} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-slate-500 px-2">
             <span>Sample Rate: {data.sampleRate} Hz</span>
             <span>Samples: {data.impulseResponse.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
