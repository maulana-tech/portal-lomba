import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page Imports
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Competitions from './pages/Competitions';
import CompetitionDetail from './pages/CompetitionDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Community from './pages/Community';
import TeamSearch from './pages/TeamSearch';

// Context Providers
import { AuthProvider } from './lib/context/auth-context';
import { CompetitionsProvider } from './lib/context/competitions-context';
import { ProjectsProvider } from './lib/context/projects-context';
import { CommunityProvider } from './lib/context/community-context';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <CompetitionsProvider>
          <ProjectsProvider>
            <CommunityProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Competition Routes */}
                  <Route path="/competitions" element={<Competitions />} />
                  <Route path="/competitions/:id" element={<CompetitionDetail />} />
                  
                  {/* Project Routes */}
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  
                  {/* Community Routes */}
                  <Route path="/community" element={<Community />} />
                  
                  {/* Team Search Routes */}
                  <Route path="/team-search" element={<TeamSearch />} />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CommunityProvider>
          </ProjectsProvider>
        </CompetitionsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
