import Sidebar from "../../components/Sidebar";
import { Outlet } from "@tanstack/react-router";

export default function Dashboard() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-[#F9F9F9]">
                <Outlet />
            </div>
            <div className="drawer-side border-r border-[#EFF0F6] shadow-lg rounded-r-xl">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <Sidebar />
            </div>
        </div>
    )
}