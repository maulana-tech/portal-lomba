import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompetitions } from '@/lib/context/competitions-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Trophy,
  Search,
  PlusCircle,
  Bell,
  BellOff
} from 'lucide-react';
import { Competition, CompetitionCategory, CompetitionLevel, CompetitionStatus } from '@/types';

interface FilterOptions {
  search: string;
  category: string;
  status: string;
  level: string;
}

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

const competitionCategories: CompetitionCategory[] = ['IT', 'Design', 'Business', 'Science', 'Engineering', 'Arts', 'Other'];
const competitionStatuses: CompetitionStatus[] = ['upcoming', 'ongoing', 'completed'];
const competitionLevels: CompetitionLevel[] = ['national', 'international'];

const Competitions = () => {
  const { competitions, subscribeToCategory, unsubscribeFromCategory, subscribedCategories } = useCompetitions();
  const { user, isAuthenticated } = useAuth();
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    status: '',
    level: '',
  });
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    // Filter competitions based on current filters
    let result = competitions.filter(comp => comp.approved);

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(comp => 
        comp.title.toLowerCase().includes(searchTerm) || 
        comp.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(comp => comp.category === filters.category);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      result = result.filter(comp => comp.status === filters.status);
    }

    // Filter by level
    if (filters.level && filters.level !== 'all') {
      result = result.filter(comp => comp.level === filters.level);
    }

    // Apply tab filtering
    if (activeTab === 'subscribed' && isAuthenticated) {
      result = result.filter(comp => 
        subscribedCategories.includes(comp.category)
      );
    }

    // Sort competitions by registration date (upcoming first)
    result.sort((a, b) => {
      const dateA = new Date(a.registrationStartDate);
      const dateB = new Date(b.registrationStartDate);
      return dateA.getTime() - dateB.getTime();
    });

    setFilteredCompetitions(result);
  }, [competitions, filters, activeTab, subscribedCategories, isAuthenticated]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      level: '',
    });
  };

  const toggleSubscription = (category: string) => {
    if (subscribedCategories.includes(category)) {
      unsubscribeFromCategory(category);
    } else {
      subscribeToCategory(category);
    }
  };

  const isCategorySubscribed = (category: string) => {
    return subscribedCategories.includes(category);
  };

  const statusLabel = (status: CompetitionStatus) => {
    switch (status) {
      case 'upcoming': return 'Akan Datang';
      case 'ongoing': return 'Sedang Berlangsung';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  const levelLabel = (level: CompetitionLevel) => {
    switch (level) {
      case 'national': return 'Nasional';
      case 'international': return 'Internasional';
      default: return level;
    }
  };

  const categoryLabel = (category: CompetitionCategory) => {
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

  const statusBadgeVariant = (status: CompetitionStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'secondary';
      case 'completed': return 'outline';
      default: return 'default';
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portal Lomba</h1>
            <p className="text-muted-foreground">
              Temukan informasi lomba terbaru untuk mahasiswa
            </p>
          </div>
          {(user?.role === 'lecturer' || user?.role === 'admin') && (
            <Link to="/competitions/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Tambah Lomba
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pencarian</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari lomba..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {competitionCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      {competitionStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tingkat</label>
                  <Select
                    value={filters.level}
                    onValueChange={(value) => handleFilterChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Tingkat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tingkat</SelectItem>
                      {competitionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {levelLabel(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetFilters}
                >
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
            
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Kategori Berlangganan</CardTitle>
                  <CardDescription>
                    Dapatkan notifikasi untuk lomba pada kategori yang Anda pilih
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {competitionCategories.map((category) => (
                      <div key={category} className="flex justify-between items-center">
                        <span>{categoryLabel(category)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleSubscription(category)}
                        >
                          {isCategorySubscribed(category) ? (
                            <><Bell className="h-4 w-4 mr-2 text-primary" /> Berlangganan</>
                          ) : (
                            <><BellOff className="h-4 w-4 mr-2" /> Langganan</>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Competition listing */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Semua Lomba</TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="subscribed">Berlangganan</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  Lomba Terbaru{filters.category && ` - ${categoryLabel(filters.category as CompetitionCategory)}`}
                </h2>
                {filteredCompetitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCompetitions.map((competition) => (
                      <Card key={competition.id} className="overflow-hidden h-full flex flex-col">
                        <div className="h-40 bg-gray-100 flex items-center justify-center">
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
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg line-clamp-1">{competition.title}</CardTitle>
                            <Badge variant={statusBadgeVariant(competition.status)}>
                              {statusLabel(competition.status)}
                            </Badge>
                          </div>
                          <CardDescription className="flex flex-wrap gap-2">
                            <Badge variant="outline">{levelLabel(competition.level)}</Badge>
                            <Badge variant="secondary">{categoryLabel(competition.category)}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {competition.description}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" /> 
                              <span className="font-medium">Pendaftaran:</span>
                              <span className="ml-1">{formatDate(competition.registrationStartDate)} - {formatDate(competition.registrationEndDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" /> 
                              <span className="font-medium">Deadline:</span>
                              <span className="ml-1">{formatDate(competition.submissionDeadline)}</span>
                            </div>
                          </div>
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
                  <div className="py-12 text-center">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Tidak Ada Lomba Ditemukan</h3>
                    <p className="text-muted-foreground">
                      Tidak ada lomba yang sesuai dengan filter yang dipilih.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                      Reset Filter
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="subscribed" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  Lomba pada Kategori Berlangganan
                </h2>
                {filteredCompetitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCompetitions.map((competition) => (
                      <Card key={competition.id} className="overflow-hidden h-full flex flex-col">
                        <div className="h-40 bg-gray-100 flex items-center justify-center">
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
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg line-clamp-1">{competition.title}</CardTitle>
                            <Badge variant={statusBadgeVariant(competition.status)}>
                              {statusLabel(competition.status)}
                            </Badge>
                          </div>
                          <CardDescription className="flex flex-wrap gap-2">
                            <Badge variant="outline">{levelLabel(competition.level)}</Badge>
                            <Badge variant="secondary">{categoryLabel(competition.category)}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {competition.description}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" /> 
                              <span className="font-medium">Pendaftaran:</span>
                              <span className="ml-1">{formatDate(competition.registrationStartDate)} - {formatDate(competition.registrationEndDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" /> 
                              <span className="font-medium">Deadline:</span>
                              <span className="ml-1">{formatDate(competition.submissionDeadline)}</span>
                            </div>
                          </div>
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
                  <div className="py-12 text-center">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Tidak Ada Lomba Berlangganan</h3>
                    <p className="text-muted-foreground">
                      Anda belum berlangganan kategori lomba atau tidak ada lomba pada kategori berlangganan Anda.
                    </p>
                    <div className="mt-4">
                      <Link to="/competitions">
                        <Button variant="outline">
                          Jelajahi Semua Lomba
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Competitions;