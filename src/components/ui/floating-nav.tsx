import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Home,
  Trophy,
  Bookmark,
  MessageSquare,
  Users,
  ChevronUp,
  User,
  LogOut,
  Settings,
  BarChart,
  UserPlus,
  GraduationCap,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export interface FloatingNavItem {
  name: string;
  link: string;
}

export const FloatingNav = ({
  navItems,
  className
}: {
  navItems: FloatingNavItem[];
  className?: string;
}) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > 100) {
        setVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role-specific items
  const getRoleSpecificItems = () => {
    if (!isAuthenticated) return [];
    
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', link: '/admin/dashboard' },
          { name: 'Users', link: '/admin/users' },
          { name: 'Settings', link: '/admin/settings' }
        ];
      case 'lecturer':
        return [
          { name: 'Manage', link: '/lecturer/competitions' },
          { name: 'Review', link: '/lecturer/projects' }
        ];
      case 'student':
        return [
          { name: 'Profile', link: '/profile' },
          { name: 'My Projects', link: '/my-projects' }
        ];
      default:
        return [];
    }
  };

  const allNavItems = [...navItems, ...getRoleSpecificItems()];

  // Theme Toggle Component
  const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    
    const toggleTheme = () => {
      if (theme === 'light') {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    const getCurrentIcon = () => {
      return theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;
    };

    const getThemeLabel = () => {
      return theme === 'light' ? 'Light' : 'Dark';
    };

    return (
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {getCurrentIcon()}
        </motion.div>
        <span className="hidden lg:block">{getThemeLabel()}</span>
      </motion.button>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 0,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          exit={{
            y: -100,
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "hidden md:flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-border/40 rounded-full dark:bg-black/90 bg-white/90 backdrop-blur-xl shadow-lg dark:shadow-white/5 z-[5000] px-6 py-3 items-center justify-center space-x-2",
            className
          )}
        >
          {/* Main Navigation Items */}
          {allNavItems.map((navItem, idx) => (
            <motion.div
              key={`nav-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={navItem.link}
                className={cn(
                  "relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  location.pathname === navItem.link 
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" 
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                <span className="whitespace-nowrap">{navItem.name}</span>
              </Link>
            </motion.div>
          ))}
          
          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />
          
          {/* Search */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/search">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300">
                <Search className="h-4 w-4" />
                <span className="hidden lg:block">Search</span>
              </button>
            </Link>
          </motion.div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />
          
          {/* Auth Actions */}
          {isAuthenticated ? (
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:block">Logout</span>
            </motion.button>
          ) : (
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/login">
                  <button className="px-4 py-2 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                    Login
                  </button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/register">
                  <button className="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-300">
                    Register
                  </button>
                </Link>
              </motion.div>
            </div>
          )}
          
          {/* Divider */}
          <div className="w-px h-6 bg-border/50" />
          
          {/* Scroll to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
          >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">Scroll to top</span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-4 right-4 z-[5001] p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-border/40 shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[4999]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-l border-border/40 z-[5000] p-6 overflow-y-auto"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8 pt-12">
                  <Link 
                    to="/" 
                    className="flex items-center space-x-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      StudentHub
                    </span>
                  </Link>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2">
                  {allNavItems.map((navItem, idx) => (
                    <Link
                      key={`mobile-nav-${idx}`}
                      to={navItem.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                        location.pathname === navItem.link
                          ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span>{navItem.name}</span>
                    </Link>
                  ))}
                  
                  {/* Mobile Search */}
                  <Link
                    to="/search"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                      location.pathname === "/search"
                        ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <span className="flex-shrink-0"><Search className="h-4 w-4" /></span>
                    <span>Search</span>
                  </Link>
                </nav>

                {/* Mobile Theme Toggle */}
                <div className="mt-6 pt-6 border-t border-border/40">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">Theme</h3>
                    <div className="flex justify-center">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {/* Mobile Auth Actions */}
                <div className="mt-8 pt-6 border-t border-border/40">
                  {isAuthenticated ? (
                    <Button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="destructive"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Scroll to Top */}
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      scrollToTop();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span>Scroll to Top</span>
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Default navigation items
export const defaultNavItems: FloatingNavItem[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Competitions",
    link: "/competitions",
  },
  {
    name: "Projects",
    link: "/projects",
  },
  {
    name: "Community",
    link: "/community",
  },
  {
    name: "Team Search",
    link: "/team-search",
  },
];
