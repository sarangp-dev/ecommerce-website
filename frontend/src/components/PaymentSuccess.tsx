import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './home-mod.css'

const API_URL_PRODUCT = import.meta.env.VITE_API_URL_PRODUCT

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

export default function PaymentSuccess() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const sessionId = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('Verifying your payment...')

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setLoading(false)
                setSuccess(false)
                setMessage('Payment session was not found.')
                return
            }

            try {
                /*
                 * IMPORTANT:
                 * Change this endpoint to the payment verification
                 * endpoint you have in your backend.
                 */
                const response = await axios.post(
                    `${API_URL_PRODUCT}/payment-success`,
                    {
                        sessionId,
                    }
                )

                console.log('Payment verification:', response.data)

                if (response.data.success) {
                    setSuccess(true)
                    setMessage('Your payment was completed successfully.')
                } else {
                    setSuccess(false)
                    setMessage(
                        response.data.message ||
                        'We could not verify your payment.'
                    )
                }
            } catch (error) {
                console.error('Payment verification error:', error)

                setSuccess(false)
                setMessage(
                    'We could not verify your payment. Please contact support if money was deducted.'
                )
            } finally {
                setLoading(false)
            }
        }

        verifyPayment()
    }, [sessionId])

    return (
        <div
            style={{
                minHeight: '100vh',
                background: C.bg,
                color: C.fg,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Background atmosphere */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `
                        radial-gradient(
                            ellipse 60% 50% at 50% 40%,
                            rgba(212, 175, 55, 0.13) 0%,
                            transparent 70%
                        ),
                        radial-gradient(
                            ellipse 50% 40% at 20% 90%,
                            rgba(61, 91, 50, 0.08) 0%,
                            transparent 65%
                        )
                    `,
                }}
            />

            {/* Grid */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundImage: `
                        linear-gradient(
                            rgba(208, 197, 175, 0.2) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(208, 197, 175, 0.2) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Navbar */}
            <nav
                style={{
                    height: '68px',
                    padding: '0 2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${C.border}`,
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(24px)',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        fontFamily: 'Outfit',
                        fontWeight: 900,
                        fontSize: '1.45rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    <span style={{ color: C.goldDark }}>Y</span>
                    <span style={{ color: C.fg }}>UTH</span>
                    <span style={{ color: C.olive }}>i</span>
                </div>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: `1px solid ${C.border}`,
                        color: C.fgDim,
                        padding: '0.55rem 1rem',
                        borderRadius: '9px',
                        fontFamily: 'Plus Jakarta Sans',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                    }}
                >
                    ← Continue Shopping
                </button>
            </nav>

            {/* Main */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 1.5rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '620px',
                        background: C.surface,
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${success
                                ? 'rgba(61, 91, 50, 0.3)'
                                : C.goldBorder
                            }`,
                        borderRadius: '28px',
                        padding: '3.5rem 3rem',
                        textAlign: 'center',
                        boxShadow:
                            '0 30px 80px rgba(61, 64, 76, 0.08)',
                    }}
                >
                    {/* Status icon */}
                    <div
                        style={{
                            width: '90px',
                            height: '90px',
                            margin: '0 auto 1.75rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            background: loading
                                ? C.goldDim
                                : success
                                    ? C.oliveDim
                                    : 'rgba(180, 70, 50, 0.1)',
                            border: `1px solid ${loading
                                    ? C.goldBorder
                                    : success
                                        ? 'rgba(61, 91, 50, 0.35)'
                                        : 'rgba(180, 70, 50, 0.3)'
                                }`,
                        }}
                    >
                        {loading ? '⏳' : success ? '✓' : '!'}
                    </div>

                    {/* Small heading */}
                    <div
                        style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.62rem',
                            color: success
                                ? C.olive
                                : C.goldDark,
                            letterSpacing: '0.22em',
                            marginBottom: '0.8rem',
                        }}
                    >
                        {loading
                            ? '— VERIFYING PAYMENT'
                            : success
                                ? '— PAYMENT CONFIRMED'
                                : '— PAYMENT STATUS'}
                    </div>

                    {/* Main heading */}
                    <h1
                        style={{
                            fontFamily: 'Outfit',
                            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: '-0.035em',
                            color: C.fg,
                            margin: '0 0 1rem',
                        }}
                    >
                        {loading
                            ? 'Checking your payment'
                            : success
                                ? 'Order Confirmed'
                                : 'Payment Could Not Be Verified'}
                    </h1>

                    {/* Message */}
                    <p
                        style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '0.95rem',
                            color: C.fgDim,
                            lineHeight: 1.7,
                            maxWidth: '450px',
                            margin: '0 auto 2rem',
                        }}
                    >
                        {message}
                    </p>

                    {/* Success information */}
                    {success && (
                        <div
                            style={{
                                background: C.oliveDim,
                                border: '1px solid rgba(61, 91, 50, 0.25)',
                                borderRadius: '14px',
                                padding: '1rem',
                                marginBottom: '2rem',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: '0.58rem',
                                    color: C.olive,
                                    letterSpacing: '0.12em',
                                    marginBottom: '0.4rem',
                                }}
                            >
                                TRANSACTION STATUS
                            </div>

                            <div
                                style={{
                                    fontFamily: 'Outfit',
                                    fontSize: '1.05rem',
                                    fontWeight: 800,
                                    color: C.olive,
                                }}
                            >
                                ✓ PAYMENT SUCCESSFUL
                            </div>
                        </div>
                    )}

                    {/* Session ID */}
                    {sessionId && (
                        <div
                            style={{
                                background: C.altBg,
                                border: `1px solid ${C.border}`,
                                borderRadius: '12px',
                                padding: '0.85rem 1rem',
                                marginBottom: '2rem',
                                textAlign: 'left',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: '0.58rem',
                                    color: C.fgSubtle,
                                    letterSpacing: '0.1em',
                                    marginBottom: '0.3rem',
                                }}
                            >
                                PAYMENT SESSION
                            </div>

                            <div
                                style={{
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: '0.68rem',
                                    color: C.fgDim,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {sessionId}
                            </div>
                        </div>
                    )}

                    {/* Button */}
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '100%',
                            background:
                                'linear-gradient(135deg, #D4AF37, #735C00)',
                            border: 'none',
                            color: '#FFF8F0',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            fontFamily: 'Outfit',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            boxShadow:
                                '0 0 32px rgba(212, 175, 55, 0.2)',
                        }}
                    >
                        CONTINUE SHOPPING →
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer
                style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    borderTop: `1px solid ${C.border}`,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <span
                    style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.6rem',
                        color: C.fgSubtle,
                        letterSpacing: '0.1em',
                    }}
                >
                    © 2026 YUTHI TECHNOLOGIES. ALL RIGHTS RESERVED.
                </span>
            </footer>
        </div>
    )
}