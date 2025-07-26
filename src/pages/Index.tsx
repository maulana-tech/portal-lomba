import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/context/auth-context';
import { useCompetitions } from '@/lib/context/competitions-context';
import { useProjects } from '@/lib/context/projects-context';
import { useCommunity } from '@/lib/context/community-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Trophy, Users, Bookmark, MessageSquare, ArrowRight, Calendar, Search } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import { Competition, Project, ForumPost, TeamRequest } from '@/types';

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { competitions } = useCompetitions();
  const { projects } = useProjects();
  const { forumPosts, teamRequests } = useCommunity();
  
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [recentTeamRequests, setRecentTeamRequests] = useState<TeamRequest[]>([]);

  useEffect(() => {
    // Filter competitions by status and only take the first 3
    const filteredCompetitions = competitions
      .filter(comp => comp.status === 'upcoming' && comp.approved)
      .sort((a, b) => {
        return new Date(a.registrationStartDate).getTime() - new Date(b.registrationStartDate).getTime();
      })
      .slice(0, 3);
    setUpcomingCompetitions(filteredCompetitions);
    
    // Get the top 3 projects with highest ratings
    const sortedProjects = [...projects].sort((a, b) => {
      const avgRatingA = a.ratings.length ? a.ratings.reduce((acc, r) => acc + r.rating, 0) / a.ratings.length : 0;
      const avgRatingB = b.ratings.length ? b.ratings.reduce((acc, r) => acc + r.rating, 0) / b.ratings.length : 0;
      return avgRatingB - avgRatingA;
    }).slice(0, 3);
    setFeaturedProjects(sortedProjects);
    
    // Get the most recent forum posts
    const sortedPosts = [...forumPosts].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 3);
    setRecentPosts(sortedPosts);
    
    // Get the most recent team requests
    const sortedRequests = [...teamRequests].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 3);
    setRecentTeamRequests(sortedRequests);
  }, [competitions, projects, forumPosts, teamRequests]);

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 -left-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container px-4 py-20 md:py-28 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Platform Terpadu untuk Mahasiswa
                  </h1>
                  <p className="text-xl text-blue-100 dark:text-gray-300 leading-relaxed">
                    Temukan informasi lomba terkini, tampilkan proyek, cari anggota tim, dan terlibat dalam komunitas mahasiswa.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/competitions">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold">
                      <Trophy className="mr-2 h-5 w-5" />
                      Jelajahi Lomba
                    </Button>
                  </Link>
                  <Link to={isAuthenticated ? "/my-projects" : "/register"}>
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      {isAuthenticated ? "Proyek Saya" : "Daftar Sekarang"}
                    </Button>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1000+</div>
                    <div className="text-sm text-blue-200">Mahasiswa Aktif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-blue-200">Proyek Terpublikasi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-blue-200">Lomba Tersedia</div>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex justify-center relative">
                <div className="relative">
                  {/* Floating cards animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                      {/* Main circle with gradient */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-blue-200/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:scale-105 transition-transform duration-500">
                        <GraduationCap className="h-32 w-32 text-white drop-shadow-lg" />
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                        <Trophy className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                        <Users className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1.5s'}}>
                        <Bookmark className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section - Bento Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Fitur Utama
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Eksplorasi fitur-fitur canggih yang membantu mengembangkan karir akademik Anda
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-6 max-w-7xl mx-auto">
            {/* Portal Lomba - Large Card */}
            <div className="lg:col-span-2 lg:row-span-2 group">
              <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Trophy className="h-16 w-16" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">100+</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Lomba Tersedia</div>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Portal Lomba
                  </CardTitle>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    Jelajahi informasi lengkap lomba mahasiswa tingkat nasional dan internasional. Dapatkan update terbaru tentang kompetisi yang sesuai dengan minat dan bidang studi Anda.
                  </p>
                </CardHeader>
                <CardFooter className="relative z-10 p-8 pt-0">
                  <Link to="/competitions" className="w-full">
                    <Button size="lg" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Jelajahi Lomba
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Showcase Proyek - Medium Card */}
            <div className="lg:col-span-2 group">
              <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Bookmark className="h-10 w-10" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Proyek</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Showcase Proyek
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Tampilkan hasil karya dan proyek-proyek terbaik Anda kepada komunitas.
                  </p>
                </CardHeader>
                <CardFooter className="relative z-10 p-6 pt-0">
                  <Link to="/projects" className="w-full">
                    <Button variant="outline" className="w-full border-2 border-blue-200 dark:border-blue-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300">
                      Jelajahi
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Forum Komunitas - Small Card */}
            <div className="group">
              <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">2K+</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Diskusi</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Forum Komunitas
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Diskusi dan berbagi pengetahuan dengan mahasiswa lain.
                  </p>
                </CardHeader>
                <CardFooter className="relative z-10 p-6 pt-0">
                  <Link to="/community" className="w-full">
                    <Button variant="outline" className="w-full text-sm border-2 border-green-200 dark:border-green-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent transition-all duration-300">
                      Bergabung
                      <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Pencarian Tim - Small Card */}
            <div className="group">
              <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Users className="h-8 w-8" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">300+</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Tim</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Pencarian Tim
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Cari rekan tim atau bergabung dengan proyek yang sedang berjalan.
                  </p>
                </CardHeader>
                <CardFooter className="relative z-10 p-6 pt-0">
                  <Link to="/team-search" className="w-full">
                    <Button variant="outline" className="w-full text-sm border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300">
                      Cari Tim
                      <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content preview section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-16 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-500/3 to-emerald-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6 shadow-lg shadow-blue-500/10 border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-sm"></div>
              Konten Terbaru
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Jelajahi Konten
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Temukan lomba terbaru, proyek inspiratif, diskusi menarik, dan peluang kolaborasi tim
            </p>
          </div>
          
          <Tabs defaultValue="competitions" className="w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-center mb-12 px-4">
              <TabsList className="grid grid-cols-4 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-1 shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20 w-full max-w-md md:max-w-3xl mx-auto h-12 md:h-14 items-center">
                <TabsTrigger 
                  value="competitions" 
                  className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 rounded-xl font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base data-[state=active]:border-0 text-gray-600 dark:text-gray-400 data-[state=active]:text-white flex items-center justify-center h-full"
                >
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 data-[state=active]:animate-pulse text-gray-500 dark:text-gray-400 data-[state=active]:text-white" />
                  Lomba
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 rounded-xl font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base data-[state=active]:border-0 text-gray-600 dark:text-gray-400 data-[state=active]:text-white flex items-center justify-center h-full"
                >
                  <Bookmark className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 data-[state=active]:animate-pulse text-gray-500 dark:text-gray-400 data-[state=active]:text-white" />
                  Proyek
                </TabsTrigger>
                <TabsTrigger 
                  value="forum" 
                  className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/30 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 rounded-xl font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base data-[state=active]:border-0 text-gray-600 dark:text-gray-400 data-[state=active]:text-white flex items-center justify-center h-full"
                >
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 data-[state=active]:animate-pulse text-gray-500 dark:text-gray-400 data-[state=active]:text-white" />
                  Forum
                </TabsTrigger>
                <TabsTrigger 
                  value="teams" 
                  className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 rounded-xl font-semibold px-3 py-2 md:px-6 md:py-3 text-sm md:text-base data-[state=active]:border-0 text-gray-600 dark:text-gray-400 data-[state=active]:text-white flex items-center justify-center h-full"
                >
                  <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 data-[state=active]:animate-pulse text-gray-500 dark:text-gray-400 data-[state=active]:text-white" />
                  Tim
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Competitions tab */}
            <TabsContent value="competitions" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="max-w-7xl mx-auto">
                {upcomingCompetitions.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {upcomingCompetitions.map((competition, index) => (
                    <Card key={competition.id} className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-[1.02]">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Competition badge/number */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="relative h-56 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/20 dark:to-red-950/20 flex items-center justify-center overflow-hidden">
                        {competition.image ? (
                          <>
                            <img 
                              src={competition.image} 
                              alt={competition.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </>
                        ) : (
                          <>
                            <Trophy className="h-20 w-20 text-orange-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-500"></div>
                          </>
                        )}
                      </div>
                      
                      <CardHeader className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                            {competition.title}
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 text-orange-700 dark:text-orange-300 border-0 font-medium">
                            {competition.level}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                            <Calendar className="h-4 w-4 mr-2 text-orange-500" /> 
                            <span className="font-medium">Pendaftaran:</span>
                            <span className="ml-2 text-gray-800 dark:text-gray-200">{formatDate(competition.registrationStartDate)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 px-6 pb-6">
                        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                          {competition.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="relative z-10 p-6 pt-0">
                        <Link to={`/competitions/${competition.id}`} className="w-full group/button">
                          <Button className="w-full bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover/button:scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                            <Trophy className="h-4 w-4 mr-2" />
                            Lihat Detail Lomba
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
                    <Trophy className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Lomba</h3>
                  <p className="text-gray-600 dark:text-gray-400">Tidak ada lomba yang akan datang saat ini.</p>
                </div>
              )}
              <div className="text-center mt-12">
                <Link to="/competitions">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                    <Trophy className="h-5 w-5 mr-2" />
                    Jelajahi Semua Lomba 
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            </TabsContent>
            
            {/* Projects tab */}
            <TabsContent value="projects" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="max-w-7xl mx-auto">
                {featuredProjects.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {featuredProjects.map((project, index) => (
                    <Card key={project.id} className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02]">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Project badge/number */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="relative h-56 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 flex items-center justify-center overflow-hidden">
                        {project.images && project.images.length > 0 ? (
                          <>
                            <img 
                              src={project.images[0]} 
                              alt={project.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-20 w-20 text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-500"></div>
                          </>
                        )}
                      </div>
                      
                      <CardHeader className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                            {project.title}
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-700 dark:text-blue-300 border-0 font-medium">
                            {project.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {project.ratings.length > 0 ? (
                            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => {
                                  const avgRating = project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length;
                                  return (
                                    <span key={i} className="text-yellow-400 text-lg">
                                      {i < Math.floor(avgRating) ? "★" : "☆"}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-sm ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                ({project.ratings.length} penilaian)
                              </span>
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Belum ada penilaian</span>
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 px-6 pb-4">
                        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="relative z-10 p-6 pt-0">
                        <Link to={`/projects/${project.id}`} className="w-full group/button">
                          <Button className="w-full bg-black hover:bg-gray-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover/button:scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Lihat Detail Proyek
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                    <Bookmark className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Proyek</h3>
                  <p className="text-gray-600 dark:text-gray-400">Belum ada proyek yang ditampilkan saat ini.</p>
                </div>
              )}
              <div className="text-center mt-12">
                <Link to="/projects">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                    <Bookmark className="h-5 w-5 mr-2" />
                    Jelajahi Semua Proyek
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            </TabsContent>
            
            {/* Forum tab */}
            <TabsContent value="forum" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="max-w-7xl mx-auto">
                {recentPosts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02]">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-lg line-clamp-1 text-gray-900 dark:text-white">{post.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <span>Oleh {post.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300">{post.content.replace(/[#*]/g, '')}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="relative z-10">
                        <div className="flex justify-between w-full items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            {post.comments.length} komentar
                          </div>
                          <Link to={`/community/post/${post.id}`}>
                            <Button size="sm" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">Baca Selengkapnya</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Belum ada postingan forum.</p>
                </div>
              )}
              <div className="text-center mt-6">
                <Link to="/community">
                  <Button className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                    Jelajahi Forum <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            </TabsContent>
            
            {/* Teams tab */}
            <TabsContent value="teams" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="max-w-7xl mx-auto">
                {recentTeamRequests.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {recentTeamRequests.map((request) => (
                    <Card key={request.id} className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <CardHeader className="relative z-10">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Pencarian Anggota Tim</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <span>Oleh {request.userName}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300">{request.description}</p>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Keahlian yang Dibutuhkan:</h4>
                          <div className="flex flex-wrap gap-1">
                            {request.requiredSkills.map((skill, i) => (
                              <Badge key={i} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        {request.deadline && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Deadline: {formatDate(request.deadline)}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="relative z-10">
                        <Link to={`/team-search/${request.id}`} className="w-full">
                          <Button className="w-full bg-black hover:bg-gray-800 text-white border-0 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                            Lihat Detail
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Belum ada pencarian tim terbaru.</p>
                </div>
              )}
              <div className="text-center mt-6">
                <Link to="/team-search">
                  <Button className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                    Lihat Semua Pencarian <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap untuk Memulai?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Bergabung sekarang dan dapatkan akses ke semua fitur. Temukan informasi lomba, bagikan proyek, dan terhubung dengan mahasiswa lainnya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/competitions">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Trophy className="h-4 w-4 mr-2" /> Jelajahi Lomba
                  </Button>
                </Link>
                <Link to="/my-projects">
                  <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                    <Bookmark className="h-4 w-4 mr-2" /> Kelola Proyek Saya
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Daftar Sekarang
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                    Masuk
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Search section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Cari Sesuai Kebutuhan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Gunakan fitur pencarian untuk menemukan lomba, proyek, atau anggota tim yang sesuai dengan minat dan keahlian Anda.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <Link to="/competitions" className="flex-1">
              <Button variant="outline" className="w-full h-auto py-6 text-lg flex items-center justify-center gap-3">
                <Trophy className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Cari Lomba</div>
                  <div className="text-xs text-muted-foreground">Temukan kompetisi sesuai minat</div>
                </div>
              </Button>
            </Link>
            <Link to="/projects" className="flex-1">
              <Button variant="outline" className="w-full h-auto py-6 text-lg flex items-center justify-center gap-3">
                <Bookmark className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Jelajahi Proyek</div>
                  <div className="text-xs text-muted-foreground">Lihat karya mahasiswa lain</div>
                </div>
              </Button>
            </Link>
            <Link to="/team-search" className="flex-1">
              <Button variant="outline" className="w-full h-auto py-6 text-lg flex items-center justify-center gap-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Cari Tim</div>
                  <div className="text-xs text-muted-foreground">Temukan rekan untuk proyek</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;