import { Suspense } from 'react';
import Scene from './Scene';
import Overlay from './Overlay';

export default function Landing3D() {
  return (
    <div className="relative min-h-screen bg-brand-dark text-white overflow-x-hidden selection:bg-brand-cyan selection:text-brand-dark">
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-brand-dark z-50 text-white">
          Loading 3D...
          <div className="w-16 h-16 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Scene />
        <Overlay />
      </Suspense>
    </div>
  );
}
