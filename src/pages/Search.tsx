import React, { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search as SearchIcon,
  Trophy,
  Bookmark,
  MessageSquare,
  Users,
  Filter
} from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Search StudentHub</h1>
            <p className="text-muted-foreground mb-6">
              Temukan lomba, proyek, diskusi forum, dan rekan tim yang Anda cari
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari lomba, proyek, atau topik yang Anda minati..."
                className="pl-12 h-12 text-base border-border/50 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                size="sm"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Search Categories */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="competitions">Lomba</TabsTrigger>
              <TabsTrigger value="projects">Proyek</TabsTrigger>
              <TabsTrigger value="community">Forum</TabsTrigger>
              <TabsTrigger value="teams">Tim</TabsTrigger>
            </TabsList>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <Trophy className="h-3 w-3 mr-1" />
                Lomba IT
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <Bookmark className="h-3 w-3 mr-1" />
                Web Development
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <MessageSquare className="h-3 w-3 mr-1" />
                React
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <Users className="h-3 w-3 mr-1" />
                Frontend
              </Badge>
            </div>

            {/* Search Results */}
            <TabsContent value="all" className="space-y-6">
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Mulai Pencarian</h3>
                <p className="text-muted-foreground">
                  Masukkan kata kunci untuk mencari lomba, proyek, forum, atau tim
                </p>
              </div>
            </TabsContent>

            <TabsContent value="competitions" className="space-y-4">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Cari Lomba</h3>
                <p className="text-muted-foreground">
                  Temukan kompetisi yang sesuai dengan minat dan keahlian Anda
                </p>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Cari Proyek</h3>
                <p className="text-muted-foreground">
                  Jelajahi proyek-proyek menarik dari mahasiswa lain
                </p>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-4">
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Cari Diskusi Forum</h3>
                <p className="text-muted-foreground">
                  Temukan topik diskusi yang relevan dengan minat Anda
                </p>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Cari Tim</h3>
                <p className="text-muted-foreground">
                  Bergabung dengan tim atau temukan anggota tim baru
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
