import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/lib/context/projects-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bookmark,
  Search,
  Plus,
  Code,
  Star,
  Users,
  Calendar,
  Eye,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { Project, ProjectCategory } from '@/types';

interface FilterOptions {
  search: string;
  category: string;
  technology: string;
}

const projectCategories: ProjectCategory[] = [
  'Web Development', 
  'Mobile App', 
  'AI/ML', 
  'IoT', 
  'Game Development', 
  'Graphic Design', 
  'Other'
];

const Projects = () => {
  const { projects } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    technology: '',
  });

  useEffect(() => {
    // Extract unique technologies from all projects
    const allTechnologies = projects.flatMap(project => project.technologies);
    const uniqueTechnologies = Array.from(new Set(allTechnologies)).sort();
    setTechnologies(uniqueTechnologies);

    // Filter projects based on current filters
    let result = [...projects];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(proj => 
        proj.title.toLowerCase().includes(searchTerm) || 
        proj.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(proj => proj.category === filters.category);
    }

    // Filter by technology
    if (filters.technology && filters.technology !== 'all') {
      result = result.filter(proj => 
        proj.technologies.some(tech => 
          tech.toLowerCase().includes(filters.technology.toLowerCase())
        )
      );
    }

    // Sort projects by rating (highest first)
    result.sort((a, b) => {
      const avgRatingA = a.ratings.length ? a.ratings.reduce((acc, r) => acc + r.rating, 0) / a.ratings.length : 0;
      const avgRatingB = b.ratings.length ? b.ratings.reduce((acc, r) => acc + r.rating, 0) / b.ratings.length : 0;
      return avgRatingB - avgRatingA;
    });

    setFilteredProjects(result);
  }, [projects, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      technology: '',
    });
  };

  const categoryLabel = (category: ProjectCategory) => {
    switch (category) {
      case 'Web Development': return 'Pengembangan Web';
      case 'Mobile App': return 'Aplikasi Mobile';
      case 'AI/ML': return 'AI/Machine Learning';
      case 'IoT': return 'Internet of Things';
      case 'Game Development': return 'Pengembangan Game';
      case 'Graphic Design': return 'Desain Grafis';
      case 'Other': return 'Lainnya';
      default: return category;
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
          <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Showcase Proyek
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Jelajahi proyek-proyek kreatif dan inovatif dari mahasiswa. Temukan inspirasi dan kolaborasi dalam ekosistem teknologi yang berkembang.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    <span>{filteredProjects.length} proyek tersedia</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{projects.reduce((acc, p) => acc + p.members.length, 0)} anggota aktif</span>
                  </div>
                </div>
              </div>
              {isAuthenticated && (
                <Link to="/projects/new">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                    <Plus className="h-5 w-5 mr-2" /> 
                    Tambah Proyek
                  </Button>
                </Link>
              )}
            </div>
          </div>
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
                      placeholder="Cari proyek..."
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
                      {projectCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teknologi</label>
                  <Select
                    value={filters.technology}
                    onValueChange={(value) => handleFilterChange('technology', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Teknologi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Teknologi</SelectItem>
                      {technologies.map((tech) => (
                        <SelectItem key={tech} value={tech}>{tech}</SelectItem>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectCategories.map((category) => (
                    <Button 
                      key={category} 
                      variant={filters.category === category ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => handleFilterChange('category', category === filters.category ? '' : category)}
                    >
                      {categoryLabel(category)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Project listing */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold mb-4">
              Proyek{filters.category && ` - ${categoryLabel(filters.category as ProjectCategory)}`}
            </h2>
            
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="group overflow-hidden h-full flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-gray-800/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    {/* Enhanced Image Section */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            console.log('Image failed to load:', project.images[0]);
                            const target = e.target as HTMLImageElement;
                            target.src = '';
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
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Tidak ada gambar</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Floating badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-white/90 dark:bg-black/90 text-foreground border-0 shadow-lg backdrop-blur-sm">
                          {project.category}
                        </Badge>
                        {project.status === 'completed' && (
                          <Badge variant="secondary" className="bg-green-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                            Selesai
                          </Badge>
                        )}
                      </div>
                      
                      {/* Rating overlay */}
                      {project.ratings.length > 0 && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-semibold">
                              {(project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="pb-4">
                      <div className="space-y-3">
                        <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        
                        {/* Enhanced Rating Display */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {project.ratings.length > 0 ? (
                              <>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => {
                                    const avgRating = project.ratings.reduce((acc, r) => acc + r.rating, 0) / project.ratings.length;
                                    return (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                      />
                                    );
                                  })}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ({project.ratings.length} {project.ratings.length > 1 ? 'penilaian' : 'penilaian'})
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Star className="h-4 w-4 text-gray-300" />
                                Belum ada penilaian
                              </span>
                            )}
                          </div>
                          
                          {/* Project Status */}
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(project.createdAt).toLocaleDateString('id-ID', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-4 flex-grow space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Enhanced Technologies */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Code className="h-3 w-3" />
                          <span>Teknologi</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
                            >
                              +{project.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-4 border-t border-white/20 dark:border-gray-800/20">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 4).map((member, i) => (
                            <div 
                              key={i} 
                              className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800 shadow-sm"
                              title={member.name}
                            >
                              {member.avatar ? (
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                member.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                          {project.members.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800 shadow-sm">
                              +{project.members.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{project.members.length} anggota</span>
                        </div>
                      </div>
                      
                      <Link to={`/projects/${project.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg group-hover:shadow-xl transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
                  <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-gray-800/20">
                    <Bookmark className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      Tidak Ada Proyek Ditemukan
                    </h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                      Tidak ada proyek yang sesuai dengan filter yang dipilih. Coba ubah filter atau reset untuk melihat semua proyek.
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                      onClick={handleResetFilters}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reset Filter
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="py-12 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl" />
                  <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-gray-800/20">
                    <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      Punya Proyek Untuk Ditampilkan?
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                      Tampilkan proyek Anda dan dapatkan pengakuan dari komunitas mahasiswa dan dosen. 
                      Bagikan kreativitas dan inovasi Anda dengan dunia!
                    </p>
                    <Link to="/projects/new">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-5 w-5 mr-2" /> 
                        Tambahkan Proyek Anda
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;