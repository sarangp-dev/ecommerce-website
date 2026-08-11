import '../App.css';
export default function Home() {
    return (
        <div>
            <section className="hero" id="hero">
                {/* <div className="hero-bg" id="hero-bg"></div>

                <div className="hero-content" id="hero-content">
                    <h1 className="hero-title">യുതി</h1>
                    <p className="hero-subtitle">YUTHI</p>
                </div>

                <div className="leaf leaf-left" id="leaf-left"></div>
                <div className="leaf leaf-right" id="leaf-right"></div>
            */}
                <div style={{ background: 'red' }}>hi</div></section>


            <section className="content-section">
                <div className="container">
                    <h2>Latest Arrivals</h2>
                    <div className="product-grid">
                        <div className="product-card">
                            <div className="product-img placeholder-1"></div>
                            <h3>Tropical T-Shirt</h3>
                            <p>$35.00</p>
                        </div>
                        <div className="product-card">
                            <div className="product-img placeholder-2"></div>
                            <h3>Khaki Shorts</h3>
                            <p>$45.00</p>
                        </div>
                        <div className="product-card">
                            <div className="product-img placeholder-3"></div>
                            <h3>Jungle Footwear</h3>
                            <p>$89.00</p>
                        </div>
                        <div className="product-card">
                            <div className="product-img placeholder-1"></div>
                            <h3>Essential Tee</h3>
                            <p>$29.00</p>
                        </div>
                    </div>
                </div>

                <div className="container mt-2">
                    <h2>Featured Collection</h2>
                    <p className="collection-desc">Immerse yourself in nature with our new sustainable line.</p>
                    <div className="product-grid">

                        <div className="product-card">
                            <div className="product-img placeholder-2"></div>
                            <h3>Cargo Pants</h3>
                            <p>$65.00</p>
                        </div>
                        <div className="product-card">
                            <div className="product-img placeholder-3"></div>
                            <h3>Hiking Boots</h3>
                            <p>$120.00</p>
                        </div>
                    </div>
                </div>
            </section>

            <script type="module" src="/main.js"></script>
        </div>
    )
}