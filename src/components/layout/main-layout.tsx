import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useAuth } from '@/lib/context/auth-context';
import {
  BarChart,
  Bookmark,
  GraduationCap,
  Home,
  Menu,
  MessageSquare,
  Search,
  Trophy,
  User,
  Users,
  UserPlus,
  LogOut,
  Settings
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Beranda', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { label: 'Lomba', path: '/competitions', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { label: 'Projek', path: '/projects', icon: <Bookmark className="h-4 w-4 mr-2" /> },
    { label: 'Komunitas', path: '/community', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { label: 'Cari Tim', path: '/team-search', icon: <Users className="h-4 w-4 mr-2" /> }
  ];

  // Role-specific items
  const roleSpecificItems = () => {
    if (!isAuthenticated) return [];
    
    switch (user?.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <BarChart className="h-4 w-4 mr-2" /> },
          { label: 'Kelola Pengguna', path: '/admin/users', icon: <UserPlus className="h-4 w-4 mr-2" /> },
          { label: 'Pengaturan', path: '/admin/settings', icon: <Settings className="h-4 w-4 mr-2" /> }
        ];
      case 'lecturer':
        return [
          { label: 'Kelola Lomba', path: '/lecturer/competitions', icon: <Trophy className="h-4 w-4 mr-2" /> },
          { label: 'Penilaian Proyek', path: '/lecturer/projects', icon: <GraduationCap className="h-4 w-4 mr-2" /> }
        ];
      case 'student':
        return [
          { label: 'Profilku', path: '/profile', icon: <User className="h-4 w-4 mr-2" /> },
          { label: 'Proyekku', path: '/my-projects', icon: <Bookmark className="h-4 w-4 mr-2" /> }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">
                    <Link to="/" className="flex items-center">
                      <GraduationCap className="h-6 w-6 mr-2" />
                      <span>StudentHub</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-4">
                  {navItems.map((item, index) => (
                    <Link 
                      key={index} 
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        {roleSpecificItems().map((item, index) => (
                          <Link 
                            key={index} 
                            to={item.path}
                            className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                              isActive(item.path) 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-muted"
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-3 py-2 mt-2" 
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Keluar
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">Masuk</Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full">Daftar</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl hidden md:inline-block">StudentHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center ml-8 space-x-1">
              {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <Link to="/search" className="md:w-40 lg:w-64">
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden md:inline-block">Cari...</span>
              </Button>
            </Link>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center">
                <Link to="/profile" className="mr-2">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Daftar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StudentHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:underline">
              Tentang Kami
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:underline">
              Kontak
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privasi
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:underline">
              Ketentuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;