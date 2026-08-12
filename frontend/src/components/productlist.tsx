
import React, { useState, useMemo } from 'react';

// Define Product interface
interface Product {
    id: number;
    name: string;
    category: 'Navigation' | 'Storage' | 'Illumination';
    price: number;
    description: string;
    image: string;
    inStock: boolean;
    badge: string;
    icon: string;
}

const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Brass Navigator Compass",
        category: "Navigation",
        price: 450,
        description: "Calibrated for true north regardless of localized magnetic anomalies. Essential for uncharted territories.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDA3VykB3PjwSNOQLN6VIul9ajNkPhzBU50q-ZyuQPjuQYGHlTsYJS4f-Mkxb_5YhES90P9idLCv0YPiweOB_kbVzbjbLS55X8Seh_5FvfEAUL4ZqPCyHEW3E8ERZtrGQPhBkRnUVxKY3-7oYkRINqjQh0imP9p2Wkld6oJQtxmWUeseRmBTq5GCQuM32GOWQ11q_dHi1-2IK40nuV67qnryU3W3oOt_jfCPSyg5um4coYlPpyPYQ",
        inStock: true,
        badge: "Artifact",
        icon: "explore"
    },
    {
        id: 2,
        name: "Weatherproof Journal",
        category: "Storage",
        price: 120,
        description: "Archival-grade paper bound in oiled leather. Resists water, mud, and the test of time. Record every discovery.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6cL1UBy4ry0o13LKIAAEFtI4-oiXJH1bAeB5Tu2SvKXz5DwZ1irvYFRn5z_4HKnrE72a_afv5UpYsOENBUhAMPLSxfaIomGa-M9Du5QljJifkNHNuq1epVk__Ntt-FBn-9cVWzmT-EOvw7WmGqPzF8D5A3z7A9NjTr9pL_91vevF7E9Q1W2N_GiFz69nwjdYs7xZZBX51JX2Ng5-nc4m7SpXQ4pXx1CLpfwq3qSb2T7hAqjYg_A",
        inStock: true,
        badge: "Popular",
        icon: "book_4"
    },
    {
        id: 3,
        name: "Canvas Expedition Satchel",
        category: "Storage",
        price: 850,
        description: "Woven from deep-loom canvas and reinforced with brass rivets. Spacious enough for charts, rations, and tools.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1nnoj3XKRtfFpKiv3OOd9yu_h2vW_ZZVibMCXiQIqN2yZLqytjkEpbaOtc3_TJeq-ZpkridzNIlufOG-5k5-Lf46PR7MS1TxzZp1McuThOuaX2T-4_gVSNB5Fc0_2MwAkubI-XA80dZ76Jxa3PoVYD-mWkPkpV7r4gYM_3bUYeqlQQT8q-OQccLjlsCTzDXhgy6-u8hIGjQUj7VB-EL-R490FN_g_g7gLIRFS7MFgh-Ri6ywm9Q",
        inStock: false,
        badge: "Heavy Duty",
        icon: "work"
    },
    {
        id: 4,
        name: "Iron-Clad Lantern",
        category: "Illumination",
        price: 320,
        description: "Burns clean and bright even in gale-force winds. The thick glass is shatter-resistant to withstand rough terrain.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChiCOIHb2NI-iaUrhaXzPgMC3d8gtsiud9yBg2uCLHSG4Znzlq1dSitNRl-_uLyRzsKqIL_07DtjQ5NmM1ZsXY3r1w07iMKGPjkvz8RnE5aYl8zxtmuLvXhar60zxrOwIrMebl2_Zb8F9GOsidNkYTNe2oTlhlzAodgNDjVHG_VWwhSMVWw_amuVnaHdyhbn4h5fYdI1JIBdcxZbo1ProOVVbOo5cf65fjjMZZEf2YbNaEOJCFjQ",
        inStock: true,
        badge: "Essential",
        icon: "lightbulb"
    }
];

export default function ProductList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState < string > ('All');
    const [sortBy, setSortBy] = useState < string > ('price-low');
    const [cartCount, setCartCount] = useState < number > (0);

    const categories = ['All', 'Navigation', 'Storage', 'Illumination'];

    const filteredAndSortedProducts = useMemo(() => {
        return PRODUCTS.filter((product) => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name-az') return a.name.localeCompare(b.name);
            if (sortBy === 'name-za') return b.name.localeCompare(a.name);
            return 0;
        });
    }, [searchQuery, selectedCategory, sortBy]);

    return (
        <div className="text-on-surface antialiased min-h-screen flex flex-col md:flex-row bg-[#fff8f0]">
            {/* SideNavBar (Desktop Only) */}
            <nav className="hidden md:flex flex-col h-screen p-2 bg-[#f5eddf] dark:bg-[#efe7da] shadow-md w-72 rounded-r-xl sticky top-0 z-40 shrink-0">
                <div className="px-4 py-6 mb-4">
                    <h1 className="font-['Bricolage_Grotesque'] text-[32px] leading-[40px] font-bold text-[#735c00] italic tracking-tight mb-8">Wayfinder</h1>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-[#d0c5af] overflow-hidden border-2 border-[#d4af37]">
                            <img
                                alt="Explorer Profile"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWEyQYEjVVE3x9rH01EG18SDeUqPIR95ciO4Vj3heYNI4LCWgD82Vnbdnhxix9l4IlI6Ric59QQymCYBBOiToOa113pEIa18suYzU7tVk1oYQzPDNk26eUKqguuL8cceQvZfgUkwNvtUgqmPDgpKQ9udWryg5QiRRX0tuG1HEop9rAIqcDumkrHKuP8iDnB87DkHDMqjQHyHOzNeeezeatZRoBeWZmD8DfeUt59yPAGMDEddiWVw"
                            />
                        </div>
                        <div>
                            <div className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-bold text-[#1f1b13]">Lead Explorer</div>
                            <div className="font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-[#4d4635]">Rank: Pathfinder</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                    <a className="flex items-center gap-3 text-[#4d4635] px-4 py-3 hover:bg-[#eae1d4] rounded-lg font-['Space_Grotesk'] text-[14px] transition-colors" href="#">
                        <span className="material-symbols-outlined">explore</span> Expeditions
                    </a>
                    <a className="flex items-center gap-3 bg-[#d4af37] text-[#554300] rounded-lg px-4 py-3 font-bold font-['Space_Grotesk'] text-[14px] transition-colors" href="#">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>backpack</span> Equipment
                    </a>
                    <a className="flex items-center gap-3 text-[#4d4635] px-4 py-3 hover:bg-[#eae1d4] rounded-lg font-['Space_Grotesk'] text-[14px] transition-colors" href="#">
                        <span className="material-symbols-outlined">book_5</span> Field Journal
                    </a>
                    <a className="flex items-center gap-3 text-[#4d4635] px-4 py-3 hover:bg-[#eae1d4] rounded-lg font-['Space_Grotesk'] text-[14px] transition-colors" href="#">
                        <span className="material-symbols-outlined">inventory_2</span> Archive
                    </a>
                </div>

                <div className="p-4 bg-[#fbf3e5] rounded-xl border border-[#eae1d4] text-center">
                    <div className="font-['Space_Grotesk'] text-[12px] text-[#4d4635] mb-1">Manifest Items</div>
                    <div className="font-['Bricolage_Grotesque'] text-[32px] text-[#735c00] font-bold">{cartCount}</div>
                </div>
            </nav>

            {/* Main Content Canvas */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-5 py-8 flex flex-col gap-8">
                {/* Header & Search */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-[#eae1d4] pb-6">
                    <div>
                        <h2 className="text-[28px] md:text-[32px] font-bold font-['Bricolage_Grotesque'] text-[#735c00] mb-2">The Archives</h2>
                        <p className="font-['Manrope'] text-[16px] text-[#4d4635] max-w-2xl">Requisition the finest tools for your journey. Every item is inspected for durability and historical provenance.</p>
                    </div>
                    <div className="w-full md:w-96 relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#7f7663] group-focus-within:text-[#735c00] transition-colors">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search the Archives..."
                            className="w-full pl-12 pr-4 py-3 bg-white border-b-2 border-[#77574d] focus:border-[#735c00] focus:ring-0 rounded-t-sm font-['Manrope'] text-[16px] text-[#1f1b13] placeholder:text-[#d0c5af] transition-colors outline-none shadow-sm"
                        />
                    </div>
                </header>

                {/* Filters & Sort Bar */}
                <section className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-[#fbf3e5] rounded-xl border border-[#eae1d4]">
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                        <span className="font-['Space_Grotesk'] text-[12px] font-semibold text-[#4d4635] mr-2">Category:</span>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 rounded-full border border-[#77574d] transition-colors font-['Manrope'] text-[14px] active:scale-95 ${selectedCategory === category
                                    ? 'bg-[#77574d] text-white'
                                    : 'text-[#77574d] hover:bg-[#77574d] hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-transparent pl-4 pr-10 py-2 border-b border-[#7f7663] text-[#1f1b13] font-['Manrope'] text-[14px] focus:outline-none focus:border-[#735c00] cursor-pointer w-40"
                            >
                                <option value="price-low">Price: Low-High</option>
                                <option value="price-high">Price: High-Low</option>
                                <option value="name-az">Name: A-Z</option>
                                <option value="name-za">Name: Z-A</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#7f7663] pointer-events-none text-sm">expand_more</span>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-[#4d4635] font-['Manrope'] text-[16px]">
                            No artifacts found matching your criteria in the archives.
                        </div>
                    ) : (
                        filteredAndSortedProducts.map((product) => (
                            <article
                                key={product.id}
                                className="bg-white rounded-xl border border-[#eae1d4] overflow-hidden shadow-[0_4px_12px_rgba(119,87,77,0.08)] group flex flex-col h-full hover:border-[#d4af37] transition-colors duration-300"
                            >
                                <div className="relative h-64 overflow-hidden bg-[#f5eddf] p-6 flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#735c00] to-transparent"></div>
                                    <img
                                        alt={product.name}
                                        className="object-contain h-full w-full relative z-10 group-hover:scale-105 transition-transform duration-500"
                                        src={product.image}
                                    />
                                    <div className="absolute top-4 right-4 bg-[#d4af37] text-[#554300] font-['Space_Grotesk'] text-[12px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        {product.badge}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow relative">
                                    <div className="absolute -top-4 right-6 w-10 h-10 bg-[#fff8f0] rounded-full shadow-sm border border-[#eae1d4] flex items-center justify-center z-20">
                                        <span className="material-symbols-outlined text-[#7f7663]">{product.icon}</span>
                                    </div>
                                    <h3 className="text-[28px] leading-[34px] font-bold font-['Bricolage_Grotesque'] text-[#735c00] mb-2">{product.name}</h3>
                                    <p className="font-['Manrope'] text-[14px] text-[#4d4635] mb-6 flex-grow">{product.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[28px] leading-[34px] font-bold text-[#1f1b13] flex items-center text-[#d4af37]">
                                            {product.price} <span className="text-sm ml-1 text-[#4d4635] font-normal">G</span>
                                        </span>
                                        {product.inStock ? (
                                            <button
                                                onClick={() => setCartCount(prev => prev + 1)}
                                                className="bg-[#77574d] text-white px-5 py-2 rounded-lg font-['Space_Grotesk'] text-[14px] font-bold shadow-[0_8px_20px_rgba(119,87,77,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-[#5d4037] transition-colors active:scale-95 flex items-center gap-2"
                                            >
                                                Add to Manifest
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="bg-[#eae1d4] text-[#1f1b13] px-5 py-2 rounded-lg font-['Space_Grotesk'] text-[14px] font-bold border border-[#d0c5af] opacity-75 cursor-not-allowed"
                                            >
                                                Out of Stock
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}