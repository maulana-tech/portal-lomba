import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingNav, defaultNavItems } from '@/components/ui/floating-nav';
import { AnimatedBackground, PageTransition } from '@/components/ui/animated-background';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      
      {/* Floating Navigation - Main Navigation */}
      <FloatingNav navItems={defaultNavItems} />

      {/* Main Content */}
      <main className="flex-1 relative z-10 pt-24 md:pt-32">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Minimal Footer */}
      <motion.footer 
        className="border-t border-border/30 py-6 bg-background/40 backdrop-blur-md relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
          <motion.p 
            className="text-sm text-muted-foreground"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            &copy; {new Date().getFullYear()} StudentHub. All rights reserved.
          </motion.p>
          <div className="flex items-center gap-6">
            {['About', 'Contact', 'Privacy', 'Terms'].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={`/${item.toLowerCase()}`} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default MainLayout;
