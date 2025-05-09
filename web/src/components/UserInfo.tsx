// src/components/UserInfo.tsx
import { ChevronDown } from "lucide-react";
interface UserInfoProps {
    avatarUrl: string;
    userName: string;
    userEmail: string;
}

export default function UserInfo({ avatarUrl, userName, userEmail }: UserInfoProps) {
    return (
        <div className="mt-auto">
            <div className="divider"></div>
            <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-base-200 rounded-lg">
                <div className="avatar">
                    <div className="w-10 rounded-full">
                        <img src={avatarUrl} alt="User Avatar" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{userName}</p>
                    <p className="text-xs text-base-content/60 truncate">
                        {userEmail}
                    </p>
                </div>
                
                <ChevronDown size={16} className="text-base-content/60" />
            </div>
        </div>
    );
} 