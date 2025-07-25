import React, { createContext, useContext, useState, useEffect } from 'react';
import { Competition, User } from '@/types';

interface CompetitionsContextType {
  competitions: Competition[];
  loading: boolean;
  addCompetition: (competition: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompetition: (id: string, competition: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  approveCompetition: (id: string) => void;
  getCompetitionById: (id: string) => Competition | undefined;
  filterCompetitions: (filters: CompetitionFilters) => Competition[];
  subscribeToCategory: (category: string) => void;
  unsubscribeFromCategory: (category: string) => void;
  subscribedCategories: string[];
}

interface CompetitionFilters {
  category?: string;
  status?: string;
  level?: string;
  search?: string;
}

const CompetitionsContext = createContext<CompetitionsContextType | undefined>(undefined);

export const useCompetitions = () => {
  const context = useContext(CompetitionsContext);
  if (context === undefined) {
    throw new Error('useCompetitions must be used within a CompetitionsProvider');
  }
  return context;
};

// Initial competitions data for demo
const initialCompetitions: Competition[] = [
  {
    id: '1',
    title: 'Hackathon Nasional 2025',
    description: 'Kompetisi pembuatan aplikasi inovatif dalam waktu 48 jam.',
    requirements: 'Mahasiswa aktif, tim 3-5 orang, menguasai pemrograman dasar.',
    category: 'IT',
    level: 'national',
    status: 'upcoming',
    registrationStartDate: new Date('2025-08-10'),
    registrationEndDate: new Date('2025-09-10'),
    submissionDeadline: new Date('2025-09-15'),
    announcementDate: new Date('2025-09-30'),
    organizer: 'Kementerian Pendidikan dan Kebudayaan',
    prize: 'Rp 50.000.000',
    registrationLink: 'https://example.com/register',
    image: '/assets/competitions/hackathon.jpg',
    createdBy: '3', // Lecturer ID
    createdAt: new Date(),
    updatedAt: new Date(),
    approved: true
  },
  {
    id: '2',
    title: 'UI/UX Design Competition',
    description: 'Kompetisi desain antarmuka aplikasi untuk meningkatkan pengalaman pengguna.',
    requirements: 'Mahasiswa aktif, individu atau tim 2 orang, menguasai desain UI/UX.',
    category: 'Design',
    level: 'international',
    status: 'ongoing',
    registrationStartDate: new Date('2025-07-01'),
    registrationEndDate: new Date('2025-07-25'),
    submissionDeadline: new Date('2025-08-15'),
    announcementDate: new Date('2025-08-30'),
    organizer: 'Adobe & Google',
    prize: 'USD 5,000',
    registrationLink: 'https://example.com/uiux-register',
    image: '/assets/competitions/uiux.jpg',
    createdBy: '3', // Lecturer ID
    createdAt: new Date(),
    updatedAt: new Date(),
    approved: true
  },
  {
    id: '3',
    title: 'Business Plan Competition',
    description: 'Kompetisi pembuatan rencana bisnis inovatif untuk startup.',
    requirements: 'Mahasiswa aktif, tim 3-4 orang, fokus pada solusi bisnis berkelanjutan.',
    category: 'Business',
    level: 'national',
    status: 'upcoming',
    registrationStartDate: new Date('2025-08-15'),
    registrationEndDate: new Date('2025-09-15'),
    submissionDeadline: new Date('2025-10-01'),
    announcementDate: new Date('2025-10-15'),
    organizer: 'Bank Indonesia',
    prize: 'Rp 75.000.000 dan Inkubasi Bisnis',
    registrationLink: 'https://example.com/bizplan-register',
    image: '/assets/competitions/business.jpg',
    createdBy: '1', // Admin ID
    createdAt: new Date(),
    updatedAt: new Date(),
    approved: true
  }
];

interface CompetitionsProviderProps {
  children: React.ReactNode;
}

export const CompetitionsProvider = ({ children }: CompetitionsProviderProps) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Load competitions from localStorage or use initial data
    const storedCompetitions = localStorage.getItem('competitions');
    if (storedCompetitions) {
      setCompetitions(JSON.parse(storedCompetitions));
    } else {
      setCompetitions(initialCompetitions);
      localStorage.setItem('competitions', JSON.stringify(initialCompetitions));
    }

    // Load subscribed categories
    const storedCategories = localStorage.getItem('subscribedCategories');
    if (storedCategories) {
      setSubscribedCategories(JSON.parse(storedCategories));
    }
    
    setLoading(false);
  }, []);

  // Save competitions to localStorage when they change
  useEffect(() => {
    if (competitions.length > 0) {
      localStorage.setItem('competitions', JSON.stringify(competitions));
    }
  }, [competitions]);

  // Save subscribed categories to localStorage
  useEffect(() => {
    localStorage.setItem('subscribedCategories', JSON.stringify(subscribedCategories));
  }, [subscribedCategories]);

  const addCompetition = (competitionData: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompetition: Competition = {
      ...competitionData,
      id: `competition_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCompetitions([...competitions, newCompetition]);
  };

  const updateCompetition = (id: string, competitionData: Partial<Competition>) => {
    const updatedCompetitions = competitions.map(competition => 
      competition.id === id 
        ? { ...competition, ...competitionData, updatedAt: new Date() } 
        : competition
    );
    
    setCompetitions(updatedCompetitions);
  };

  const deleteCompetition = (id: string) => {
    setCompetitions(competitions.filter(competition => competition.id !== id));
  };

  const approveCompetition = (id: string) => {
    updateCompetition(id, { approved: true });
  };

  const getCompetitionById = (id: string): Competition | undefined => {
    return competitions.find(competition => competition.id === id);
  };

  const filterCompetitions = (filters: CompetitionFilters): Competition[] => {
    return competitions.filter(competition => {
      // Filter by category
      if (filters.category && competition.category !== filters.category) {
        return false;
      }
      
      // Filter by status
      if (filters.status && competition.status !== filters.status) {
        return false;
      }
      
      // Filter by level
      if (filters.level && competition.level !== filters.level) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && 
        !competition.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !competition.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const subscribeToCategory = (category: string) => {
    if (!subscribedCategories.includes(category)) {
      setSubscribedCategories([...subscribedCategories, category]);
    }
  };

  const unsubscribeFromCategory = (category: string) => {
    setSubscribedCategories(subscribedCategories.filter(c => c !== category));
  };

  return (
    <CompetitionsContext.Provider
      value={{
        competitions,
        loading,
        addCompetition,
        updateCompetition,
        deleteCompetition,
        approveCompetition,
        getCompetitionById,
        filterCompetitions,
        subscribeToCategory,
        unsubscribeFromCategory,
        subscribedCategories
      }}
    >
      {children}
    </CompetitionsContext.Provider>
  );
};