import React, { createContext, useContext, useState, useEffect } from 'react';
import { ForumPost, Comment, TeamRequest, User } from '@/types';

interface CommunityContextType {
  forumPosts: ForumPost[];
  teamRequests: TeamRequest[];
  loading: boolean;
  
  // Forum methods
  addForumPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'likes'>) => void;
  updateForumPost: (id: string, post: Partial<ForumPost>) => void;
  deleteForumPost: (id: string) => void;
  getForumPostById: (id: string) => ForumPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  likePost: (postId: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  
  // Team request methods
  addTeamRequest: (request: Omit<TeamRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeamRequest: (id: string, request: Partial<TeamRequest>) => void;
  deleteTeamRequest: (id: string) => void;
  getTeamRequestById: (id: string) => TeamRequest | undefined;
  filterTeamRequests: (skill?: string) => TeamRequest[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

// Sample users
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
    id: '3',
    name: 'Lecturer User',
    email: 'lecturer@example.com',
    role: 'lecturer' as const,
    university: 'University of Example',
    faculty: 'Engineering',
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
  }
];

// Initial forum posts data for demo
const initialForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Tips Mengikuti Hackathon untuk Pemula',
    content: `
# Tips Mengikuti Hackathon untuk Pemula

Halo teman-teman! Saya baru saja mengikuti hackathon nasional dan ingin berbagi beberapa tips bagi yang baru memulai:

1. **Bentuk tim dengan skill yang beragam** - Pastikan tim Anda memiliki developer, desainer UI/UX, dan orang yang fokus pada business model/pitch.
2. **Persiapkan template/boilerplate** - Siapkan kode dasar atau template sebelum hari-H untuk menghemat waktu.
3. **Fokus pada MVP (Minimum Viable Product)** - Jangan mencoba membangun aplikasi yang terlalu kompleks, fokuslah pada fitur utama yang berfungsi dengan baik.
4. **Perhatikan kriteria penilaian** - Pastikan solusi Anda sesuai dengan kriteria yang dinilai juri.
5. **Latih pitch Anda** - Presentasi yang bagus bisa jadi faktor penentu kemenangan.

Ada yang punya tips lain untuk dibagikan?
    `,
    author: sampleUsers[0],
    comments: [
      {
        id: 'c1',
        content: 'Terima kasih atas tipsnya! Saya menambahkan bahwa istirahat yang cukup juga sangat penting selama hackathon.',
        author: sampleUsers[2],
        likes: 3,
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 'c2',
        content: 'Setuju dengan point #3. Lebih baik memiliki produk sederhana yang berfungsi sempurna daripada produk kompleks dengan banyak bug.',
        author: sampleUsers[1],
        likes: 5,
        createdAt: new Date(Date.now() - 43200000) // 12 hours ago
      }
    ],
    likes: 12,
    tags: ['hackathon', 'tips', 'pemula'],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    id: '2',
    title: 'Mencari Rekomendasi Framework untuk Machine Learning',
    content: `
Halo semua,

Saya sedang mengerjakan proyek klasifikasi gambar dan masih bingung framework mana yang sebaiknya digunakan. Saya sudah coba TensorFlow, tapi masih penasaran dengan PyTorch dan scikit-learn.

Bagi yang sudah berpengalaman, mana yang menurut kalian paling cocok untuk pemula dengan performa yang baik?

Terima kasih!
    `,
    author: sampleUsers[1],
    comments: [
      {
        id: 'c3',
        content: 'Untuk klasifikasi gambar, PyTorch cukup intuitif dan memiliki dokumentasi yang bagus untuk pemula.',
        author: sampleUsers[0],
        likes: 2,
        createdAt: new Date(Date.now() - 36000000) // 10 hours ago
      }
    ],
    likes: 7,
    tags: ['machine learning', 'framework', 'AI'],
    createdAt: new Date(Date.now() - 129600000), // 1.5 days ago
    updatedAt: new Date(Date.now() - 129600000)
  }
];

// Initial team requests data for demo
const initialTeamRequests: TeamRequest[] = [
  {
    id: '1',
    projectId: '1',
    description: 'Mencari frontend developer untuk proyek EduConnect. Diutamakan yang menguasai React dan memiliki pengalaman dengan UI/UX design.',
    requiredSkills: ['React', 'TypeScript', 'UI/UX'],
    deadline: new Date('2025-08-15'),
    contactInfo: 'student@example.com',
    userId: '2',
    userName: 'Student User',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    id: '2',
    description: 'Mencari anggota tim untuk lomba Hackathon Nasional 2025. Dibutuhkan backend developer dengan pengalaman Node.js dan database.',
    requiredSkills: ['Node.js', 'MongoDB', 'Express'],
    deadline: new Date('2025-08-01'),
    contactInfo: 'jane.doe@example.com',
    userId: '4',
    userName: 'Jane Doe',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000)
  }
];

interface CommunityProviderProps {
  children: React.ReactNode;
}

export const CommunityProvider = ({ children }: CommunityProviderProps) => {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load forum posts from localStorage or use initial data
    const storedPosts = localStorage.getItem('forumPosts');
    if (storedPosts) {
      setForumPosts(JSON.parse(storedPosts));
    } else {
      setForumPosts(initialForumPosts);
      localStorage.setItem('forumPosts', JSON.stringify(initialForumPosts));
    }
    
    // Load team requests from localStorage or use initial data
    const storedRequests = localStorage.getItem('teamRequests');
    if (storedRequests) {
      setTeamRequests(JSON.parse(storedRequests));
    } else {
      setTeamRequests(initialTeamRequests);
      localStorage.setItem('teamRequests', JSON.stringify(initialTeamRequests));
    }
    
    setLoading(false);
  }, []);

  // Save forum posts to localStorage when they change
  useEffect(() => {
    if (forumPosts.length > 0) {
      localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
    }
  }, [forumPosts]);

  // Save team requests to localStorage when they change
  useEffect(() => {
    if (teamRequests.length > 0) {
      localStorage.setItem('teamRequests', JSON.stringify(teamRequests));
    }
  }, [teamRequests]);

  // Forum methods
  const addForumPost = (postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'likes'>) => {
    const newPost: ForumPost = {
      ...postData,
      id: `post_${Date.now()}`,
      comments: [],
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setForumPosts([newPost, ...forumPosts]);
  };

  const updateForumPost = (id: string, postData: Partial<ForumPost>) => {
    const updatedPosts = forumPosts.map(post => 
      post.id === id 
        ? { ...post, ...postData, updatedAt: new Date() } 
        : post
    );
    
    setForumPosts(updatedPosts);
  };

  const deleteForumPost = (id: string) => {
    setForumPosts(forumPosts.filter(post => post.id !== id));
  };

  const getForumPostById = (id: string): ForumPost | undefined => {
    return forumPosts.find(post => post.id === id);
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment_${Date.now()}`,
      likes: 0,
      createdAt: new Date()
    };
    
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
          updatedAt: new Date()
        };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
  };

  const likePost = (postId: string) => {
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
  };

  const likeComment = (postId: string, commentId: string) => {
    const updatedPosts = forumPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes + 1
            };
          }
          return comment;
        });
        
        return {
          ...post,
          comments: updatedComments
        };
      }
      return post;
    });
    
    setForumPosts(updatedPosts);
  };

  // Team request methods
  const addTeamRequest = (requestData: Omit<TeamRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: TeamRequest = {
      ...requestData,
      id: `request_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTeamRequests([newRequest, ...teamRequests]);
  };

  const updateTeamRequest = (id: string, requestData: Partial<TeamRequest>) => {
    const updatedRequests = teamRequests.map(request => 
      request.id === id 
        ? { ...request, ...requestData, updatedAt: new Date() } 
        : request
    );
    
    setTeamRequests(updatedRequests);
  };

  const deleteTeamRequest = (id: string) => {
    setTeamRequests(teamRequests.filter(request => request.id !== id));
  };

  const getTeamRequestById = (id: string): TeamRequest | undefined => {
    return teamRequests.find(request => request.id === id);
  };

  const filterTeamRequests = (skill?: string): TeamRequest[] => {
    if (!skill) return teamRequests;
    
    return teamRequests.filter(request => 
      request.requiredSkills.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        forumPosts,
        teamRequests,
        loading,
        addForumPost,
        updateForumPost,
        deleteForumPost,
        getForumPostById,
        addComment,
        likePost,
        likeComment,
        addTeamRequest,
        updateTeamRequest,
        deleteTeamRequest,
        getTeamRequestById,
        filterTeamRequests
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};