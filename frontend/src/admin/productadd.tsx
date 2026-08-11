import React, { useState } from 'react';

interface ProductItem {
    id: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageUrl: string;
}

const initialProducts: ProductItem[] = [
    {
        id: '1',
        name: 'Carbon Mechanical Keyboard v2',
        category: 'Electronics / Accessories',
        sku: 'KB-7704-CB',
        price: 189.00,
        stock: 42,
        status: 'In Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYqD7bZIUBvdeBfUZJJCVhxHfFZrnUw2_kd-ka0XmceDwrtix1QVlZmeT6BA1ipe6-rDRfcBTX7CAdYZrkpDTxTwOkkVnxekLe-NElc3w1hrEk0yNjnFPL3chl6y5yqtnNUUUoR6OeLC0kvq4cKwt-E8wmoBt9sGMGNd7qHotmqqUfRObe8m6DoyFQ8VH1USlxBEcix20ZbnQ7RQx_5CxRyRgXwRfAGKVYXpSL1haG_EnSH0bed-P6Q'
    },
    {
        id: '2',
        name: 'Titanium Pro Headphones',
        category: 'Electronics / Audio',
        sku: 'AU-402-TIT',
        price: 349.99,
        stock: 8,
        status: 'Low Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKFILmscN2Chl4Dp8y2D0qgo5GzWvjk_33FxtGY9l28lio18n93EVQnIYtjLa2mxwNRy8gSQsV1kvwLk41mWFGpYCCTxSneYciSlpZtWn6Y282-iBP3giu9S51LMQ5ipGYwtYCSCISZHYlU69Vjsx50pMUh5-DtglcUCCVsImbBEtCvkwbbXvekpM4jT_x39lJMHPsmZtoK2hWxvTgWS_Ue2R-kUtvod9ncRIaHvjW4rbm2h1DuLnXGA'
    },
    {
        id: '3',
        name: 'Obsidian Smart Watch 5',
        category: 'Wearables / Tech',
        sku: 'WA-S5-OBS',
        price: 299.00,
        stock: 156,
        status: 'In Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmoOylg3kAU3Sx7hrVFHevw8YTPmjhD9Yre-v8mgduw-gufB62R01xhi9n1LoOcxsgCH-KEJB7ju_9rTLTkBQqj9hExFqiBuaZw5Vd3vJQakyvewTiw1eLKbcm_wC1ntuXXlWbpRJMnQB0-rlKbChraPHMJp5FNe5QdUDc8CF7d0xtaRUcZwxPdbmpG9SG_Ca8XR0nXYgL5JLK3nto4eM13blQLxsv8xE-9NpKGZ_t_SbiYjeMiBRyig'
    },
    {
        id: '4',
        name: 'Pro-Visual 34" Curved Monitor',
        category: 'Electronics / Displays',
        sku: 'MO-PV34-CRV',
        price: 849.00,
        stock: 0,
        status: 'Out of Stock',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJpQ0a_iuMF9W2ayI33ZbOyXbtyJ2ZWIEM1vZHwRo40y6dq1X0yLR-P8Mk11pKftJ3aLgd4sNBT008y9O0Ph2DswM8AOtn7QycJuyxclaDyCdiPr_cZ9mpISo2wfAO6gxVV76XE7czj5xVSLypU5lKrfvU9QYYlyiVdWHu2cYEpsEg2LFBMgbCIVRQYJzCu7FgDy74FJo8IU1URbjYDLTUcumsg0jzZxNbs_0ZPsTWz7foUFOZznOPAA'
    }
];

export const YuthiAdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<ProductItem[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStockChange = (id: string, newStock: number) => {
        const stockVal = Math.max(0, newStock);
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    let status: ProductItem['status'] = 'In Stock';
                    if (stockVal === 0) status = 'Out of Stock';
                    else if (stockVal < 10) status = 'Low Stock';
                    return { ...item, stock: stockVal, status };
                }
                return item;
            })
        );
    };

    const filteredProducts = products.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#FFF8F0] text-[#3D404C] font-sans overflow-hidden flex h-screen selection:bg-[#D0C5AF] selection:text-[#3D404C]">
            {/* Persistent Sidebar Navigation */}
            <aside className="w-[260px] h-full bg-[#F7F0E2] border-r border-[#D0C5AF] flex flex-col z-50">
                <div className="h-14 flex items-center px-6 border-b border-[#D0C5AF]">
                    <span className="text-[20px] font-semibold text-[#735C00] tracking-tight">Yuthi Admin</span>
                </div>
                <nav className="flex-1 py-4 space-y-1 px-3">
                    <a className="flex items-center gap-3 px-3 py-2 text-[#696B75] hover:bg-[#EEE7DA] rounded transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 bg-[#735C00] text-[#FFF8F0] rounded transition-colors group shadow-sm" href="#">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                        <span className="font-medium">Products</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#696B75] hover:bg-[#EEE7DA] rounded transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                        <span className="font-medium">Orders</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#696B75] hover:bg-[#EEE7DA] rounded transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                        <span className="font-medium">Reports</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 text-[#696B75] hover:bg-[#EEE7DA] rounded transition-colors group" href="#">
                        <span className="material-symbols-outlined text-[20px]">people</span>
                        <span className="font-medium">Customers</span>
                    </a>
                </nav>
                <div className="p-3 border-t border-[#D0C5AF]">
                    <a className="flex items-center gap-3 px-3 py-2 text-[#696B75] hover:bg-[#EEE7DA] rounded transition-colors" href="#">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="font-medium">Settings</span>
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full">
                {/* TopAppBar */}
                <header className="bg-[#FFF8F0] border-b border-[#D0C5AF] h-14 flex items-center justify-between px-8 z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button className="material-symbols-outlined text-[#696B75] active:scale-95 transition-transform">menu</button>
                        <h1 className="text-[20px] font-semibold text-[#3D404C]">Inventory Admin</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#696B75]">search</span>
                            <input
                                className="pl-10 pr-4 py-1.5 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm w-64 focus:ring-1 focus:ring-[#735C00] focus:border-[#735C00] outline-none transition-all text-[#3D404C] placeholder-[#696B75]"
                                placeholder="Search inventory..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-[#D0C5AF]">
                            <span className="material-symbols-outlined text-[#696B75]">notifications</span>
                            <div className="w-8 h-8 rounded-full bg-[#D0C5AF] flex items-center justify-center text-[#735C00] font-bold text-xs">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Canvas */}
                <section className="flex-1 overflow-y-auto p-8 bg-[#FFF8F0]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-[30px] font-bold text-[#3D404C]">Products</h2>
                            <p className="text-[#696B75] mt-1">Manage your catalog, stock levels, and pricing across all channels.</p>
                        </div>
                        <button className="bg-[#3D5B32] text-[#FFF8F0] font-semibold text-[14px] px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Add Product
                        </button>
                    </div>

                    {/* Dashboard Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[12px] font-medium mb-2">TOTAL PRODUCTS</p>
                            <div className="flex items-end justify-between">
                                <span className="text-[30px] font-bold leading-none text-[#3D404C]">1,284</span>
                                <span className="text-[#3D5B32] text-[12px] font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[12px] font-medium mb-2">LOW STOCK ALERTS</p>
                            <div className="flex items-end justify-between">
                                <span className="text-[30px] font-bold leading-none text-[#D4AF37]">18</span>
                                <span className="text-[#D4AF37] text-[12px] font-medium">Requires Action</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[12px] font-medium mb-2">OUT OF STOCK</p>
                            <div className="flex items-end justify-between">
                                <span className="text-[30px] font-bold leading-none text-[#3D404C]">4</span>
                                <span className="bg-[#EEE7DA] px-2 py-0.5 rounded text-[10px] text-[#696B75] uppercase font-bold tracking-wider">Stable</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[12px] font-medium mb-2">TOTAL VALUE</p>
                            <div className="flex items-end justify-between">
                                <span className="text-[30px] font-bold leading-none text-[#3D404C]">$142.5k</span>
                                <span className="text-[#735C00] opacity-80 material-symbols-outlined">payments</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 rounded-t-xl flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 border border-[#D0C5AF] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#EEE7DA] transition-colors text-[#3D404C]">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filters
                            </button>
                            <div className="h-6 w-[1px] bg-[#D0C5AF]"></div>
                            <select className="bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer text-[#3D404C]">
                                <option>All Categories</option>
                                <option>Electronics</option>
                                <option>Apparel</option>
                                <option>Home Goods</option>
                            </select>
                            <select className="bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer text-[#3D404C]">
                                <option>Stock Level: All</option>
                                <option>Low Stock</option>
                                <option>Out of Stock</option>
                                <option>In Stock</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#696B75] mr-2">SORT BY</span>
                            <button className="text-sm font-medium text-[#735C00] flex items-center gap-1">
                                Last Updated
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="bg-[#F7F0E2] border-x border-b border-[#D0C5AF] rounded-b-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#EEE7DA] border-y border-[#D0C5AF]">
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider w-12">
                                        <input className="rounded border-[#D0C5AF] text-[#735C00] focus:ring-[#735C00]" type="checkbox" />
                                    </th>
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Stock Level</th>
                                    <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D0C5AF]">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-[#696B75]">No products found.</td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#FFF8F0] transition-colors group">
                                            <td className="px-6 py-4">
                                                <input className="rounded border-[#D0C5AF] text-[#735C00] focus:ring-[#735C00]" type="checkbox" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded bg-[#EEE7DA] flex-shrink-0 overflow-hidden border border-[#D0C5AF]">
                                                        <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[#3D404C]">{item.name}</div>
                                                        <div className="text-xs text-[#696B75]">{item.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[12px] text-[#696B75]">{item.sku}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-[#3D404C]">${item.price.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-[#FFF8F0] border border-[#D0C5AF] rounded overflow-hidden">
                                                        <button
                                                            className="px-2 py-1 hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                            onClick={() => handleStockChange(item.id, item.stock - 1)}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">remove</span>
                                                        </button>
                                                        <input
                                                            className="w-12 bg-transparent border-none text-center text-[12px] focus:ring-0 p-0 text-[#3D404C]"
                                                            type="number"
                                                            value={item.stock}
                                                            onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                                                        />
                                                        <button
                                                            className="px-2 py-1 hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                            onClick={() => handleStockChange(item.id, item.stock + 1)}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                                        </button>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${item.status === 'In Stock' ? 'bg-[#3D5B32] text-[#FFF8F0]' :
                                                            item.status === 'Low Stock' ? 'bg-[#D4AF37] text-[#FFF8F0]' : 'bg-[#696B75] text-[#FFF8F0]'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-[#EEE7DA] rounded text-[#696B75]" title="Edit">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-[#EEE7DA] hover:text-[#735C00] rounded text-[#696B75]" title="Delete">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-[#EEE7DA] border-t border-[#D0C5AF] px-6 py-4 flex items-center justify-between">
                            <span className="text-xs text-[#696B75] font-medium">Showing 1 to 4 of 1,284 results</span>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 flex items-center justify-center border border-[#D0C5AF] rounded hover:bg-[#FFF8F0] transition-colors disabled:opacity-50 text-[#3D404C]" disabled>
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-[#735C00] text-[#FFF8F0] rounded font-medium text-xs">1</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-[#D0C5AF] rounded hover:bg-[#FFF8F0] transition-colors font-medium text-xs text-[#3D404C]">2</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-[#D0C5AF] rounded hover:bg-[#FFF8F0] transition-colors font-medium text-xs text-[#3D404C]">3</button>
                                <span className="px-1 text-[#696B75]">...</span>
                                <button className="w-8 h-8 flex items-center justify-center border border-[#D0C5AF] rounded hover:bg-[#FFF8F0] transition-colors font-medium text-xs text-[#3D404C]">321</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-[#D0C5AF] rounded hover:bg-[#FFF8F0] transition-colors text-[#3D404C]">
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bento Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-[#F7F0E2] p-6 rounded-xl border border-[#D0C5AF]">
                            <h3 className="text-[20px] font-semibold mb-4 flex items-center gap-2 text-[#3D404C]">
                                <span className="material-symbols-outlined text-[#735C00]">trending_up</span>
                                Inventory Health Forecast
                            </h3>
                            <div className="h-40 flex items-end gap-2 px-2">
                                <div className="flex-1 bg-[#735C00] opacity-20 h-1/4 rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-30 h-1/3 rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-40 h-1/2 rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-50 h-2/3 rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-60 h-3/4 rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-80 h-full rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] opacity-90 h-[90%] rounded-t"></div>
                                <div className="flex-1 bg-[#735C00] h-[95%] rounded-t"></div>
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-[#696B75]">
                                <span>OCT 2023</span>
                                <span>NOV 2023</span>
                                <span>DEC 2023</span>
                                <span>JAN 2024 (FCST)</span>
                            </div>
                        </div>
                        <div className="bg-[#3D404C] text-[#FFF8F0] p-6 rounded-xl flex flex-col justify-between overflow-hidden relative border border-[#D0C5AF]">
                            <div className="relative z-10">
                                <h4 className="text-[20px] font-semibold mb-2 text-[#D4AF37]">System Status</h4>
                                <p className="text-sm opacity-90">All sync channels are active and communicating normally with external warehouses.</p>
                            </div>
                            <div className="relative z-10 mt-4 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#3D5B32] animate-pulse"></div>
                                <span className="text-[12px] font-medium tracking-wide">LIVE SYNC ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};