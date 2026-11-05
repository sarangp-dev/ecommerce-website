import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Users,
    Settings,
    X,
} from "lucide-react";

interface SidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

const navLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Customers', path: '/admin/customers', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    return (
        <>
            {/* Mobile Sidebar Overlay Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 w-[260px] bg-[#F7F0E2] border-r border-[#D0C5AF] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-14 flex items-center justify-between px-6 border-b border-[#D0C5AF]">
                    <span className="text-[20px] font-semibold text-[#735C00] tracking-tight">Yuthi Admin</span>
                    <button
                        className="lg:hidden text-[#696B75] p-1 rounded hover:bg-[#EEE7DA]"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
                    {navLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                        ? 'bg-[#735C00] text-[#FFF8F0] shadow-sm'
                                        : 'text-[#696B75] hover:bg-[#EEE7DA]'
                                    }`
                                }
                            >
                                <IconComponent className="w-5 h-5 shrink-0" />
                                <span className="font-medium text-sm">{link.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-[#D0C5AF]">
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#735C00] text-[#FFF8F0]' : 'text-[#696B75] hover:bg-[#EEE7DA]'
                            }`
                        }
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        <span className="font-medium text-sm">Settings</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};