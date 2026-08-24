import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from "axios";
import { useCart } from './CartContext';

const API_URL_PRODUCT = import.meta.env.VITE_API_URL_PRODUCT;
import {
    Compass,
    Plus,
    Minus,
    Trash2,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    ReceiptText,
    User
} from 'lucide-react';

export default function Cartpage(): React.JSX.Element {
    const handlePayment = async () => {
        try {

            if (manifestItems.length === 0) {
                return;
            }

            const response = await axios.post(
                `${API_URL_PRODUCT}/create-payment-intent`,
                {
                    items: manifestItems.map((item) => ({
                        product: item.id,
                        quantity: item.quantity,
                    })),
                }
            );

            if (response.data.success) {
                window.location.href = response.data.url;
            }

        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            alert("Unable to start payment");
        }
    };
    const navigate = useNavigate();
    const { cartItems: manifestItems, updateQuantity, removeFromCart: removeItem, cartTotal: subtotal } = useCart();

    const courierFee: number = 15;

    // Calculations
    const currencySymbol: string = manifestItems[0]?.currency || "₹"; // or use whatever default currency you want
    const totalOffering: number = subtotal > 0 ? subtotal + courierFee : 0;

    return (
        <div className="bg-[#fff8f0] text-[#1f1b13] min-h-screen flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#554300] relative">

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#735c00_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-[#fff8f0]/90 backdrop-blur-md border-b border-[#d0c5af]/50 flex justify-between items-center px-5 py-3 w-full">
                <div className="flex items-center gap-3">
                    <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#4d4635] hover:bg-[#eae1d4] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-extrabold text-2xl text-[#735c00] tracking-tight">Yuthi</span>
                </div>

                {/* Laptop Navigation Icons */}
                <div className="hidden md:flex gap-2">
                    <button className="text-[#4d4635] hover:text-[#735c00] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#eae1d4]" onClick={() => navigate('/homemod')}>
                        <Compass className="w-5 h-5" />
                    </button>
                    <button className="text-[#4d4635] hover:text-[#735c00] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#eae1d4]" onClick={() => navigate('/profile')}>
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-grow container mx-auto px-5 py-8 max-w-7xl relative z-10 pb-32 md:pb-16">

                {/* Header Section */}
                <div className="mb-8 flex items-center gap-3">
                    <Compass className="text-[#735c00] w-9 h-9 fill-[#735c00]/20" />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f1b13] tracking-tight">Expedition Manifest</h1>
                </div>

                <p className="text-[#4d4635] mb-8 md:hidden text-center text-sm">
                    Verify your gear before departure. Ensure you have the necessary supplies for the journey ahead.
                </p>

                {/* Grid Layout: Gear List & Financial Ledger */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Gear List / Path View */}
                    <div className="lg:col-span-8 space-y-4 relative">

                        {manifestItems.length === 0 ? (
                            <div className="text-center py-16 bg-[#f5eddf] rounded-2xl border border-[#d0c5af]/30">
                                <p className="text-[#4d4635] font-medium">Your expedition manifest is empty.</p>
                                <p className="text-sm text-[#7f7663] mt-1">Add provisions to begin your journey.</p>
                            </div>
                        ) : (
                            manifestItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#f5eddf] shadow-sm hover:shadow-md rounded-xl border border-[#d0c5af]/40 flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 transition-all duration-200"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg shadow-sm border border-[#d0c5af]/30 shrink-0"
                                    />

                                    <div className="flex-grow w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-semibold uppercase tracking-wider text-[#7f7663]">{item.category}</span>
                                                <h3 className="font-bold text-lg text-[#1f1b13]">{item.name}</h3>
                                                <p className="text-sm text-[#4d4635] mt-0.5">{item.description}</p>
                                            </div>
                                            <div className="text-[#735c00] font-bold text-lg">
                                                {item.price} {item.currency}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#d0c5af]/20">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-[#fff8f0] rounded-full border border-[#d0c5af]/60 overflow-hidden shadow-2xs">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="px-3 py-1 text-[#1f1b13] hover:bg-[#eae1d4] transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="px-4 font-medium text-sm text-[#1f1b13]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="px-3 py-1 text-[#1f1b13] hover:bg-[#eae1d4] transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Delete Item */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[#ba1a1a] hover:text-white hover:bg-[#ba1a1a]/10 p-2 rounded-full transition-colors flex items-center justify-center"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Financial Ledger (Sticky on Desktop) */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#efe7da] rounded-2xl p-6 shadow-lg border border-[#d0c5af] lg:sticky lg:top-[90px]">

                            <div className="flex items-center gap-2 mb-6 border-b border-[#d0c5af] pb-4">
                                <ReceiptText className="text-[#4d4635] w-5 h-5" />
                                <h2 className="font-bold text-xl text-[#1f1b13]">Financial Ledger</h2>
                            </div>

                            <div className="space-y-3 text-sm font-medium">
                                <div className="flex justify-between items-center text-[#4d4635]">
                                    <span>Provisions Subtotal</span>
                                    <span className="font-bold text-[#1f1b13]">{subtotal} {currencySymbol}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#4d4635]">
                                    <span>Courier / Delivery Fee</span>
                                    <span className="font-bold text-[#1f1b13]">{subtotal > 0 ? `${courierFee} ${currencySymbol}` : `0 ${currencySymbol}`}</span>
                                </div>

                                <div className="pt-3 mt-3 border-t border-[#d0c5af] border-dashed"></div>

                                <div className="flex justify-between items-center text-base">
                                    <span className="font-bold text-[#1f1b13]">Total Offering</span>
                                    <span className="font-extrabold text-2xl text-[#735c00]">{totalOffering} {currencySymbol}</span>
                                </div>
                            </div>

                            {/* Desktop CTA Button */}
                            <button
                                onClick={handlePayment}
                                disabled={manifestItems.length === 0}
                                className="hidden lg:flex w-full mt-8 bg-[#d4af37] text-[#554300] font-semibold py-4 rounded-xl shadow-md hover:bg-[#735c00] hover:text-white transition-all active:scale-[0.98] items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Finalize Expedition
                            </button>

                            <p className="text-center mt-4 text-xs text-[#4d4635] italic opacity-80">
                                "Preparation is the key to a safe return."
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Sticky Bottom Action Bar (Optimized for Mobile Viewports) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-[#fff8f0]/95 backdrop-blur-md border-t border-[#d0c5af]/30 z-50 shadow-lg">
                <button
                    onClick={handlePayment}
                    disabled={manifestItems.length === 0}
                    className="w-full bg-[#d4af37] text-[#554300] font-semibold py-3.5 rounded-xl shadow-md hover:bg-[#735c00] hover:text-white transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    Finalize Expedition ({totalOffering} {currencySymbol})
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

        </div>
    );
}