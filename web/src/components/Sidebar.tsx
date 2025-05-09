import {
    LayoutDashboard,
    Library,
    Users,
    Activity,
    LifeBuoy,
    Settings,
} from "lucide-react";
import SidebarLogo from "./SidebarLogo";
import NavigationSection from "./NavigationSection";
import UserInfo from "./UserInfo";

// Define navigation items data
const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Library, label: "Reports", href: "/dashboard/reports" },
    { icon: Users, label: "People", href: "/dashboard/people" },
    { icon: Activity, label: "Chat with AI", href: "/dashboard/chat" },
];

const supportNavItems = [
    { icon: LifeBuoy, label: "Get Started", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
];

// Example user data (replace with actual data source)
const userData = {
    avatarUrl: "https://placehold.co/40x40/black/white?text=SW",
    userName: "Sam Wheeler",
    userEmail: "samwheeler@example.com",
};

export default function Sidebar() {
    return (
        <div className="flex h-full flex-col justify-between p-4 bg-base-100 text-base-content w-64">
            <div className="flex flex-col items-start">
                <SidebarLogo />

                <NavigationSection items={mainNavItems} />

                
                <NavigationSection title="Support" items={supportNavItems} />
            </div>

            
            <UserInfo
                avatarUrl={userData.avatarUrl}
                userName={userData.userName}
                userEmail={userData.userEmail}
            />
        </div>
    );
} 