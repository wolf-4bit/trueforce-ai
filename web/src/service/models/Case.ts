export interface Officer {
  id: number | string;
  name: string;
  avatar?: string;
  department?: string;
}

export interface Case {
  id: number | string;
  name: string;
  description?: string;
  summary?: string;
  summaryUrl?: string;
  reportTime: string;
  status: 'Active' | 'Inactive';
  tags: string[];
  offices: {
    name: string;
    avatar: string;
  }[];
  officers?: Officer[];
  officerName?: string;
  officerAvatar?: string;
  department?: string;
}

// Sample data for development
export const MOCK_CASES: Case[] = [
  {
    id: 1,
    name: 'Downtown Robbery',
    tags: ['Casualties', 'Violent'],
    offices: [
      { name: 'Homicide Unit', avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { name: 'Intelligence Division', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Armed robbery at downtown bank with two casualties',
    summaryUrl: '/cases/1',
    status: 'Active',
    reportTime: '2023-06-15T09:30:00Z'
  },
  {
    id: 2,
    name: 'Harbor Drug Bust',
    tags: ['Narcotics', 'International'],
    offices: [
      { name: 'Narcotics Division', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80' }
    ],
    summary: 'Major international drug smuggling operation at the harbor',
    summaryUrl: '/cases/2',
    status: 'Inactive',
    reportTime: '2023-05-22T14:45:00Z'
  },
  {
    id: 3,
    name: 'City Hall Corruption',
    tags: ['Corruption', 'Fraud'],
    offices: [
      { name: 'Fraud Division', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { name: 'Public Integrity Unit', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Investigation into alleged corruption at city hall',
    summaryUrl: '/cases/3',
    status: 'Inactive',
    reportTime: '2023-04-18T11:20:00Z'
  },
  {
    id: 4,
    name: 'Museum Heist',
    tags: ['Theft', 'Organized Crime'],
    offices: [
      { name: 'Major Crimes Unit', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { name: 'Art Theft Division', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Sophisticated theft of valuable artifacts from the National Museum',
    summaryUrl: '/cases/4',
    status: 'Active',
    reportTime: '2023-06-02T08:15:00Z'
  },
  {
    id: 5,
    name: 'Serial Arsonist',
    tags: ['Casualties', 'Arson'],
    offices: [
      { name: 'Arson Investigation Unit', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Investigation into series of suspicious fires in the downtown area',
    summaryUrl: '/cases/5',
    status: 'Active',
    reportTime: '2023-05-28T19:45:00Z'
  },
  {
    id: 6,
    name: 'University Hacking',
    tags: ['Cyber Crime', 'Data Breach'],
    offices: [
      { name: 'Cyber Crimes Unit', avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { name: 'Intelligence Division', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Breach of university systems with sensitive student data compromised',
    summaryUrl: '/cases/6',
    status: 'Active',
    reportTime: '2023-06-10T13:30:00Z'
  },
  {
    id: 7,
    name: 'Pharmacy Robberies',
    tags: ['Theft', 'Narcotics', 'Casualties'],
    offices: [
      { name: 'Robbery Division', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80' },
      { name: 'Narcotics Division', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Series of armed robberies targeting pharmacies for prescription drugs',
    summaryUrl: '/cases/7',
    status: 'Active',
    reportTime: '2023-06-08T22:15:00Z'
  },
  {
    id: 8,
    name: 'Waterfront Murder',
    tags: ['Casualties', 'Homicide', 'Organized Crime'],
    offices: [
      { name: 'Homicide Unit', avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { name: 'Organized Crime Unit', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
    ],
    summary: 'Body discovered at the waterfront with suspected ties to organized crime',
    summaryUrl: '/cases/8',
    status: 'Inactive',
    reportTime: '2023-05-15T07:40:00Z'
  }
]; 