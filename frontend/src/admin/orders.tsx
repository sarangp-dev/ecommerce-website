import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Users,
    Settings,
    Bell,
    Search,
    Eye,
    X,
    TrendingUp,
    ChevronDown,
    Loader2,
    Filter,
    Menu,
    DollarSign,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    User,
    Mail,
    MapPin,
    Calendar
} from "lucide-react";

const API_URL_ORDER = import.meta.env.VITE_API_URL_ORDER || 'http://localhost:5000/api/orders';

const navLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, active: false },
    { label: 'Products', icon: Package, active: false },
    { label: 'Orders', icon: ShoppingCart, active: true },
    { label: 'Reports', icon: BarChart3, active: false },
    { label: 'Customers', icon: Users, active: false },
];

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: 'Paid' | 'Pending' | 'Failed';
    orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
}

// Extracted GlobalLoader Component
interface GlobalLoaderProps {
    isLoading: boolean;
    loadingMessage?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading, loadingMessage }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);

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
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (!isLoading && loadingProgress === 0) return null;

    const circleRadius = 54;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset = circleCircumference - (loadingProgress / 100) * circleCircumference;

    return (
        <div className="absolute inset-0 bg-[#181b26]/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={circleRadius}
                        stroke="#3A506B"
                        strokeWidth="8"
                        fill="transparent"
                    />
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

export const YuthiOrdersDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Global Action Loading State & Message
    const [actionLoading, setActionLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Selected Order for Details Modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const getAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL_ORDER}/getorders`, {
                withCredentials: true,
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Fallback mock data if backend isn't linked yet for testing UI
            setOrders([
                {
                    id: "ord_001",
                    orderNumber: "YT-84920",
                    customerName: "Sarang P",
                    customerEmail: "sarang@example.com",
                    shippingAddress: "Edacheri North, Kozhikode, Kerala 673502",
                    items: [
                        { productId: "p1", name: "Operation Chimera Jacket", quantity: 1, price: 149.99 },
                        { productId: "p2", name: "Cyber Silk Tee", quantity: 2, price: 45.00 }
                    ],
                    totalAmount: 239.99,
                    paymentStatus: "Paid",
                    orderStatus: "Processing",
                    createdAt: "2026-11-04T10:30:00Z"
                },
                {
                    id: "ord_002",
                    orderNumber: "YT-84921",
                    customerName: "Ananya Menon",
                    customerEmail: "ananya@example.com",
                    shippingAddress: "MG Road, Kochi, Kerala 682016",
                    items: [
                        { productId: "p3", name: "Neumorphic Wallet", quantity: 1, price: 65.50 }
                    ],
                    totalAmount: 65.50,
                    paymentStatus: "Paid",
                    orderStatus: "Shipped",
                    createdAt: "2026-11-03T14:15:00Z"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    const filteredOrders = orders.filter(
        (ord) =>
            (ord.orderNumber && ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (ord.customerName && ord.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (ord.customerEmail && ord.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
        try {
            setStatusUpdating(true);
            setLoadingMessage(`Updating order status to ${newStatus}...`);
            setActionLoading(true);

            await axios.put(
                `${API_URL_ORDER}/updateorderstatus/${orderId}`,
                { orderStatus: newStatus },
                { withCredentials: true }
            );

            setOrders((prev) =>
                prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
            );
            if (selectedOrder) {
                setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            // Optimistic update fallback for UI testing
            setOrders((prev) =>
                prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
            );
            if (selectedOrder) {
                setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            }
        } finally {
            setStatusUpdating(false);
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: Order['orderStatus']) => {
        switch (status) {
            case 'Delivered':
                return <span className="bg-[#3D5B32] text-[#FFF8F0] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
            case 'Shipped':
                return <span className="bg-[#735C00] text-[#FFF8F0] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Shipped</span>;
            case 'Processing':
                return <span className="bg-[#D4AF37] text-[#FFF8F0] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Processing</span>;
            case 'Cancelled':
                return <span className="bg-[#696B75] text-[#FFF8F0] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Cancelled</span>;
        }
    };

    return (
        <div className="bg-[#FFF8F0] text-[#3D404C] font-sans h-screen flex flex-col md:flex-row overflow-hidden selection:bg-[#D0C5AF] selection:text-[#3D404C] relative">
            <GlobalLoader isLoading={actionLoading} loadingMessage={loadingMessage} />

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}


            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Top Header */}
                <header className="bg-[#FFF8F0] border-b border-[#D0C5AF] min-h-14 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            className="lg:hidden text-[#696B75] p-1.5 hover:bg-[#F7F0E2] rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg sm:text-[20px] font-semibold text-[#3D404C] truncate">Orders Management</h1>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#696B75] w-5 h-5" />
                            <input
                                className="pl-9 pr-3 py-1.5 bg-[#F7F0E2] border border-[#D0C5AF] rounded-lg text-sm w-36 sm:w-48 md:w-64 focus:ring-1 focus:ring-[#735C00] focus:border-[#735C00] outline-none transition-all text-[#3D404C] placeholder-[#696B75]"
                                placeholder="Search order ID or customer..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-[#D0C5AF]">
                            <button className="text-[#696B75] p-1 hover:bg-[#F7F0E2] rounded-lg" aria-label="Notifications">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-[#D0C5AF] flex items-center justify-center text-[#735C00] font-bold text-xs shrink-0">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Canvas */}
                <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FFF8F0]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-[30px] font-bold text-[#3D404C]">Customer Orders</h2>
                            <p className="text-xs sm:text-sm text-[#696B75] mt-0.5 sm:mt-1">Track customer checkouts, fulfillment progress, and shipping statuses.</p>
                        </div>
                    </div>

                    {/* Stats Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">TOTAL ORDERS</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">{orders.length}</span>
                                <span className="text-[#3D5B32] text-[12px] font-medium flex items-center gap-0.5">
                                    <TrendingUp className="w-[14px] h-[14px]" /> Active
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">PROCESSING</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#D4AF37]">
                                    {orders.filter(o => o.orderStatus === 'Processing').length}
                                </span>
                                <span className="text-[#D4AF37] text-[12px] font-medium">Needs Fulfillment</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">SHIPPED</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">
                                    {orders.filter(o => o.orderStatus === 'Shipped').length}
                                </span>
                                <span className="bg-[#EEE7DA] px-2 py-0.5 rounded text-[10px] text-[#696B75] uppercase font-bold tracking-wider">In Transit</span>
                            </div>
                        </div>
                        <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-4 sm:p-5 rounded-xl shadow-sm">
                            <p className="text-[#696B75] text-[11px] sm:text-[12px] font-medium mb-2">REVENUE</p>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl sm:text-[30px] font-bold leading-none text-[#3D404C]">
                                    ${orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <DollarSign className="w-5 h-5 text-[#735C00] opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Filter & Options Toolbar */}
                    <div className="bg-[#F7F0E2] border border-[#D0C5AF] p-3 sm:p-4 rounded-t-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button className="flex items-center gap-2 border border-[#D0C5AF] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#EEE7DA] transition-colors text-[#3D404C]">
                                <Filter className="w-[18px] h-[18px]" />
                                Filters
                            </button>
                            <div className="hidden sm:block h-6 w-[1px] bg-[#D0C5AF]"></div>
                            <select className="bg-transparent border border-[#D0C5AF] sm:border-none rounded-lg px-2 py-1.5 sm:p-0 text-xs sm:text-sm font-medium cursor-pointer text-[#3D404C]">
                                <option>Status: All</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D0C5AF]">
                            <span className="text-xs text-[#696B75]">SORT BY</span>
                            <button className="text-xs sm:text-sm font-medium text-[#735C00] flex items-center gap-1">
                                Newest Orders
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Orders Container */}
                    <div className="bg-[#F7F0E2] border-x border-b border-[#D0C5AF] rounded-b-xl overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="py-12 text-center text-[#696B75] text-sm flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading customer orders...
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="py-12 text-center text-[#696B75] text-sm">No orders found.</div>
                        ) : (
                            <>
                                {/* Mobile / Tablet Card View */}
                                <div className="block lg:hidden divide-y divide-[#D0C5AF]">
                                    {filteredOrders.map((ord) => (
                                        <div key={ord.id} className="p-4 hover:bg-[#FFF8F0] transition-colors space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <span className="font-mono font-bold text-sm text-[#735C00]">{ord.orderNumber}</span>
                                                    <div className="font-semibold text-sm text-[#3D404C] mt-0.5">{ord.customerName}</div>
                                                    <div className="text-xs text-[#696B75]">{ord.items.length} items • ${ord.totalAmount.toFixed(2)}</div>
                                                </div>
                                                {getStatusBadge(ord.orderStatus)}
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-[#D0C5AF]/40 text-xs text-[#696B75]">
                                                <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(ord);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                    className="bg-[#3D5B32] text-[#FFF8F0] px-3 py-1.5 rounded-md font-medium flex items-center gap-1 hover:opacity-90"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Full Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead>
                                            <tr className="bg-[#EEE7DA] border-y border-[#D0C5AF]">
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Order ID</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Payment</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-[12px] font-medium text-[#696B75] uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#D0C5AF]">
                                            {filteredOrders.map((ord) => (
                                                <tr key={ord.id} className="hover:bg-[#FFF8F0] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-xs font-bold text-[#735C00]">{ord.orderNumber}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-sm text-[#3D404C]">{ord.customerName}</div>
                                                        <div className="text-xs text-[#696B75]">{ord.customerEmail}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-[#696B75]">
                                                        {new Date(ord.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-[#3D404C]">${ord.totalAmount.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-[#EEE7DA] text-[#3D404C] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                            {ord.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(ord.orderStatus)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(ord);
                                                                setIsDetailsModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-[#EEE7DA] rounded text-[#696B75] hover:text-[#735C00] transition-colors"
                                                            title="View Order Details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <div className="bg-[#EEE7DA] border-t border-[#D0C5AF] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                            <span className="text-xs text-[#696B75] font-medium">Showing all {filteredOrders.length} orders</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Order Details & Fulfillment Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#FFF8F0] border border-[#D0C5AF] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative my-8">
                        <div className="flex items-center justify-between pb-4 border-b border-[#D0C5AF] mb-6">
                            <div>
                                <span className="font-mono font-bold text-sm text-[#735C00]">{selectedOrder.orderNumber}</span>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#181b26]">Order Details</h3>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-[#696B75] hover:text-[#3D404C] cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer & Shipping info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F0E2] p-4 rounded-xl border border-[#D0C5AF]">
                                <div>
                                    <h4 className="text-xs font-bold text-[#696B75] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#735C00]" /> Customer Info
                                    </h4>
                                    <p className="font-semibold text-sm text-[#3D404C]">{selectedOrder.customerName}</p>
                                    <p className="text-xs text-[#696B75] flex items-center gap-1 mt-1">
                                        <Mail className="w-3.5 h-3.5" /> {selectedOrder.customerEmail}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-[#696B75] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-[#735C00]" /> Shipping Address
                                    </h4>
                                    <p className="text-xs text-[#3D404C] leading-relaxed">{selectedOrder.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Order Items Table */}
                            <div>
                                <h4 className="text-xs font-bold text-[#696B75] uppercase tracking-wider mb-3">Purchased Items</h4>
                                <div className="border border-[#D0C5AF] rounded-lg overflow-hidden bg-white">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="bg-[#EEE7DA] border-b border-[#D0C5AF] text-[#696B75]">
                                                <th className="p-3">Product Name</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#D0C5AF]">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-medium text-[#3D404C]">{item.name}</td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                                                    <td className="p-3 text-right font-semibold">${(item.quantity * item.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end items-center gap-4 mt-3 px-2">
                                    <span className="text-xs font-semibold text-[#696B75]">Total Amount:</span>
                                    <span className="text-lg font-bold text-[#3D404C]">${selectedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Status Update Actions */}
                            <div className="pt-4 border-t border-[#D0C5AF]">
                                <label className="block text-xs font-semibold text-[#696B75] mb-2 uppercase tracking-wider">Update Fulfillment Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as Order['orderStatus'][]).map((st) => (
                                        <button
                                            key={st}
                                            disabled={statusUpdating || selectedOrder.orderStatus === st}
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedOrder.orderStatus === st
                                                ? 'bg-[#735C00] text-white shadow-sm ring-2 ring-[#735C00]/50'
                                                : 'bg-[#EEE7DA] text-[#3D404C] hover:bg-[#D0C5AF]'
                                                } disabled:opacity-50`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-6 mt-6 border-t border-[#D0C5AF]">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-5 py-2 bg-[#3D5B32] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};