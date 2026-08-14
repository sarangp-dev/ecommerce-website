import axios from 'axios';
import React from 'react';
const API_URL_PRODUCT = import.meta.env.VITE_API_URL_PRODUCT;

export default function InitializeNewproduct(): React.JSX.Element {
    const [formData, setFormData] = React.useState({
        productName: '',
        category: '',
        price: '',
        stock: '',
        description: '',
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [productimage, setProductImage] = React.useState<File | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProductImage(e.target.files[0]);
        }
    };

    const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const data = new FormData();

            data.append("productName", formData.productName);
            data.append("category", formData.category);
            data.append("productprice", formData.price);
            data.append("quantity", formData.stock);
            data.append("description", formData.description);

            if (productimage) {
                data.append("productimage", productimage);
            }

            const response = await axios.post(
                `${API_URL_PRODUCT}/addproduct`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log("Product added successfully!");

                setFormData({
                    productName: '',
                    category: '',
                    price: '',
                    stock: '',
                    description: '',
                });

                setProductImage(null);

                // Clear file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
            console.log("Form response:", response.data);

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    return (
        <div className="bg-[#FFF8F0] text-[#181b26] min-h-screen overflow-hidden flex font-sans antialiased">
            {/* SideNavBar */}
            <nav className="hidden md:flex flex-col bg-[#F7F0E2] border-r border-[#ccc6bc]/30 fixed left-0 top-0 h-full w-72 pt-16 pb-8 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="px-6 mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]">
                            <img
                                className="w-full h-full object-cover"
                                alt="Portrait of a product manager"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRE8j-yDNj1t22kQAXu4ETLyhglAvxWzVAoBi_hDPH385NXpCcE9-lndodcztpy5_zVf0kJFh5u5avbVJtRyYd7Togc099l6duB7u-CB7jgPxR1LcQABJ3vdPROsVLodfHJwgw3213QzDg_-HYD2pfY-4fYPllP2IZXXov1_y4GqgWAvBDk65q4_8z9LFAWSLd8Lx0YDsqetyx7ytSc0vXDktvRt83B6jKTk3VeInVFJAWAXXIF_7w"
                            />
                        </div>
                        <div>
                            <h2 className="text-[20px] leading-tight font-serif text-[#181b26]">product Nexus</h2>
                            <p className="text-xs text-[#4a463f] mt-1">Phase: Initialization</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-1 flex flex-col px-2">
                    <a
                        className="relative flex items-center gap-4 px-4 py-3 text-[#3D5B32] bg-[#3D5B32]/5 rounded-lg transition-colors duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            rocket_launch
                        </span>
                        <span className="text-sm font-semibold tracking-wider">Basics</span>
                    </a>
                    <a
                        className="flex items-center gap-4 px-4 py-3 text-[#4a463f] hover:text-[#181b26] hover:bg-black/5 rounded-lg transition-colors duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined">shutter_speed</span>
                        <span className="text-sm font-semibold tracking-wider">Timeline</span>
                    </a>
                    <a
                        className="flex items-center gap-4 px-4 py-3 text-[#4a463f] hover:text-[#181b26] hover:bg-black/5 rounded-lg transition-colors duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined">groups</span>
                        <span className="text-sm font-semibold tracking-wider">Team</span>
                    </a>
                </div>

                <div className="mt-auto space-y-1 border-t border-[#ccc6bc]/30 pt-4 px-2">
                    <a
                        className="flex items-center gap-4 px-4 py-3 text-[#4a463f] hover:text-[#181b26] hover:bg-black/5 rounded-lg transition-colors duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="text-sm font-semibold tracking-wider">System Status</span>
                    </a>
                    <a
                        className="flex items-center gap-4 px-4 py-3 text-[#4a463f] hover:text-[#181b26] hover:bg-black/5 rounded-lg transition-colors duration-200"
                        href="#"
                    >
                        <span className="material-symbols-outlined">help_center</span>
                        <span className="text-sm font-semibold tracking-wider">Help</span>
                    </a>
                </div>

                <div className="px-6 mt-6">
                    <button className="w-full py-3 bg-white text-[#181b26] border border-[#7b766e] hover:border-[#D4AF37] transition-all duration-300 text-sm font-semibold rounded flex items-center justify-center gap-2 group cursor-pointer">
                        Deploy product
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </nav>

            {/* Main Content Stage */}
            <main className="flex-1 md:ml-72 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-y-auto">
                <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-5 h-20 bg-[#FFF8F0]/90 backdrop-blur-md border-b border-[#ccc6bc]/30 left-0">
                    <div className="font-serif text-[24px] tracking-tight text-[#181b26]">NEURAL_FLOW</div>
                    <button className="text-[#4a463f] hover:text-[#625e58]">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                <div className="w-full max-w-3xl bg-white rounded-xl mt-20 md:mt-0 p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#ccc6bc]/20 relative">
                    <div className="mb-10 text-center">
                        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#181b26] mb-2">
                            Initialize New product
                        </h1>
                        <p className="text-lg text-[#4a463f]">Define the core parameters for the new operational sequence.</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleAddProduct}>
                        {/* product Name */}
                        <div className="group relative">
                            <label className="block text-sm font-semibold tracking-wider text-[#181b26] mb-2">
                                product Name
                            </label>
                            <input
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 text-base placeholder:text-[#4a463f]/50"
                                placeholder="e.g. Operation Chimera"
                                type="text"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Classification */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold tracking-wider text-[#181b26] mb-2">
                                    Classification
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 text-base appearance-none cursor-pointer"
                                        required
                                    >
                                        <option disabled value="">
                                            Select Category
                                        </option>
                                        <option value="alpha">Alpha Level</option>
                                        <option value="beta">Beta Level</option>
                                        <option value="omega">Omega Level</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#4a463f] pointer-events-none">
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {/* Product Price */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold tracking-wider text-[#181b26] mb-2">
                                    Product Price
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 text-base placeholder:text-[#4a463f]/50"
                                    placeholder="e.g. 99.99"
                                    required
                                />
                            </div>

                            {/* Number of Stock */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold tracking-wider text-[#181b26] mb-2">
                                    Number of stock
                                </label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 text-base placeholder:text-[#4a463f]/50"
                                    placeholder="e.g. 50"
                                    required
                                />
                            </div>

                            {/* Product Image Input */}
                            <div className="group relative">
                                <label className="block text-sm font-semibold tracking-wider text-[#181b26] mb-2">
                                    product image
                                </label>
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-2.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="group relative">
                            <label className="flex justify-between items-end mb-2">
                                <span className="block text-sm font-semibold tracking-wider text-[#181b26]">Executive Summary</span>
                                <span className="text-xs text-[#4a463f]">{formData.description.length}/500</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                maxLength={500}
                                className="w-full bg-white border border-[#7b766e] text-[#181b26] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 text-base placeholder:text-[#4a463f]/50 resize-none"
                                placeholder="Detail the primary objectives and anticipated outcomes..."
                                rows={4}
                            ></textarea>
                        </div>

                        {/* Action Area */}
                        <div className="mt-12 flex justify-end">
                            <button
                                className="bg-[#3D5B32] text-white px-8 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                                type="submit"
                            >
                                add product
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}