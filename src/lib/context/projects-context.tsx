import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectCategory, Rating, User, ProjectComment } from '@/types';

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ratings' | 'comments'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  filterProjects: (filters: ProjectFilters) => Project[];
  addRating: (projectId: string, rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  rateProject: (projectId: string, userId: string, rating: number) => Promise<void>;
  addComment: (projectId: string, comment: Omit<ProjectComment, 'id' | 'createdAt'>) => Promise<void>;
}

interface ProjectFilters {
  category?: ProjectCategory;
  technology?: string;
  search?: string;
  memberId?: string;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

// Sample users for the projects
const sampleUsers = [
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    role: 'student' as const,
    university: 'University of Example',
    faculty: 'Computer Science',
    skills: ['React', 'JavaScript', 'UI/UX'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'student' as const,
    university: 'University of Example',
    faculty: 'Computer Science',
    skills: ['Python', 'Machine Learning', 'Data Science'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'student' as const,
    university: 'University of Example',
    faculty: 'Computer Science',
    skills: ['React Native', 'Firebase', 'Mobile Development'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Initial projects data for demo
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'EduConnect - Platform Pembelajaran Online',
    description: 'Aplikasi web yang menghubungkan mahasiswa dengan konten pembelajaran interaktif.',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    images: ['/images/projects/EduConnect-Image.png'],
    videoLink: 'https://youtube.com/example',
    repositoryLink: 'https://github.com/example/educonnect',
    demoLink: 'https://educonnect-demo.example.com',
    members: [sampleUsers[0], sampleUsers[1]],
    ownerId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'completed',
    features: [
      'Dashboard interaktif untuk mahasiswa',
      'Sistem manajemen konten pembelajaran',
      'Forum diskusi real-time',
      'Sistem penilaian otomatis'
    ],
    challenges: 'Implementasi real-time features dan optimasi performa untuk jumlah pengguna yang besar.',
    futureImprovements: 'Integrasi AI untuk personalisasi pembelajaran dan penambahan fitur mobile app.',
    comments: [
      {
        id: 'c1',
        userId: '3',
        userName: 'Lecturer User',
        userAvatar: '/assets/avatars/lecturer.jpg',
        content: 'Proyek yang sangat bagus! Implementasi yang solid dan UI yang user-friendly.',
        createdAt: new Date()
      }
    ],
    ratings: [
      {
        id: 'r1',
        userId: '3',
        userName: 'Lecturer User',
        projectId: '1',
        rating: 4.5,
        comment: 'Proyek yang bagus dengan implementasi yang baik. Antarmuka pengguna sangat intuitif.',
        createdAt: new Date()
      }
    ]
  },
  {
    id: '2',
    title: 'SmartAgri - Aplikasi IoT untuk Pertanian',
    description: 'Sistem IoT untuk memantau dan mengoptimalkan proses pertanian dengan sensor dan machine learning.',
    category: 'IoT',
    technologies: ['Arduino', 'Python', 'TensorFlow', 'React Native'],
    images: ['/images/projects/SmartAgri-IoT-for-Agriculture.png'],
    repositoryLink: 'https://github.com/example/smartagri',
    members: [sampleUsers[1], sampleUsers[2]],
    ownerId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'in-progress',
    features: [
      'Monitoring sensor real-time',
      'Prediksi cuaca dan kondisi tanah',
      'Rekomendasi perawatan tanaman',
      'Dashboard analitik'
    ],
    challenges: 'Integrasi berbagai sensor dan pengembangan algoritma ML yang akurat.',
    futureImprovements: 'Integrasi dengan drone untuk monitoring area yang lebih luas.',
    comments: [],
    ratings: []
  },
  {
    id: '3',
    title: 'VirtualTour - Aplikasi VR untuk Wisata',
    description: 'Aplikasi mobile yang menyediakan pengalaman wisata virtual dengan teknologi AR/VR.',
    category: 'Mobile App',
    technologies: ['Unity', 'ARKit', 'ARCore', 'C#'],
    images: ['/images/projects/Virtual-Tour-500x500.png'],
    videoLink: 'https://youtube.com/example-vr',
    repositoryLink: 'https://github.com/example/virtualtour',
    demoLink: 'https://virtualtour-demo.example.com',
    members: [sampleUsers[2]],
    ownerId: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'completed',
    features: [
      'Pengalaman VR immersive',
      'Tour virtual 360°',
      'Informasi wisata interaktif',
      'Sharing ke social media'
    ],
    challenges: 'Optimasi performa untuk device mobile dan pengembangan konten VR yang menarik.',
    futureImprovements: 'Integrasi dengan AI untuk personalisasi tour dan penambahan fitur multiplayer.',
    comments: [
      {
        id: 'c2',
        userId: '1',
        userName: 'Admin User',
        userAvatar: '/assets/avatars/admin.jpg',
        content: 'Konsep yang sangat inovatif! Implementasi AR/VR yang smooth.',
        createdAt: new Date()
      }
    ],
    ratings: [
      {
        id: 'r2',
        userId: '1',
        userName: 'Admin User',
        projectId: '3',
        rating: 5.0,
        comment: 'Implementasi AR/VR yang sangat menarik dan inovatif.',
        createdAt: new Date()
      },
      {
        id: 'r3',
        userId: '3',
        userName: 'Lecturer User',
        projectId: '3',
        rating: 4.8,
        comment: 'Konsep yang unik dan eksekusi yang sangat baik.',
        createdAt: new Date()
      }
    ]
  },
  {
    id: '4',
    title: 'AI Chatbot Assistant',
    description: 'Intelligent chatbot powered by machine learning for customer support and assistance.',
    category: 'AI/ML',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    images: ['/images/projects/student-portal.svg'],
    videoLink: 'https://youtube.com/example-ai',
    repositoryLink: 'https://github.com/example/ai-chatbot',
    demoLink: 'https://ai-chatbot-demo.example.com',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    ownerId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'completed',
    features: [
      'Natural language processing',
      'Context-aware conversations',
      'Multi-language support',
      'Real-time response system'
    ],
    challenges: 'Implementing accurate NLP models and maintaining conversation context across sessions.',
    futureImprovements: 'Integration with voice recognition and advanced sentiment analysis.',
    comments: [
      {
        id: 'c3',
        userId: '4',
        userName: 'Jane Doe',
        userAvatar: '/assets/avatars/jane.jpg',
        content: 'Amazing AI implementation! The chatbot responses are very natural and helpful.',
        createdAt: new Date()
      }
    ],
    ratings: [
      {
        id: 'r4',
        userId: '4',
        userName: 'Jane Doe',
        projectId: '4',
        rating: 4.9,
        comment: 'Excellent AI implementation with great user experience.',
        createdAt: new Date()
      }
    ]
  },
  {
    id: '5',
    title: 'Adventure Quest Game',
    description: 'Epic RPG adventure game with immersive storytelling and dynamic gameplay.',
    category: 'Game Development',
    technologies: ['Unity', 'C#', 'Blender', 'Photoshop'],
    images: ['/images/projects/game-dev.svg'],
    videoLink: 'https://youtube.com/example-game',
    repositoryLink: 'https://github.com/example/adventure-quest',
    demoLink: 'https://adventure-quest-demo.example.com',
    members: [sampleUsers[2]],
    ownerId: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'in-progress',
    features: [
      'Open world exploration',
      'Dynamic combat system',
      'Character progression',
      'Multiplayer support'
    ],
    challenges: 'Optimizing game performance and creating engaging content for long gameplay sessions.',
    futureImprovements: 'Adding VR support and expanding the game world with new quests.',
    comments: [],
    ratings: []
  }
];

interface ProjectsProviderProps {
  children: React.ReactNode;
}

export const ProjectsProvider = ({ children }: ProjectsProviderProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load projects from localStorage or use initial data
    try {
      const storedProjects = localStorage.getItem('projects');
      console.log('Stored projects:', storedProjects);
      
      // Check if we need to reset data due to schema changes
      const dataVersion = localStorage.getItem('projects_version');
      const currentVersion = '1.2'; // Update this when making schema changes
      
      if (storedProjects && dataVersion === currentVersion) {
        const parsedProjects = JSON.parse(storedProjects);
        console.log('Parsed projects:', parsedProjects);
        
        // Ensure dates are properly converted back to Date objects
        const projectsWithDates = parsedProjects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          ratings: project.ratings.map((rating: any) => ({
            ...rating,
            createdAt: new Date(rating.createdAt)
          })),
          comments: project.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }))
        }));
        console.log('Projects with dates:', projectsWithDates);
        setProjects(projectsWithDates);
      } else {
        console.log('No stored projects or version mismatch, using initial data');
        setProjects(initialProjects);
        localStorage.setItem('projects', JSON.stringify(initialProjects));
        localStorage.setItem('projects_version', currentVersion);
      }
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      // Fallback to initial data if localStorage fails
      setProjects(initialProjects);
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
    
    setLoading(false);
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (projects.length > 0) {
      try {
        localStorage.setItem('projects', JSON.stringify(projects));
        console.log('Saved projects to localStorage:', projects);
      } catch (error) {
        console.error('Error saving projects to localStorage:', error);
      }
    }
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ratings' | 'comments'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ratings: [],
      comments: []
    };
    
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id 
        ? { ...project, ...projectData, updatedAt: new Date() } 
        : project
    );
    
    setProjects(updatedProjects);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const filterProjects = (filters: ProjectFilters): Project[] => {
    return projects.filter(project => {
      // Filter by category
      if (filters.category && project.category !== filters.category) {
        return false;
      }
      
      // Filter by technology
      if (filters.technology && 
          !project.technologies.some(tech => 
            tech.toLowerCase().includes(filters.technology!.toLowerCase())
          )
      ) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && 
          !project.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !project.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      
      // Filter by member
      if (filters.memberId && 
          !project.members.some(member => member.id === filters.memberId)
      ) {
        return false;
      }
      
      return true;
    });
  };

  const addRating = (projectId: string, ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: `rating_${Date.now()}`,
      createdAt: new Date()
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          ratings: [...project.ratings, newRating]
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
  };

  const rateProject = async (projectId: string, userId: string, rating: number): Promise<void> => {
    return new Promise((resolve) => {
      // Find existing rating by this user
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        resolve();
        return;
      }

      const existingRatingIndex = project.ratings.findIndex(r => r.userId === userId);
      const user = project.members.find(m => m.id === userId) || { name: 'Anonymous User' };

      const newRating: Rating = {
        id: `rating_${Date.now()}`,
        userId,
        userName: user.name,
        projectId,
        rating,
        comment: '',
        createdAt: new Date()
      };

      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
          const updatedRatings = existingRatingIndex >= 0 
            ? p.ratings.map((r, index) => index === existingRatingIndex ? newRating : r)
            : [...p.ratings, newRating];
          
          return {
            ...p,
            ratings: updatedRatings
          };
        }
        return p;
      });

      setProjects(updatedProjects);
      resolve();
    });
  };

  const addComment = async (projectId: string, commentData: Omit<ProjectComment, 'id' | 'createdAt'>): Promise<void> => {
    return new Promise((resolve) => {
      const newComment: ProjectComment = {
        ...commentData,
        id: `comment_${Date.now()}`,
        createdAt: new Date()
      };

      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            comments: [...project.comments, newComment]
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      resolve();
    });
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        filterProjects,
        addRating,
        rateProject,
        addComment
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};