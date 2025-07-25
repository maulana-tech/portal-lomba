import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '@/lib/context/community-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  PlusCircle,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { TeamRequest } from '@/types';

interface FilterOptions {
  search: string;
  skill: string;
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

const TeamSearch = () => {
  const { teamRequests } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [filteredRequests, setFilteredRequests] = useState<TeamRequest[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    skill: '',
  });
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique skills from all team requests
    const allSkills = teamRequests.flatMap(request => request.requiredSkills);
    const uniqueSkills = Array.from(new Set(allSkills)).sort();
    setAvailableSkills(uniqueSkills);

    // Filter team requests based on current filters
    let result = [...teamRequests];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(request => 
        request.projectTitle.toLowerCase().includes(searchTerm) || 
        request.description.toLowerCase().includes(searchTerm) ||
        request.userName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by skill
    if (filters.skill) {
      result = result.filter(request => 
        request.requiredSkills.some(skill => 
          skill.toLowerCase().includes(filters.skill.toLowerCase())
        )
      );
    }

    // Sort by creation date (newest first)
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredRequests(result);
  }, [teamRequests, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      skill: '',
    });
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Cari Anggota Tim</h1>
            <p className="text-muted-foreground">
              Temukan rekan tim untuk proyek Anda atau gabung dengan proyek yang menarik
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/team-search/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Cari Anggota Tim
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
                      placeholder="Cari berdasarkan judul, deskripsi..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Keahlian yang Dicari</label>
                  <div className="flex flex-wrap gap-1">
                    {filters.skill ? (
                      <>
                        <Badge className="cursor-pointer" onClick={() => handleFilterChange('skill', '')}>
                          {filters.skill} ✕
                        </Badge>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pilih keahlian di bawah</p>
                    )}
                  </div>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Keahlian yang Dicari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {availableSkills.length > 0 ? (
                    availableSkills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant={filters.skill === skill ? "default" : "outline"} 
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('skill', skill === filters.skill ? '' : skill)}
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada keahlian yang dicari</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {!isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Bergabung Sekarang</CardTitle>
                  <CardDescription>
                    Daftar untuk mulai mencari anggota tim atau bergabung dengan proyek menarik
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/register">
                    <Button className="w-full">Daftar</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Masuk</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Team requests listing */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold mb-4">
              {filteredRequests.length} Pencarian Tim{filters.skill && ` untuk "${filters.skill}"`}
            </h2>
            
            {!isAuthenticated && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-center">
                  <Link to="/login" className="font-medium text-primary hover:underline">Masuk</Link> atau <Link to="/register" className="font-medium text-primary hover:underline">Daftar</Link> untuk membuat pencarian tim atau menghubungi pembuat pencarian.
                </p>
              </div>
            )}
            
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id}>
                    <div className="md:flex">
                      <div className="md:flex-grow p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Link 
                                to={`/team-search/${request.id}`}
                                className="hover:text-primary hover:underline transition-colors"
                              >
                                {request.projectTitle}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-2">
                              <span>Oleh {request.userName}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(request.createdAt)}</span>
                            </p>
                          </div>
                          <Badge>{request.positionsOpen} posisi</Badge>
                        </div>
                        
                        <p className="line-clamp-2 mb-4 text-sm">
                          {request.description}
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1.5">Keahlian yang Dibutuhkan:</h4>
                            <div className="flex flex-wrap gap-1">
                              {request.requiredSkills.map((skill, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline"
                                  className="cursor-pointer"
                                  onClick={() => handleFilterChange('skill', skill)}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {request.deadline && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              <span>Deadline: {formatDate(request.deadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-4 border-t md:border-t-0 md:border-l md:flex md:flex-col md:justify-center md:items-center md:w-40">
                        <Link to={`/team-search/${request.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Pencarian Tim Ditemukan</h3>
                <p className="text-muted-foreground mb-6">
                  {filters.search || filters.skill 
                    ? 'Tidak ada pencarian tim yang sesuai dengan filter yang dipilih.' 
                    : 'Belum ada pencarian tim. Buat pencarian untuk menemukan anggota tim baru!'}
                </p>
                {(filters.search || filters.skill) && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Reset Filter
                  </Button>
                )}
                {isAuthenticated && !filters.search && !filters.skill && (
                  <Link to="/team-search/new">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" /> Buat Pencarian Tim
                    </Button>
                  </Link>
                )}
              </div>
            )}
            
            {filteredRequests.length > 0 && isAuthenticated && (
              <div className="pt-6">
                <Link to="/team-search/new">
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" /> Buat Pencarian Tim Baru
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamSearch;