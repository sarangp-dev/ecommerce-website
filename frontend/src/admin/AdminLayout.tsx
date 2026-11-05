import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, Search, Bell } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-[#FFF8F0] text-[#3D404C] font-sans h-screen flex flex-col md:flex-row overflow-hidden selection:bg-[#D0C5AF] selection:text-[#3D404C] relative">
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">


                <div className="flex-1 overflow-y-auto bg-[#FFF8F0]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};