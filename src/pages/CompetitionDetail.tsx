import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetitions } from '@/lib/context/competitions-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Trophy, 
  Award, 
  Clock, 
  User, 
  ExternalLink, 
  Edit, 
  Bell,
  BellOff,
  Share2,
  Check
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Competition } from '@/types';

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

const statusLabel = (status: string) => {
  switch (status) {
    case 'upcoming': return 'Akan Datang';
    case 'ongoing': return 'Sedang Berlangsung';
    case 'completed': return 'Selesai';
    default: return status;
  }
};

const levelLabel = (level: string) => {
  switch (level) {
    case 'national': return 'Nasional';
    case 'international': return 'Internasional';
    default: return level;
  }
};

const categoryLabel = (category: string) => {
  switch (category) {
    case 'IT': return 'Teknologi Informasi';
    case 'Design': return 'Desain';
    case 'Business': return 'Bisnis';
    case 'Science': return 'Sains';
    case 'Engineering': return 'Teknik';
    case 'Arts': return 'Seni';
    case 'Other': return 'Lainnya';
    default: return category;
  }
};

const statusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'upcoming': return 'default';
    case 'ongoing': return 'secondary';
    case 'completed': return 'outline';
    default: return 'default';
  }
};

const CompetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCompetitionById, subscribeToCategory, unsubscribeFromCategory, subscribedCategories } = useCompetitions();
  const { user, isAuthenticated } = useAuth();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const comp = getCompetitionById(id);
      if (comp) {
        setCompetition(comp);
        
        // Check if user is subscribed to this category
        if (isAuthenticated && subscribedCategories.includes(comp.category)) {
          setIsSubscribed(true);
        }
      }
    }
  }, [id, getCompetitionById, subscribedCategories, isAuthenticated]);

  if (!competition) {
    return (
      <MainLayout>
        <div className="container px-4 py-16 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Lomba Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Lomba yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link to="/competitions">
            <Button>Kembali ke Daftar Lomba</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const toggleSubscription = () => {
    if (isSubscribed) {
      unsubscribeFromCategory(competition.category);
    } else {
      subscribeToCategory(competition.category);
    }
    setIsSubscribed(!isSubscribed);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: competition.title,
          text: `Cek lomba: ${competition.title}`,
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

  const canEdit = isAuthenticated && 
    (user?.role === 'admin' || 
    (user?.role === 'lecturer' && user.id === competition.createdBy));

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Link to="/competitions" className="text-muted-foreground hover:text-primary transition-colors">
            &larr; Kembali ke Daftar Lomba
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero section */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64">
              {competition.image ? (
                <img 
                  src={competition.image} 
                  alt={competition.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Trophy className="h-24 w-24 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant={statusBadgeVariant(competition.status)}>
                    {statusLabel(competition.status)}
                  </Badge>
                  <Badge variant="outline" className="bg-white/80">
                    {levelLabel(competition.level)}
                  </Badge>
                  <Badge variant="secondary">
                    {categoryLabel(competition.category)}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {competition.title}
                </h1>
              </div>
            </div>
            
            {/* Tabs section */}
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Detail</TabsTrigger>
                <TabsTrigger value="requirements">Persyaratan</TabsTrigger>
                <TabsTrigger value="dates">Tanggal Penting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deskripsi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{competition.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Hadiah</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                      <p className="whitespace-pre-line">{competition.prize}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Persyaratan Peserta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{competition.requirements}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Penyelenggara</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <p>{competition.organizer}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jadwal Lomba</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Pendaftaran</p>
                        <p className="text-muted-foreground">
                          {formatDate(competition.registrationStartDate)} - {formatDate(competition.registrationEndDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Batas Pengumpulan</p>
                        <p className="text-muted-foreground">{formatDate(competition.submissionDeadline)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Pengumuman Pemenang</p>
                        <p className="text-muted-foreground">{formatDate(competition.announcementDate)}</p>
                      </div>
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
                <CardTitle>Daftar Lomba</CardTitle>
                <CardDescription>
                  {competition.status === 'completed' 
                    ? 'Lomba ini telah selesai' 
                    : competition.status === 'upcoming' 
                      ? `Pendaftaran dibuka: ${formatDate(competition.registrationStartDate)}`
                      : 'Pendaftaran sedang berlangsung'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <a 
                  href={competition.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full"
                >
                  <Button 
                    className="w-full" 
                    disabled={competition.status === 'completed'}
                  >
                    {competition.status === 'completed' 
                      ? 'Pendaftaran Ditutup' 
                      : 'Daftar Sekarang'
                    }
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                
                {isAuthenticated && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={toggleSubscription}
                  >
                    {isSubscribed ? (
                      <><BellOff className="h-4 w-4 mr-2" /> Berhenti Berlangganan</>
                    ) : (
                      <><Bell className="h-4 w-4 mr-2" /> Langganan Kategori</>
                    )}
                  </Button>
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
                  <Link to={`/competitions/edit/${competition.id}`}>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" /> Edit Lomba
                    </Button>
                  </Link>
                )}

                {user?.role === 'admin' && !competition.approved && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full">
                        Setujui Lomba
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Setujui Lomba</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menyetujui lomba ini? Lomba yang disetujui akan ditampilkan kepada semua pengguna.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction>Setujui</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
            
            {/* Important dates card */}
            <Card>
              <CardHeader>
                <CardTitle>Tanggal Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-start text-sm">
                  <span>Mulai Pendaftaran:</span>
                  <span className="font-medium">{formatDate(competition.registrationStartDate)}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span>Tutup Pendaftaran:</span>
                  <span className="font-medium">{formatDate(competition.registrationEndDate)}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span>Batas Pengumpulan:</span>
                  <span className="font-medium">{formatDate(competition.submissionDeadline)}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span>Pengumuman:</span>
                  <span className="font-medium">{formatDate(competition.announcementDate)}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Related competitions */}
            <Card>
              <CardHeader>
                <CardTitle>Lomba Terkait</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/competitions" className="block">
                    <Button variant="link" className="p-0 h-auto">
                      Lihat Semua Lomba
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

export default CompetitionDetail;