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
  Star
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Showcase Proyek</h1>
            <p className="text-muted-foreground">
              Jelajahi proyek-proyek kreatif dan inovatif dari mahasiswa
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Tambah Proyek
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
                  <Card key={project.id} className="overflow-hidden h-full flex flex-col">
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
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
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
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline">+{project.technologies.length - 3}</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex -space-x-2 mr-2">
                          {project.members.slice(0, 3).map((member, i) => (
                            <div 
                              key={i} 
                              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-background"
                              title={member.name}
                            >
                              {member.avatar ? (
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                member.name.charAt(0)
                              )}
                            </div>
                          ))}
                          {project.members.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-background">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                        <span>{project.members.length} anggota</span>
                      </div>
                      <Link to={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">Lihat</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Proyek Ditemukan</h3>
                <p className="text-muted-foreground">
                  Tidak ada proyek yang sesuai dengan filter yang dipilih.
                </p>
                <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                  Reset Filter
                </Button>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="py-8 text-center border-t mt-12">
                <h3 className="text-xl font-semibold mb-4">Punya Proyek Untuk Ditampilkan?</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Tampilkan proyek Anda dan dapatkan pengakuan dari komunitas mahasiswa dan dosen.
                </p>
                <Link to="/projects/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Tambahkan Proyek Anda
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

export default Projects;