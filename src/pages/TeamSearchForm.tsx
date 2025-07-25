import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '@/lib/context/community-context';
import { useAuth } from '@/lib/context/auth-context';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { id } from 'date-fns/locale';

// Form validation schema
const formSchema = z.object({
  projectTitle: z.string().min(5, 'Judul proyek minimal 5 karakter').max(100, 'Judul proyek maksimal 100 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter').max(2000, 'Deskripsi maksimal 2000 karakter'),
  requiredSkills: z.string().min(3, 'Masukkan minimal satu keahlian'),
  positionsOpen: z.coerce.number().int().min(1, 'Minimal 1 posisi tersedia').max(20, 'Maksimal 20 posisi'),
  projectType: z.string().min(1, 'Pilih tipe proyek'),
  deadline: z.date().optional(),
  contactInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TeamSearchForm = () => {
  const { addTeamRequest } = useCommunity();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectTitle: '',
      description: '',
      requiredSkills: '',
      positionsOpen: 1,
      projectType: '',
      contactInfo: '',
    },
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login', { replace: true });
    return null;
  }

  const onSubmit = (values: FormValues) => {
    setSubmitting(true);
    
    try {
      // Parse comma-separated skills into array
      const skillsArray = values.requiredSkills.split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      // Add team request
      addTeamRequest({
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || '',
        projectTitle: values.projectTitle,
        description: values.description,
        requiredSkills: skillsArray,
        positionsOpen: values.positionsOpen,
        projectType: values.projectType,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
        contactInfo: values.contactInfo,
        createdAt: new Date().toISOString(),
        applicants: [],
      });
      
      navigate('/team-search');
    } catch (error) {
      console.error('Failed to create team request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cari Anggota Tim</h1>
          <p className="text-muted-foreground mt-2">
            Buat pengumuman untuk mencari anggota tim yang sesuai dengan kebutuhan proyek Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pencarian Tim</CardTitle>
                <CardDescription>
                  Berikan informasi yang jelas tentang proyek dan anggota tim yang Anda cari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Judul Proyek</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Aplikasi Manajemen Perpustakaan" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi Proyek</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Jelaskan tentang proyek Anda, tujuan, dan jenis kontribusi yang Anda harapkan dari anggota tim" 
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="requiredSkills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keahlian yang Dibutuhkan</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Contoh: React, Node.js, UI/UX Design (pisahkan dengan koma)" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="positionsOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Posisi</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={1} 
                                max={20}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipe Proyek</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih tipe proyek" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="mobile-app">Aplikasi Mobile</SelectItem>
                                <SelectItem value="desktop-app">Aplikasi Desktop</SelectItem>
                                <SelectItem value="game">Game</SelectItem>
                                <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                                <SelectItem value="iot">Internet of Things</SelectItem>
                                <SelectItem value="research">Penelitian</SelectItem>
                                <SelectItem value="other">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Deadline Pendaftaran (Opsional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: id })
                                    ) : (
                                      <span>Pilih tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Informasi Kontak Tambahan (Opsional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Email, Discord, dll." 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate(-1)}
                      >
                        Batal
                      </Button>
                      <Button 
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? 'Menyimpan...' : 'Publikasikan Pencarian'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Tips */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tips Mencari Anggota Tim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Berikan Detail yang Jelas</h3>
                  <p className="text-sm text-muted-foreground">
                    Jelaskan proyek Anda dengan baik agar calon anggota tim dapat memahami visi dan misi proyek.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Spesifikasikan Keahlian</h3>
                  <p className="text-sm text-muted-foreground">
                    Sebutkan keahlian teknis atau non-teknis yang dibutuhkan dengan spesifik.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Jadilah Realistis</h3>
                  <p className="text-sm text-muted-foreground">
                    Tentukan jumlah anggota tim yang sesuai dengan kebutuhan dan skala proyek.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Tetapkan Tenggat Waktu</h3>
                  <p className="text-sm text-muted-foreground">
                    Jika ada deadline spesifik untuk proyek, sebutkan untuk membantu calon anggota menilai ketersediaan mereka.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Pencarian tim akan aktif selama 30 hari</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamSearchForm;