import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Case } from '../../service/models/Case';
import { caseService } from '../../service/api/caseService';
import { getTagClass } from '../../components/dashboard/reports/utils';

interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  thumbnailUrl?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  description: string;
  tags: string[];
  confidence: number;
}

interface FIRData {
  summary: string;
  suggestedTags: string[];
  selectedTags: string[];
  timelineEvents: TimelineEvent[];
  officerNotes: string;
}

export default function EvidenceManagementPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const caseId = search.caseId || '1';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Set to false directly to skip loading state
  const [uploadedFiles, setUploadedFiles] = useState<EvidenceFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [firData, setFirData] = useState<FIRData>({
    summary: '',
    suggestedTags: [],
    selectedTags: [],
    timelineEvents: [],
    officerNotes: ''
  });
  
  // Create a mock case directly instead of loading from service
  const [caseDetails, setCaseDetails] = useState<Case>({
    id: caseId,
    name: 'Sample Downtown Incident',
    reportTime: new Date().toISOString(),
    status: 'Active',
    tags: ['Theft', 'Confrontation', 'Retail Location'],
    company: 'Local Retail Store',
    description: 'Incident at downtown retail location involving possible theft and confrontation',
    summary: 'Reported theft with confrontation at retail store',
    summaryUrl: '/cases/1',
    offices: [{
      name: 'Patrol Division',
      avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }],
    officers: [{
      id: 101,
      name: 'Officer Johnson',
      avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      department: 'Patrol Division'
    }]
  });
  
  const steps = [
    { title: 'Upload Evidence', description: 'Add bodycam footage' },
    { title: 'Process & Timeline', description: 'AI processing' },
    { title: 'FIR Generation', description: 'Review and edit' }
  ];

  // Add some sample files for demonstration
  useEffect(() => {
    // Add a sample file for demo purposes
    const addDemoFile = () => {
      const sampleFile: EvidenceFile = {
        id: 'sample-1',
        name: 'bodycam_footage_20230615.mp4',
        size: 45687021,
        type: 'video/mp4',
        progress: 100,
        status: 'completed',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590856029620-9b5a4825d3be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      };
      
      setUploadedFiles([sampleFile]);
    };
    
    // Only add demo file if no files already uploaded
    if (uploadedFiles.length === 0) {
      addDemoFile();
    }
  }, []);

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles: EvidenceFile[] = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file upload progress
    newFiles.forEach(file => {
      simulateFileUpload(file.id);
    });
  };
  
  // Simulate file upload (in a real app, this would be an API call)
  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(files => 
          files.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  progress: 100, 
                  status: 'completed',
                  thumbnailUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`
                } 
              : f
          )
        );
      } else {
        setUploadedFiles(files => 
          files.map(f => 
            f.id === fileId ? { ...f, progress: Math.floor(progress) } : f
          )
        );
      }
    }, 200);
  };
  
  // Process evidence (in a real app, this would be an API call)
  const processEvidence = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    setProcessProgress(0);
    
    // Simulate processing delay with progress
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Generate mock FIR data when processing completes
          setTimeout(() => {
            generateMockFIRData();
            setIsProcessing(false);
            setCurrentStep(2); // Move to FIR generation step
          }, 500);
          
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 300);
  };

  // Generate mock FIR data (in a real app, this would come from the backend)
  const generateMockFIRData = () => {
    // Generate random timeline events
    const events: TimelineEvent[] = Array(4).fill(0).map((_, i) => ({
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date(Date.now() - (i * 15 * 60000)).toISOString(),
      description: [
        'Subject approached the store entrance',
        'Verbal confrontation with store employee',
        'Subject displayed threatening behavior',
        'Subject fled the scene in a blue sedan'
      ][i],
      tags: [['Confrontation'], ['Verbal Warning'], ['Threat Display'], ['Vehicle Involved']][i],
      confidence: Math.floor(70 + Math.random() * 30)
    }));
    
    // Generate mock summary based on case details and events
    const summary = `On ${new Date().toLocaleDateString()}, officers responded to a disturbance at ${caseDetails?.company || 'location'}. 
The bodycam footage shows a verbal confrontation that escalated to threatening behavior. 
The subject was identified as a male in his 30s wearing dark clothing.
The subject fled the scene in a blue sedan heading eastbound.
No injuries were reported, but witnesses described feeling threatened.`;

    // Generate suggested tags
    const suggestedTags = ['Confrontation', 'Verbal Dispute', 'Threat Display', 'Vehicle Involved', 'Non-violent', 'Retail Location'];
    
    setFirData({
      summary,
      suggestedTags,
      selectedTags: suggestedTags.slice(0, 3), // Select first few tags by default
      timelineEvents: events,
      officerNotes: ''
    });
  };
  
  const handleTagToggle = (tag: string) => {
    setFirData(prev => {
      if (prev.selectedTags.includes(tag)) {
        return { ...prev, selectedTags: prev.selectedTags.filter(t => t !== tag) };
      } else {
        return { ...prev, selectedTags: [...prev.selectedTags, tag] };
      }
    });
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFirData(prev => ({ ...prev, summary: e.target.value }));
  };
  
  const handleOfficerNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFirData(prev => ({ ...prev, officerNotes: e.target.value }));
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSaveFIR = () => {
    // In a real app, this would save the FIR to the backend
    console.log('Saving FIR:', firData);
    
    // Show success message and navigate back
    alert('Case report saved successfully!');
    
    // Navigate back to case list or case details
    navigate({ to: '/dashboard/reports' });
  };
  
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(files => files.filter(f => f.id !== fileId));
  };

  // Format a file size in bytes to a readable string
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format a timestamp to a readable string
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-500">Loading case information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="p-4 md:p-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center">
              <button 
                onClick={() => navigate({ to: '/dashboard/reports' })}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Case #{caseDetails.id}: {caseDetails.name}</h1>
            </div>
            <p className="text-gray-500 mt-1">Reported on {new Date(caseDetails.reportTime).toLocaleDateString()}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              caseDetails.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {caseDetails.status}
            </span>
          </div>
        </div>

        
        <div className="mb-8">
          <ul className="steps w-full">
            {steps.map((step, index) => (
              <li 
                key={index}
                className={`step ${index <= currentStep ? 'step-primary' : ''}`}
                data-content={index < currentStep ? '✓' : (index + 1).toString()}
              >
                <div className="text-xs md:text-sm">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-gray-500 hidden md:block">{step.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            
            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Upload Bodycam Footage</h2>
                <p className="text-gray-600 mb-6">Upload one or more video files from bodycams for processing. Supported formats: MP4, AVI, MOV.</p>
                
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-4 text-sm text-gray-600">Drag and drop video files here, or</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="btn btn-primary mt-4">
                    Select Files
                  </label>
                </div>
                
                
                {uploadedFiles.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Uploaded Files</h3>
                    <div className="space-y-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center border rounded-lg p-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                              <button 
                                onClick={() => handleRemoveFile(file.id)}
                                className="text-gray-400 hover:text-red-500"
                                disabled={file.status === 'uploading'}
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className={`h-2 rounded-full ${file.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs mt-1 text-gray-500">
                              {file.status === 'uploading' && `Uploading... ${file.progress}%`}
                              {file.status === 'processing' && 'Processing...'}
                              {file.status === 'completed' && 'Upload complete'}
                              {file.status === 'error' && 'Error uploading file'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Process Evidence</h2>
                <p className="text-gray-600 mb-6">
                  Our AI will analyze the bodycam footage to identify key events, create a timeline, and generate a preliminary report.
                </p>
                
                
                {isProcessing ? (
                  <div className="text-center py-8">
                    <div className="radial-progress text-primary mx-auto mb-4" style={{ "--value": Math.floor(processProgress) } as React.CSSProperties}>
                      {Math.floor(processProgress)}%
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Processing Evidence</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Our AI is analyzing the bodycam footage to extract key information. This may take a few minutes depending on the length and number of videos.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="font-semibold text-lg mt-4 mb-2">Ready to Process</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Click the button below to start processing the uploaded bodycam footage. This will analyze the videos to identify events, extract information, and generate a preliminary report.
                    </p>
                    <button 
                      onClick={processEvidence}
                      className="btn btn-primary"
                      disabled={uploadedFiles.length === 0}
                    >
                      Start Processing
                    </button>
                  </div>
                )}
                
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-3">Uploaded Evidence</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 h-32 flex items-center justify-center">
                            {file.thumbnailUrl ? (
                              <img src={file.thumbnailUrl} alt={file.name} className="h-full w-full object-cover" />
                            ) : (
                              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">First Information Report (FIR)</h2>
                <p className="text-gray-600 mb-6">
                  Review and edit the AI-generated report. You can modify the summary, add notes, and manage tags.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 space-y-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Case Summary</span>
                      </label>
                      <textarea
                        value={firData.summary}
                        onChange={handleSummaryChange}
                        className="textarea textarea-bordered h-40"
                        placeholder="Case summary will appear here..."
                      ></textarea>
                      <label className="label">
                        <span className="label-text-alt">AI-generated summary that you can edit</span>
                      </label>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Officer Notes</span>
                      </label>
                      <textarea
                        value={firData.officerNotes}
                        onChange={handleOfficerNotesChange}
                        className="textarea textarea-bordered h-40"
                        placeholder="Add your notes about the case..."
                      ></textarea>
                      <label className="label">
                        <span className="label-text-alt">Additional notes not included in the summary</span>
                      </label>
                    </div>
                  </div>
                  
                  
                  <div className="space-y-6">
                    
                    <div>
                      <h3 className="font-medium mb-3">Tags</h3>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 mb-2">AI-suggested tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {firData.suggestedTags.map(tag => (
                            <label key={tag} className="cursor-pointer inline-flex items-center">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-sm mr-1"
                                checked={firData.selectedTags.includes(tag)}
                                onChange={() => handleTagToggle(tag)}
                              />
                              <span className={`px-2 py-1 text-xs rounded-full ${getTagClass(tag)}`}>
                                {tag}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-sm">Add custom tag:</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered input-sm flex-1"
                            placeholder="Enter custom tag"
                            id="customTag"
                          />
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              const input = document.getElementById('customTag') as HTMLInputElement;
                              if (input.value) {
                                handleTagToggle(input.value);
                                input.value = '';
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    
                    <div>
                      <h3 className="font-medium mb-3">Timeline</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <ul className="steps steps-vertical p-4">
                          {firData.timelineEvents.map((event, index) => (
                            <li key={event.id} className="step step-primary">
                              <div className="text-left py-2">
                                <p className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</p>
                                <p className="font-medium">{event.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {event.tags.map(tag => (
                                    <span 
                                      key={`${event.id}-${tag}`} 
                                      className={`px-2 py-0.5 text-xs rounded-full ${getTagClass(tag)}`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Confidence: {event.confidence}%
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
        <div className="flex justify-between">
          <button 
            onClick={handlePrevious}
            className="btn btn-outline"
            disabled={currentStep === 0}
          >
            Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={handleNext}
              className="btn btn-primary"
              disabled={
                (currentStep === 0 && uploadedFiles.length === 0) ||
                (currentStep === 1 && isProcessing)
              }
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSaveFIR}
              className="btn btn-primary"
            >
              Save & Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 