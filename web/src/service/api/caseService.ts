import { Case, MOCK_CASES } from '../models/Case';

// Define the interface for case search parameters
interface CaseSearchParams {
  search?: string;
  sortBy?: keyof Case;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
  status?: 'Active' | 'Inactive';
  tags?: string[];
}

// Define pagination interface for response
interface PaginatedResponse {
  cases: Case[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
  };
}

// Add a custom interface for case submission data
interface CaseSubmissionData {
  name?: string;
  company?: string;
  status?: 'Active' | 'Inactive';
  description?: string;
  tags?: string[];
  priority?: string;
  reportedAt?: string;
}

// Process mock cases to add officers array based on offices data
const processedMockCases = MOCK_CASES.map(caseItem => {
  return {
    ...caseItem,
    // Convert offices to officers array
    officers: caseItem.offices.map(office => ({
      id: Math.floor(Math.random() * 10000), // Generate random ID
      name: office.name,
      avatar: office.avatar,
      department: 'Department' // Mock department
    })),
    // Add description if not present
    description: caseItem.description || `Case #${caseItem.id} investigation details`
  };
});

// Case service with search, filter, and stats functions
export const caseService = {
  // Get filtered, sorted, and paginated cases
  getCases: async (params: CaseSearchParams = {}): Promise<PaginatedResponse> => {
    const {
      search = '',
      sortBy = 'id',
      sortDirection = 'desc',
      page = 1,
      perPage = 8,
      status,
      tags = []
    } = params;

    // Filter cases
    let filteredCases = [...processedMockCases];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCases = filteredCases.filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        (c.summary && c.summary.toLowerCase().includes(searchLower))
      );
    }

    // Filter by status
    if (status) {
      filteredCases = filteredCases.filter(c => c.status === status);
    }

    // Filter by tags
    if (tags.length > 0) {
      filteredCases = filteredCases.filter(c => 
        tags.some(tag => c.tags.includes(tag))
      );
    }

    // Sort cases
    filteredCases.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    // Paginate cases
    const total = filteredCases.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedCases = filteredCases.slice(offset, offset + perPage);

    // Simulate delay for loading state
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      cases: paginatedCases,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        perPage
      }
    };
  },

  // Get case statistics
  getCaseStats: async () => {
    // Simulate delay for loading state
    await new Promise(resolve => setTimeout(resolve, 1200));

    const totalCases = processedMockCases.length;
    const activeCases = processedMockCases.filter(c => c.status === 'Active').length;
    const pendingCases = activeCases; // For this mock, pending = active
    const solvedCases = totalCases - activeCases;

    return {
      totalCases,
      activeCases,
      pendingCases,
      solvedCases,
      caseGrowth: { percentage: 15, isPositive: true },
      pendingGrowth: { percentage: 5, isPositive: true },
      solvedGrowth: { percentage: 8, isPositive: false }
    };
  },

  // Get all available tags
  getTags: async () => {
    // Extract unique tags from all cases
    const allTags = processedMockCases.flatMap(c => c.tags);
    const uniqueTags = [...new Set(allTags)];
    
    // Simulate delay for loading state
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return uniqueTags;
  },

  // Add a new case to the system
  addCase: async (caseData: CaseSubmissionData): Promise<Case> => {
    // Generate a new ID (in a real API this would be done by the server)
    const newId = Math.max(...processedMockCases.map(c => Number(c.id))) + 1;
    
    // Create a new case with default values for missing fields
    const newCase: Case = {
      id: newId,
      name: caseData.name || 'Untitled Case',
      reportTime: caseData.reportedAt || new Date().toISOString(),
      status: caseData.status || 'Active',
      tags: caseData.tags || [],
      description: caseData.description || `Case #${newId} investigation details`,
      summary: caseData.description ? 
        (caseData.description.length > 100 ? 
          caseData.description.substring(0, 100) + '...' : 
          caseData.description) : 
        `Case #${newId} investigation`,
      summaryUrl: `/cases/${newId}`,
      // Create a default office entry
      offices: [{
        name: 'Case Management Unit',
        avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }]
    };

    // In a real application, we would make an API call here
    // For this mock, we'll simulate a server delay and add to our local array
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to the processed cases array (in a real app, this would be handled by the backend)
    processedMockCases.unshift({
      ...newCase,
      officers: newCase.offices.map(office => ({
        id: Math.floor(Math.random() * 10000),
        name: office.name,
        avatar: office.avatar,
        department: 'Department'
      }))
    });
    
    return newCase;
  }
}; 