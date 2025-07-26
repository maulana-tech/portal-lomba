// User types
export type UserRole = 'guest' | 'student' | 'lecturer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  skills?: string[];
  university?: string;
  faculty?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Competition types
export type CompetitionStatus = 'upcoming' | 'ongoing' | 'completed';
export type CompetitionLevel = 'national' | 'international';
export type CompetitionCategory = 'IT' | 'Design' | 'Business' | 'Science' | 'Engineering' | 'Arts' | 'Other';

export interface Competition {
  id: string;
  title: string;
  description: string;
  requirements: string;
  category: CompetitionCategory;
  level: CompetitionLevel;
  status: CompetitionStatus;
  registrationStartDate: Date;
  registrationEndDate: Date;
  submissionDeadline: Date;
  announcementDate: Date;
  organizer: string;
  prize: string;
  registrationLink: string;
  image?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  approved: boolean;
}

// Project types
export type ProjectCategory = 'Web Development' | 'Mobile App' | 'AI/ML' | 'IoT' | 'Game Development' | 'Graphic Design' | 'Other';
export type ProjectStatus = 'in-progress' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  images: string[];
  videoLink?: string;
  repositoryLink?: string;
  demoLink?: string;
  members: User[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  ratings: Rating[];
  status: ProjectStatus;
  features?: string[];
  challenges?: string;
  futureImprovements?: string;
  comments: ProjectComment[];
}

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProjectComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

// Forum types
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  comments: Comment[];
  likes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  likes: number;
  createdAt: Date;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  image?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Team types
export interface TeamRequest {
  id: string;
  projectId?: string;
  description: string;
  requiredSkills: string[];
  deadline?: Date;
  contactInfo: string;
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}