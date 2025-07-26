import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '@/lib/context/projects-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bookmark, 
  Code, 
  Github,
  ExternalLink, 
  Calendar,
  Star,
  MessageSquare,
  Share2,
  Check,
  Edit,
  ArrowLeft,
  Eye,
  Users,
  Award,
  Clock,
  Play
} from 'lucide-react';
import { Project, Rating, ProjectComment } from '@/types';

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

const formatRelativeTime = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  
  return formatDate(date);
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, rateProject, addComment, projects, loading: contextLoading } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('ID proyek tidak valid');
        setLoading(false);
        return;
      }

      // Wait for context to finish loading
      if (contextLoading) {
        return;
      }

      try {
        console.log('Loading project with ID:', id);
        console.log('Available projects:', projects.map(p => ({ id: p.id, title: p.title })));
        
        const proj = getProjectById(id);
        console.log('Found project:', proj);
        
        if (proj) {
          setProject(proj);
          
          // Check if user has already rated
          if (isAuthenticated && user) {
            const existingRating = proj.ratings.find(r => r.userId === user.id);
            if (existingRating) {
              setUserRating(existingRating.rating);
            }
          }
        } else {
          // Fallback: try to find project by index if ID is numeric
          const numericId = parseInt(id);
          if (!isNaN(numericId) && numericId > 0 && numericId <= projects.length) {
            const fallbackProject = projects[numericId - 1];
            console.log('Using fallback project:', fallbackProject);
            setProject(fallbackProject);
          } else {
            setError(`Proyek dengan ID "${id}" tidak ditemukan. Tersedia: ${projects.map(p => p.id).join(', ')}`);
          }
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Terjadi kesalahan saat memuat proyek');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, getProjectById, user, isAuthenticated, projects, contextLoading]);

  const handleRating = async (value: number) => {
    if (!isAuthenticated || !user || !project) {
      navigate('/login');
      return;
    }
    
    try {
      await rateProject(project.id, user.id, value);
      setUserRating(value);
      
      // Refresh project data
      const updatedProject = getProjectById(project.id);
      if (updatedProject) {
        setProject(updatedProject);
      }
    } catch (err) {
      console.error('Error rating project:', err);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated || !comment.trim() || !user || !project) {
      return;
    }
    
    setSubmittingComment(true);
    try {
      const newComment = {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: comment.trim()
      };
      
      await addComment(project.id, newComment);
      setComment('');
      
      // Refresh project data
      const updatedProject = getProjectById(project.id);
      if (updatedProject) {
        setProject(updatedProject);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (!project) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: `Cek proyek menarik: ${project.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const canEdit = isAuthenticated && user && project && (
    user.id === project.ownerId || 
    project.members.some(member => member.id === user.id) ||
    user.role === 'admin'
  );

  const getAverageRating = () => {
    if (!project || project.ratings.length === 0) return 0;
    return Number((project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length).toFixed(1));
  };

  const getRatingCount = () => {
    return project?.ratings.length || 0;
  };

  // Show loading state while context is loading or component is loading
  if (loading || contextLoading) {
    return (
      <MainLayout>
        <div className="container px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error || !project) {
    return (
      <MainLayout>
        <div className="container px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Proyek Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'Proyek yang Anda cari tidak tersedia atau telah dihapus.'}
            </p>
            
            {/* Debug information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <p className="text-sm">Requested ID: {id}</p>
                <p className="text-sm">Available IDs: {projects.map(p => p.id).join(', ')}</p>
                <p className="text-sm">Total Projects: {projects.length}</p>
                <p className="text-sm">Context Loading: {contextLoading ? 'Yes' : 'No'}</p>
                <p className="text-sm">Component Loading: {loading ? 'Yes' : 'No'}</p>
                <p className="text-sm">Error: {error || 'None'}</p>
                <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
                  <p><strong>Tip:</strong> Jika Anda mengakses /projects/1, /projects/2, atau /projects/3, 
                  coba gunakan tombol "Reset Data" di bawah untuk memuat ulang data proyek.</p>
                </div>
              </div>
            )}
            
            {/* Available projects */}
            {projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Proyek yang Tersedia:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects.slice(0, 4).map((proj) => (
                    <Link 
                      key={proj.id} 
                      to={`/projects/${proj.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium">{proj.title}</div>
                      <div className="text-sm text-muted-foreground">{proj.category}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Link to="/projects">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar Proyek
                </Button>
              </Link>
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                Kembali ke Halaman Sebelumnya
              </Button>
              
              {/* Reset data button for development */}
              {process.env.NODE_ENV === 'development' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.location.reload();
                    }} 
                    className="w-full"
                  >
                    Reload Page
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      localStorage.removeItem('projects');
                      console.log('Projects data cleared from localStorage');
                      window.location.reload();
                    }} 
                    className="w-full"
                  >
                    Reset Data (Dev Only)
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        {/* Enhanced Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-all duration-300 group bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Proyek
          </Link>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced Project Hero Section */}
            <div className="relative">
              {project.images && project.images.length > 0 ? (
                <div className="relative group">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="overflow-hidden rounded-2xl relative">
                            <img 
                              src={image} 
                              alt={`${project.title} - gambar ${index + 1}`} 
                              className="w-full h-72 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                console.log('Image failed to load:', image);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show fallback
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                      <div class="text-center">
                                        <svg class="h-16 w-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h3m0 0h3a1 1 0 011 1v2m0 0v2a1 1 0 01-1 1h-3m0 0H8a1 1 0 01-1-1V4z" />
                                        </svg>
                                        <p class="text-gray-500 text-sm">Gambar tidak tersedia</p>
                                      </div>
                                    </div>
                                  `;
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 h-10 w-10 bg-white/90 dark:bg-black/90 border-0 shadow-lg" />
                    <CarouselNext className="right-4 h-10 w-10 bg-white/90 dark:bg-black/90 border-0 shadow-lg" />
                  </Carousel>
                  
                  {/* Floating badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 dark:bg-black/90 text-foreground border-0 shadow-lg">
                      {project.images.length} gambar
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                      {project.category}
                    </Badge>
                  </div>
                  
                  {/* Floating action buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white/90 dark:bg-black/90 border-0 shadow-lg hover:bg-white dark:hover:bg-black"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <Link to={`/projects/edit/${project.id}`}>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-white/90 dark:bg-black/90 border-0 shadow-lg hover:bg-white dark:hover:bg-black"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-72 md:h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                  <div className="text-center relative z-10">
                    <Bookmark className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Tidak ada gambar tersedia</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Project Header */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
                  {project.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto md:mx-0">
                  {project.description}
                </p>
              </div>
              
              {/* Project Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Dibuat {formatRelativeTime(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{getAverageRating()} ({getRatingCount()} penilaian)</span>
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{project.members.length} anggota</span>
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Badge variant="outline" className="text-xs">
                    {project.status === 'completed' ? 'Selesai' : 'Dalam Pengembangan'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Enhanced Project Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-background/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  Ringkasan
                </TabsTrigger>
                <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  Detail
                </TabsTrigger>
                <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  Tim
                </TabsTrigger>
                <TabsTrigger value="comments" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  Komentar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bookmark className="h-6 w-6 text-primary" />
                      </div>
                      Deskripsi Proyek
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground text-lg">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      Teknologi yang Digunakan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          <Code className="h-4 w-4 mr-2" /> 
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                {project.features && project.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Fitur Utama
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {project.challenges && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Tantangan dalam Pengembangan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line leading-relaxed">{project.challenges}</p>
                    </CardContent>
                  </Card>
                )}
                
                {project.futureImprovements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Rencana Pengembangan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line leading-relaxed">{project.futureImprovements}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Anggota Tim
                    </CardTitle>
                    <CardDescription>
                      {project.members.length} anggota yang berkontribusi pada proyek
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-lg font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Komentar ({project.comments.length})
                    </CardTitle>
                    <CardDescription>
                      Diskusi tentang proyek ini
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Berikan komentar atau masukan tentang proyek ini..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {comment.length}/500 karakter
                          </span>
                          <Button 
                            onClick={handleComment} 
                            disabled={!comment.trim() || submittingComment}
                            size="sm"
                          >
                            {submittingComment ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="h-4 w-4 mr-2" /> 
                                Kirim Komentar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <MessageSquare className="h-4 w-4" />
                        <AlertDescription>
                          Silakan masuk untuk memberikan komentar
                        </AlertDescription>
                        <Link to="/login" className="ml-auto">
                          <Button size="sm">Masuk</Button>
                        </Link>
                      </Alert>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      {project.comments.length > 0 ? (
                        project.comments.map((comment, index) => (
                          <div key={index} className="space-y-3 p-4 rounded-lg border bg-card">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                                <AvatarFallback className="text-sm">
                                  {comment.userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-medium truncate">{comment.userName}</div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatRelativeTime(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Belum ada komentar. Jadilah yang pertama memberikan komentar!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enhanced Sidebar */}
          <div className="space-y-6 sticky top-8">
            {/* Enhanced Project Info Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bookmark className="h-6 w-6 text-primary" />
                  </div>
                  Tentang Proyek
                </CardTitle>
                <CardDescription className="text-base">
                  {project.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rating:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => {
                        const avgRating = getAverageRating();
                        return (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(avgRating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm font-medium">
                      {getAverageRating()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dibuat pada:</span>
                  <span className="text-sm">{formatDate(project.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status === 'completed' ? 'Selesai' : 'Dalam Pengembangan'}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  {project.demoLink && (
                    <a 
                      href={project.demoLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300">
                        <Play className="h-4 w-4 mr-2" /> 
                        Lihat Demo
                      </Button>
                    </a>
                  )}
                  
                  {project.repositoryLink && (
                    <a 
                      href={project.repositoryLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border-gray-500/20 hover:bg-gray-500/20 transition-all duration-300">
                        <Github className="h-4 w-4 mr-2" /> 
                        Repository
                      </Button>
                    </a>
                  )}
                  
                  <Button 
                    variant="secondary" 
                    className="w-full h-12 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300"
                    onClick={handleShare}
                  >
                    {shareSuccess ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> 
                        Link Tersalin
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-2" /> 
                        Bagikan
                      </>
                    )}
                  </Button>
                  
                  {canEdit && (
                    <Link to={`/projects/edit/${project.id}`} className="w-full">
                      <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 hover:bg-green-500/20 transition-all duration-300">
                        <Edit className="h-4 w-4 mr-2" /> 
                        Edit Proyek
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Rating Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  Beri Penilaian
                </CardTitle>
                <CardDescription className="text-base">
                  Berikan penilaian Anda untuk proyek ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          className="p-2 hover:scale-110 transition-all duration-300 hover:bg-yellow-500/10 rounded-lg"
                          onClick={() => handleRating(value)}
                          title={`${value} bintang`}
                        >
                          <Star
                            className={`h-10 w-10 transition-all duration-300 ${
                              (userRating !== null && value <= userRating) 
                                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg" 
                                : "text-gray-300 hover:text-yellow-300 hover:scale-110"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating !== null ? (
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">
                          Terima kasih atas penilaian Anda!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Anda memberikan {userRating} bintang
                        </p>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Klik pada bintang untuk memberikan penilaian
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <Star className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Masuk untuk memberikan penilaian
                    </p>
                    <Link to="/login">
                      <Button variant="outline" size="sm">Masuk</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Enhanced Related Projects Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bookmark className="h-6 w-6 text-primary" />
                  </div>
                  Proyek Terkait
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/projects" className="block">
                    <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-primary/10 to-primary/20 border-primary/20 hover:bg-primary/20 transition-all duration-300 justify-start">
                      Lihat Semua Proyek
                    </Button>
                  </Link>
                  <Link to={`/projects?category=${project.category}`} className="block">
                    <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300 justify-start">
                      Proyek {project.category}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;