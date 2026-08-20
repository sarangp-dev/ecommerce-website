import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';


const API_URL_PRODUCT = import.meta.env.VITE_API_URL_PRODUCT;

interface ProductItem {
    id: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    image: string | null;
}

// Extracted GlobalLoader Component
interface GlobalLoaderProps {
    isLoading: boolean;
    loadingMessage?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading, loadingMessage }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Smooth Progress Simulator Effect (Stops just below 100%)
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isLoading) {
            setLoadingProgress(10);
            timer = setInterval(() => {
                setLoadingProgress((prev) => {
                    if (prev >= 98) return 98;
                    const next = prev + Math.floor(Math.random() * 8) + 2;
                    return next > 98 ? 98 : next;
                });
            }, 200);
        } else {
            setLoadingProgress(100);
            const timeout = setTimeout(() => setLoadingProgress(0), 400);
            return () => clearTimeout(timeout);
        }
        return () => clearInterval(timer);
    }, [isLoading]);

    // Don't render anything if not loading and progress is fully reset
    if (!isLoading && loadingProgress === 0) return null;

    // Radius calculation for SVG Circular Progress Ring
    const circleRadius = 54;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (loadingProgress / 100) * circleCircumference;

    return (
        <div className="absolute inset-0 bg-[#181b26]/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-40 h-40">
                {/* Background Track Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={circleRadius}
                        stroke="#3A506B"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    {/* Animated Golden Progress Arc */}
                    <circle
                        cx="60"
                        cy="60"
                        r={circleRadius}
                        stroke="#D4AF37"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        style={{
                            strokeDasharray: circleCircumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 0.2s ease-in-out',
                        }}
                    />
                </svg>
                {/* Percentage Text Display Inside Circle */}
                <div className="absolute flex flex-col items-center justify-center text-[#FFF8F0]">
                    <span className="text-2xl font-serif font-bold tracking-tight">{loadingProgress}%</span>
                </div>
            </div>
            <p className="mt-6 text-sm font-medium tracking-wide text-[#FFF8F0]/90 animate-pulse font-serif">
                {loadingMessage || 'Processing network sequence...'}
            </p>
        </div>
    );
};

export const YuthiAdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Global Action Loading State & Message for the GlobalLoader
    const [actionLoading, setActionLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Deleting State (track which product ID is currently being deleted)
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editStock, setEditStock] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        productName: '',
        category: '',
        price: '',
        stock: '',
        sku: '',
        description: '',
    });
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const [addImageFile, setAddImageFile] = useState<File | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleEditClick = (product: ProductItem) => {
        setEditingProduct(product);
        setEditProductName(product.name || '');
        setEditProductPrice(product.price !== undefined && product.price !== null ? product.price.toString() : '');
        setEditStock(product.stock !== undefined && product.stock !== null ? product.stock.toString() : '');
        setEditCategory(product.category || '');
        setEditDescription('');
        setEditImageFile(null);
        setIsEditModalOpen(true);
    };

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

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL_PRODUCT}/getproducts`
            );
            setProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    const filteredProducts = products.filter(
        (item) =>
            (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const navLinks = [
        { label: 'Dashboard', icon: 'dashboard', active: false },
        { label: 'Products', icon: 'inventory_2', active: true },
        { label: 'Orders', icon: 'shopping_cart', active: false },
        { label: 'Reports', icon: 'analytics', active: false },
        { label: 'Customers', icon: 'people', active: false },
    ];

    // Handle Delete Product with GlobalLoader State
    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            setDeletingId(id);
            setLoadingMessage('Purging record from secure node...');
            setActionLoading(true);
            await axios.delete(`${API_URL_PRODUCT}/deleteproduct/${id}`,
                {
                    withCredentials: true
                }
            );
            setProducts((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        } finally {
            setDeletingId(null);
            setActionLoading(false);
        }
    };

    // Handle Add Product Submit with GlobalLoader State
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsAdding(true);
            setLoadingMessage('Initializing new catalog asset...');
            setActionLoading(true);
            const data = new FormData();
            data.append("productName", addFormData.productName);
            data.append("category", addFormData.category);
            data.append("productprice", addFormData.price);
            data.append("quantity", addFormData.stock);
            data.append("sku", addFormData.sku);
            data.append("description", addFormData.description);

            if (addImageFile) {
                data.append("productimage", addImageFile);
            }

            await axios.post(
                `${API_URL_PRODUCT}/addproduct`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            // Reset form fields
            setAddFormData({
                productName: '',
                category: '',
                price: '',
                stock: '',
                sku: '',
                description: '',
            });
            setAddImageFile(null);
            if (addFileInputRef.current) {
                addFileInputRef.current.value = '';
            }

            await getAllProducts();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        } finally {
            setIsAdding(false);
            setActionLoading(false);
        }
    };

    // Handle Edit Product Submit with GlobalLoader State
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            setIsSubmitting(true);
            setLoadingMessage('Synchronizing updated parameters...');
            setActionLoading(true);
            const formData = new FormData();
            formData.append("productName", editProductName);
            formData.append("productprice", editProductPrice);
            formData.append("quantity", editStock);
            formData.append("category", editCategory);
            formData.append("description", editDescription);

            if (editImageFile) {
                formData.append("productImage", editImageFile);
            }

            await axios.put(
                `${API_URL_PRODUCT}/editproduct/${editingProduct.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            await getAllProducts();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        } finally {
            setIsSubmitting(false);
            setActionLoading(false);
        }
    };

    return (
        <div className="bg-[#FFF8F0] text-[#3D404C] font-sans h-screen flex flex-col md:flex-row overflow-hidden selection:bg-[#D0C5AF] selection:text-[#3D404C] relative">

            {/* Global Loader Implementation */}
            <GlobalLoader isLoading={actionLoading} loadingMessage={loadingMessage} />

            {/* Mobile Sidebar Overlay Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Navigation Sidebar */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 w-[260px] bg-[#F7F0E2] border-r border-[#D0C5AF] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-14 flex items-center justify-between px-6 border-b border-[#D0C5AF]">
                    <span className="text-[20px] font-semibold text-[#735C00] tracking-tight">Yuthi Admin</span>
                    <button
                        className="lg:hidden material-symbols-outlined text-[#696B75]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        close
                    </button>
                </div>
                <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${link.active
                                ? 'bg-[#735C00] text-[#FFF8F0] shadow-sm'
                                : 'text-[#696B75] hover:bg-[#EEE7DA]'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                style={link.active ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {link.icon}
                            </span>
                            <span className="font-medium text-sm">{link.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-3 border-t border-[#D0C5AF]">
                    <a className="flex items-center gap-3 px-3 py-2.5 text-[#696B75] hover:bg-[#EEE7DA] rounded-lg transition-colors" href="#">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="font-medium text-sm">Settings</span>
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Top Header */}
                <header className="bg-[#FFF8F0] border-b border-[#D0C5AF] min-h-14 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            className="lg:hidden material-symbols-outlined text-[#696B75] p-1.5 hover:bg-[#F7F0E2] rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Toggle menu"
                        >
                            menu
                        </button>
                        <h1 className="text-lg sm:text-[20px] font-semibold text-[#3D404C] truncate">Inventory Admin</h1>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#696B75] text-[20px]">search</span>
                            <input
                                className="pl-9 pr-3 py-1.5 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm w-36 sm:w-48 md:w-64 focus:ring-1 focus:ring-[#735C00] focus:border-[#735C00] outline-none transition-all text-[#3D404C] placeholder-[#696B75]"
                                placeholder="Search inventory..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Notifications & Profile */}
                        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-[#D0C5AF]">
                            <button className="material-symbols-outlined text-[#696B75] p-1 hover:bg-[#F7F0E2] rounded-lg">
                                notifications
                            </button>
                            <div className="w-8 h-8 rounded-full bg-[#D0C5AF] flex items-center justify-center text-[#735C00] font-bold text-xs shrink-0">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Canvas */}
                <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FFF8F0]">
                    {/* Header Action Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-[30px] font-bold text-[#3D404C]">Products</h2>
                            <p className="text-xs sm:text-sm text-[#696B75] mt-0.5 sm:mt-1">Manage your catalog, stock levels, and pricing across all channels.</p>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="self-start sm:self-auto bg-[#3D5B32] text-[#FFF8F0] font-semibold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>Add Product</span>
                        </button>
                    </div>

                    {/* Stats Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">TOTAL PRODUCTS</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">{products.length}</span>
                                <span className="text-[#3D5B32] text-[12px] font-medium flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span> Live
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">LOW STOCK ALERTS</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#D4AF37]">
                                    {products.filter(p => p.status === 'Low Stock').length}
                                </span>
                                <span className="text-[#D4AF37] text-[12px] font-medium">Requires Action</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">OUT OF STOCK</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">
                                    {products.filter(p => p.status === 'Out of Stock').length}
                                </span>
                                <span className="bg-[#EEE7DA] px-2 py-0.5 rounded text-[10px] text-[#696B75] uppercase font-bold tracking-wider">Stable</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">TOTAL VALUE</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">
                                    ${products.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.stock || 0)), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-[#735C00] opacity-80 material-symbols-outlined">payments</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Options Toolbar */}
                    <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-3 sm:p-4 rounded-t-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button className="flex items-center gap-2 border border-[#D0C5AF] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#EEE7DA] transition-colors text-[#3D404C]">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filters
                            </button>
                            <div className="hidden sm:block h-6 w-[1px] bg-[#D0C5AF]"></div>
                            <select className="bg-transparent border border-[#D0C5AF] sm:border-none rounded-lg px-2 py-1.5 sm:p-0 text-xs sm:text-sm font-medium cursor-pointer text-[#3D404C]">
                                <option>All Categories</option>
                                <option>Electronics</option>
                                <option>Apparel</option>
                                <option>Home Goods</option>
                            </select>
                            <select className="bg-transparent border border-[#D0C5AF] sm:border-none rounded-lg px-2 py-1.5 sm:p-0 text-xs sm:text-sm font-medium cursor-pointer text-[#3D404C]">
                                <option>Stock Level: All</option>
                                <option>Low Stock</option>
                                <option>Out of Stock</option>
                                <option>In Stock</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D0C5AF]">
                            <span className="text-xs text-[#696B75]">SORT BY</span>
                            <button className="text-xs sm:text-sm font-medium text-[#735C00] flex items-center gap-1">
                                Last Updated
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Products Container */}
                    <div className="bg-[#F7F0E2] border-x border-b border-[#D0C5AF] rounded-b-xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="py-12 text-center text-[#696B75] text-sm flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                Loading inventory...
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="py-12 text-center text-[#696B75] text-sm">No products found.</div>
                        ) : (
                            <>
                                {/* Mobile / Tablet View: Card Layout */}
                                <div className="block lg:hidden divide-y divide-[#D0C5AF]">
                                    {filteredProducts.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-[#FFF8F0] transition-colors space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <input className="rounded border-[#D0C5AF] text-[#735C00] focus:ring-[#735C00] mt-1" type="checkbox" />
                                                    <div className="w-12 h-12 rounded bg-[#EEE7DA] shrink-0 overflow-hidden border border-[#D0C5AF]">
                                                        <img className="w-full h-full object-cover" src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-[#3D404C]">{item.name}</div>
                                                        <div className="text-xs text-[#696B75]">{item.category} • <span className="font-mono">{item.sku}</span></div>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight shrink-0 ${item.status === 'In Stock' ? 'bg-[#3D5B32] text-[#FFF8F0]' :
                                                    item.status === 'Low Stock' ? 'bg-[#D4AF37] text-[#FFF8F0]' : 'bg-[#696B75] text-[#FFF8F0]'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-[#D0C5AF]/40">
                                                <span className="font-medium text-sm text-[#3D404C]">${(item.price || 0).toFixed(2)}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-[#FFF8F0] border border-[#D0C5AF] rounded-lg overflow-hidden">
                                                        <button
                                                            className="w-9 h-9 flex items-center justify-center hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                            onClick={() => handleStockChange(item.id, (item.stock || 0) - 1)}
                                                            aria-label="Decrease stock"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">remove</span>
                                                        </button>
                                                        <input
                                                            className="w-10 bg-transparent border-none text-center text-xs focus:ring-0 p-0 text-[#3D404C] font-semibold"
                                                            type="number"
                                                            value={item.stock ?? 0}
                                                            onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                                                        />
                                                        <button
                                                            className="w-9 h-9 flex items-center justify-center hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                            onClick={() => handleStockChange(item.id, (item.stock || 0) + 1)}
                                                            aria-label="Increase stock"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            className="p-2 hover:bg-[#EEE7DA] rounded text-[#696B75]"
                                                            title="Edit"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button
                                                            className="p-2 hover:bg-[#EEE7DA] hover:text-[#735C00] rounded text-[#696B75] disabled:opacity-50"
                                                            title="Delete"
                                                            disabled={deletingId === item.id}
                                                            onClick={() => handleDeleteProduct(item.id)}
                                                        >
                                                            {deletingId === item.id ? (
                                                                <span className="material-symbols-outlined text-[18px] animate-spin text-[#735C00]">progress_activity</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Full Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
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
                                            {filteredProducts.map((item) => (
                                                <tr key={item.id} className="hover:bg-[#FFF8F0] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <input className="rounded border-[#D0C5AF] text-[#735C00] focus:ring-[#735C00]" type="checkbox" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded bg-[#EEE7DA] shrink-0 overflow-hidden border border-[#D0C5AF]">
                                                                <img className="w-full h-full object-cover" src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-[#3D404C]">{item.name}</div>
                                                                <div className="text-xs text-[#696B75]">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[12px] text-[#696B75] font-mono">{item.sku}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-[#3D404C]">${(item.price || 0).toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center bg-[#FFF8F0] border border-[#D0C5AF] rounded overflow-hidden">
                                                                <button
                                                                    className="px-2 py-1 hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                                    onClick={() => handleStockChange(item.id, (item.stock || 0) - 1)}
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                                                </button>
                                                                <input
                                                                    className="w-12 bg-transparent border-none text-center text-[12px] focus:ring-0 p-0 text-[#3D404C] font-semibold"
                                                                    type="number"
                                                                    value={item.stock ?? 0}
                                                                    onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                                                                />
                                                                <button
                                                                    className="px-2 py-1 hover:bg-[#EEE7DA] transition-colors text-[#696B75]"
                                                                    onClick={() => handleStockChange(item.id, (item.stock || 0) + 1)}
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
                                                            <button
                                                                className="p-2 hover:bg-[#EEE7DA] rounded text-[#696B75]"
                                                                title="Edit"
                                                                onClick={() => handleEditClick(item)}
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                            <button
                                                                className="p-2 hover:bg-[#EEE7DA] hover:text-[#735C00] rounded text-[#696B75] disabled:opacity-50"
                                                                title="Delete"
                                                                disabled={deletingId === item.id}
                                                                onClick={() => handleDeleteProduct(item.id)}
                                                            >
                                                                {deletingId === item.id ? (
                                                                    <span className="material-symbols-outlined text-[20px] animate-spin text-[#735C00]">progress_activity</span>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination Bar */}
                        <div className="bg-[#EEE7DA] border-t border-[#D0C5AF] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-[#696B75] font-medium">Showing all {filteredProducts.length} items</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#FFF8F0] border border-[#D0C5AF] rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-xl relative my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-[#D0C5AF] mb-6">
                            <div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181b26]">Initialize New product</h3>
                                <p className="text-xs text-[#4a463f] mt-0.5">Define the core parameters for the new operational sequence.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="material-symbols-outlined text-[#696B75] hover:text-[#3D404C] cursor-pointer"
                            >
                                close
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={addFormData.productName}
                                    onChange={(e) => setAddFormData({ ...addFormData, productName: e.target.value })}
                                    required
                                    disabled={isAdding}
                                    className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:opacity-60"
                                    placeholder="e.g. Operation Chimera"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                        Classification
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={addFormData.category}
                                            onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
                                            required
                                            disabled={isAdding}
                                            className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] appearance-none cursor-pointer disabled:opacity-60"
                                        >
                                            <option disabled value="">
                                                Select Category
                                            </option>
                                            <option value="alpha">Alpha Level</option>
                                            <option value="beta">Beta Level</option>
                                            <option value="omega">Omega Level</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Apparel">Apparel</option>
                                            <option value="Home Goods">Home Goods</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#4a463f] pointer-events-none text-sm">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        value={addFormData.sku}
                                        onChange={(e) => setAddFormData({ ...addFormData, sku: e.target.value })}
                                        required
                                        disabled={isAdding}
                                        className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] font-mono disabled:opacity-60"
                                        placeholder="e.g. SKU-1002"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                        Product Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addFormData.price}
                                        onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                                        required
                                        disabled={isAdding}
                                        className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:opacity-60"
                                        placeholder="e.g. 99.99"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                        Number of Stock
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={addFormData.stock}
                                        onChange={(e) => setAddFormData({ ...addFormData, stock: e.target.value })}
                                        required
                                        disabled={isAdding}
                                        className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:opacity-60"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-wider text-[#181b26] mb-1">
                                    Product Image
                                </label>
                                <input
                                    ref={addFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    disabled={isAdding}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setAddImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#3D5B32] file:text-white disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-xs font-semibold tracking-wider text-[#181b26]">Executive Summary</label>
                                    <span className="text-[10px] text-[#4a463f]">{addFormData.description.length}/500</span>
                                </div>
                                <textarea
                                    value={addFormData.description}
                                    onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                                    maxLength={500}
                                    rows={3}
                                    disabled={isAdding}
                                    className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] resize-none disabled:opacity-60"
                                    placeholder="Detail the primary objectives and anticipated outcomes..."
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D0C5AF]">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={isAdding}
                                    className="px-4 py-2 text-xs font-semibold text-[#696B75] hover:bg-[#EEE7DA] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="bg-[#3D5B32] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-75 cursor-pointer"
                                >
                                    {isAdding ? (
                                        <>
                                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                            Initializing...
                                        </>
                                    ) : (
                                        <>
                                            Add product
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#FFF8F0] border border-[#D0C5AF] rounded-xl max-w-lg w-full p-6 shadow-xl relative my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-[#D0C5AF] mb-4">
                            <h3 className="text-lg font-bold text-[#3D404C]">Edit Product</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="material-symbols-outlined text-[#696B75] hover:text-[#3D404C] cursor-pointer"
                            >
                                close
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#696B75] mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={editProductName}
                                    onChange={(e) => setEditProductName(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm text-[#3D404C] focus:ring-1 focus:ring-[#735C00] outline-none disabled:opacity-60"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#696B75] mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editProductPrice}
                                        onChange={(e) => setEditProductPrice(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full px-3 py-2 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm text-[#3D404C] focus:ring-1 focus:ring-[#735C00] outline-none disabled:opacity-60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#696B75] mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full px-3 py-2 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm text-[#3D404C] focus:ring-1 focus:ring-[#735C00] outline-none disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#696B75] mb-1">Category</label>
                                <input
                                    type="text"
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm text-[#3D404C] focus:ring-1 focus:ring-[#735C00] outline-none disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#696B75] mb-1">Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm text-[#3D404C] focus:ring-1 focus:ring-[#735C00] outline-none resize-none disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#696B75] mb-1">Update Product Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setEditImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full text-xs text-[#696B75] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EEE7DA] file:text-[#3D404C] hover:file:bg-[#D0C5AF] disabled:opacity-60"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D0C5AF]">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-xs font-semibold text-[#696B75] hover:bg-[#EEE7DA] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-[#735C00] text-[#FFF8F0] font-semibold text-xs rounded-lg hover:opacity-90 transition-all disabled:opacity-75 flex items-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};