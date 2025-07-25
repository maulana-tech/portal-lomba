import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '@/lib/context/projects-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';
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
  ThumbsUp
} from 'lucide-react';
import { Project } from '@/types';

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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, rateProject, addComment } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const proj = getProjectById(id);
      if (proj) {
        setProject(proj);
        
        // Check if user has already rated
        if (isAuthenticated && user) {
          const userRating = proj.ratings.find(r => r.userId === user.id);
          if (userRating) {
            setUserRating(userRating.rating);
          }
        }
      }
    }
  }, [id, getProjectById, user, isAuthenticated]);

  if (!project) {
    return (
      <MainLayout>
        <div className="container px-4 py-16 text-center">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Proyek Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Proyek yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link to="/projects">
            <Button>Kembali ke Daftar Proyek</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleRating = (value: number) => {
    if (!isAuthenticated) {
      // Redirect to login or show login prompt
      return;
    }
    
    setRating(value);
    if (user) {
      rateProject(project.id, user.id, value);
      setUserRating(value);
    }
  };

  const handleComment = () => {
    if (!isAuthenticated || !comment.trim() || !user) {
      return;
    }
    
    addComment(project.id, {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: comment,
      createdAt: new Date().toISOString()
    });
    
    setComment('');
    
    // Refresh project data
    const updatedProject = getProjectById(project.id);
    if (updatedProject) {
      setProject(updatedProject);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: `Cek proyek: ${project.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const canEdit = isAuthenticated && user && (
    user.id === project.ownerId || 
    project.members.some(member => member.id === user.id) ||
    user.role === 'admin'
  );

  const getAverageRating = () => {
    if (project.ratings.length === 0) return 0;
    return project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length;
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
            &larr; Kembali ke Daftar Proyek
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project images */}
            {project.images && project.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="overflow-hidden rounded-xl">
                        <img 
                          src={image} 
                          alt={`${project.title} - gambar ${index + 1}`} 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <Bookmark className="h-24 w-24 text-gray-400" />
              </div>
            )}
            
            {/* Project header */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <Badge>{project.category}</Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Dibuat pada {formatDate(project.createdAt)}</span>
              </div>
            </div>
            
            {/* Project tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                <TabsTrigger value="details">Detail</TabsTrigger>
                <TabsTrigger value="team">Tim</TabsTrigger>
                <TabsTrigger value="comments">Komentar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deskripsi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{project.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Teknologi yang Digunakan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          <Code className="h-3.5 w-3.5 mr-1.5" /> {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                {project.features && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fitur Utama</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {project.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {project.challenges && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tantangan dalam Pengembangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{project.challenges}</p>
                    </CardContent>
                  </Card>
                )}
                
                {project.futureImprovements && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Rencana Pengembangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{project.futureImprovements}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Anggota Tim</CardTitle>
                    <CardDescription>
                      {project.members.length} anggota yang berkontribusi pada proyek
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {member.avatar ? (
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium">{member.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
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
                    <CardTitle>Komentar ({project.comments.length})</CardTitle>
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
                        />
                        <Button onClick={handleComment} disabled={!comment.trim()}>
                          <MessageSquare className="h-4 w-4 mr-2" /> Kirim Komentar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="mb-4 text-muted-foreground">
                          Silakan masuk untuk memberikan komentar
                        </p>
                        <Link to="/login">
                          <Button>Masuk</Button>
                        </Link>
                      </div>
                    )}
                    
                    <div className="space-y-4 pt-6 border-t">
                      {project.comments.length > 0 ? (
                        project.comments.map((comment, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {comment.userAvatar ? (
                                  <img 
                                    src={comment.userAvatar} 
                                    alt={comment.userName} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span>{comment.userName.charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{comment.userName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(comment.createdAt)}
                                </div>
                              </div>
                            </div>
                            <p className="pl-10 text-sm">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Belum ada komentar. Jadilah yang pertama memberikan komentar!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action card */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Proyek</CardTitle>
                <CardDescription>
                  {project.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rating:</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const avgRating = getAverageRating();
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
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dibuat pada:</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status === 'completed' ? 'Selesai' : 'Dalam Pengembangan'}
                  </Badge>
                </div>
                
                <div className="pt-4 space-y-3">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" /> Lihat Demo
                      </Button>
                    </a>
                  )}
                  
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        <Github className="h-4 w-4 mr-2" /> Repository
                      </Button>
                    </a>
                  )}
                  
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    {shareSuccess ? (
                      <><Check className="h-4 w-4 mr-2" /> Link Tersalin</>
                    ) : (
                      <><Share2 className="h-4 w-4 mr-2" /> Bagikan</>
                    )}
                  </Button>
                  
                  {canEdit && (
                    <Link to={`/projects/edit/${project.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" /> Edit Proyek
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Rating card */}
            <Card>
              <CardHeader>
                <CardTitle>Beri Penilaian</CardTitle>
                <CardDescription>
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
                          className="p-1"
                          onClick={() => handleRating(value)}
                          title={`${value} star${value > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              (userRating !== null && value <= userRating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating !== null ? (
                      <p className="text-center text-sm">
                        Terima kasih atas penilaian Anda!
                      </p>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Klik pada bintang untuk memberikan penilaian
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Masuk untuk memberikan penilaian
                    </p>
                    <Link to="/login">
                      <Button variant="outline" size="sm">Masuk</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Related projects */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Terkait</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/projects" className="block">
                    <Button variant="link" className="p-0 h-auto">
                      Lihat Semua Proyek
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