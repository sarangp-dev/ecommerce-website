import { motion } from 'framer-motion';
import { landingData } from '../../data/data';

export default function Overlay() {
  return (
    <div id="landing-overlay" className="relative z-10 w-full font-sans text-brand-light">
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-purple-500 mb-6"
        >
          {landingData.hero.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl"
        >
          {landingData.hero.subtitle}
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(102, 252, 241, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="px-8 py-4 bg-transparent border border-brand-cyan text-brand-cyan rounded-full text-lg font-semibold uppercase tracking-wider backdrop-blur-sm hover:bg-brand-cyan/10 transition-colors"
        >
          {landingData.hero.cta}
        </motion.button>
      </section>

      {/* Feature Sections */}
      <div className="py-20">
        {landingData.features.map((feature, index) => (
          <section 
            key={feature.id} 
            className={`feature-section-${index + 1} min-h-[80vh] flex items-center px-8 md:px-24 ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div 
              initial={{ opacity: 0, x: index % 2 !== 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-white mb-4">{feature.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          </section>
        ))}
      </div>
      
      {/* Footer Space */}
      <section className="h-[50vh] flex justify-center items-center">
        <h2 className="text-2xl font-medium text-brand-cyan/60 tracking-widest uppercase">
          Ready to dive in?
        </h2>
      </section>

    </div>
  );
}
