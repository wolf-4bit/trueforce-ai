import logo from "../assets/logo.svg";

export default function SidebarLogo() {
    return (
        <div className="h-16 mb-4 flex items-center justify-center text-2xl font-bold text-error w-auto">
            <img src={logo} alt="Logo" className="w-44 h-44" />
        </div>
    );
} 