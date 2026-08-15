import { useNavigate } from 'react-router-dom'
import './home-mod.css'
import { useState, useCallback, useEffect, type MouseEvent } from 'react'
import axios from "axios";

const API_URL_PRODUCT = import.meta.env.VITE_API_URL_PRODUCT;

// ─── Data ────────────────────────────────────────────────────────────────────

const initialProducts = [
    {
        id: 1,
        name: 'Nebula Pro Headphones',
        price: 299,
        originalPrice: 399,
        tag: 'BEST SELLER',
        tagColor: '#D4AF37',
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format',
        description: 'Immersive 3D audio with AI noise cancellation',
    },
    {
        id: 2,
        name: 'Quantum Watch X',
        price: 599,
        originalPrice: null,
        tag: 'NEW ARRIVAL',
        tagColor: '#735C00',
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format',
        description: 'Biometric tracking beyond limits',
    },
    {
        id: 3,
        name: 'Void Runner Sneakers',
        price: 189,
        originalPrice: null,
        tag: 'LIMITED',
        tagColor: '#3D5B32',
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format',
        description: 'Zero gravity comfort technology',
    },
    {
        id: 4,
        name: 'Photon Camera 4K',
        price: 1299,
        originalPrice: null,
        tag: 'EXCLUSIVE',
        tagColor: '#D4AF37',
        category: 'Photography',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&auto=format',
        description: 'Capture light at its purest',
    },
    {
        id: 5,
        name: 'Matrix Laptop Ultra',
        price: 2499,
        originalPrice: null,
        tag: 'FEATURED',
        tagColor: '#3D5B32',
        category: 'Computing',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format',
        description: 'Process reality at machine speed',
    },
    {
        id: 6,
        name: 'Prism Sunglasses',
        price: 249,
        originalPrice: null,
        tag: 'HOT',
        tagColor: '#735C00',
        category: 'Eyewear',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&auto=format',
        description: 'See the world in new frequencies',
    },
]

const categories = [
    { name: 'Audio', icon: '🎧', count: 47, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format' },
    { name: 'Wearables', icon: '⌚', count: 23, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format' },
    { name: 'Computing', icon: '💻', count: 61, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&auto=format' },
    { name: 'Photography', icon: '📷', count: 34, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop&auto=format' },
]

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Sound Engineer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
        text: "The Nebula Pro has completely transformed how I work. The spatial audio is unlike anything I've experienced — it's like being inside the sound.",
        rating: 5,
    },
    {
        name: 'Marcus Wright',
        role: 'Tech Reviewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
        text: "Yuthi consistently delivers products that feel two years ahead of competitors. The build quality is exceptional and the ecosystem just works.",
        rating: 5,
    },
    {
        name: 'Yuki Tanaka',
        role: 'Creative Director',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
        text: "I ordered three products in one cart — the packaging alone is an experience. These are objects you want on your desk.",
        rating: 5,
    },
]

// ─── 3D Tilt Hook ─────────────────────────────────────────────────────────────

function useTilt(maxDeg = 15) {
    const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } })
    const [isActive, setIsActive] = useState(false)

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            setIsActive(true)
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width
            const y = (e.clientY - rect.top) / rect.height
            setTilt({
                x: (y - 0.5) * -maxDeg * 2,
                y: (x - 0.5) * maxDeg * 2,
                shine: { x: x * 100, y: y * 100 },
            })
        },
        [maxDeg],
    )

    const onMouseLeave = useCallback(() => {
        setIsActive(false)
        setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } })
    }, [])

    const transition = isActive
        ? 'transform 0.08s linear'
        : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)'

    return { tilt, isActive, transition, onMouseMove, onMouseLeave }
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
    bg: '#FFF8F0',
    surface: 'rgba(247, 240, 226, 0.85)',
    surfaceSolid: '#F7F0E2',
    fg: '#3D404C',
    fgDim: '#696B75',
    fgSubtle: 'rgba(105, 107, 117, 0.6)',
    gold: '#D4AF37',
    goldDark: '#735C00',
    goldDim: 'rgba(212, 175, 55, 0.15)',
    goldBorder: 'rgba(212, 175, 55, 0.35)',
    olive: '#3D5B32',
    oliveDim: 'rgba(61, 91, 50, 0.12)',
    border: '#D0C5AF',
    altBg: '#EEE7DA',
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ cartCount }: { cartCount: number }) {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '0 2.5rem',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: scrolled ? 'rgba(255, 248, 240, 0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px)' : 'none',
                borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
                transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
            }}
        >
            <div
                style={{
                    fontFamily: 'Outfit',
                    fontWeight: 900,
                    fontSize: '1.45rem',
                    letterSpacing: '-0.02em',
                    userSelect: 'none',
                }}
            >
                <span style={{ color: C.goldDark }}>Y</span>
                <span style={{ color: C.fg }}>UTH</span>
                <span style={{ color: C.olive }}>i</span>
            </div>

            <div
                className="nav-links"
                style={{ display: 'flex', gap: '2.5rem' }}
            >
                {['Products', 'Categories', 'New Arrivals', 'Sale'].map((link) => (
                    <a
                        key={link}
                        href="#"
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: C.fgDim,
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.fg)}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.fgDim)}
                    >
                        {link}
                    </a>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: C.fgDim,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '0.4rem',
                    }}
                >
                    🔍
                </button>
                <button onClick={() => navigate('/cart')}
                    style={{
                        position: 'relative',
                        background: C.goldDim,
                        border: `1px solid ${C.goldBorder}`,
                        borderRadius: '9px',
                        color: C.fg,
                        cursor: 'pointer',
                        padding: '0.5rem 1.1rem',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                    }}
                >
                    <span >🛒</span> Cart
                    {cartCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: '-7px',
                                right: '-7px',
                                background: C.goldDark,
                                color: '#FFF8F0',
                                borderRadius: '50%',
                                width: '17px',
                                height: '17px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                fontFamily: 'JetBrains Mono',
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ products }: { products: any[] }) {
    const [currentImage, setCurrentImage] = useState(0);

    const [isChanging, setIsChanging] = useState(false);
    useEffect(() => {
        if (!products || products.length <= 1) return;

        const timer = setTimeout(() => {
            setCurrentImage((prev) => (prev + 1) % products.length);
        }, 20000);

        return () => clearTimeout(timer);
    }, [products, currentImage]);
    useEffect(() => {
        if (!products || products.length <= 1) return;

        const timer = setTimeout(() => {
            setCurrentImage((prev) => (prev + 1) % products.length);
        }, 20000); // EVERY image stays for exactly 20 seconds

        return () => clearTimeout(timer);
    }, [currentImage, products.length]);
    const currentProduct = products[currentImage];
    return (
        <section
            style={{
                minHeight: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                padding: '0 4rem',
                paddingTop: '68px',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="hero-grid section-pad"
        >
            {/* Radial background atmosphere */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 70% 60% at 72% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 25% 85%, rgba(61, 91, 50, 0.08) 0%, transparent 60%)
          `,
                    pointerEvents: 'none',
                }}
            />

            {/* Subtle grid lines */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(208, 197, 175, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(208, 197, 175, 0.25) 1px, transparent 1px)
          `,
                    backgroundSize: '64px 64px',
                    pointerEvents: 'none',
                }}
            />

            {/* Left column */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.68rem',
                        color: C.goldDark,
                        letterSpacing: '0.22em',
                        marginBottom: '1.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <span
                        style={{
                            width: '30px',
                            height: '1px',
                            background: C.goldDark,
                            display: 'inline-block',
                            flexShrink: 0,
                        }}
                    />
                    NEW SEASON 2026 COLLECTION
                </div>

                <h1
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: 'clamp(2.6rem, 5.5vw, 5.4rem)',
                        fontWeight: 900,
                        lineHeight: 0.96,
                        color: C.fg,
                        margin: '0 0 1.5rem',
                        letterSpacing: '-0.035em',
                    }}
                >
                    THE FUTURE
                    <br />
                    <span
                        style={{
                            background: `linear-gradient(125deg, ${C.goldDark} 0%, ${C.gold} 50%, ${C.olive} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        WEARS YOU
                    </span>
                </h1>

                <p
                    style={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '1rem',
                        color: C.fgDim,
                        lineHeight: 1.72,
                        maxWidth: '380px',
                        margin: '0 0 2.5rem',
                    }}
                >
                    Explore our curated collection of next-generation tech products. Where design meets dimension.
                </p>

                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        style={{
                            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                            border: 'none',
                            color: '#FFF8F0',
                            padding: '0.95rem 2.1rem',
                            borderRadius: '11px',
                            fontFamily: 'Outfit',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            boxShadow: '0 0 32px rgba(212, 175, 55, 0.25)',
                        }}
                    >
                        SHOP NOW →
                    </button>
                    <button
                        style={{
                            background: 'transparent',
                            border: `1px solid ${C.border}`,
                            color: C.fgDim,
                            padding: '0.95rem 2.1rem',
                            borderRadius: '11px',
                            fontFamily: 'Outfit',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        VIEW ALL
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '3rem', marginTop: '3.5rem' }}>
                    {[
                        { num: '24K+', label: 'Products' },
                        { num: '850K', label: 'Customers' },
                        { num: '4.9★', label: 'Rating' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div
                                style={{
                                    fontFamily: 'Outfit',
                                    fontSize: '1.55rem',
                                    fontWeight: 900,
                                    color: C.fg,
                                    lineHeight: 1,
                                }}
                            >
                                {stat.num}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontSize: '0.75rem',
                                    color: C.fgSubtle,
                                    marginTop: '0.3rem',
                                }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right column — floating product visual */}
            <div
                className="hero-visual"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                {/* Pulsing aura */}
                <div
                    style={{
                        position: 'absolute',
                        width: '420px',
                        height: '420px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 65%)',
                        animation: 'pulse-glow 3.5s ease-in-out infinite',
                    }}
                />

                {/* Rotating orbit ring */}
                <div
                    style={{
                        position: 'absolute',
                        width: '390px',
                        height: '390px',
                        borderRadius: '50%',
                        border: `1px solid ${C.goldBorder}`,
                        animation: 'spin-slow 22s linear infinite',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: C.gold,
                            boxShadow: `0 0 12px ${C.gold}`,
                        }}
                    />
                </div>

                {/* Second slower ring */}
                <div
                    style={{
                        position: 'absolute',
                        width: '460px',
                        height: '460px',
                        borderRadius: '50%',
                        border: `1px solid rgba(61, 91, 50, 0.2)`,
                        animation: 'spin-slow 38s linear infinite reverse',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: C.olive,
                            boxShadow: `0 0 10px ${C.olive}`,
                        }}
                    />
                </div>

                {/* Main product image */}
                <div
                    style={{
                        width: '300px',
                        height: '300px',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        animation: 'float 6.5s ease-in-out infinite',
                        boxShadow: `0 30px 80px rgba(212, 175, 55, 0.18), 0 0 0 1px ${C.border}`,
                        background: `linear-gradient(135deg, ${C.surfaceSolid} 0%, ${C.altBg} 100%)`,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            key={currentProduct.image}
                            src={currentProduct.image}
                            alt={currentProduct.name}
                            className="hero-product-image"
                        />

                        <div className="hero-image-overlay" />
                    </div>
                </div>

                {/* Floating badge 1 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '14%',
                        right: '4%',
                        background: C.surfaceSolid,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${C.goldBorder}`,
                        borderRadius: '14px',
                        padding: '0.875rem 1.125rem',
                        animation: 'float 6.5s ease-in-out infinite',
                        animationDelay: '-3.2s',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.62rem',
                            color: C.goldDark,
                            letterSpacing: '0.14em',
                        }}
                    >
                        TOP PICK
                    </div>
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: C.fg,
                            marginTop: '0.2rem',
                        }}
                    >
                        Nebula Pro
                    </div>
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '1.05rem',
                            fontWeight: 900,
                            color: C.goldDark,
                        }}
                    >
                        $299
                    </div>
                </div>

                {/* Floating badge 2 */}
                <div
                    style={{
                        position: 'absolute',
                        top: '18%',
                        left: '5%',
                        background: C.surfaceSolid,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid rgba(61, 91, 50, 0.25)`,
                        borderRadius: '14px',
                        padding: '0.875rem 1.125rem',
                        animation: 'float 6.5s ease-in-out infinite',
                        animationDelay: '-1.5s',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.62rem',
                            color: C.olive,
                            letterSpacing: '0.14em',
                        }}
                    >
                        FREE SHIP
                    </div>
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: C.fg,
                            marginTop: '0.2rem',
                        }}
                    >
                        Orders $150+
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
    product,
    onAddToCart
}: {
    product: any;
    onAddToCart: () => void;
}) {
    const { tilt, transition, onMouseMove, onMouseLeave } = useTilt(13)
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        onAddToCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ perspective: '900px', cursor: 'default' }}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition,
                    transformStyle: 'preserve-3d',
                    background: C.surface,
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${C.border}`,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(61, 64, 76, 0.04)',
                }}
            >
                {/* Holographic shine layer */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        background: `radial-gradient(circle at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(212, 175, 55, 0.12) 0%, transparent 55%)`,
                        pointerEvents: 'none',
                    }}
                />

                {/* Image area */}
                <div
                    style={{
                        height: '210px',
                        background: `linear-gradient(145deg, ${C.altBg} 0%, ${C.surfaceSolid} 100%)`,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <img
                        key={product.image}
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'translateZ(10px) scale(1.03)',
                            animation: 'productImageTransition 0.8s ease-in-out',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '11px',
                            left: '11px',
                            zIndex: 3,
                            background: product.tagColor,
                            color: '#FFF8F0',
                            padding: '3px 9px',
                            borderRadius: '5px',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                        }}
                    >
                        {product.tag}
                    </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '1.25rem', position: 'relative', zIndex: 3 }}>
                    <div
                        style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.6rem',
                            color: C.fgSubtle,
                            letterSpacing: '0.14em',
                            marginBottom: '0.4rem',
                        }}
                    >
                        {product.category.toUpperCase()}
                    </div>
                    <h3
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: C.fg,
                            margin: '0 0 0.35rem',
                            lineHeight: 1.2,
                        }}
                    >
                        {product.name}
                    </h3>
                    <p
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '0.8rem',
                            color: C.fgDim,
                            margin: '0 0 1.1rem',
                            lineHeight: 1.55,
                        }}
                    >
                        {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            {product.originalPrice && (
                                <div
                                    style={{
                                        fontFamily: 'JetBrains Mono',
                                        fontSize: '0.65rem',
                                        color: C.fgSubtle,
                                        textDecoration: 'line-through',
                                        lineHeight: 1,
                                        marginBottom: '2px',
                                    }}
                                >
                                    ${product.originalPrice}
                                </div>
                            )}
                            <span
                                style={{
                                    fontFamily: 'Outfit',
                                    fontSize: '1.3rem',
                                    fontWeight: 900,
                                    color: C.fg,
                                }}
                            >
                                ${product.price.toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={handleAdd}
                            style={{
                                background: added ? C.oliveDim : C.goldDim,
                                border: `1px solid ${added ? 'rgba(61, 91, 50, 0.4)' : C.goldBorder}`,
                                color: added ? C.olive : C.goldDark,
                                padding: '0.5rem 1.1rem',
                                borderRadius: '9px',
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        >
                            {added ? '✓ Added' : '+ Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Products Section ─────────────────────────────────────────────────────────
function ProductsSection({
    products,
    onAddToCart
}: {
    products: any[];
    onAddToCart: () => void;
}) {
    const [filter, setFilter] = useState('All');

    const filters = ['All'];

    const filtered =
        filter === 'All'
            ? products
            : products.filter((p) => p.category === filter);
    return (
        <section style={{ padding: '6rem 4rem' }} className="section-pad">
            <div style={{ marginBottom: '3rem' }}>
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: C.goldDark,
                        letterSpacing: '0.22em',
                        marginBottom: '0.75rem',
                    }}
                >
                    — FEATURED PRODUCTS
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: 'clamp(1.9rem, 3.2vw, 3.1rem)',
                            fontWeight: 900,
                            color: C.fg,
                            margin: 0,
                            lineHeight: 1.08,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Engineered for
                        <br />
                        <span style={{ color: C.goldDark }}>Tomorrow</span>
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    background: filter === f ? C.goldDim : 'transparent',
                                    border: `1px solid ${filter === f ? C.goldBorder : C.border}`,
                                    color: filter === f ? C.fg : C.fgDim,
                                    padding: '0.38rem 1rem',
                                    borderRadius: '100px',
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontSize: '0.8rem',
                                    fontWeight: filter === f ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </section>
    )
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: (typeof categories)[0] }) {
    const { tilt, transition, onMouseMove, onMouseLeave } = useTilt(9)
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseMove={onMouseMove}
            onMouseLeave={(e) => {
                onMouseLeave()
                setHovered(false)
            }}
            onMouseEnter={() => setHovered(true)}
            style={{ perspective: '800px', cursor: 'pointer' }}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: `${transition}, border-color 0.3s`,
                    height: '200px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: `1px solid ${hovered ? C.goldBorder : C.border}`,
                }}
            >
                <img
                    src={category.image}
                    alt={`${category.name} product category`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: hovered ? 'scale(1.09)' : 'scale(1)',
                        transition: 'transform 0.55s ease',
                        filter: 'brightness(0.7)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: hovered
                            ? 'linear-gradient(to top, rgba(212, 175, 55, 0.3) 0%, transparent 65%)'
                            : 'linear-gradient(to top, rgba(61, 64, 76, 0.65) 0%, transparent 65%)',
                        transition: 'background 0.4s',
                    }}
                />
                <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem' }}>
                    <div
                        style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.6rem',
                            color: hovered ? C.goldDark : 'rgba(255, 248, 240, 0.8)',
                            letterSpacing: '0.14em',
                            marginBottom: '0.3rem',
                            transition: 'color 0.3s',
                        }}
                    >
                        {category.count} PRODUCTS
                    </div>
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: '#FFF8F0',
                        }}
                    >
                        {category.name}
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        fontSize: '1.4rem',
                    }}
                >
                    {category.icon}
                </div>
            </div>
        </div>
    )
}

function CategoriesSection() {
    return (
        <section
            style={{ padding: '4rem 4rem', position: 'relative', overflow: 'hidden' }}
            className="section-pad"
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse 100% 50% at 50% 110%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }}
            />
            <div style={{ marginBottom: '2.5rem' }}>
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: C.goldDark,
                        letterSpacing: '0.22em',
                        marginBottom: '0.75rem',
                    }}
                >
                    — EXPLORE CATEGORIES
                </div>
                <h2
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: 'clamp(1.9rem, 3.2vw, 3.1rem)',
                        fontWeight: 900,
                        color: C.fg,
                        margin: 0,
                        letterSpacing: '-0.03em',
                    }}
                >
                    Find Your <span style={{ color: C.goldDark }}>Universe</span>
                </h2>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                }}
            >
                {categories.map((cat) => (
                    <CategoryCard key={cat.name} category={cat} />
                ))}
            </div>
        </section>
    )
}

// ─── Spotlight ────────────────────────────────────────────────────────────────

function SpotlightSection({ onAddToCart }: { onAddToCart: () => void }) {
    const [activeSpec, setActiveSpec] = useState(0)
    const specs = [
        { label: 'Noise Cancellation', value: '98.4%' },
        { label: 'Battery Life', value: '40 hrs' },
        { label: 'Driver Size', value: '40mm' },
        { label: 'Frequency Range', value: '4–40kHz' },
    ]

    return (
        <section
            style={{
                padding: '6rem 4rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '5rem',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="spotlight-grid section-pad"
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Visual */}
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        maxWidth: '500px',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${C.surfaceSolid} 0%, ${C.altBg} 100%)`,
                        boxShadow: '0 40px 100px rgba(61, 64, 76, 0.08)',
                        border: `1px solid ${C.border}`,
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=960&h=960&fit=crop&auto=format"
                        alt="Nebula Pro Headphones close-up"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Rating badge */}
                <div
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        right: '-1rem',
                        background: C.surfaceSolid,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${C.goldBorder}`,
                        borderRadius: '14px',
                        padding: '1rem 1.2rem',
                        animation: 'float 4.5s ease-in-out infinite',
                        animationDelay: '-1.1s',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: C.goldDark,
                        }}
                    >
                        ★ 4.9
                    </div>
                    <div
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '0.7rem',
                            color: C.fgSubtle,
                        }}
                    >
                        12,847 reviews
                    </div>
                </div>
            </div>

            {/* Copy */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: C.olive,
                        letterSpacing: '0.22em',
                        marginBottom: '1rem',
                    }}
                >
                    — EDITOR'S CHOICE
                </div>
                <h2
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: 'clamp(2.2rem, 4.2vw, 4.4rem)',
                        fontWeight: 900,
                        color: C.fg,
                        margin: '0 0 1rem',
                        lineHeight: 0.98,
                        letterSpacing: '-0.035em',
                    }}
                >
                    Nebula Pro
                    <br />
                    <span style={{ fontSize: '0.55em', color: C.fgDim, fontWeight: 600 }}>
                        Headphones
                    </span>
                </h2>

                <p
                    style={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '0.97rem',
                        color: C.fgDim,
                        lineHeight: 1.72,
                        margin: '0 0 2rem',
                        maxWidth: '420px',
                    }}
                >
                    Engineered with aerospace-grade materials and our proprietary AuraSound™ chip. The Nebula Pro delivers an audio experience that transcends physical space.
                </p>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        marginBottom: '2.5rem',
                    }}
                >
                    {specs.map((spec, i) => (
                        <div
                            key={spec.label}
                            onClick={() => setActiveSpec(i)}
                            style={{
                                background: activeSpec === i ? C.goldDim : C.altBg,
                                border: `1px solid ${activeSpec === i ? C.goldBorder : C.border}`,
                                borderRadius: '11px',
                                padding: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.22s',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: '0.6rem',
                                    color: C.fgSubtle,
                                    letterSpacing: '0.08em',
                                }}
                            >
                                {spec.label}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'Outfit',
                                    fontSize: '1.1rem',
                                    fontWeight: 900,
                                    color: activeSpec === i ? C.goldDark : C.fg,
                                    marginTop: '0.25rem',
                                    transition: 'color 0.22s',
                                }}
                            >
                                {spec.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                        <div
                            style={{
                                fontFamily: 'JetBrains Mono',
                                fontSize: '0.62rem',
                                color: C.fgSubtle,
                                letterSpacing: '0.1em',
                                textDecoration: 'line-through',
                                lineHeight: 1,
                            }}
                        >
                            $399
                        </div>
                        <div
                            style={{
                                fontFamily: 'Outfit',
                                fontSize: '2.1rem',
                                fontWeight: 900,
                                color: C.fg,
                                lineHeight: 1,
                            }}
                        >
                            $299
                        </div>
                    </div>
                    <button
                        onClick={onAddToCart}
                        style={{
                            flex: 1,
                            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                            border: 'none',
                            color: '#FFF8F0',
                            padding: '1rem 2rem',
                            borderRadius: '13px',
                            fontFamily: 'Outfit',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            boxShadow: '0 0 32px rgba(212, 175, 55, 0.2)',
                        }}
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </section>
    )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
    const { tilt, transition, onMouseMove, onMouseLeave } = useTilt(7)

    return (
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: '800px' }}>
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition,
                    background: C.surface,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${C.border}`,
                    borderRadius: '18px',
                    padding: '1.75rem',
                    boxShadow: '0 10px 30px rgba(61, 64, 76, 0.04)',
                }}
            >
                <div
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: '1rem',
                        color: C.goldDark,
                        marginBottom: '1rem',
                        letterSpacing: '0.08em',
                    }}
                >
                    {'★'.repeat(t.rating)}
                </div>
                <p
                    style={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '0.9rem',
                        color: C.fgDim,
                        lineHeight: 1.72,
                        margin: '0 0 1.5rem',
                        fontStyle: 'italic',
                    }}
                >
                    "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <img
                        src={t.avatar}
                        alt={`${t.name} profile photo`}
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `2px solid ${C.goldBorder}`,
                            flexShrink: 0,
                        }}
                    />
                    <div>
                        <div
                            style={{
                                fontFamily: 'Outfit',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: C.fg,
                            }}
                        >
                            {t.name}
                        </div>
                        <div
                            style={{
                                fontFamily: 'JetBrains Mono',
                                fontSize: '0.6rem',
                                color: C.fgSubtle,
                                letterSpacing: '0.1em',
                            }}
                        >
                            {t.role.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TestimonialsSection() {
    return (
        <section style={{ padding: '5rem 4rem' }} className="section-pad">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: C.goldDark,
                        letterSpacing: '0.22em',
                        marginBottom: '0.75rem',
                    }}
                >
                    — WHAT PEOPLE SAY
                </div>
                <h2
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: 'clamp(1.9rem, 3.2vw, 3.1rem)',
                        fontWeight: 900,
                        color: C.fg,
                        margin: 0,
                        letterSpacing: '-0.03em',
                    }}
                >
                    Trusted by{' '}
                    <span style={{ color: C.goldDark }}>850K+ Customers</span>
                </h2>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {testimonials.map((t) => (
                    <TestimonialCard key={t.name} t={t} />
                ))}
            </div>
        </section>
    )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTASection() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = () => {
        if (email.includes('@')) {
            setSubmitted(true)
        }
    }

    return (
        <section
            style={{ padding: '2rem 4rem 5rem' }}
            className="section-pad cta-margin"
        >
            <div
                style={{
                    borderRadius: '28px',
                    padding: '5rem',
                    background: `
            linear-gradient(135deg,
              rgba(212, 175, 55, 0.12) 0%,
              rgba(61, 91, 50, 0.08) 50%,
              rgba(208, 197, 175, 0.15) 100%
            )
          `,
                    border: `1px solid ${C.goldBorder}`,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="cta-inner"
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.62rem',
                        color: C.goldDark,
                        letterSpacing: '0.22em',
                        marginBottom: '1.25rem',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    — EXCLUSIVE OFFER
                </div>
                <h2
                    style={{
                        fontFamily: 'Outfit',
                        fontSize: 'clamp(2.2rem, 4vw, 3.7rem)',
                        fontWeight: 900,
                        color: C.fg,
                        margin: '0 0 1rem',
                        lineHeight: 0.98,
                        letterSpacing: '-0.035em',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    Get 20% Off Your
                    <br />
                    First Order
                </h2>
                <p
                    style={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '1rem',
                        color: C.fgDim,
                        margin: '0 auto 2.5rem',
                        maxWidth: '400px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    Join 850,000+ tech enthusiasts and unlock early access to new arrivals, exclusive drops, and member-only pricing.
                </p>

                {submitted ? (
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: C.olive,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        ✓ You're in — check your inbox!
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            maxWidth: '460px',
                            margin: '0 auto',
                            position: 'relative',
                            zIndex: 1,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="enter your email"
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                background: C.surfaceSolid,
                                border: `1px solid ${C.border}`,
                                borderRadius: '11px',
                                padding: '0.9rem 1.25rem',
                                color: C.fg,
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={handleSubmit}
                            style={{
                                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                                border: 'none',
                                color: '#FFF8F0',
                                padding: '0.9rem 1.75rem',
                                borderRadius: '11px',
                                fontFamily: 'Outfit',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 0 26px rgba(212, 175, 55, 0.25)',
                            }}
                        >
                            CLAIM OFFER
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
    return (
        <footer
            style={{
                padding: '3rem 4rem',
                borderTop: `1px solid ${C.border}`,
            }}
            className="section-pad"
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}
                className="footer-grid"
            >
                <div>
                    <div
                        style={{
                            fontFamily: 'Outfit',
                            fontWeight: 900,
                            fontSize: '1.45rem',
                            letterSpacing: '-0.02em',
                            marginBottom: '1rem',
                        }}
                    >
                        <span style={{ color: C.goldDark }}>Y</span>
                        <span style={{ color: C.fg }}>UTH</span>
                        <span style={{ color: C.olive }}>i</span>
                    </div>
                    <p
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '0.85rem',
                            color: C.fgSubtle,
                            lineHeight: 1.7,
                            maxWidth: '230px',
                            margin: 0,
                        }}
                    >
                        The future of tech retail. Curated products for the generation that lives in the digital frontier.
                    </p>
                </div>

                {[
                    { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Sale', 'Gift Cards'] },
                    { title: 'Support', links: ['FAQ', 'Shipping', 'Returns', 'Contact'] },
                    { title: 'Company', links: ['About', 'Careers', 'Press', 'Partners'] },
                ].map((col) => (
                    <div key={col.title}>
                        <div
                            style={{
                                fontFamily: 'Outfit',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: C.fg,
                                marginBottom: '1rem',
                                letterSpacing: '0.04em',
                            }}
                        >
                            {col.title}
                        </div>
                        {col.links.map((link) => (
                            <a
                                key={link}
                                href="#"
                                style={{
                                    display: 'block',
                                    fontFamily: 'Plus Jakarta Sans',
                                    fontSize: '0.85rem',
                                    color: C.fgSubtle,
                                    textDecoration: 'none',
                                    marginBottom: '0.6rem',
                                }}
                                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.fgDim)}
                                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.fgSubtle)}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                ))}
            </div>

            <div
                style={{
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.6rem',
                        color: C.fgSubtle,
                        letterSpacing: '0.1em',
                    }}
                >
                    © 2026 Yuthi TECHNOLOGIES. ALL RIGHTS RESERVED.
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Privacy', 'Terms', 'Cookies'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            style={{
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: '0.75rem',
                                color: C.fgSubtle,
                                textDecoration: 'none',
                            }}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function HomeMod() {
    const [cartCount, setCartCount] = useState(0)
    const [products, setProducts] = useState(initialProducts);
    const addToCart = useCallback(() => setCartCount((n) => n + 1), [])
    const getproducts = async () => {
        try {
            const res = await axios.get(`${API_URL_PRODUCT}/getproducts`);

            if (res.status === 200) {
                console.log("Product data successfully fetched:", res.data);

                setProducts(res.data.products);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };
    useEffect(() => {
        getproducts();
    }, []);

    return (
        <div style={{ background: C.bg, minHeight: '100vh', color: C.fg }}>
            <Nav cartCount={cartCount} />
            <HeroSection products={products} />
            <ProductsSection
                products={products}
                onAddToCart={addToCart}
            />
            <CategoriesSection />
            <SpotlightSection onAddToCart={addToCart} />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    )
}