import React, { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  isLoading: boolean;
  trendValue?: number;
  trendIsPositive?: boolean;
  trendLabel?: string;
  showAvatars?: boolean;
  avatarUrls?: string[];
}

const StatCard: React.FC<StatCardProps> = ({
  icon, 
  title, 
  value, 
  isLoading,
  trendValue,
  trendIsPositive,
  trendLabel = 'this month',
  showAvatars = false,
  avatarUrls = []
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-4 rounded-lg mr-5 ${iconBackgroundColor(title)}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          {isLoading ? (
            <>
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-1 mb-1 w-16"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</h2>
              {trendValue !== undefined && (
                <p className="text-xs font-medium mt-1 flex items-center">
                  {renderTrend(trendIsPositive, trendValue, trendLabel)}
                </p>
              )}
              {showAvatars && avatarUrls.length > 0 && (
                <div className="flex -space-x-2 mt-2 overflow-hidden">
                  {avatarUrls.map((avatar, index) => (
                    <img 
                      key={index}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" 
                      src={avatar} 
                      alt="Officer avatar" 
                      title="Officer avatar"
                    />
                  ))}
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-xs font-medium text-gray-500 ring-2 ring-white">
                    +8
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to determine background color based on title
const iconBackgroundColor = (title: string): string => {
  if (title.includes('Total Cases')) return 'bg-blue-50';
  if (title.includes('Pending')) return 'bg-amber-50';
  if (title.includes('Solved')) return 'bg-green-50';
  return 'bg-gray-50'; // Default
};

// Helper function to render trend indicator
const renderTrend = (isPositive?: boolean, percentage?: number, label?: string) => {
  if (percentage === undefined) return null;
  
  // For pending cases, a positive trend is actually negative (red)
  // For other cases, a positive trend is good (green)
  const isPendingCase = label?.includes('pending');
  const showGreen = isPendingCase ? !isPositive : isPositive;
  
  return showGreen ? (
    <span className="text-green-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
      </svg>
      {percentage}% {label}
    </span> 
  ) : (
    <span className="text-red-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z" clipRule="evenodd" />
      </svg>
      {percentage}% {label}
    </span>
  );
};

export default StatCard; 