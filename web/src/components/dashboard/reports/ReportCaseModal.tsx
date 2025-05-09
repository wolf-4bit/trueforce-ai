import React, { useState } from 'react';
import { Case } from '../../../service/models/Case';

interface ReportCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: Partial<Case>) => Promise<any>;
  availableTags: string[];
  onNavigateToEvidence?: (caseId: number | string) => void;
}

const ReportCaseModal: React.FC<ReportCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableTags,
  onNavigateToEvidence
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Case>>({
    name: '',
    status: 'Active',
    company: '',
    description: '',
    tags: [],
    priority: 'Medium',
    reportedAt: new Date().toISOString()
  });
  
  const steps = [
    { title: 'Basic Info', description: 'Case details' },
    { title: 'Description', description: 'What happened' },
    { title: 'Classification', description: 'Tags & priority' },
    { title: 'Review', description: 'Submit case' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newCase = await onSubmit(formData);
      
      // Navigate to evidence upload if function provided
      if (onNavigateToEvidence && newCase && newCase.id) {
        onNavigateToEvidence(newCase.id);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current step is valid before allowing to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name && formData.company;
      case 1: // Description
        return formData.description && formData.description.length >= 20;
      case 2: // Classification
        return formData.tags && formData.tags.length > 0 && formData.priority;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
        <h3 className="font-bold text-lg mb-6">Report New Case</h3>
        
        
        <ul className="steps w-full mb-8">
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

        <div className="p-1">
          
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Case Title</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Related Company/Entity</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company or entity involved"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          
          {currentStep === 1 && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Case Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the case..."
                className="textarea textarea-bordered h-48"
                required
              />
              <label className="label">
                <span className="label-text-alt">Minimum 20 characters</span>
                <span className={`label-text-alt ${formData.description && formData.description.length < 20 ? 'text-error' : 'text-success'}`}>
                  {formData.description ? formData.description.length : 0}/20 characters
                </span>
              </label>
            </div>
          )}

          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Priority</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags (Select at least one)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableTags.map(tag => (
                    <label key={tag} className="cursor-pointer label justify-start gap-2 hover:bg-gray-50 rounded-md p-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={formData.tags?.includes(tag) || false}
                        onChange={() => handleTagToggle(tag)}
                      />
                      <span className="label-text">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-md">Review Case Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Title</p>
                  <p className="mt-1">{formData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Related Company</p>
                  <p className="mt-1">{formData.company}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">{formData.status}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className="mt-1">{formData.priority}</p>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{formData.description}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="flex items-center text-blue-800 font-medium mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Next Steps
                </p>
                <p className="text-sm text-blue-700">
                  After submitting this case, you'll be directed to an evidence upload page where you can:
                </p>
                <ul className="text-sm text-blue-700 list-disc list-inside mt-2">
                  <li>Upload bodycam footage</li>
                  <li>Process evidence for AI-generated summaries</li>
                  <li>Review and edit the First Information Report (FIR)</li>
                  <li>Manage case timeline and tags</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          {currentStep > 0 && (
            <button 
              onClick={handlePrevious}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={handleNext}
              className="btn btn-primary"
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Submit & Continue to Evidence
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCaseModal; 