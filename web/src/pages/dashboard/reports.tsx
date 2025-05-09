import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Case } from '../../service/models/Case';
import { caseService } from '../../service/api/caseService';
import ActionBar from '../../components/dashboard/reports/ActionBar';
import StatsCardSection from '../../components/dashboard/reports/StatsCardSection';
import CaseTableSection from '../../components/dashboard/reports/CaseTableSection';
import ReportCaseModal from '../../components/dashboard/reports/ReportCaseModal';
import SuccessNotification from '../../components/dashboard/reports/SuccessNotification';
import { getTagClass } from '../../components/dashboard/reports/utils';

export default function ReportsComponent() {
  const navigate = useNavigate();
  
  // State for case data
  const [cases, setCases] = useState<Case[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 8
  });
  
  // State for stats
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    pendingCases: 0,
    solvedCases: 0,
    caseGrowth: { percentage: 0, isPositive: true },
    pendingGrowth: { percentage: 0, isPositive: true },
    solvedGrowth: { percentage: 0, isPositive: true }
  });
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Case>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    isVisible: false
  });
  
  const officeAvatars = [
    'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  ];

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const response = await caseService.getCases({
        search: searchQuery,
        sortBy,
        sortDirection,
        page: pagination.currentPage,
        perPage: pagination.perPage,
        status: statusFilter === 'all' ? undefined : statusFilter,
        tags: tagFilter
      });
      
      setCases(response.cases);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setIsStatsLoading(true);
    try {
      const stats = await caseService.getCaseStats();
      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await caseService.getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  useEffect(() => {
    loadStats();
    loadCases();
    loadTags();
  }, []);

  useEffect(() => {
    loadCases();
  }, [searchQuery, sortBy, sortDirection, statusFilter, tagFilter, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    
    if (value === 'newest' || value === 'oldest') {
      setSortBy('id');
      setSortDirection(value === 'newest' ? 'desc' : 'asc');
    } else if (value === 'a-z' || value === 'z-a') {
      setSortBy('name');
      setSortDirection(value === 'a-z' ? 'asc' : 'desc');
    }
  };

  const handleStatusFilterChange = (status: 'all' | 'Active' | 'Inactive') => {
    setStatusFilter(status);
  };

  const handleTagFilterChange = (tag: string) => {
    setTagFilter(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };
  
  // Handle opening the report new case modal
  const handleReportNewCase = () => {
    setIsModalOpen(true);
  };

  // Navigate to evidence management page
  const navigateToEvidence = (caseId: number | string) => {
    navigate({ to: '/dashboard/evidence-management', search: { caseId } });
  };

  // Handle form submission
  const handleSubmitCase = async (caseData: any) => {
    try {
      const newCase = await caseService.addCase(caseData);
      
      // Refresh the case list and stats
      loadCases();
      loadStats();
      
      // Show success notification
      setNotification({
        message: `Case "${newCase.name}" has been successfully reported!`,
        isVisible: true
      });
      
      return newCase;
    } catch (error) {
      console.error('Error submitting case:', error);
      throw error;
    }
  };

  const handleCaseClick = (caseId: number | string) => {
    navigateToEvidence(caseId);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const paginationData = {
    currentPage: pagination.currentPage,
    totalPages: Math.max(3, pagination.totalPages), 
    totalItems: Math.max(24, pagination.total), 
    itemsPerPage: pagination.perPage,
    onPageChange: handlePageChange
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="p-4 md:p-6">
        
        <ActionBar title="Cases" onReportNewCase={handleReportNewCase} />
        
        
        <StatsCardSection 
          stats={stats} 
          isLoading={isStatsLoading} 
          officeAvatars={officeAvatars} 
        />

        
        <CaseTableSection
          cases={cases}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          tagFilter={tagFilter}
          availableTags={availableTags}
          handleTagFilterChange={handleTagFilterChange}
          handleSortChange={handleSortChange}
          getTagClass={getTagClass}
          paginationData={paginationData}
          onCaseClick={handleCaseClick}
        />
        
        
        <ReportCaseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitCase}
          availableTags={availableTags}
          onNavigateToEvidence={navigateToEvidence}
        />

        
        <SuccessNotification
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={handleCloseNotification}
          duration={5000}
        />
      </div>
    </div>
  );
}
