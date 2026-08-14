import React, { useEffect, useState } from 'react';

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