// src/components/NavigationSection.tsx
import { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    href?: string; // Optional href for the link
    isActive?: boolean; // Optional flag for active state
}

interface NavigationSectionProps {
    title?: string;
    items: NavItemProps[];
}

export default function NavigationSection({ title, items }: NavigationSectionProps) {
    return (
        <>
            {title && (
                <>
                    <div className="divider"></div>
                    <p className="px-4 text-xs uppercase text-base-content/50 mb-2">
                        {title}
                    </p>
                </>
            )}
            <ul className="menu space-y-2">
                {items.map((item, index) => (
                    <li key={index}>
                        {item.href?.startsWith('/') ? (
                            <Link
                                to={item.href}
                                className={`flex text-[#4D4D4D] items-center justify-start font-medium text-sm hover:bg-[#E9EFFF] ${
                                    item.isActive ? "active bg-primary/10 text-primary" : ""
                                }`}
                                activeProps={{ className: "active bg-primary/10 text-primary" }}
                                preload="intent"
                            >
                                <item.icon size={24} className="mr-2" />
                                {item.label}
                            </Link>
                        ) : (
                            <a 
                                href={item.href || "#"}
                                className={`flex text-[#4D4D4D] items-center justify-start font-medium text-sm hover:bg-[#E9EFFF] ${
                                    item.isActive ? "active bg-primary/10 text-primary" : ""
                                }`}
                                onClick={(e) => {
                                    if (item.href === "#") {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <item.icon size={24} className="mr-2" />
                                {item.label}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
} 