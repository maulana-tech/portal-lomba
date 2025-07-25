import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '@/lib/context/community-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  PlusCircle,
  Users,
  ThumbsUp,
  User
} from 'lucide-react';
import { ForumPost, TeamRequest } from '@/types';

interface FilterOptions {
  search: string;
  tag: string;
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

const Community = () => {
  const { forumPosts, teamRequests } = useCommunity();
  const { isAuthenticated } = useAuth();
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TeamRequest[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    tag: '',
  });
  const [activeTab, setActiveTab] = useState('forum');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique tags from forum posts
    const allTags = forumPosts.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(allTags)).sort();
    setAvailableTags(uniqueTags);

    // Extract unique skills from team requests
    const allSkills = teamRequests.flatMap(request => request.requiredSkills);
    const uniqueSkills = Array.from(new Set(allSkills)).sort();
    setAvailableSkills(uniqueSkills);

    // Filter forum posts
    let postsResult = [...forumPosts];
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      postsResult = postsResult.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.tag && activeTab === 'forum') {
      postsResult = postsResult.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === filters.tag.toLowerCase())
      );
    }
    // Sort posts by date (newest first)
    postsResult.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setFilteredPosts(postsResult);

    // Filter team requests
    let requestsResult = [...teamRequests];
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      requestsResult = requestsResult.filter(request => 
        request.projectTitle.toLowerCase().includes(searchTerm) || 
        request.description.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.tag && activeTab === 'team-search') {
      requestsResult = requestsResult.filter(request => 
        request.requiredSkills.some(skill => skill.toLowerCase() === filters.tag.toLowerCase())
      );
    }
    // Sort requests by date (newest first)
    requestsResult.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setFilteredRequests(requestsResult);
  }, [forumPosts, teamRequests, filters, activeTab]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      tag: '',
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset tag filter when changing tabs
    setFilters(prev => ({ ...prev, tag: '' }));
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Komunitas Mahasiswa</h1>
            <p className="text-muted-foreground">
              Diskusikan, berbagi pengetahuan, dan terhubung dengan mahasiswa lain
            </p>
          </div>
          {isAuthenticated && (
            <div className="flex flex-wrap gap-2">
              <Link to="/community/new-post">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" /> Buat Postingan
                </Button>
              </Link>
              <Link to="/team-search/new">
                <Button>
                  <Users className="h-4 w-4 mr-2" /> Cari Anggota Tim
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with filters */}
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
                      placeholder={activeTab === 'forum' ? "Cari diskusi..." : "Cari pencarian tim..."}
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                
                {activeTab === 'forum' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tag</label>
                    <div className="flex flex-wrap gap-1">
                      {filters.tag ? (
                        <>
                          <Badge className="cursor-pointer" onClick={() => handleFilterChange('tag', '')}>
                            {filters.tag} ✕
                          </Badge>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Pilih tag di bawah</p>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'team-search' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keahlian yang Dicari</label>
                    <div className="flex flex-wrap gap-1">
                      {filters.tag ? (
                        <>
                          <Badge className="cursor-pointer" onClick={() => handleFilterChange('tag', '')}>
                            {filters.tag} ✕
                          </Badge>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Pilih keahlian di bawah</p>
                      )}
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetFilters}
                >
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
            
            {/* Popular tags or skills */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'forum' ? 'Tag Populer' : 'Keahlian yang Dicari'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {activeTab === 'forum' ? (
                    availableTags.length > 0 ? (
                      availableTags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant={filters.tag === tag ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => handleFilterChange('tag', tag === filters.tag ? '' : tag)}
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Belum ada tag</p>
                    )
                  ) : (
                    availableSkills.length > 0 ? (
                      availableSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant={filters.tag === skill ? "default" : "outline"} 
                          className="cursor-pointer"
                          onClick={() => handleFilterChange('tag', skill === filters.tag ? '' : skill)}
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Belum ada keahlian yang dicari</p>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="forum" onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="forum">Forum Diskusi</TabsTrigger>
                <TabsTrigger value="team-search">Pencarian Tim</TabsTrigger>
              </TabsList>
              
              {/* Forum Posts */}
              <TabsContent value="forum" className="space-y-4">
                {!isAuthenticated && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-center">
                      <Link to="/login" className="font-medium text-primary hover:underline">Masuk</Link> atau <Link to="/register" className="font-medium text-primary hover:underline">Daftar</Link> untuk membuat postingan dan berpartisipasi dalam diskusi.
                    </p>
                  </div>
                )}
                
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">
                            <Link 
                              to={`/community/post/${post.id}`}
                              className="hover:text-primary hover:underline transition-colors"
                            >
                              {post.title}
                            </Link>
                          </CardTitle>
                        </div>
                        <CardDescription>
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                              {post.author.avatar ? (
                                <img 
                                  src={post.author.avatar} 
                                  alt={post.author.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <span>{post.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3 text-sm mb-3">
                          {post.content.replace(/[#*]/g, '')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleFilterChange('tag', tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1.5" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            <span>{post.comments.length} komentar</span>
                          </div>
                        </div>
                        <Link to={`/community/post/${post.id}`}>
                          <Button variant="ghost" size="sm">Baca Selengkapnya</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Tidak Ada Postingan Ditemukan</h3>
                    <p className="text-muted-foreground mb-6">
                      {filters.search || filters.tag 
                        ? 'Tidak ada postingan yang sesuai dengan filter yang dipilih.' 
                        : 'Belum ada postingan di forum. Jadilah yang pertama membuat postingan!'}
                    </p>
                    {(filters.search || filters.tag) && (
                      <Button variant="outline" onClick={handleResetFilters}>
                        Reset Filter
                      </Button>
                    )}
                    {isAuthenticated && !filters.search && !filters.tag && (
                      <Link to="/community/new-post">
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" /> Buat Postingan Baru
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
                
                {filteredPosts.length > 0 && isAuthenticated && (
                  <div className="pt-6">
                    <Link to="/community/new-post">
                      <Button className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" /> Buat Postingan Baru
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              {/* Team Search */}
              <TabsContent value="team-search" className="space-y-4">
                {!isAuthenticated && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <p className="text-center">
                      <Link to="/login" className="font-medium text-primary hover:underline">Masuk</Link> atau <Link to="/register" className="font-medium text-primary hover:underline">Daftar</Link> untuk membuat pencarian tim dan berpartisipasi dalam kolaborasi proyek.
                    </p>
                  </div>
                )}
                
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              <Link 
                                to={`/team-search/${request.id}`}
                                className="hover:text-primary hover:underline transition-colors"
                              >
                                {request.projectTitle}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center">
                                <span>{request.userName}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDate(request.createdAt)}</span>
                                {request.deadline && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>Deadline: {formatDate(request.deadline)}</span>
                                  </>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge>{request.positionsOpen} posisi</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3 text-sm mb-4">
                          {request.description}
                        </p>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Keahlian yang Dibutuhkan:</h4>
                          <div className="flex flex-wrap gap-1">
                            {request.requiredSkills.map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => handleFilterChange('tag', skill)}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/team-search/${request.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Lihat Detail
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Tidak Ada Pencarian Tim</h3>
                    <p className="text-muted-foreground mb-6">
                      {filters.search || filters.tag 
                        ? 'Tidak ada pencarian tim yang sesuai dengan filter yang dipilih.' 
                        : 'Belum ada pencarian tim. Buat pencarian untuk menemukan anggota tim baru!'}
                    </p>
                    {(filters.search || filters.tag) && (
                      <Button variant="outline" onClick={handleResetFilters}>
                        Reset Filter
                      </Button>
                    )}
                    {isAuthenticated && !filters.search && !filters.tag && (
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;