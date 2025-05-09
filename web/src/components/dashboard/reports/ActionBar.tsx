import React from 'react';

interface ActionBarProps {
  title: string;
  onReportNewCase: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ title, onReportNewCase }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <button 
        onClick={onReportNewCase}
        className="btn btn-primary gap-2 px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 border-0 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Report New Case
      </button>
    </div>
  );
};

export default ActionBar; 