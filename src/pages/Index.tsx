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
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Platform Terpadu untuk Mahasiswa
                </h1>
                <p className="text-lg opacity-90">
                  Temukan informasi lomba terkini, tampilkan proyek, cari anggota tim, dan terlibat dalam komunitas mahasiswa.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/competitions">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Jelajahi Lomba
                    </Button>
                  </Link>
                  <Link to={isAuthenticated ? "/my-projects" : "/register"}>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      {isAuthenticated ? "Proyek Saya" : "Daftar Sekarang"}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative h-80 w-80">
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-white/20 flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Portal Lomba',
                description: 'Informasi lengkap lomba mahasiswa tingkat nasional dan internasional.',
                icon: <Trophy className="h-10 w-10 text-orange-500" />,
                link: '/competitions'
              },
              {
                title: 'Showcase Proyek',
                description: 'Tampilkan hasil karya dan proyek-proyek terbaik Anda.',
                icon: <Bookmark className="h-10 w-10 text-blue-500" />,
                link: '/projects'
              },
              {
                title: 'Forum Komunitas',
                description: 'Diskusi, berbagi pengetahuan, dan terhubung dengan mahasiswa lain.',
                icon: <MessageSquare className="h-10 w-10 text-green-500" />,
                link: '/community'
              },
              {
                title: 'Pencarian Tim',
                description: 'Cari rekan tim atau bergabung dengan proyek yang sedang berjalan.',
                icon: <Users className="h-10 w-10 text-purple-500" />,
                link: '/team-search'
              }
            ].map((feature, i) => (
              <Card key={i} className="h-full flex flex-col">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={feature.link} className="w-full">
                    <Button variant="outline" className="w-full">
                      Jelajahi <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Content preview section */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Jelajahi Konten</h2>
          <Tabs defaultValue="competitions" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="competitions">Lomba</TabsTrigger>
              <TabsTrigger value="projects">Proyek</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="teams">Pencarian Tim</TabsTrigger>
            </TabsList>
            
            {/* Competitions tab */}
            <TabsContent value="competitions" className="space-y-4">
              {upcomingCompetitions.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {upcomingCompetitions.map((competition) => (
                    <Card key={competition.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {competition.image ? (
                          <img 
                            src={competition.image} 
                            alt={competition.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Trophy className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{competition.title}</CardTitle>
                          <Badge>{competition.level}</Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-1" /> 
                            Pendaftaran: {formatDate(competition.registrationStartDate)}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{competition.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/competitions/${competition.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Lihat Detail
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Tidak ada lomba yang akan datang.</p>
                </div>
              )}
              <div className="text-center mt-6">
                <Link to="/competitions">
                  <Button>
                    Lihat Semua Lomba <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            {/* Projects tab */}
            <TabsContent value="projects" className="space-y-4">
              {featuredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {featuredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {project.images && project.images.length > 0 ? (
                          <img 
                            src={project.images[0]} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Bookmark className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge>{project.category}</Badge>
                        </div>
                        <CardDescription>
                          {project.ratings.length > 0 ? (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => {
                                const avgRating = project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length;
                                return (
                                  <span key={i} className="text-yellow-400">
                                    {i < Math.floor(avgRating) ? "★" : "☆"}
                                  </span>
                                );
                              })}
                              <span className="text-xs ml-2">
                                ({project.ratings.length} {project.ratings.length > 1 ? 'penilaian' : 'penilaian'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs">Belum ada penilaian</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{project.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="outline">{tech}</Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline">+{project.technologies.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/projects/${project.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Lihat Proyek
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Belum ada proyek yang ditampilkan.</p>
                </div>
              )}
              <div className="text-center mt-6">
                <Link to="/projects">
                  <Button>
                    Lihat Semua Proyek <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            {/* Forum tab */}
            <TabsContent value="forum" className="space-y-4">
              {recentPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {recentPosts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center">
                            <span>Oleh {post.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3">{post.content.replace(/[#*]/g, '')}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex justify-between w-full items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            {post.comments.length} komentar
                          </div>
                          <Link to={`/community/post/${post.id}`}>
                            <Button variant="ghost" size="sm">Baca Selengkapnya</Button>
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
                  <Button>
                    Jelajahi Forum <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            {/* Teams tab */}
            <TabsContent value="teams" className="space-y-4">
              {recentTeamRequests.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {recentTeamRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Pencarian Anggota Tim</CardTitle>
                        <CardDescription>
                          <div className="flex items-center">
                            <span>Oleh {request.userName}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3">{request.description}</p>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Keahlian yang Dibutuhkan:</h4>
                          <div className="flex flex-wrap gap-1">
                            {request.requiredSkills.map((skill, i) => (
                              <Badge key={i} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        {request.deadline && (
                          <div className="mt-2 text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Deadline: {formatDate(request.deadline)}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Link to={`/team-search/${request.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
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
                  <Button>
                    Lihat Semua Pencarian <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
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
      <section className="py-16 bg-gray-50">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Cari Sesuai Kebutuhan</h2>
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