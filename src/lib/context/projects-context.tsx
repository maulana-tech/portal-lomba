import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectCategory, Rating, User } from '@/types';

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ratings'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  filterProjects: (filters: ProjectFilters) => Project[];
  addRating: (projectId: string, rating: Omit<Rating, 'id' | 'createdAt'>) => void;
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
    images: ['/assets/projects/educonnect1.jpg', '/assets/projects/educonnect2.jpg'],
    videoLink: 'https://youtube.com/example',
    repositoryLink: 'https://github.com/example/educonnect',
    demoLink: 'https://educonnect-demo.example.com',
    members: [sampleUsers[0], sampleUsers[1]],
    ownerId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    images: ['/assets/projects/smartagri1.jpg', '/assets/projects/smartagri2.jpg'],
    repositoryLink: 'https://github.com/example/smartagri',
    members: [sampleUsers[1], sampleUsers[2]],
    ownerId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    ratings: []
  },
  {
    id: '3',
    title: 'VirtualTour - Aplikasi VR untuk Wisata',
    description: 'Aplikasi mobile yang menyediakan pengalaman wisata virtual dengan teknologi AR/VR.',
    category: 'Mobile App',
    technologies: ['Unity', 'ARKit', 'ARCore', 'C#'],
    images: ['/assets/projects/virtualtour1.jpg'],
    videoLink: 'https://youtube.com/example-vr',
    repositoryLink: 'https://github.com/example/virtualtour',
    demoLink: 'https://virtualtour-demo.example.com',
    members: [sampleUsers[2]],
    ownerId: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(initialProjects);
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
    
    setLoading(false);
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ratings'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ratings: []
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
        addRating
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};