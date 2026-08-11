import './test.css'
import { useState, useCallback, useEffect, type MouseEvent } from 'react'

// ─── Kerala Palette ────────────────────────────────────────────────────────────
const K = {
    ink: '#0b0702',
    mahogany: '#1c0e05',
    teak: '#2e1808',
    rosewood: '#3d2210',
    gold: '#c0801a',
    goldBright: '#e0a018',
    saffron: '#cc5814',
    vermillion: '#a82e12',
    green: '#1a4820',
    teal: '#0c3830',
    ivory: '#f0d8a8',
    cream: '#f5e4c0',
    sand: '#d0aa6e',
    dim: 'rgba(240,216,168,0.58)',
    subtle: 'rgba(240,216,168,0.32)',
    ghost: 'rgba(240,216,168,0.14)',
    goldBorder: 'rgba(192,128,26,0.28)',
    goldGlow: 'rgba(224,160,24,0.15)',
}

// ─── Stream paths — seamlessly tiling at 1440px period (viewBox 2880×200) ──────
// Each path is a cubic-bezier approximation of a sine wave.
// Period = 1440 px → translating the 200vw container by -50% (-100vw) loops perfectly.
const STREAMS = [
    { d: 'M0,100 C266,40 454,40 720,100 C986,160 1174,160 1440,100 C1706,40 1894,40 2160,100 C2426,160 2614,160 2880,100', color: K.gold, opacity: 0.13, dur: '14s', del: '0s', sw: 1.5 },
    { d: 'M0,60  C266,10 454,10  720,60  C986,110 1174,110 1440,60  C1706,10 1894,10  2160,60  C2426,110 2614,110 2880,60', color: K.goldBright, opacity: 0.08, dur: '20s', del: '-7s', sw: 1.0 },
    { d: 'M0,140 C266,100 454,100 720,140 C986,180 1174,180 1440,140 C1706,100 1894,100 2160,140 C2426,180 2614,180 2880,140', color: K.saffron, opacity: 0.09, dur: '11s', del: '-3s', sw: 1.5 },
    { d: 'M0,80  C266,50  454,50  720,80  C986,110 1174,110 1440,80  C1706,50  1894,50  2160,80  C2426,110 2614,110 2880,80', color: K.goldBright, opacity: 0.07, dur: '24s', del: '-11s', sw: 0.8 },
    { d: 'M0,120 C266,90  454,90  720,120 C986,150 1174,150 1440,120 C1706,90  1894,90  2160,120 C2426,150 2614,150 2880,120', color: K.gold, opacity: 0.10, dur: '17s', del: '-5s', sw: 1.2 },
    { d: 'M0,50  C266,20  454,80  720,50  C986,20  1174,80  1440,50  C1706,20  1894,80  2160,50  C2426,20  2614,80  2880,50', color: K.saffron, opacity: 0.06, dur: '28s', del: '-14s', sw: 0.7 },
]

// ─── Ember data — stable, computed once ────────────────────────────────────────
const EMBERS = Array.from({ length: 32 }, (_, i) => ({
    x: (i * 37 + 11) % 100,
    size: 2 + (i % 3),
    dur: 7 + (i % 7),
    del: -(i * 0.65),
    op: 0.28 + (i % 5) * 0.09,
    col: i % 3 === 0 ? K.goldBright : i % 3 === 1 ? K.saffron : K.gold,
}))

// ─── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
    {
        id: 1, name: 'Nilavilakku Brass Lamp', price: 2850,
        tag: 'HANDCRAFTED', tagColor: K.goldBright,
        category: 'Brass & Metal',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format',
        desc: 'Five-tiered temple lamp, hand-cast in Thrissur',
        artisan: 'Gopalan Achary · Thrissur',
    },
    {
        id: 2, name: 'Kathakali Face Mask', price: 1200,
        tag: 'RARE', tagColor: K.vermillion,
        category: 'Performing Arts',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&h=600&fit=crop&auto=format',
        desc: 'Hand-painted papier-mâché with natural earth pigments',
        artisan: 'Radhakrishnan Nair · Thrippunithura',
    },
    {
        id: 3, name: 'Kerala Mural Panel', price: 4500,
        tag: 'ORIGINAL', tagColor: K.gold,
        category: 'Mural Art',
        image: 'https://images.unsplash.com/photo-1578301978069-58a7e9c8e5b9?w=600&h=600&fit=crop&auto=format',
        desc: 'Temple fresco style on handmade cotton canvas',
        artisan: 'Sreeja Varma · Guruvayur',
    },
    {
        id: 4, name: 'Kasavu Handloom Saree', price: 3200,
        tag: "WEAVER'S OWN", tagColor: K.saffron,
        category: 'Textiles',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=600&fit=crop&auto=format',
        desc: 'Pure cotton with 24-thread zari border, Balaramapuram',
        artisan: 'Thankamani Amma · Balaramapuram',
    },
    {
        id: 5, name: 'Rosewood Gajendra', price: 5600,
        tag: 'HEIRLOOM', tagColor: '#a07830',
        category: 'Wood Craft',
        image: 'https://images.unsplash.com/photo-1564571335568-f59e68afe27a?w=600&h=600&fit=crop&auto=format',
        desc: 'Master-carved Kerala elephant in aged Indian rosewood',
        artisan: 'Vishwanathan Pillai · Changanacherry',
    },
    {
        id: 6, name: 'Spice Heritage Box', price: 980,
        tag: 'EXPORT GRADE', tagColor: '#3a7a30',
        category: 'Spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop&auto=format',
        desc: 'Cardamom, pepper & cinnamon from Idukki highlands',
        artisan: 'Murugan Estates · Idukki',
    },
    {
        id: 7, name: 'Aranmula Kannadi', price: 7200,
        tag: 'GI CERTIFIED', tagColor: K.goldBright,
        category: 'Brass & Metal',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&auto=format',
        desc: 'Handmade metal alloy mirror, one of eight auspicious items',
        artisan: 'Rajan Varma · Aranmula',
    },
    {
        id: 8, name: 'Coir Weave Collection', price: 650,
        tag: 'ECO CRAFT', tagColor: '#4a7828',
        category: 'Coir & Bamboo',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format',
        desc: 'Natural coir mat from Alappuzha cooperative weavers',
        artisan: "Alappuzha Weavers' Guild",
    },
]

const CATEGORIES = [
    { name: 'Brass & Metal', count: 34, col: K.gold, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=280&fit=crop&auto=format' },
    { name: 'Mural Art', count: 28, col: K.vermillion, img: 'https://images.unsplash.com/photo-1578301978069-58a7e9c8e5b9?w=400&h=280&fit=crop&auto=format' },
    { name: 'Textiles', count: 52, col: K.saffron, img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=280&fit=crop&auto=format' },
    { name: 'Wood Craft', count: 41, col: '#a07830', img: 'https://images.unsplash.com/photo-1564571335568-f59e68afe27a?w=400&h=280&fit=crop&auto=format' },
    { name: 'Spices', count: 19, col: '#3a7a30', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=280&fit=crop&auto=format' },
    { name: 'Performing Arts', count: 23, col: K.vermillion, img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=280&fit=crop&auto=format' },
]

const REVIEWS = [
    {
        name: 'Anitha Krishnan', role: 'Textile Collector', loc: 'Thiruvananthapuram',
        text: "The Kasavu saree arrived folded in banana leaf packaging. It felt like receiving a letter from another century. Pure craftsmanship, every thread.",
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    },
    {
        name: 'Thomas Varghese', role: 'Art Curator', loc: 'Kochi',
        text: "Every piece on Kalabhavan carries a story. The mural panel is now the centrepiece of my gallery. Provenance-certified and deeply authentic.",
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    },
    {
        name: 'Lakshmi Menon', role: 'Heritage Collector', loc: 'Kozhikode',
        text: "The Aranmula Kannadi came with the artisan's three-generation lineage card. This is not shopping — it is cultural stewardship.",
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
    },
]

// ─── Hook: 3D tilt ─────────────────────────────────────────────────────────────
function useTilt(deg = 14) {
    const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50 })
    const [active, setActive] = useState(false)

    const onMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            setActive(true)
            const r = e.currentTarget.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width
            const ny = (e.clientY - r.top) / r.height
            setTilt({ x: (ny - 0.5) * -deg * 2, y: (nx - 0.5) * deg * 2, px: nx * 100, py: ny * 100 })
        },
        [deg],
    )

    const onLeave = useCallback(() => {
        setActive(false)
        setTilt({ x: 0, y: 0, px: 50, py: 50 })
    }, [])

    const tr = active
        ? 'transform 0.08s linear'
        : 'transform 0.7s cubic-bezier(0.23,1,0.32,1)'

    return { tilt, active, tr, onMove, onLeave }
}

// ─── FlowingStreams ─────────────────────────────────────────────────────────────
function FlowingStreams({ opacity = 1 }: { opacity?: number }) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity,
            }}
        >
            {STREAMS.map((s, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '200vw',
                        height: '100%',
                        animation: `kerala-stream ${s.dur} linear ${s.del} infinite`,
                    }}
                >
                    <svg
                        viewBox="0 0 2880 200"
                        preserveAspectRatio="none"
                        style={{ width: '100%', height: '100%', opacity: s.opacity }}
                    >
                        <path d={s.d} stroke={s.color} strokeWidth={s.sw} fill="none" />
                    </svg>
                </div>
            ))}
        </div>
    )
}

// ─── FloatingEmbers ─────────────────────────────────────────────────────────────
function FloatingEmbers() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', }}>
            {EMBERS.map((e, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: `${e.x}%`,
                        width: `${e.size}px`,
                        height: `${e.size}px`,
                        borderRadius: '50%',
                        background: e.col,
                        boxShadow: `0 0 ${e.size * 3}px ${e.col}`,
                        animation: `kerala-ember ${e.dur}s ease-in ${e.del}s infinite`,
                        opacity: e.op,
                    }}
                />
            ))}
        </div>
    )
}

// ─── WaveDivider ───────────────────────────────────────────────────────────────
function WaveDivider({
    from,
    to,
    alt = false,
}: {
    from: string
    to: string
    alt?: boolean
}) {
    // The wave fills from the bottom up in `to` colour against a `from` background.
    const pathA =
        'M0,30 C240,5 480,55 720,30 C960,5 1200,55 1440,30 L1440,60 L0,60 Z'
    const pathB =
        'M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z'
    return (
        <div
            style={{ background: from, height: '60px', overflow: 'hidden', marginBottom: '-1px' }}
        >
            <svg
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', display: 'block' }}
            >
                <path d={alt ? pathB : pathA} fill={to} />
            </svg>
        </div>
    )
}

// ─── KeralaMotif — decorative dotted rule ──────────────────────────────────────
function KeralaMotif({
    w = 200,
    color = K.gold,
    opacity = 0.4,
}: {
    w?: number
    color?: string
    opacity?: number
}) {
    const dots = [25, 55, 85, 115, 145, 175]
    return (
        <svg width={w} height="20" viewBox="0 0 200 20" style={{ opacity }}>
            <line x1="0" y1="10" x2="200" y2="10" stroke={color} strokeWidth="0.6" />
            {dots.map((cx) => (
                <circle key={cx} cx={cx} cy="10" r="2.8" fill={color} />
            ))}
        </svg>
    )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ cartCount }: { cartCount: number }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                height: '70px',
                padding: '0 2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: scrolled ? 'rgba(28,14,5,0.93)' : 'transparent',
                backdropFilter: scrolled ? 'blur(22px)' : 'none',
                borderBottom: scrolled ? `1px solid ${K.goldBorder}` : 'none',
                transition: 'all 0.4s ease',
            }}
        >
            {/* Logo */}
            <div>
                <div
                    style={{
                        fontFamily: 'Philosopher, serif',
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        color: K.ivory,
                        letterSpacing: '0.1em',
                        lineHeight: 1,
                    }}
                >
                    KALABHAVAN
                </div>
                <div
                    style={{
                        fontFamily: 'Hind, sans-serif',
                        fontSize: '0.6rem',
                        color: K.gold,
                        letterSpacing: '0.26em',
                        lineHeight: 1,
                        marginTop: '2px',
                    }}
                >
                    കലാഭവൻ · ARTS OF KERALA
                </div>
            </div>

            {/* Links */}
            <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
                {['Collections', 'Artisans', 'Heritage', 'About'].map((l) => (
                    <a
                        key={l}
                        href="#"
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: K.dim,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = K.ivory)}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = K.dim)}
                    >
                        {l}
                    </a>
                ))}
            </div>

            {/* Basket */}
            <button
                style={{
                    position: 'relative',
                    background: 'rgba(192,128,26,0.14)',
                    border: `1px solid ${K.goldBorder}`,
                    borderRadius: '7px',
                    color: K.ivory,
                    padding: '0.5rem 1.1rem',
                    fontFamily: 'Hind, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                }}
            >
                🪔 Basket
                {cartCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-7px',
                            right: '-7px',
                            background: K.vermillion,
                            color: K.ivory,
                            borderRadius: '50%',
                            width: '17px',
                            height: '17px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                        }}
                    >
                        {cartCount}
                    </span>
                )}
            </button>
        </nav>
    )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
    return (
        <section
            style={{
                minHeight: '100vh',
                background: K.ink,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '70px',
            }}
        >
            <FlowingStreams />
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', transform: 'scale(-1) ' }}> <FloatingEmbers /></div>


            {/* Atmospheric radials */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `
            radial-gradient(ellipse 65% 55% at 68% 50%, rgba(192,128,26,0.11) 0%, transparent 65%),
            radial-gradient(ellipse 35% 35% at 28% 65%, rgba(204,88,20,0.08) 0%, transparent 55%)
          `,
                }}
            />

            {/* Content */}
            <div
                className="hero-grid section-pad"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    padding: '4rem',
                    width: '100%',
                    maxWidth: '1340px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '2rem',
                        }}
                    >
                        <span
                            style={{
                                width: '30px',
                                height: '1px',
                                background: K.gold,
                                display: 'inline-block',
                                flexShrink: 0,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '0.62rem',
                                color: K.gold,
                                letterSpacing: '0.24em',
                            }}
                        >
                            KERALA · AUTHENTIC ARTS & CRAFTS
                        </span>
                    </div>

                    <h1
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: 'clamp(2.8rem, 5.5vw, 5.6rem)',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: '0 0 0.5rem',
                            lineHeight: 1.0,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Where Every
                        <br />
                        <span style={{ color: K.gold }}>Craft Tells</span>
                        <br />a Story
                    </h1>

                    <div style={{ margin: '1.25rem 0' }}>
                        <KeralaMotif />
                    </div>

                    <p
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '1rem',
                            color: K.dim,
                            lineHeight: 1.78,
                            maxWidth: '390px',
                            margin: '0 0 2.5rem',
                        }}
                    >
                        Curated heirlooms from the hands of Kerala's master artisans — brass
                        temple lamps, Kathakali masks, handwoven Kasavu, rosewood carvings,
                        and Idukki spices.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            style={{
                                background: `linear-gradient(135deg, ${K.gold}, ${K.saffron})`,
                                border: 'none',
                                color: K.ink,
                                padding: '1rem 2.2rem',
                                borderRadius: '5px',
                                fontFamily: 'Philosopher, serif',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.05em',
                                boxShadow: `0 0 32px rgba(192,128,26,0.42)`,
                            }}
                        >
                            Explore Collection →
                        </button>
                        <button
                            style={{
                                background: 'transparent',
                                border: `1px solid ${K.goldBorder}`,
                                color: K.ivory,
                                padding: '1rem 2.2rem',
                                borderRadius: '5px',
                                fontFamily: 'Philosopher, serif',
                                fontSize: '1rem',
                                fontWeight: 400,
                                cursor: 'pointer',
                            }}
                        >
                            Meet the Artisans
                        </button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '3rem', marginTop: '3.5rem' }}>
                        {[
                            { n: '240+', l: 'Artisans' },
                            { n: '1,800', l: 'Pieces' },
                            { n: 'GI', l: 'Certified' },
                        ].map((s) => (
                            <div key={s.l}>
                                <div
                                    style={{
                                        fontFamily: 'Philosopher, serif',
                                        fontSize: '1.6rem',
                                        fontWeight: 700,
                                        color: K.ivory,
                                        lineHeight: 1,
                                    }}
                                >
                                    {s.n}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'Hind, sans-serif',
                                        fontSize: '0.72rem',
                                        color: K.subtle,
                                        marginTop: '0.3rem',
                                    }}
                                >
                                    {s.l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — floating visual */}
                <div
                    className="hero-visual"
                    style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Pulsing aura */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '380px',
                            height: '380px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(192,128,26,0.18) 0%, transparent 65%)`,
                            animation: 'kerala-pulse 4s ease-in-out infinite',
                        }}
                    />

                    {/* Orbit ring */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '370px',
                            height: '370px',
                            borderRadius: '50%',
                            border: `1px solid rgba(192,128,26,0.18)`,
                            animation: 'kerala-spin 32s linear infinite',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-4px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: K.goldBright,
                                boxShadow: `0 0 12px ${K.goldBright}`,
                            }}
                        />
                    </div>

                    {/* Main image */}
                    <div
                        style={{
                            width: '290px',
                            height: '370px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            animation: 'kerala-float 7s ease-in-out infinite',
                            boxShadow: `0 40px 90px rgba(11,7,2,0.75), 0 0 0 1px ${K.goldBorder}`,
                            background: K.teak,
                            position: 'relative',
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=580&h=740&fit=crop&auto=format"
                            alt="Kerala backwaters at golden dusk — misty palm-lined canals"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'sepia(0.2) saturate(1.3) brightness(0.82)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(11,7,2,0.65) 0%, transparent 55%)',
                            }}
                        />
                        {/* Caption inside image */}
                        <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem' }}>
                            <div
                                style={{
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '0.58rem',
                                    color: K.gold,
                                    letterSpacing: '0.14em',
                                }}
                            >
                                GOD'S OWN COUNTRY
                            </div>
                            <div
                                style={{
                                    fontFamily: 'Philosopher, serif',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    color: K.ivory,
                                    marginTop: '0.15rem',
                                }}
                            >
                                Kerala Backwaters
                            </div>
                        </div>
                    </div>

                    {/* Floating badge — today's pick */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '65px',
                            right: '-8px',
                            background: 'rgba(28,14,5,0.94)',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid rgba(192,128,26,0.32)`,
                            borderRadius: '10px',
                            padding: '1rem 1.25rem',
                            animation: 'kerala-float 7s ease-in-out infinite',
                            animationDelay: '-3.5s',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '0.58rem',
                                color: K.gold,
                                letterSpacing: '0.14em',
                            }}
                        >
                            TODAY'S PICK
                        </div>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: K.ivory,
                                marginTop: '0.25rem',
                            }}
                        >
                            Nilavilakku
                        </div>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: K.goldBright,
                            }}
                        >
                            ₹2,850
                        </div>
                    </div>

                    {/* Floating badge — craft */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '18%',
                            left: '-8px',
                            background: 'rgba(28,14,5,0.94)',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid rgba(168,46,18,0.32)`,
                            borderRadius: '10px',
                            padding: '0.875rem 1.1rem',
                            animation: 'kerala-float 7s ease-in-out infinite',
                            animationDelay: '-1.5s',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '0.58rem',
                                color: K.saffron,
                                letterSpacing: '0.14em',
                            }}
                        >
                            LIVE ARTISANS
                        </div>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: K.ivory,
                                marginTop: '0.25rem',
                            }}
                        >
                            240+ Makers
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom fade into next section */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: `linear-gradient(to top, ${K.mahogany}, transparent)`,
                    pointerEvents: 'none',
                }}
            />
        </section >
    )
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
    product,
    onAdd,
}: {
    product: (typeof PRODUCTS)[0]
    onAdd: () => void
}) {
    const { tilt, tr, onMove, onLeave } = useTilt(13)
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        onAdd()
        setAdded(true)
        setTimeout(() => setAdded(false), 2200)
    }

    return (
        <div
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ perspective: '900px', cursor: 'default' }}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: tr,
                    transformStyle: 'preserve-3d',
                    background: K.rosewood,
                    border: `1px solid ${K.goldBorder}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Golden shimmer overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(192,128,26,0.14) 0%, transparent 55%)`,
                        pointerEvents: 'none',
                    }}
                />

                {/* Image */}
                <div
                    style={{
                        height: '215px',
                        background: K.mahogany,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'sepia(0.12) saturate(1.15)',
                            transform: `translateZ(8px) scale(1.04)`,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            zIndex: 3,
                            background: product.tagColor,
                            color: K.ink,
                            padding: '3px 9px',
                            borderRadius: '3px',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.57rem',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                        }}
                    >
                        {product.tag}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '55px',
                            background: `linear-gradient(to top, ${K.rosewood}, transparent)`,
                        }}
                    />
                </div>

                {/* Body */}
                <div style={{ padding: '1.2rem', position: 'relative', zIndex: 3 }}>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.57rem',
                            color: K.subtle,
                            letterSpacing: '0.15em',
                            marginBottom: '0.35rem',
                        }}
                    >
                        {product.category.toUpperCase()}
                    </div>
                    <h3
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: '0 0 0.35rem',
                            lineHeight: 1.18,
                        }}
                    >
                        {product.name}
                    </h3>
                    <p
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.8rem',
                            color: K.dim,
                            margin: '0 0 0.55rem',
                            lineHeight: 1.55,
                        }}
                    >
                        {product.desc}
                    </p>
                    <div
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.7rem',
                            color: K.gold,
                            marginBottom: '1rem',
                            fontStyle: 'italic',
                        }}
                    >
                        ✦ {product.artisan}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: K.goldBright,
                            }}
                        >
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button
                            onClick={handleAdd}
                            style={{
                                background: added ? 'rgba(30,72,32,0.4)' : 'rgba(192,128,26,0.14)',
                                border: `1px solid ${added ? 'rgba(30,72,32,0.65)' : K.goldBorder}`,
                                color: added ? '#5aaa60' : K.gold,
                                padding: '0.48rem 1rem',
                                borderRadius: '5px',
                                fontFamily: 'Hind, sans-serif',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        >
                            {added ? '✓ Added' : '+ Basket'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Products Section ──────────────────────────────────────────────────────────
function ProductsSection({ onAdd }: { onAdd: () => void }) {
    const [filter, setFilter] = useState('All')
    const cats = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))]
    const list = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)

    return (
        <section
            style={{
                background: K.mahogany,
                padding: '5rem 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="section-pad"
        >
            <FlowingStreams opacity={0.65} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.62rem',
                            color: K.gold,
                            letterSpacing: '0.24em',
                            marginBottom: '0.75rem',
                        }}
                    >
                        — THE COLLECTION
                    </div>
                    <h2
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: '0 0 0.5rem',
                            lineHeight: 1.06,
                        }}
                    >
                        Timeless Works of
                        <br />
                        <span style={{ color: K.gold }}>Kerala Craftsmanship</span>
                    </h2>
                    <div
                        style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0 1.75rem' }}
                    >
                        <KeralaMotif />
                    </div>

                    {/* Filters */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {cats.map((c) => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                style={{
                                    background:
                                        filter === c ? 'rgba(192,128,26,0.22)' : 'transparent',
                                    border: `1px solid ${filter === c ? 'rgba(192,128,26,0.58)' : K.goldBorder}`,
                                    color: filter === c ? K.ivory : K.subtle,
                                    padding: '0.38rem 1rem',
                                    borderRadius: '100px',
                                    fontFamily: 'Hind, sans-serif',
                                    fontSize: '0.8rem',
                                    fontWeight: filter === c ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {list.map((p) => (
                        <ProductCard key={p.id} product={p} onAdd={onAdd} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Categories Section ────────────────────────────────────────────────────────
function CatCard({ cat }: { cat: (typeof CATEGORIES)[0] }) {
    const { tilt, tr, onMove, onLeave } = useTilt(9)
    const [hov, setHov] = useState(false)

    return (
        <div
            onMouseMove={onMove}
            onMouseLeave={(e) => {
                onLeave(e)
                setHov(false)
            }}
            onMouseEnter={() => setHov(true)}
            style={{ perspective: '800px', cursor: 'pointer' }}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: `${tr}, border-color 0.3s`,
                    height: '185px',
                    borderRadius: '9px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: `1px solid ${hov ? cat.col + '55' : K.goldBorder}`,
                }}
            >
                <img
                    src={cat.img}
                    alt={`${cat.name} craft category`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: `sepia(0.18) saturate(1.1) brightness(${hov ? 0.68 : 0.52})`,
                        transform: hov ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.55s ease',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: hov
                            ? `linear-gradient(to top, ${cat.col}48 0%, transparent 62%)`
                            : `linear-gradient(to top, rgba(11,7,2,0.8) 0%, transparent 60%)`,
                        transition: 'background 0.4s',
                    }}
                />
                <div style={{ position: 'absolute', bottom: '1.1rem', left: '1.1rem' }}>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.57rem',
                            color: hov ? cat.col : K.subtle,
                            letterSpacing: '0.14em',
                            marginBottom: '0.25rem',
                            transition: 'color 0.3s',
                        }}
                    >
                        {cat.count} PIECES
                    </div>
                    <div
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: K.ivory,
                        }}
                    >
                        {cat.name}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CategoriesSection() {
    return (
        <section
            style={{
                background: K.teak,
                padding: '5rem 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="section-pad"
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 50% at 50% 110%, rgba(12,56,48,0.45) 0%, transparent 62%)`,
                    pointerEvents: 'none',
                }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.62rem',
                            color: '#4a9a50',
                            letterSpacing: '0.24em',
                            marginBottom: '0.75rem',
                        }}
                    >
                        — HERITAGE FORMS
                    </div>
                    <h2
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: 0,
                            lineHeight: 1.06,
                        }}
                    >
                        Arts Born of{' '}
                        <span style={{ color: '#5ab060' }}>This Sacred Land</span>
                    </h2>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                    }}
                >
                    {CATEGORIES.map((c) => (
                        <CatCard key={c.name} cat={c} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Artisan Spotlight ─────────────────────────────────────────────────────────
function ArtisanSpotlight({ onAdd }: { onAdd: () => void }) {
    const [qty, setQty] = useState(1)
    const [activeSpec, setActiveSpec] = useState(0)
    const specs = [
        { k: 'Material', v: 'Panchaloha alloy' },
        { k: 'Origin', v: 'Thrissur, Kerala' },
        { k: 'Technique', v: 'Lost-wax casting' },
        { k: 'Lineage', v: '3rd generation' },
    ]

    return (
        <section
            style={{
                background: K.ink,
                padding: '6rem 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="section-pad"
        >
            <FlowingStreams opacity={0.85} />
            <FloatingEmbers />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 65% 50% at 30% 50%, rgba(192,128,26,0.08) 0%, transparent 60%)`,
                    pointerEvents: 'none',
                }}
            />

            <div
                className="spot-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '5rem',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                {/* Left — product visual */}
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            width: '100%',
                            aspectRatio: '4/5',
                            maxWidth: '460px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: `0 45px 100px rgba(11,7,2,0.72)`,
                            border: `1px solid ${K.goldBorder}`,
                            background: K.teak,
                            position: 'relative',
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=920&h=1150&fit=crop&auto=format"
                            alt="Nilavilakku brass temple lamp — close detail of hand-cast finish"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'sepia(0.18) saturate(1.25) brightness(0.88)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(11,7,2,0.55) 0%, transparent 50%)',
                            }}
                        />
                    </div>

                    {/* Artisan badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '2.5rem',
                            right: '-1.5rem',
                            background: 'rgba(28,14,5,0.95)',
                            backdropFilter: 'blur(22px)',
                            border: `1px solid ${K.goldBorder}`,
                            borderRadius: '10px',
                            padding: '1rem 1.25rem',
                            animation: 'kerala-float 5.5s ease-in-out infinite',
                            animationDelay: '-2s',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '0.57rem',
                                color: K.gold,
                                letterSpacing: '0.14em',
                            }}
                        >
                            MASTER ARTISAN
                        </div>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: K.ivory,
                                marginTop: '0.3rem',
                            }}
                        >
                            Gopalan Achary
                        </div>
                        <div
                            style={{
                                fontFamily: 'Hind, sans-serif',
                                fontSize: '0.7rem',
                                color: K.dim,
                            }}
                        >
                            3rd generation · Thrissur
                        </div>
                    </div>
                </div>

                {/* Right — copy */}
                <div>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.62rem',
                            color: K.vermillion + 'cc',
                            letterSpacing: '0.24em',
                            marginBottom: '1rem',
                        }}
                    >
                        — ARTISAN SPOTLIGHT
                    </div>
                    <h2
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: 'clamp(2.2rem, 4.2vw, 4.2rem)',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: '0 0 0.5rem',
                            lineHeight: 1.0,
                        }}
                    >
                        Nilavilakku
                        <br />
                        <span
                            style={{ fontSize: '0.52em', color: K.dim, fontWeight: 400 }}
                        >
                            Brass Temple Lamp
                        </span>
                    </h2>
                    <div style={{ margin: '1rem 0' }}>
                        <KeralaMotif w={160} />
                    </div>

                    <p
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.97rem',
                            color: K.dim,
                            lineHeight: 1.78,
                            margin: '0 0 2rem',
                            maxWidth: '430px',
                        }}
                    >
                        The Nilavilakku — literally "standing lamp" — is Kerala's most
                        sacred domestic object. Gopalan Achary's family has cast these in
                        the five-tiered form for three generations, using the same alloy
                        proportions inscribed in ancient temple workshop manuscripts.
                    </p>

                    {/* Spec grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.75rem',
                            marginBottom: '2.5rem',
                        }}
                    >
                        {specs.map((s, i) => (
                            <div
                                key={s.k}
                                onClick={() => setActiveSpec(i)}
                                style={{
                                    background:
                                        activeSpec === i
                                            ? 'rgba(192,128,26,0.14)'
                                            : 'rgba(46,24,8,0.5)',
                                    border: `1px solid ${activeSpec === i ? 'rgba(192,128,26,0.52)' : K.goldBorder}`,
                                    borderRadius: '8px',
                                    padding: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.22s',
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: 'DM Mono, monospace',
                                        fontSize: '0.57rem',
                                        color: K.subtle,
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    {s.k.toUpperCase()}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'Philosopher, serif',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        color: activeSpec === i ? K.gold : K.ivory,
                                        marginTop: '0.25rem',
                                        transition: 'color 0.22s',
                                    }}
                                >
                                    {s.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price + CTA */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '0.6rem',
                                    color: K.subtle,
                                    letterSpacing: '0.1em',
                                }}
                            >
                                PRICE
                            </div>
                            <div
                                style={{
                                    fontFamily: 'Philosopher, serif',
                                    fontSize: '2.2rem',
                                    fontWeight: 700,
                                    color: K.goldBright,
                                    lineHeight: 1,
                                }}
                            >
                                ₹2,850
                            </div>
                        </div>

                        {/* Qty */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: `1px solid ${K.goldBorder}`,
                                borderRadius: '6px',
                                overflow: 'hidden',
                            }}
                        >
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: K.ivory,
                                    padding: '0 0.875rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Philosopher, serif',
                                    fontSize: '1.1rem',
                                    height: '42px',
                                }}
                            >
                                −
                            </button>
                            <span
                                style={{
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '0.85rem',
                                    color: K.ivory,
                                    padding: '0 0.5rem',
                                    minWidth: '2ch',
                                    textAlign: 'center',
                                }}
                            >
                                {qty}
                            </span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: K.ivory,
                                    padding: '0 0.875rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Philosopher, serif',
                                    fontSize: '1.1rem',
                                    height: '42px',
                                }}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={onAdd}
                            style={{
                                background: `linear-gradient(135deg, ${K.gold}, ${K.saffron})`,
                                border: 'none',
                                color: K.ink,
                                padding: '0.9rem 2rem',
                                borderRadius: '6px',
                                fontFamily: 'Philosopher, serif',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.05em',
                                boxShadow: `0 0 30px rgba(192,128,26,0.38)`,
                            }}
                        >
                            Add to Basket
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Reviews ───────────────────────────────────────────────────────────────────
function ReviewCard({ r }: { r: (typeof REVIEWS)[0] }) {
    const { tilt, tr, onMove, onLeave } = useTilt(7)
    return (
        <div onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: '800px' }}>
            <div
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: tr,
                    background: K.rosewood,
                    border: `1px solid ${K.goldBorder}`,
                    borderRadius: '10px',
                    padding: '1.75rem',
                }}
            >
                <div
                    style={{
                        fontFamily: 'Philosopher, serif',
                        fontSize: '1rem',
                        color: K.goldBright,
                        marginBottom: '1rem',
                        letterSpacing: '0.1em',
                    }}
                >
                    ✦✦✦✦✦
                </div>
                <p
                    style={{
                        fontFamily: 'Hind, sans-serif',
                        fontSize: '0.9rem',
                        color: K.dim,
                        lineHeight: 1.78,
                        margin: '0 0 1.5rem',
                        fontStyle: 'italic',
                    }}
                >
                    "{r.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <img
                        src={r.img}
                        alt={`${r.name} reviewer`}
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `2px solid ${K.goldBorder}`,
                            flexShrink: 0,
                        }}
                    />
                    <div>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: K.ivory,
                            }}
                        >
                            {r.name}
                        </div>
                        <div
                            style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '0.57rem',
                                color: K.subtle,
                                letterSpacing: '0.1em',
                            }}
                        >
                            {r.role.toUpperCase()} · {r.loc.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ReviewsSection() {
    return (
        <section
            style={{
                background: K.mahogany,
                padding: '5rem 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="section-pad"
        >
            <FlowingStreams opacity={0.5} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div
                        style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '0.62rem',
                            color: K.gold,
                            letterSpacing: '0.24em',
                            marginBottom: '0.75rem',
                        }}
                    >
                        — VOICES OF TRUST
                    </div>
                    <h2
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                            fontWeight: 700,
                            color: K.ivory,
                            margin: 0,
                        }}
                    >
                        Stories from Our <span style={{ color: K.gold }}>Patrons</span>
                    </h2>
                    <div
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}
                    >
                        <KeralaMotif />
                    </div>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {REVIEWS.map((r) => (
                        <ReviewCard key={r.name} r={r} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
    const [email, setEmail] = useState('')
    const [done, setDone] = useState(false)
    const submit = () => email.includes('@') && setDone(true)

    return (
        <section
            style={{
                background: K.teak,
                padding: '6rem 4rem',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="section-pad"
        >
            <FloatingEmbers />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(192,128,26,0.1) 0%, transparent 65%)`,
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    maxWidth: '680px',
                    margin: '0 auto',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Lamp icon */}
                <div
                    style={{
                        fontSize: '2.8rem',
                        marginBottom: '1.75rem',
                        animation: 'kerala-float 5.5s ease-in-out infinite',
                        display: 'inline-block',
                    }}
                >
                    🪔
                </div>

                <div
                    style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '0.62rem',
                        color: K.gold,
                        letterSpacing: '0.24em',
                        marginBottom: '1rem',
                    }}
                >
                    — JOIN THE TRADITION
                </div>
                <h2
                    style={{
                        fontFamily: 'Philosopher, serif',
                        fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                        fontWeight: 700,
                        color: K.ivory,
                        margin: '0 0 0.75rem',
                        lineHeight: 1.04,
                    }}
                >
                    Be First to See
                    <br />
                    <span style={{ color: K.gold }}>New Arrivals</span>
                </h2>
                <div
                    style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0 1.5rem' }}
                >
                    <KeralaMotif />
                </div>
                <p
                    style={{
                        fontFamily: 'Hind, sans-serif',
                        fontSize: '1rem',
                        color: K.dim,
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.75,
                        maxWidth: '420px',
                    }}
                >
                    Join 12,000+ collectors receiving updates on new artisan works,
                    limited editions, and festival exclusives from across Kerala.
                </p>

                {done ? (
                    <div
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: K.gold,
                        }}
                    >
                        ✦ Wonderful — welcome to the Kalabhavan family.
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            maxWidth: '440px',
                            margin: '0 auto',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submit()}
                            placeholder="your@email.com"
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                background: 'rgba(11,7,2,0.65)',
                                border: `1px solid ${K.goldBorder}`,
                                borderRadius: '6px',
                                padding: '0.9rem 1.25rem',
                                color: K.ivory,
                                fontFamily: 'Hind, sans-serif',
                                fontSize: '0.9rem',
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={submit}
                            style={{
                                background: `linear-gradient(135deg, ${K.gold}, ${K.saffron})`,
                                border: 'none',
                                color: K.ink,
                                padding: '0.9rem 1.75rem',
                                borderRadius: '6px',
                                fontFamily: 'Philosopher, serif',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                letterSpacing: '0.05em',
                                whiteSpace: 'nowrap',
                                boxShadow: `0 0 28px rgba(192,128,26,0.42)`,
                            }}
                        >
                            Join ✦
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer
            style={{
                background: K.ink,
                padding: '4rem',
                borderTop: `1px solid ${K.goldBorder}`,
            }}
            className="section-pad"
        >
            <div
                className="footer-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}
            >
                <div>
                    <div
                        style={{
                            fontFamily: 'Philosopher, serif',
                            fontWeight: 700,
                            fontSize: '1.35rem',
                            color: K.ivory,
                            letterSpacing: '0.1em',
                            marginBottom: '2px',
                        }}
                    >
                        KALABHAVAN
                    </div>
                    <div
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.6rem',
                            color: K.gold,
                            letterSpacing: '0.22em',
                            marginBottom: '1.1rem',
                        }}
                    >
                        കലാഭവൻ · ARTS OF KERALA
                    </div>
                    <p
                        style={{
                            fontFamily: 'Hind, sans-serif',
                            fontSize: '0.85rem',
                            color: K.subtle,
                            lineHeight: 1.72,
                            maxWidth: '220px',
                            margin: '0 0 1.25rem',
                        }}
                    >
                        Preserving Kerala's living heritage by connecting master artisans
                        with discerning collectors worldwide.
                    </p>
                    <KeralaMotif w={160} />
                </div>

                {[
                    {
                        title: 'Discover',
                        links: ['New Arrivals', 'Best Sellers', 'Artisan Stories', 'GI Certified'],
                    },
                    { title: 'Support', links: ['How to Order', 'Shipping', 'Returns', 'Authenticity'] },
                    { title: 'Community', links: ['About Us', 'Artisan Network', 'Blog', 'Exhibitions'] },
                ].map((col) => (
                    <div key={col.title}>
                        <div
                            style={{
                                fontFamily: 'Philosopher, serif',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: K.ivory,
                                marginBottom: '1.1rem',
                                letterSpacing: '0.06em',
                            }}
                        >
                            {col.title}
                        </div>
                        {col.links.map((l) => (
                            <a
                                key={l}
                                href="#"
                                style={{
                                    display: 'block',
                                    fontFamily: 'Hind, sans-serif',
                                    fontSize: '0.85rem',
                                    color: K.subtle,
                                    textDecoration: 'none',
                                    marginBottom: '0.55rem',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = K.dim)}
                                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = K.subtle)}
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                ))}
            </div>

            <div
                style={{
                    borderTop: 'rgba(240,216,168,0.07) 1px solid',
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
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '0.58rem',
                        color: 'rgba(240,216,168,0.22)',
                        letterSpacing: '0.1em',
                    }}
                >
                    © 2026 KALABHAVAN · ARTS OF KERALA. ALL RIGHTS RESERVED.
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Privacy', 'Terms', 'GI Policy'].map((l) => (
                        <a
                            key={l}
                            href="#"
                            style={{
                                fontFamily: 'Hind, sans-serif',
                                fontSize: '0.75rem',
                                color: 'rgba(240,216,168,0.28)',
                                textDecoration: 'none',
                            }}
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
    const [cart, setCart] = useState(0)
    const addToCart = useCallback(() => setCart((n) => n + 1), [])

    return (
        <div style={{ background: K.ink, minHeight: '100vh', color: K.ivory }}>
            <Nav cartCount={cart} />

            <HeroSection />

            <WaveDivider from={K.ink} to={K.mahogany} />
            <ProductsSection onAdd={addToCart} />

            <WaveDivider from={K.mahogany} to={K.teak} alt />
            <CategoriesSection />

            <WaveDivider from={K.teak} to={K.ink} />
            <ArtisanSpotlight onAdd={addToCart} />

            <WaveDivider from={K.ink} to={K.mahogany} alt />
            <ReviewsSection />

            <WaveDivider from={K.mahogany} to={K.teak} />
            <CTASection />

            <WaveDivider from={K.teak} to={K.ink} alt />
            <Footer />
        </div>
    )
}
