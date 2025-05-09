import React from 'react';
import StatCard from './StatCard';
import { 
  CasesIcon, 
  PendingCasesIcon, 
  SolvedCasesIcon 
} from '../../dashboard/icons/DashboardIcons';

interface StatsData {
  totalCases: number;
  activeCases: number;
  pendingCases: number;
  solvedCases: number;
  caseGrowth: { percentage: number; isPositive: boolean };
  pendingGrowth: { percentage: number; isPositive: boolean };
  solvedGrowth: { percentage: number; isPositive: boolean };
}

interface StatsCardSectionProps {
  stats: StatsData;
  isLoading: boolean;
  officeAvatars: string[];
}

const StatsCardSection: React.FC<StatsCardSectionProps> = ({ 
  stats, 
  isLoading,
  officeAvatars
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      
      <StatCard
        icon={<CasesIcon className="h-10 w-10 text-blue-600" />}
        title="Total Cases"
        value={stats.totalCases}
        isLoading={isLoading}
        trendValue={stats.caseGrowth.percentage}
        trendIsPositive={stats.caseGrowth.isPositive}
        trendLabel="this month"
      />

      
      <StatCard
        icon={<PendingCasesIcon className="h-10 w-10 text-amber-500" />}
        title="Pending Cases"
        value={stats.pendingCases}
        isLoading={isLoading}
        trendValue={stats.pendingGrowth.percentage}
        trendIsPositive={stats.pendingGrowth.isPositive}
        trendLabel="this month"
      />

      
      <StatCard
        icon={<SolvedCasesIcon className="h-10 w-10 text-green-600" />}
        title="Total Solved Cases"
        value={stats.solvedCases}
        isLoading={isLoading}
        showAvatars={true}
        avatarUrls={officeAvatars}
      />
    </div>
  );
};

export default StatsCardSection; 