import React from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckSquare,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  MoreVertical,
  Upload,
  Archive,
  MessageSquare
} from 'lucide-react';

export const CasesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Briefcase className={className || "h-6 w-6 text-green-500"} />
);

export const PendingCasesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Clock className={className || "h-6 w-6 text-green-500"} />
);

export const SolvedCasesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckSquare className={className || "h-6 w-6 text-green-500"} />
);

export const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <TrendingUp className={className || "w-3 h-3 mr-1"} />
);

export const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <TrendingDown className={className || "w-3 h-3 mr-1"} />
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ChevronLeft className={className || "h-4 w-4"} />
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ChevronRight className={className || "h-4 w-4"} />
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Search className={className || "h-5 w-5 text-gray-400"} />
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <ChevronDown className={className || "h-5 w-5 text-gray-400"} />
);

export const MoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <MoreVertical className={className || "h-5 w-5 text-gray-400"} />
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Upload className={className || "h-4 w-4 mr-2"} />
);

export const ArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Archive className={className || "h-4 w-4 mr-2"} />
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <MessageSquare className={className || "h-4 w-4 mr-2"} />
); 