import React, { useState } from 'react';

// Static mock data for a standalone frontend dashboard
interface InventoryItem {
    id: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageUrl: string;
}

const initialInventory: InventoryItem[] = [
    {
        id: '1',
        name: 'Precision Chrono X1',
        category: 'Watch & Accessories',
        sku: 'PCX1-0042',
        price: 499.00,
        stock: 24,
        status: 'In Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGJG6KWhPOmJ88ikfFjOaHO6_0d4v7NEFivtA990wb3ZQ_8uTS7ABvunhTCUybu3TWErRR6aCggyadHh_DFWH61NCrRvOVNysmwyvrAaqVHEmZyBhcf8jn3EjXhKDF64tSNJ6c4DJG3xAyx4IOSJ6iIXzgscAp_MifweISxW69inoQ1xzFXuIGZ7_N3f3cXQuIiQ96zYVM9LIRtbUdT1mFcJYK6H3NPDRC1tXPS2PrC6RnTmsHzXoDBA'
    },
    {
        id: '2',
        name: 'SonicFlow ANC',
        category: 'Audio',
        sku: 'SF-ANC-001',
        price: 299.00,
        stock: 8,
        status: 'Low Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNPW155-y298SWev72I35ZP-VsSJYwpljSSg9T7kXQnVPQ3PXFR1AC7wGDm0aK81naXTctu-IT8iR1aMXpnPZRJ4S1x6yJjc7DJQgugGuwtZgPs8f8qXnSLMLLFx8CwmDvtQeLLSZz2SC7d6Rq7KscBfqZ0pgBzseKjCAoFgbDdmOZt_THBydXtL8uQ7beJNN1mjCNH9ykzY1gu2KOJP_ih5jxWm673vxkyr7t2K-U4U7OURpyD7rP-g'
    },
    {
        id: '3',
        name: 'EliteBook Pro G9',
        category: 'Computers',
        sku: 'EB-PRO-G9',
        price: 1850.00,
        stock: 42,
        status: 'In Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy6YXxehaMCr3X1Pxmtf3igTjR9pz09_AAvNH3BqwsRC5xKFyQd_7SyyhJ7vCyFIRt4Y6htu8KdgKDKcvyX7RM8oT3chRSxADz24TFtNYXyy30dYvzwDUBXYnm4EeEJlTbo1RvR62n61fpNC6Gfp2I9V76SFCVFQ4-hAoBWG4ZLhPvRe04L2V2ed4bn6Xv2_jre1EtepPFUE_EMS6j8cDBe81OGMXD1JZtxLCscp39H7obU9e05vVAqg'
    },
    {
        id: '4',
        name: 'M-Series Notebook',
        category: 'Stationery',
        sku: 'SNB-M-2024',
        price: 45.00,
        stock: 0,
        status: 'Out of Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEkvJMkDKo_Uqjrfi6GYM2uXcG3NCC2ViX5b7piPALxhjXjI-X5i_fDENAZvqy9tuG23aHj8lFJ7vnv3y4gcY0eEI2ggjJ9G7IwW_vlkuse3oJPp65f7DTyVQANSwMqj1JzJkXwzQ4VD6Oal1eg8O_YzG7DA3TzfkgQpWicEW2IqVjvhLfKc3JsRzGj2xAMX_r-YKA3aCrBysJ3o-66EORqdl22OHWl34c0b5B3VTbkGx2NdjBI4WTaA'
    }
];

export const DummyInventoryDashboard: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [searchTerm, setSearchTerm] = useState('');

    // Handle local stock adjustment for frontend interactivity
    const handleStockChange = (id: string, delta: number) => {
        setInventory((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newStock = Math.max(0, item.stock + delta);
                    let newStatus: InventoryItem['status'] = 'In Stock';
                    if (newStock === 0) newStatus = 'Out of Stock';
                    else if (newStock < 10) newStatus = 'Low Stock';
                    return { ...item, stock: newStock, status: newStatus };
                }
                return item;
            })
        );
    };

    const filteredInventory = inventory.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#FFF8F0] text-[#3D404C] font-sans selection:bg-[#D4AF37]/20 selection:text-[#3D404C] min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 h-14 bg-[#FFF8F0] border-b border-[#D0C5AF]">
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-[#696B75] hover:bg-[#EEE7DA] p-2 rounded-full active:scale-95 transition-transform duration-150">
                        menu
                    </button>
                    <h1 className="text-[20px] font-semibold text-[#3D404C] tracking-tight">Inventory Admin</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center bg-[#F7F0E2] px-3 py-1.5 rounded-lg border border-[#D0C5AF] w-64 mr-4 focus-within:ring-2 ring-[#D4AF37]/40 transition-all">
                        <span className="material-symbols-outlined text-[#696B75] text-[20px] mr-2">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-[14px] w-full p-0 placeholder:text-[#696B75]/60 outline-none text-[#3D404C]"
                            placeholder="Search resources..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="material-symbols-outlined text-[#696B75] hover:bg-[#EEE7DA] p-2 rounded-full active:scale-95 transition-transform duration-150">
                        notifications
                    </button>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D0C5AF] cursor-pointer ml-2">
                        <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWWBa5zA1k7_vK8URGuYGeRjAmxanbBwkmg7rUr2svDLZRFgEB0pXNKUwMHL1yJLi4LKvcIkaHZnT6aUiUwTkzqe55Nh85vdiqxbLhUZpXMeKsbetg4Z_EicCQPR6IMHjAtVqbxGYr9xHproJY6jKJAAimtq8im98s2Jpq9hx2G4My2-EuCcSuXib2nU2h2tfs4zbvAEBD0axD_UFyePA3v00Q9sjeGcTFSWepn40-S6f3kkp4hPTpuA"
                            alt="Profile"
                        />
                    </div>
                </div>
            </header>

            <div className="flex min-h-screen pt-14">
                {/* Sidebar Navigation */}
                <aside className="hidden md:flex flex-col w-[260px] bg-[#F7F0E2] border-r border-[#D0C5AF] fixed h-[calc(100vh-3.5rem)]">
                    <nav className="flex-1 py-6 px-4 space-y-2">
                        <a className="flex items-center gap-4 px-4 py-3 bg-[#735C00] text-[#FFF8F0] rounded-lg font-semibold shadow-sm transition-all duration-200" href="#">
                            <span className="material-symbols-outlined text-[#D4AF37]">dashboard</span>
                            <span className="text-[14px]">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 text-[#3D404C] hover:bg-[#EEE7DA] rounded-lg font-semibold transition-all duration-200" href="#">
                            <span className="material-symbols-outlined text-[#696B75]">inventory_2</span>
                            <span className="text-[14px]">Products</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 text-[#3D404C] hover:bg-[#EEE7DA] rounded-lg font-semibold transition-all duration-200" href="#">
                            <span className="material-symbols-outlined text-[#696B75]">shopping_cart</span>
                            <span className="text-[14px]">Orders</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 text-[#3D404C] hover:bg-[#EEE7DA] rounded-lg font-semibold transition-all duration-200" href="#">
                            <span className="material-symbols-outlined text-[#696B75]">analytics</span>
                            <span className="text-[14px]">Analytics</span>
                        </a>
                        <div className="pt-6 mt-6 border-t border-[#D0C5AF]/40">
                            <a className="flex items-center gap-4 px-4 py-3 text-[#3D404C] hover:bg-[#EEE7DA] rounded-lg font-semibold transition-all duration-200" href="#">
                                <span className="material-symbols-outlined text-[#696B75]">settings</span>
                                <span className="text-[14px]">Settings</span>
                            </a>
                        </div>
                    </nav>
                    <div className="p-4">
                        <div className="bg-[#3D404C] p-4 rounded-xl text-[#FFF8F0]">
                            <p className="text-[#D0C5AF] text-[12px] font-medium mb-2 tracking-wider">STORAGE USAGE</p>
                            <div className="w-full bg-[#696B75]/30 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#D4AF37] w-3/4 h-full"></div>
                            </div>
                            <p className="text-[#D0C5AF]/80 text-[11px] mt-2 font-medium">785.4 GB of 1 TB used</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-[260px] p-8 overflow-x-hidden">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <p className="text-[12px] font-semibold text-[#735C00] uppercase tracking-widest mb-1">Operational Overview</p>
                            <h2 className="text-[30px] font-bold text-[#3D404C]">Dashboard</h2>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#D0C5AF] bg-[#FFF8F0] text-[#3D404C] text-[14px] font-semibold rounded-lg hover:bg-[#EEE7DA] transition-colors">
                                <span className="material-symbols-outlined text-[20px] text-[#696B75]">calendar_today</span>
                                Last 30 Days
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#3D5B32] text-[#FFF8F0] text-[14px] font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                New Product
                            </button>
                        </div>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#FFF8F0] p-6 rounded-xl border border-[#D0C5AF] hover:border-[#D4AF37] transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-[#D4AF37]/15 text-[#735C00] rounded-lg">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <span className="text-[12px] px-2 py-0.5 bg-[#3D5B32]/15 text-[#3D5B32] rounded-full font-medium uppercase">+12.5%</span>
                            </div>
                            <p className="text-[#696B75] font-medium text-[14px] mb-1">Total Sales</p>
                            <h3 className="text-[20px] font-semibold text-[#3D404C]">$124,592.00</h3>
                        </div>

                        <div className="bg-[#FFF8F0] p-6 rounded-xl border border-[#D0C5AF] hover:border-[#D4AF37] transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-[#D4AF37]/15 text-[#735C00] rounded-lg">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <span className="text-[12px] px-2 py-0.5 bg-[#3D5B32]/15 text-[#3D5B32] rounded-full font-medium uppercase">+8.2%</span>
                            </div>
                            <p className="text-[#696B75] font-medium text-[14px] mb-1">Gross Profit</p>
                            <h3 className="text-[20px] font-semibold text-[#3D404C]">$42,310.45</h3>
                        </div>

                        <div className="bg-[#FFF8F0] p-6 rounded-xl border border-[#D0C5AF] hover:border-[#D4AF37] transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-500/15 text-red-700 rounded-lg">
                                    <span className="material-symbols-outlined">assignment_return</span>
                                </div>
                                <span className="text-[12px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium uppercase">-2.1%</span>
                            </div>
                            <p className="text-[#696B75] font-medium text-[14px] mb-1">Returns</p>
                            <h3 className="text-[20px] font-semibold text-[#3D404C]">$1,450.00</h3>
                        </div>

                        <div className="bg-[#FFF8F0] p-6 rounded-xl border border-[#D0C5AF] hover:border-[#D4AF37] transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-[#D4AF37]/15 text-[#735C00] rounded-lg">
                                    <span className="material-symbols-outlined">percent</span>
                                </div>
                                <span className="text-[12px] px-2 py-0.5 bg-[#3D5B32]/15 text-[#3D5B32] rounded-full font-medium uppercase">+1.4%</span>
                            </div>
                            <p className="text-[#696B75] font-medium text-[14px] mb-1">Net Margin</p>
                            <h3 className="text-[20px] font-semibold text-[#3D404C]">34.2%</h3>
                        </div>
                    </div>

                    {/* Bento Content Section */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Large Table Container */}
                        <div className="col-span-12 lg:col-span-8 bg-[#FFF8F0] rounded-xl border border-[#D0C5AF] overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-[#D0C5AF] flex items-center justify-between bg-[#F7F0E2]/50">
                                <h4 className="text-[20px] font-semibold text-[#3D404C]">Inventory List</h4>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-[#696B75] hover:bg-[#EEE7DA] rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">filter_list</span>
                                    </button>
                                    <button className="p-2 text-[#696B75] hover:bg-[#EEE7DA] rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#F7F0E2]/60 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider">SKU</th>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-[12px] font-semibold text-[#696B75] uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#D0C5AF]/40">
                                        {filteredInventory.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-6 text-[#696B75]">No products found matching search.</td>
                                            </tr>
                                        ) : (
                                            filteredInventory.map((item) => (
                                                <tr key={item.id} className="hover:bg-[#EEE7DA]/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-[#F7F0E2] overflow-hidden flex-shrink-0 border border-[#D0C5AF]/50">
                                                                <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-[#3D404C] text-[14px]">{item.name}</div>
                                                                <div className="text-[#696B75] text-[12px]">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-[12px] font-medium text-[#696B75]">{item.sku}</td>
                                                    <td className="px-6 py-4 text-[#3D404C] font-medium">${item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="w-6 h-6 flex items-center justify-center border border-[#D0C5AF] bg-[#FFF8F0] rounded hover:bg-[#3D5B32] hover:text-[#FFF8F0] hover:border-[#3D5B32] transition-colors"
                                                                onClick={() => handleStockChange(item.id, -1)}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-[12px] font-medium text-[#3D404C]">{item.stock}</span>
                                                            <button
                                                                className="w-6 h-6 flex items-center justify-center border border-[#D0C5AF] bg-[#FFF8F0] rounded hover:bg-[#3D5B32] hover:text-[#FFF8F0] hover:border-[#3D5B32] transition-colors"
                                                                onClick={() => handleStockChange(item.id, 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-sm ${item.status === 'In Stock' ? 'bg-[#3D5B32]/15 text-[#3D5B32]' :
                                                            item.status === 'Low Stock' ? 'bg-[#735C00]/15 text-[#735C00]' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 text-[#735C00] hover:bg-[#735C00]/10 rounded-md transition-colors" title="Edit">
                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            </button>
                                                            <button className="p-1.5 text-red-700 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sales Distribution Column */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-[#FFF8F0] rounded-xl border border-[#D0C5AF] p-6 shadow-sm">
                                <h4 className="text-[20px] font-semibold text-[#3D404C] mb-6">Sales by Category</h4>
                                <div className="space-y-6">
                                    {[{ name: 'Electronics', pct: '45%' }, { name: 'Stationery', pct: '28%' }, { name: 'Fashion', pct: '15%' }, { name: 'Others', pct: '12%' }].map((cat, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[14px] font-medium text-[#3D404C]">{cat.name}</span>
                                                <span className="text-[12px] font-medium text-[#696B75]">{cat.pct}</span>
                                            </div>
                                            <div className="w-full bg-[#EEE7DA] h-2 rounded-full overflow-hidden">
                                                <div className="bg-[#735C00] h-full" style={{ width: cat.pct, opacity: 1 - idx * 0.2 }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#3D404C] rounded-xl p-6 text-[#FFF8F0] relative overflow-hidden group shadow-sm">
                                <h4 className="text-[20px] font-semibold text-[#D4AF37] mb-4">Warehouse Status</h4>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[14px] text-[#D0C5AF]">Efficiency Rating</span>
                                    <span className="text-[20px] font-semibold text-[#FFF8F0]">94.2%</span>
                                </div>
                                <div className="flex items-center gap-1 mb-6">
                                    <span className="material-symbols-outlined text-[16px] text-[#3D5B32] bg-white rounded-full">check_circle</span>
                                    <span className="text-[12px] font-medium text-[#D4AF37]">Optimal Performance</span>
                                </div>
                                <button className="w-full py-3 bg-[#D4AF37] text-[#3D404C] font-bold rounded-lg hover:bg-[#D4AF37]/90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
                                    View Warehouse Maps
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};