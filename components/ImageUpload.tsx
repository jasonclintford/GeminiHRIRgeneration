import React, { ChangeEvent } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label
        htmlFor="file-upload"
        className={`group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
        ${disabled 
          ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed' 
          : 'border-slate-600 bg-slate-800/30 hover:border-indigo-500 hover:bg-slate-800/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            className={`w-12 h-12 mb-4 transition-colors duration-300 ${disabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-indigo-400'}`} 
            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> an ear photo</p>
          <p className="text-xs text-slate-500">PNG, JPG (Max 5MB)</p>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
