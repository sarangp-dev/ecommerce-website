import React, { useEffect } from 'react';

export default function Profile() {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const elementVisible = 100;

            reveals.forEach((reveal) => {
                const elementTop = reveal.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    reveal.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();

        return () => {
            window.removeEventListener('scroll', revealOnScroll);
        };
    }, []);

    return (
        <div className="bg-[#fff8f0] text-[#1f1b13] font-['Manrope',sans-serif] min-h-screen relative pb-32 md:pb-12 antialiased overflow-x-hidden selection:bg-[#d4af37] selection:text-white">
            {/* Global CSS / Custom Styles */}
            <style>{`
        .texture-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
        
        .path-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          bottom: 0;
          width: 2px;
          background-image: linear-gradient(to bottom, #d0c5af 50%, transparent 50%);
          background-size: 2px 12px;
          z-index: 0;
        }
        
        .tactile-shadow {
          box-shadow: 0 4px 12px rgba(115, 92, 0, 0.08);
        }
        
        .tool-shadow {
          box-shadow: 0 8px 20px rgba(115, 92, 0, 0.12);
        }

        .etched-border {
          border: 1px solid #d0c5af;
        }
        
        .button-pressed-edge {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .paper-shadow {
          box-shadow: 0 4px 12px rgba(93, 64, 55, 0.08);
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            {/* Tactile Grain Overlay */}
            <div className="texture-overlay" />

            {/* Top App Bar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-[#fff8f0] border-b border-[#d0c5af] shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                    <div className="font-['Bricolage_Grotesque'] text-[28px] md:text-[32px] font-bold text-[#735c00]">
                        Wayfinder
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-4">
                    <nav className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-[#4d4635] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium hover:bg-[#efe7da] px-3 py-2 rounded transition-colors flex flex-col items-center group"
                        >
                            <span className="material-symbols-outlined text-[24px] mb-1 group-hover:text-[#735c00] transition-colors">
                                explore
                            </span>
                            <span>Map</span>
                        </a>
                        <a
                            href="#"
                            className="text-[#4d4635] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium hover:bg-[#efe7da] px-3 py-2 rounded transition-colors flex flex-col items-center group"
                        >
                            <span className="material-symbols-outlined text-[24px] mb-1 group-hover:text-[#735c00] transition-colors">
                                menu_book
                            </span>
                            <span>Journal</span>
                        </a>
                        <a
                            href="#"
                            className="text-[#554300] font-bold font-['Space_Grotesk'] text-[14px] leading-[18px] bg-[#d4af37] px-4 py-2 rounded-full transition-colors flex flex-col items-center"
                        >
                            <span
                                className="material-symbols-outlined text-[24px] mb-1"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                badge
                            </span>
                            <span>Logbook</span>
                        </a>
                        <a
                            href="#"
                            className="text-[#4d4635] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium hover:bg-[#efe7da] px-3 py-2 rounded transition-colors flex flex-col items-center group"
                        >
                            <span className="material-symbols-outlined text-[24px] mb-1 group-hover:text-[#735c00] transition-colors">
                                backpack
                            </span>
                            <span>Gear</span>
                        </a>
                    </nav>
                </div>

                {/* Right side controls / Mobile icon buttons */}
                <div className="flex items-center gap-3">
                    <button className="text-[#735c00] md:text-[#4d4635] hover:bg-[#efe7da] p-2 rounded-full transition-colors active:scale-95 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">settings</span>
                    </button>
                    <button className="text-[#735c00] md:text-[#4d4635] hover:bg-[#efe7da] p-2 rounded-full transition-colors active:scale-95 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">history_edu</span>
                    </button>
                    {/* Desktop Avatar Profile Thumbnail */}
                    <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden etched-border">
                        <img
                            alt="Explorer's portrait photo"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYPlL_5eDKD6nQAPLTl5ux0ot9VzFTjGhAGwZIREybf7mgZ5vvDxafaWeldaTRoT5RtlzZKTge0CqXIWqRxSz3w6TcYmQfdOTs3c44PEIyiTVVHJhNAeJhBb8_xejTmgF3JnFVuRvZU8qFR0D5RxSmaK9QSGTd_Ev11dVJIxrX5kTa_QkrW-UApWUOYCcCRZ7fPfiDTE096EYBJtNf3qioFHJkhFfj-xdJLCqVq-yNsAhmKa4BRQ"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <main className="pt-24 max-w-7xl mx-auto px-5 py-8 md:grid md:grid-cols-12 md:gap-8">

                {/* Page Title Header (Desktop Only) */}
                <div className="col-span-12 mb-8 hidden md:block">
                    <h1 className="font-['Bricolage_Grotesque'] text-[40px] leading-[48px] tracking-[-0.02em] font-extrabold text-[#735c00] border-b-2 border-[#d0c5af] pb-4 inline-block">
                        Explorer's Identification
                    </h1>
                </div>

                {/* Left Column: The Identity (Bento Grid Style) */}
                <section className="col-span-12 md:col-span-4 mb-8 md:mb-0">
                    <div className="bg-[#fbf3e5] rounded-xl etched-border tactile-shadow p-6 flex flex-col items-center text-center relative overflow-hidden group">
                        {/* Decorative background map pattern */}
                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAN1aKGs5Q4z9nU2-4XdpeSk4MGFN_v04QXiHJ54fY5iYtfGszXYSJTzYnxvGHprpt4rXfwIRTkltSV2SeFVaxRBe5nl2mfyPWuVRcFimLMXN89rctfA4QqFTEJpoXRxFtXi5Jbclc5aolwa7kk-HG13EzFpMhrhQ6AcEmwmKvLk9asg1w9NRZo6lhQJoAXExwn3CZKXdWI2UmGoRXy0qjthny4FSUvrDY74HdaWfWlrbWKjgj4cA')`,
                            }}
                        />

                        {/* Avatar Image container */}
                        <div className="w-32 h-32 rounded-full overflow-hidden etched-border mb-4 relative z-10 tool-shadow">
                            <img
                                className="w-full h-full object-cover"
                                alt="Captain Julian Vance portrait"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQMNlHZIKlFFA_otKh3Al9c0nyU61tgcAgIC2YwPJwdCRVufiviqHFUpdY96k1RTF2JrvrdYRyz3KX34037XbD-WYJNkkKnf82H1gEEMgl9VBXxZImUtVKzt0-ienZMvw2AoN4nkb-xJDHBdZnpvvOz9SJtjPK6rNzZqOf-imoP5G3een0WcRGkcDY8J0Fw18swdZGjfp7igu-bF2qU8204docYgBW567R-C9YDHWOdi5Jr3_i5A"
                            />
                        </div>

                        <h2 className="font-['Bricolage_Grotesque'] text-[32px] leading-[40px] font-bold text-[#1f1b13] mb-1 relative z-10">
                            Captain Julian Vance
                        </h2>
                        <div className="inline-block px-3 py-1 border border-[#7f7663] text-[#735c00] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold rounded-full mb-4 relative z-10 uppercase bg-[#eae1d4]">
                            Master Cartographer
                        </div>

                        {/* Stats row for mobile responsiveness enhancement */}
                        <div className="flex md:hidden gap-4 mb-4 relative z-10 w-full justify-center">
                            <div className="flex flex-col items-center bg-[#fff8f0] rounded-xl px-4 py-2 border border-[#d0c5af] paper-shadow">
                                <span className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#735c00]">42</span>
                                <span className="text-[12px] text-[#4d4635]">Journeys</span>
                            </div>
                            <div className="flex flex-col items-center bg-[#fff8f0] rounded-xl px-4 py-2 border border-[#d0c5af] paper-shadow">
                                <span className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#735c00]">12k</span>
                                <span className="text-[12px] text-[#4d4635]">Miles</span>
                            </div>
                        </div>

                        <div className="w-full border-t border-[#d0c5af] my-4 relative z-10" />

                        <div className="flex flex-col gap-3 w-full text-left relative z-10">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#7f7663] text-[20px]">mail</span>
                                <span className="text-[#4d4635] text-[14px] leading-[20px]">julian.vance@wayfinders.co</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#7f7663] text-[20px]">location_on</span>
                                <span className="text-[#4d4635] text-[14px] leading-[20px]">Basecamp: Pacific Northwest</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#7f7663] text-[20px]">calendar_today</span>
                                <span className="text-[#4d4635] text-[14px] leading-[20px]">Joined: Solstice 2021</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-[#d4af37] text-[#554300] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold py-3 rounded-lg tool-shadow button-pressed-edge hover:bg-[#735c00] hover:text-white transition-colors flex justify-center items-center gap-2 uppercase">
                            <span className="material-symbols-outlined text-[18px]">edit_document</span>
                            Update Logs
                        </button>
                    </div>
                </section>

                {/* Right Column: Journal & Gear */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-8">

                    {/* Expedition Journal Section */}
                    <section className="reveal active">
                        <div className="flex justify-between items-end mb-4 border-b border-[#d0c5af] pb-2">
                            <h3 className="font-['Bricolage_Grotesque'] text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-bold text-[#77574d] flex items-center gap-2">
                                <span className="material-symbols-outlined">menu_book</span>
                                Completed Journeys
                            </h3>
                            <a
                                href="#"
                                className="text-[#735c00] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium hover:underline flex items-center gap-1"
                            >
                                View All Archives <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Journey Card 1 */}
                            <div className="bg-[#fbf3e5] rounded-lg etched-border tactile-shadow p-5 hover:bg-[#efe7da] transition-colors cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <span className="material-symbols-outlined text-[48px] text-[#735c00]">terrain</span>
                                </div>
                                <div>
                                    <div className="text-[#7f7663] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mb-1 uppercase tracking-wider">
                                        Oct 12 - 28, 2023
                                    </div>
                                    <h4 className="font-['Bricolage_Grotesque'] text-[28px] leading-[34px] font-bold text-[#1f1b13] mb-2">
                                        The Alpine Traverse
                                    </h4>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-0.5 border border-[#7f7663] text-[#77574d] text-[14px] leading-[20px] rounded-full bg-[#eae1d4]">
                                            Mountain
                                        </span>
                                        <span className="px-2 py-0.5 border border-[#7f7663] text-[#77574d] text-[14px] leading-[20px] rounded-full bg-[#eae1d4]">
                                            Strenuous
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="w-full bg-[#eae1d4] h-1.5 rounded-full mr-4 relative">
                                        <div className="bg-[#735c00] h-full rounded-full w-full" />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#d4af37] rounded-full shadow-sm border border-[#735c00]" />
                                    </div>
                                    <span className="text-[#735c00] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium whitespace-nowrap group-hover:underline">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            {/* Journey Card 2 */}
                            <div className="bg-[#fbf3e5] rounded-lg etched-border tactile-shadow p-5 hover:bg-[#efe7da] transition-colors cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <span className="material-symbols-outlined text-[48px] text-[#735c00]">water</span>
                                </div>
                                <div>
                                    <div className="text-[#7f7663] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mb-1 uppercase tracking-wider">
                                        Aug 01 - 14, 2023
                                    </div>
                                    <h4 className="font-['Bricolage_Grotesque'] text-[28px] leading-[34px] font-bold text-[#1f1b13] mb-2">
                                        Coastal Kayak Run
                                    </h4>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-0.5 border border-[#7f7663] text-[#77574d] text-[14px] leading-[20px] rounded-full bg-[#eae1d4]">
                                            Water
                                        </span>
                                        <span className="px-2 py-0.5 border border-[#7f7663] text-[#77574d] text-[14px] leading-[20px] rounded-full bg-[#eae1d4]">
                                            Moderate
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="w-full bg-[#eae1d4] h-1.5 rounded-full mr-4 relative">
                                        <div className="bg-[#735c00] h-full rounded-full w-full" />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#d4af37] rounded-full shadow-sm border border-[#735c00]" />
                                    </div>
                                    <span className="text-[#735c00] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium whitespace-nowrap group-hover:underline">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Assigned Equipment / Gear Bag Section */}
                    <section className="reveal">
                        <div className="flex justify-between items-end mb-4 border-b border-[#d0c5af] pb-2">
                            <h3 className="font-['Bricolage_Grotesque'] text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-bold text-[#77574d] flex items-center gap-2">
                                <span className="material-symbols-outlined">backpack</span>
                                Assigned Equipment
                            </h3>
                            <a
                                href="#"
                                className="text-[#735c00] font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium hover:underline flex items-center gap-1"
                            >
                                Inventory <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </a>
                        </div>

                        {/* Gear Inventory Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Gear Item 1 */}
                            <a
                                href="#"
                                className="block bg-white rounded-xl etched-border tactile-shadow p-3 hover:-translate-y-1 transition-transform group"
                            >
                                <div className="aspect-square bg-[#fbf3e5] rounded-lg mb-3 overflow-hidden relative">
                                    <img
                                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        alt="Brass Compass"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2khz2Mql-cb-Qe193m_r9SMAQay3yQiN3m0Bml1JfXQZOmYRN00aG7BA1Zi_39nGbIJ2U-16q75e11TLAm9uZgUxQ1rVQwpABjI9JGau4xQyMrf8s0PkG_0xRYQliiz3vURusOrchpAPXTi9oM4YgL36awYZlbVcZkSvNmX8JN51y81DlCHRF9KSnJWfqpm_I8DdJJyNV-AkJ9oH4aXhn3CXhCOVoGS3Six_Rf__-0T3nuUKSdQ"
                                    />
                                </div>
                                <h5 className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium text-[#1f1b13] truncate">
                                    Brass Compass
                                </h5>
                                <p className="text-[#7f7663] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mt-1">
                                    Navigation
                                </p>
                            </a>

                            {/* Gear Item 2 */}
                            <a
                                href="#"
                                className="block bg-white rounded-xl etched-border tactile-shadow p-3 hover:-translate-y-1 transition-transform group"
                            >
                                <div className="aspect-square bg-[#fbf3e5] rounded-lg mb-3 overflow-hidden relative">
                                    <img
                                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        alt="Canvas Rucksack"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuASEsPUbwwHtZz1vUxxM7_h4-449SNXhahUjSqIY_-NIohA-97ANrUh_VA9R4SY63SURYgpjnl7LgkTB9T7sCfZdKlOdMhYeCHg001MVA5N8sBsDbJSy1zs-4c6FtCeHxm4EyiwHniOxx8Ll9sN3FvQVqZ6Pm3t-YzPvfWN9MQiHeT0JO13BbqSkPj20_55J6PL18LD2HA-SunNsjbLvtl4p5JXKpvn8SQKbagrD7AzROLuxlav7w"
                                    />
                                </div>
                                <h5 className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium text-[#1f1b13] truncate">
                                    Canvas Rucksack
                                </h5>
                                <p className="text-[#7f7663] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mt-1">
                                    Storage
                                </p>
                            </a>

                            {/* Gear Item 3 */}
                            <a
                                href="#"
                                className="block bg-white rounded-xl etched-border tactile-shadow p-3 hover:-translate-y-1 transition-transform group"
                            >
                                <div className="aspect-square bg-[#fbf3e5] rounded-lg mb-3 overflow-hidden relative">
                                    <img
                                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        alt="Storm Lantern"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5JB6X9N-vj8WlE1bogNhPVB-Swa7Z0klignyp5JMlQrLLCE65iGSywCL2-bRldAgBWsc9sAPwoVRungqOs5BqChnS6bwFd3WGVYV0VIOWfYbUyfJNjChtlvEJg-B7evhACdFj5auV71Wm3Zh4OgyL0bGt9ps2EsU0AQkvyWFSWfPOp7P1ftEBc2LnsMc_NrfHOYVD1iXXSSPh34JSY6lWGSRTgNWN2in6FEig21lYaWVdIYcpbw"
                                    />
                                </div>
                                <h5 className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium text-[#1f1b13] truncate">
                                    Storm Lantern
                                </h5>
                                <p className="text-[#7f7663] font-['Space_Grotesk'] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mt-1">
                                    Illumination
                                </p>
                            </a>

                            {/* Gear Item 4: Requisition New Gear */}
                            <a
                                href="#"
                                className="block bg-white rounded-xl etched-border tactile-shadow p-3 hover:-translate-y-1 transition-transform group flex flex-col justify-center items-center text-center border-dashed border-2 border-[#d0c5af]"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#efe7da] flex items-center justify-center mb-2 text-[#7f7663] group-hover:text-[#554300] group-hover:bg-[#d4af37] transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">add</span>
                                </div>
                                <h5 className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-medium text-[#4d4635] group-hover:text-[#735c00] transition-colors">
                                    Requisition<br />New Gear
                                </h5>
                            </a>
                        </div>
                    </section>

                </div>
            </main>

            {/* Mobile Bottom Navigation Bar (Hidden on md and up) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-[#fbf3e5] border-t border-[#d0c5af] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-xl">
                <a
                    href="#"
                    className="flex flex-col items-center justify-center text-[#4d4635] px-4 py-1 hover:text-[#735c00] transition-transform duration-300 ease-out active:scale-90"
                >
                    <span className="material-symbols-outlined mb-1">explore</span>
                    <span className="font-['Space_Grotesk'] text-[14px] leading-[18px]">Map</span>
                </a>
                <a
                    href="#"
                    className="flex flex-col items-center justify-center text-[#4d4635] px-4 py-1 hover:text-[#735c00] transition-transform duration-300 ease-out active:scale-90"
                >
                    <span className="material-symbols-outlined mb-1">menu_book</span>
                    <span className="font-['Space_Grotesk'] text-[14px] leading-[18px]">Journal</span>
                </a>
                <a
                    href="#"
                    className="flex flex-col items-center justify-center bg-[#d4af37] text-[#554300] rounded-full px-4 py-1 transition-transform duration-300 ease-out active:scale-90"
                >
                    <span
                        className="material-symbols-outlined mb-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        badge
                    </span>
                    <span className="font-['Space_Grotesk'] text-[14px] leading-[18px] font-bold">Logbook</span>
                </a>
                <a
                    href="#"
                    className="flex flex-col items-center justify-center text-[#4d4635] px-4 py-1 hover:text-[#735c00] transition-transform duration-300 ease-out active:scale-90"
                >
                    <span className="material-symbols-outlined mb-1">backpack</span>
                    <span className="font-['Space_Grotesk'] text-[14px] leading-[18px]">Gear</span>
                </a>
            </nav>
        </div>
    );
}