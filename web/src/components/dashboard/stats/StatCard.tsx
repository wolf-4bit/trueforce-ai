import React, { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  avatars?: string[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, avatars }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-6 flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            {icon}
          </div>
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
            
            {trend && (
              <p className={`text-xs mt-1 ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                <span className="inline-flex items-center">
                  <svg 
                    className={`w-3 h-3 mr-1 ${!trend.isPositive ? 'transform rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-6 6a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1zm-8-6a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm8 0a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1z" 
                      clipRule="evenodd"
                    />
                  </svg>
                  {trend.value}
                </span>
              </p>
            )}
            
            {avatars && (
              <div className="avatar-group -space-x-2 mt-1">
                {avatars.map((avatar, index) => (
                  <div key={index} className="avatar">
                    <div className="w-6 h-6 rounded-full ring-2 ring-base-100">
                      <img src={avatar} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 